import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Home.css";
import baseURL from "../baseURL";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  // Handle button click with delay and navigation
  const handleButtonClick = async () => {
    if (isLoading) return; // Avoid multiple clicks if already loading

    setIsLoading(true);

    // Start or clear text generation interval
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    } else {
      const id = setInterval(generateText, 200);
      setIntervalId(id);
      setTimeout(() => {
        clearInterval(id);
        setIntervalId(null);
        setIsLoading(false);
      }, 5000);
    }

    // Wait for 3 seconds before navigating
    setTimeout(() => {
      const username = inputRef.current.value.trim();
      if (username) {
        navigate(`/texteditor?username=${encodeURIComponent(username)}`);
      } else {
        alert("Please enter a username");
        setIsLoading(false);
      }
    }, 3000);
  };

  // Generate random text for UI
  const generateText = () => {
    let characters = "abcdefghijklmnopqrstuvwxyz1234567890~@!#$%^&*()?";
    let length = Math.floor(Math.random() * 5000) + 50;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setDisplayText((prevText) => prevText + result + " ");
  };

  return (
    <div className="main__container">
      <div className="flex flex-col items-center justify-center min-h-[37rem] inner__container">
        <h1 className="text-4xl text-center font-bold text-white mb-4">
          Access Your Data From Anywhere
        </h1>
        <form
          className="m-3 flex items-center justify-center gap-8"
          onSubmit={(e) => e.preventDefault()} // Prevent default form submission
        >
          <input
            ref={inputRef}
            className="input-field bg-[#222630] px-4 py-3 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
            name="text"
            placeholder="Enter email or username"
            type="text"
          />
          <div
            onClick={handleButtonClick} // Handle click event
            className="button"
          >
            <span>{isLoading ? "Loading..." : "Open"}</span>
            <span className="button-border"></span>
          </div>
        </form>
      </div>
      
      <div className="text-container h-[34rem]">{displayText}</div>
    </div>
  );
};

export default Home;
