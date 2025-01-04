import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar.js";
import "./css/navbar.css";
import { useState } from "react";

function App() {
  const [styleMarginLeft, setStyleMarginLeft] = useState({
    marginLeft: "100px",
  });

  return (
    <div>
      <Navbar setStyleMarginLeft={setStyleMarginLeft} />
      <div id="container" class="container" style={styleMarginLeft}>
        <div className="content">
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
