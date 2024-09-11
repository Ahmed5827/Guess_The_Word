import { useState, useEffect } from "react";
import getrandom_word from "../../services/Back-end-call"; // Make sure this import path is correct
import LetterCircle from "../Circle/LetterCircle";
import "./Home.css"
import toast, { Toaster } from "react-hot-toast";
import { PacmanLoader } from "react-spinners";

import yellowBulb from "/yellow lightbulb.svg"
import yellowBulbIch from "/yellow-ich lightbulb.svg"
import noBulb from "/no lightbulb.svg"
import giveup from "/giveup.svg"

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseReceived, setResponseReceived] = useState(false); // New state to track if response is received
  const [selectedWord, setSelectedWord] = useState("");
  const [nbHintsLeft, setNbHintsLeft] = useState(2);

  const handleWordChange = (newWord) => {
    setSelectedWord(newWord);
  };
  const handleGiveUp = () => {
    if (!confirm("Are you sure you want to give up ?")) {
      toast.dismiss();
      toast.success("Good job! Keep going", { duration: 4000 });
      return;
    }
    toast.dismiss();
    toast.error("Better luck next time!",);
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  const handleUseHint = () => {
    if (nbHintsLeft === 0) {
      toast.dismiss();
      toast.error("Hints Credit Experired");
      return;
    }
    setNbHintsLeft(nbHintsLeft - 1);
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
  const lightbulb = nbHintsLeft === 2 ? yellowBulb : nbHintsLeft === 1 ? yellowBulbIch : noBulb;
  let indices = new Set();
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * word.length));
  }

  let word_to_hint = word.split('').map((char, i) => {
    return indices.has(i) ? char : '_';
  }).join('');

  return (
    <>
      <Toaster />
      <div className="containerr">
        <div><h2>Guess the Word</h2></div>
        <div className="word_informations">
          <div className="word_information">
            <div>Definition</div>
            <div className="definition">{meanings[0]?.definition}</div>
          </div>
          {nbHintsLeft < 2 ? <>
            <div className="word_information">
              <div>Hint: </div>
              <div className="showHint">{meanings[1]?.definition}</div></div></> : <></>}
          {nbHintsLeft === 0 ? <>
            <div className="word_to_guess">
              <div>Word to guess: <span>{word_to_hint}</span></div>
              <div className="showHint"></div></div></> : <></>}

        </div>
        <div className="inputs">
          <div className="giveup" onClick={handleGiveUp}>
            <div>Give up</div>
            <div><img className="icon" src={giveup} height={"50px"} alt="" /></div>
          </div>
          <div className="wheel">
            <LetterCircle letters={word.split("")} onWordChange={handleWordChange} />
          </div>
          <div className={"hint " + (lightbulb == noBulb ? "disabled" : "")} onClick={handleUseHint}>
            <div>Use Hint ({nbHintsLeft} Hints left)</div>
            <div className="icon"><img src={lightbulb} height={"50px"} alt="" /></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;