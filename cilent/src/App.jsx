import React, { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import TextEditor from "./components/TextEditor";

function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <div className="pad">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/texteditor" element={<TextEditor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
