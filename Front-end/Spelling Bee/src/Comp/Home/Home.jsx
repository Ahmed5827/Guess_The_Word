import { useState, useEffect } from "react";
import getrandom_word from "../../services/Back-end-call"; // Make sure this import path is correct
import LetterCircle from "../Circle/LetterCircle";
import "./Home.css"
import toast, { Toaster } from "react-hot-toast";
import { PacmanLoader } from "react-spinners";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseReceived, setResponseReceived] = useState(false); // New state to track if response is received
  const [selectedWord, setSelectedWord] = useState("");

  const handleWordChange = (newWord) => {
    setSelectedWord(newWord);
  };
  const handleGiveUp = () => {
    if (!confirm("Are you sure you want to give up ?")) {
      toast.dismiss();
      toast.success("Good job! Keep going", { duration: 4000 });
      return;
    }
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  useEffect(() => {
    console.log("selectedword: ", selectedWord)
    if (selectedWord === "" || !data) {
      return;
    }
    if (data && selectedWord != "" && selectedWord === data?.word) {
      toast.dismiss();
      toast.success("Correct Guess")
    }
    else {
      toast.dismiss();
      toast.error("Ti hak bhim fil anglais")
    }
  }, [selectedWord])

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

  if (loading) return (
    <div className="loading">
      <p>Loading...</p>
      <div>
        <PacmanLoader
          color="#efd800"
          margin={3}
        />
      </div>
    </div>
  );

  if (!data) return <p>No data found.</p>;

  // Destructure the response data
  const { word, meanings } = data;
  const letters = [...new Set(word.split(""))].sort(() => Math.random() - 0.5)

  return (
    <>
      <Toaster />
      <div className="containerr">
        <div><h2>Guess the Word</h2></div>
        <div className="word_information">
          <div>Definition</div>
          <div className="definition">{meanings[0]?.definition}</div>
          <div></div>
        </div>
        <div className="inputs">
          <div className="giveup" onClick={handleGiveUp}>
            <div>Give up</div>
            <div><img src="" alt="" /></div>
          </div>
          <div className="wheel">
            <LetterCircle letters={[...new Set(word.split(""))]} onWordChange={handleWordChange} />
          </div>
          <div className="hint">
            <div>Hint</div>
            <div><img src="" alt="" /></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;