import React from "react";
import "./PollCard.css";

const PollCard = ({ poll }) => {
  return (
    <div className="poll-card">
      <h2 className="poll-card-title">{poll.title}</h2>
      <p className="poll-card-description">{poll.description}</p>
      <ul className="poll-card-choices">
        {poll.choices.map((choice, index) => (
          <li key={index} className="poll-card-choice">
            <button>{choice.choice_text}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollCard;
