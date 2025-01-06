import React from "react";
import "../css/Card.css";

const AnsweredPolls = ({ poll }) => {
  const totalResponses = poll.totalResponses || 0; // Nombre total de réponses pour le sondage

  return (
    <div className="card">
      <h2 className="card-title">{poll.title}</h2>
      <p className="card-description">{poll.description}</p>
      <div className="card-choices">
        {poll.choices.map((choice, index) => {
          // Nombre de réponses pour ce choix
          const choiceResponses = poll.responses.filter(
            (response) => response.choice_text === choice.choice_text
          ).length;

          // Pourcentage des réponses pour ce choix
          const choicePercentage =
            totalResponses > 0
              ? ((choiceResponses / totalResponses) * 100).toFixed(2)
              : 0;

          return (
            <div
              key={index}
              className={`card-choice ${
                choice.choice_text === poll.selectedChoice ? "selected" : ""
              }`}
            >
              <span>
                {choice.choice_text} - {choiceResponses} réponse(s) (
                {choicePercentage}%)
              </span>
            </div>
          );
        })}
      </div>
      <p className="card-footer">
        Total des réponses : {totalResponses}
      </p>
    </div>
  );
};

export default AnsweredPolls;
