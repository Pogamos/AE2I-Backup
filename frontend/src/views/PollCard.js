import React, { useState } from "react";
import "../css/Card.css";

const PollCard = ({ poll, onVote }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  // Dans PollCard.js
  const handleVoteClick = () => {
    if (selectedChoice) {
      // Vérifier que l'objet selectedChoice a le bon format
      const formattedChoice = {
        choice_text: selectedChoice.choice_text
      };
      onVote(poll._id, formattedChoice);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">{poll.title}</h2>
      <p className="card-description">{poll.description}</p>
      <div className="card-choices">
        {poll.choices.map((choice, index) => {
          const voteCount = poll.responses.filter(
            (response) => response.choice_text === choice.choice_text
          ).length;
          return (
            <button
              key={index}
              className={`card-choice ${
                selectedChoice === choice ? "selected" : ""
              }`}
              onClick={() => setSelectedChoice(choice)}
            >
              {choice.choice_text} ({voteCount} votes)
            </button>
          );
        })}
      </div>
      <button
        className={`card-vote-button ${
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
