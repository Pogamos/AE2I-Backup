import React, { useState } from "react";
import Navbar from "./components/navbar"; // Composant de la barre de navigation
import Polls from "./pages/Polls/Polls.js";
import "./css/navbar.css"; // CSS pour la navbar
import "./App.css"; // CSS global de l'application

function App() {
  const [styleMarginLeft, setStyleMarginLeft] = useState({
    marginLeft: "100px", // Marges initiales
  });

  return (
    <div>
      {/* Composant Navbar, avec possibilité de changer la marge */}
      <Navbar setStyleMarginLeft={setStyleMarginLeft} />

      {/* Conteneur principal */}
      <div id="container" className="container" style={styleMarginLeft}>
        {/* Page des sondages */}
        <Polls />
      </div>
    </div>
  );
}

export default App;
