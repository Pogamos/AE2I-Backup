import React, { useState, useEffect } from "react";
import PollCard from "./components/PollCard.js";
import AnsweredPolls from "./components/AnsweredPolls.js";
import "./Polls.css";

const Polls = () => {
  const [polls, setPolls] = useState([]); // État pour stocker tous les sondages
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(null); // Stocke les éventuelles erreurs

  // Récupération des sondages depuis l'API
  useEffect(() => {
    fetch("http://localhost:5001/api/polls")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur réseau : " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        // Ajoute `isVoted` et `selectedChoice` par défaut à chaque sondage
        const pollsWithState = data.polls.map((poll) => ({
          ...poll,
          isVoted: false, // Par défaut, le sondage n'est pas voté
          selectedChoice: null, // Aucune réponse sélectionnée
        }));
        setPolls(pollsWithState);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Gestion du vote
  const handleVote = (pollId, selectedChoice) => {
    // Met à jour uniquement le sondage voté
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll._id === pollId
          ? { ...poll, isVoted: true, selectedChoice } // Marque ce sondage comme voté
          : poll // Les autres sondages restent inchangés
      )
    );
  };

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
          polls.map((poll) =>
            poll.isVoted ? (
              <AnsweredPolls key={poll._id} poll={poll} />
            ) : (
              <PollCard key={poll._id} poll={poll} onVote={handleVote} />
            )
          )
        ) : (
          <p>Aucun sondage disponible.</p>
        )}
      </div>
    </div>
  );
};

export default Polls;
