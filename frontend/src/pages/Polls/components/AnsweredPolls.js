import React from "react";
import "./AnsweredPolls.css";

const AnsweredPolls = ({ poll }) => {
  return (
    <div className="answered-poll-card">
      <h2 className="answered-poll-title">{poll.title}</h2>
      <p className="answered-poll-description">{poll.description}</p>
      <div className="answered-poll-choices">
        {poll.choices.map((choice, index) => (
          <div
            key={index}
            className={`answered-poll-choice ${
              choice === poll.selectedChoice ? "selected" : ""
            }`}
          >
            <span>{choice.choice_text}</span>
            <span>{Math.floor(Math.random() * 100)}%</span>
          </div>
        ))}
      </div>
      <p className="answered-poll-footer">
        Merci pour votre participation !
      </p>
    </div>
  );
};

export default AnsweredPolls;
