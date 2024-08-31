import { useState, useEffect } from "react";
import getrandom_word from "../../services/Back-end-call"; // Make sure this import path is correct
const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseReceived, setResponseReceived] = useState(false); // New state to track if response is received

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchData = async () => {
      try {
        const response = await getrandom_word();
        if (isMounted && !responseReceived) {
          setData(response);
          setLoading(false);
          setResponseReceived(true); // Set flag to true after response is received
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Clean up function to set isMounted to false when component unmounts
    };
  }, [responseReceived]); // Dependency array includes responseReceived

  if (loading) return <p>Loading...</p>;

  if (!data) return <p>No data found.</p>;

  // Destructure the response data
  const { word, meanings } = data;

  return (
    <div>
      <h1>Word: {word}</h1>
      <ul>
        {meanings.map((meaning, index) => (
          <li key={index}>{meaning.definition}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;