# Guess the Word

## Overview

"Guess the Word" is an interactive word-guessing game that combines a Flask-based backend and a React-based frontend. The backend generates random words and provides additional information about each word, while the frontend creates a dynamic user interface for the game, utilizing the data provided by the backend.

## Features

- **Backend (Flask)**:
  - Generates random words.
  - Provides information about the generated words (e.g., definitions, examples).
  
- **Frontend (React)**:
  - Allows users to guess the word based on clues provided.
  - Displays game status and word-related information fetched from the backend.

## Technologies

- **Backend**: Flask
- **Frontend**: React
- **Database**: (Specify if any database is used)
- **Deployment**: (Specify deployment methods if applicable)

## Installation

### Back-end

1. Navigate to the backend directory:
   ```bash
   cd backend
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
4. Run the Flask application:
   ```bash
   python app.py

### Front-end

1. Navigate to the frontend directory:
   ```bash
   cd Front-end/Spelling Bee
2. Create and activate a virtual environment:
   ```bash
    npm install

3. Install dependencies:
   ```bash
   npm run dev

## Usage


1. Start the Flask backend and ensure it is running.
2. Start the React frontend.
3. Open your browser and navigate to http://localhost:3000 (or the port specified by React).

## API Endpoints

A Swagger interface is provided to explore and test endpoints interactively under the URL: [http://127.0.0.1:5000/apidocs/](http://127.0.0.1:5000/apidocs/)

## Contact

Feel free to contact me for any questions or suggestions about this project.
