from flask import Flask, jsonify
import time
import requests
from flask_cors import CORS
from flasgger import Swagger

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
swagger = Swagger(app)

@app.route("/all_about_word/", methods=['GET'])
def all_about_word():
    """
    Get a random word and its meanings.
    ---
    responses:
      200:
        description: A random word with its meanings
        schema:
          id: WordData
          properties:
            word:
              type: string
              description: The random word
              example: "example"
            meanings:
              type: array
              items:
                type: object
                properties:
                  definition:
                    type: string
                    description: Definition of the word
                    example: "A representative form or pattern."
    """
    t0 = time.time()

    def get_random_word():
        URL_base1 = "https://random-word-api.herokuapp.com/word"
        for _ in range(3):
            response = requests.get(URL_base1)
            if response.status_code == 200:
                print("Random word request was successful!")
                return response.json()[0]
            else:
                print(f"Failed to retrieve word: {response.status_code}. Retrying...")
                time.sleep(1)
        raise Exception("Failed to retrieve random word after retries")

    def get_word_data(word):
        URL_base2 = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
        for _ in range(3):
            response = requests.get(URL_base2)
            if response.status_code == 200:
                print("Dictionary request was successful!")
                x = response.json()
                combined_definitions = []
                for item in x[0]["meanings"]:
                    combined_definitions.extend(item.get("definitions", []))
                return jsonify({"word": x[0]["word"], "meanings": combined_definitions})
            else:
                print(f"Failed to retrieve data: {response.status_code}. Retrying...")
                time.sleep(1)
        raise Exception("Failed to retrieve dictionary data after retries")

    word = get_random_word()
    while True:
        data = get_word_data(word)
        if data is None:
            word = get_random_word()
        else:
            t1 = time.time()
            print(t1 - t0)
            return data

@app.route("/", methods=['GET'])
def home():
    """
    A simple hello world endpoint.
    ---
    responses:
      200:
        description: Hello world from Flask
        schema:
          id: HelloWorld
          properties:
            message:
              type: string
              example: "hello world from Flask"
    """
    return "hello world from Flask"

if __name__ == '__main__':
    app.run(debug=True)
