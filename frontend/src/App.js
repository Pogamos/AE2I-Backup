import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar.js";
import "./css/navbar.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import './css/ProfilePage.css';


  
function App() {
  const [styleMarginLeft, setStyleMarginLeft] = useState({
    marginLeft: "100px",
  });

  return (
    <Router>
      <Navbar setStyleMarginLeft={setStyleMarginLeft} />
      <div id="container" className="container" style={styleMarginLeft}>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/myaccount" element={<ProfilePage />} /> {/* Redirection du profil */}
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
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
  );
}

export default App;
