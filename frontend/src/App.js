import React, { useState } from "react";
import Navbar from "./components/navbar";
import "./css/navbar.css";
import Polls from "./pages/Polls/Polls.js"
import "./App.css";

function App() {
  const [styleMarginLeft, setStyleMarginLeft] = useState({
    marginLeft: "100px",
  });

  return (
    <div>
      <Navbar setStyleMarginLeft={setStyleMarginLeft} />
      <div id="container" class="container" style={styleMarginLeft}>
      <Polls/>
      </div>
    </div>
  );
}

export default App;
