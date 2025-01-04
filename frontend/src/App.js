import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar.js";
import "./css/navbar.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Events from "./views/events";

function App() {
  const [styleMarginLeft, setStyleMarginLeft] = useState({
    marginLeft: "100px",
  });

  return (
    <Router>
      <div>
        <Navbar setStyleMarginLeft={setStyleMarginLeft} />
        <div id="container" className="container" style={styleMarginLeft}>
          <div className="content">
            <div className="App">
              <Routes>
                <Route
                  path="/"
                  element={
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
                  }
                />
                <Route path="/events" element={<Events />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
