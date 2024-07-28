import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import "./TextEditor.css";
import baseURL from "../baseURL";

const socket = io(baseURL);

function TextEditor() {
  const [scriptContent, setScriptContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const username = new URLSearchParams(location.search).get("username");

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("fetchScript");
    });

    socket.on("scriptContent", (content) => {
      setScriptContent(content);
    });

    getScriptContent(); // Fetch script content on component mount

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleScriptChange = (event) => {
    const content = event.target.value;
    setScriptContent(content);
  };

  const handleSave = async () => {
    try {
      if (!username) {
        throw new Error("Username is missing.");
      }
      const response = await axios.post(
        `${baseURL}/saveScript?editorId=${username}`,
        {
          content: scriptContent,
        }
      );
      if (response.status === 200) {
        alert("Script saved successfully!");
      } else {
        throw new Error("Failed to save script");
      }
    } catch (error) {
      console.error("Error saving script:", error);
      alert(
        "An error occurred while saving the script. Please try again later."
      );
    }
  };

  const handleRefresh = async () => {
    try {
      await getScriptContent(); // Fetch script content and set it
    } catch (error) {
      console.error("Error fetching script:", error);
      alert("An error occurred while fetching the script.");
    }
  };

  const getScriptContent = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/getScript?editorId=${username}`
      );
      setScriptContent(response.data); // Update script content state
    } catch (error) {
      throw new Error("Failed to fetch script");
    }
  };

  return (
    <div className="terminal-loader">
      <div className="terminal-header">
        <div className="terminal-title">
          <p>Welcome {username}!</p>
        </div>
      </div>
      <br />
      <br />
      <div className="text">Loading...</div>
      <div className="App">
        <div>
          <textarea
            value={scriptContent}
            onChange={handleScriptChange}
            // rows="20"
            // cols="80"
            style={{ fontFamily: "monospace" }}
            className="chat-container"
          ></textarea>
        </div>
        <div>
          <div className="buttonscontainer">
            <button type="button" className="bookmarkBtn" onClick={handleSave}>
              <span className="IconContainer">
                <svg viewBox="0 0 384 512" height="0.9em" className="icon">
                  <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
                </svg>
              </span>
              <p className="save"></p>
            </button>
            <button type="button" className="refresh-button bg-black" onClick={handleRefresh}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-repeat"
                viewBox="0 0 16 16"
              >
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
                <path
                  fillRule="evenodd"
                  d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                ></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextEditor;