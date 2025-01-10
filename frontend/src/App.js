import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar.js";
import "./css/navbar.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Team from "./views/team";
import Events from "./views/events";
import Polls from "./views/Polls.js";
import LoginPage from "./views/LoginPage.js";
import ProfilePage from "./views/ProfilePage.js";
import RegisterPage from "./views/RegisterPage.js";

function App() {
  const [styleMarginLeft, setStyleMarginLeft] = useState({
    marginLeft: "100px",
  });

  return (
    <div>
      <Navbar setStyleMarginLeft={setStyleMarginLeft} />
      <div id="container" class="container" style={styleMarginLeft}>
        <div className="content">
    <Router>
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
          <Route path="/team" element={<Team />} />
          <Route path="/events" element={<Events />} />
          <Route path="/Polls" element={<Polls />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/myaccount" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>
      </div>
    </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
