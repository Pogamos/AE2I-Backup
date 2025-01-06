import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar.js";
import "./css/navbar.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import './css/ProfilePage.css';

function App() {
  const [styleMarginLeft, setStyleMarginLeft] = useState({
    marginLeft: "100px",
  });

  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];

  return (
    <div>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar setStyleMarginLeft={setStyleMarginLeft} />}
      <div id="container" className="container" style={hideNavbarRoutes.includes(location.pathname) ? {} : styleMarginLeft}>
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/myaccount" element={<ProfilePage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
