import React, { useState, useEffect } from "react";
import "./Polls.css";

const Polls = () => {
  const [poll, setPoll] = useState(null); // État pour stocker les données du sondage
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(null); // Stocke les éventuelles erreurs

  useEffect(() => {
    console.log("Début de la requête API...");

    fetch("http://localhost:5001/api/polls")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur réseau : " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Données reçues :", data); // Log des données reçues
        if (data.polls && data.polls.length > 0) {
          setPoll(data.polls[0]); // On prend le premier sondage
        } else {
          console.log("Aucun sondage trouvé.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des sondages :", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="polls-container">
        <div className="polls-header">
          <h1 className="polls-title">Sondages</h1>
        </div>
        <p>Chargement des sondages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="polls-container">
        <div className="polls-header">
          <h1 className="polls-title">Sondages</h1>
        </div>
        <p>Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="polls-container">
      <div className="polls-header">
        <h1 className="polls-title">Sondages</h1>
      </div>
      {poll ? (
        <div className="poll">
          <h2>{poll.title}</h2>
          <p>{poll.description}</p>
          <ul className="choices">
            {poll.choices.map((choice, index) => (
              <li key={index} className="choice">
                <button>{choice.choice_text}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Aucun sondage disponible.</p>
      )}
    </div>
  );
};

export default Polls;
