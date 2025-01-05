import React, { useState } from "react";
import "./PollCard.css";

const PollCard = ({ poll, onVote }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleVoteClick = () => {
    if (selectedChoice) {
      onVote(poll._id, selectedChoice); // Passe l'ID et la réponse sélectionnée au parent
    }
  };

  return (
    <div className="poll-card">
      <h2 className="poll-card-title">{poll.title}</h2>
      <p className="poll-card-description">{poll.description}</p>
      <div className="poll-card-choices">
        {poll.choices.map((choice, index) => (
          <button
            key={index}
            className={`poll-card-choice ${
              selectedChoice === choice ? "selected" : ""
            }`}
            onClick={() => setSelectedChoice(choice)}
          >
            {choice.choice_text}
          </button>
        ))}
      </div>
      <button
        className={`poll-card-vote-button ${
          selectedChoice ? "active" : "inactive"
        }`}
        onClick={handleVoteClick}
        disabled={!selectedChoice}
      >
        Voter
      </button>
    </div>
  );
};

export default PollCard;
