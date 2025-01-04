import React, { useState, useEffect } from "react";
import PollCard from "./components/PollCard.js";
import "./Polls.css";

const Polls = () => {
  const [polls, setPolls] = useState([]); // État pour stocker tous les sondages
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(null); // Stocke les éventuelles erreurs

  useEffect(() => {
    fetch("http://localhost:5001/api/polls")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur réseau : " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setPolls(data.polls || []); // Stocke tous les sondages reçus
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="polls-container">
      <div className="polls-header">
        <h1 className="polls-title">Sondages</h1>
      </div>
      <div className="polls-content">
        {loading ? (
          <p>Chargement des sondages...</p>
        ) : error ? (
          <p>Erreur : {error}</p>
        ) : polls.length > 0 ? (
          polls.map((poll, pollIndex) => (
            <PollCard key={pollIndex} poll={poll} />
          ))
        ) : (
          <p>Aucun sondage disponible.</p>
        )}
      </div>
    </div>
  );
};

export default Polls;
