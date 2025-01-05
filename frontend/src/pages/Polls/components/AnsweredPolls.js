import React from "react";
import "./Card.css";

const AnsweredPolls = ({ poll }) => {
  return (
    <div className="card">
      <h2 className="card-title">{poll.title}</h2>
      <p className="card-description">{poll.description}</p>
      <div className="card-choices">
        {poll.choices.map((choice, index) => (
          <div
            key={index}
            className={`card-choice ${
              choice.choice_text === poll.selectedChoice.choice_text
                ? "selected"
                : ""
            }`}
          >
            <span>{choice.choice_text}</span>
          </div>
        ))}
      </div>
      <p className="card-footer">Merci pour votre participation !</p>
    </div>
  );
};

export default AnsweredPolls;
