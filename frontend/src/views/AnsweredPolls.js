import React from "react";
import "../css/Polls.css";

const AnsweredPolls = ({ poll }) => {
  if (!poll || !Array.isArray(poll.choices) || !Array.isArray(poll.responses)) {
    console.error("Erreur : Données du sondage invalides", poll);
    return <p>⚠️ Erreur : Données du sondage indisponibles.</p>;
  }

  const totalResponses = poll.responses.length;

  // Préparer un mapping des votes par choix
  const votesByChoice = poll.choices.reduce((acc, choice) => {
    const choiceVotes = poll.responses.filter((r) => r.choice === choice.choice_text).length;
    acc[choice.choice_text] = choiceVotes;
    return acc;
  }, {});

  return (
    <div className="polls-card">
      <h2 className="polls-card-title">{poll.title}</h2>
      {poll.description && <p className="polls-card-description">{poll.description}</p>}

      <div className="polls-card-choices">
        {poll.choices.map((choice, index) => {
          const choiceVotes = votesByChoice[choice.choice_text] || 0;
          const percentage = totalResponses > 0 ? ((choiceVotes / totalResponses) * 100).toFixed(1) : "0.0";

          return (
            <div key={index} className="polls-card-choice">
              {choice.choice_text} - {percentage}% ({choiceVotes} votes)
            </div>
          );
        })}
      </div>

      <p className="polls-card-footer">Total des votes : {totalResponses}</p>
    </div>
  );
};

export default AnsweredPolls;
