import React, { useState } from "react";
import "../css/Polls.css";

const PollCard = ({ poll, onVote }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleVoteClick = async () => {
    if (!selectedChoice) {
      alert("Veuillez sélectionner une option avant de voter.");
      return;
    }

    try {
      await onVote(poll._id, selectedChoice);
    } catch (error) {
      console.error("❌ Erreur complète :", error);
      setErrorMessage("Erreur lors du vote, veuillez réessayer.");
    }
  };

  return (
    <div className="polls-card">
      <h2 className="polls-card-title">{poll.title}</h2>
      <p className="polls-card-description">{poll.description}</p>

      <div className="polls-card-choices">
        {poll.choices.map((choice, index) => (
          <button
            key={index}
            className={`polls-card-choice ${selectedChoice === choice ? "selected" : ""}`}
            onClick={() => setSelectedChoice(choice)}
          >
            {choice.choice_text}
          </button>
        ))}
      </div>

      {errorMessage && <p className="error-message">⚠️ {errorMessage}</p>}

      <button className="polls-card-vote-button" onClick={handleVoteClick}>
        Voter
      </button>
    </div>
  );
};

export default PollCard;
