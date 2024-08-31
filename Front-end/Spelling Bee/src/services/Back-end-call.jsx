import axios from "axios";

function getrandom_word() {
  return axios.get('http://localhost:5000/all_about_word/')
    .then(response => response.data) // Return the response data
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error; // Optionally, re-throw the error if needed
    });
}

getrandom_word();
export default getrandom_word;
