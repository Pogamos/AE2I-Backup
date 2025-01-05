import React, { useState } from "react";
import "./Card.css";

const PollCard = ({ poll, onVote }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleVoteClick = () => {
    if (selectedChoice) {
      onVote(poll._id, selectedChoice);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">{poll.title}</h2>
      <p className="card-description">{poll.description}</p>
      <div className="card-choices">
        {poll.choices.map((choice, index) => (
          <button
            key={index}
            className={`card-choice ${
              selectedChoice === choice ? "selected" : ""
            }`}
            onClick={() => setSelectedChoice(choice)}
          >
            {choice.choice_text}
          </button>
        ))}
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
