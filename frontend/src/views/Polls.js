import React, { useState, useEffect } from "react";
import PollCard from "./PollCard.js";
import AnsweredPolls from "./AnsweredPolls.js";
import "../css/Polls.css";

const Polls = ({ currentUserId }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les sondages
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Token d'authentification

        // Récupérer tous les sondages
        const pollsResponse = await fetch("http://localhost:5000/api/polls/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!pollsResponse.ok) {
          throw new Error(
            `Erreur lors de la récupération des sondages : ${pollsResponse.statusText}`
          );
        }

        const pollsData = await pollsResponse.json();

        // Récupérer les réponses pour chaque sondage
        const pollsWithResponses = await Promise.all(
          pollsData.polls.map(async (poll) => {
            try {
              const responsesResponse = await fetch(
                `http://localhost:5000/api/polls/${poll._id}/responses/`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (!responsesResponse.ok) {
                throw new Error(
                  `Erreur lors de la récupération des réponses pour le sondage ${poll._id}`
                );
              }

              const responsesData = await responsesResponse.json();

              const totalResponses = responsesData.responses
                ? responsesData.responses.length
                : 0;

              const totalChoices = poll.choices.length || 0;
              const responsePercentage =
                totalChoices > 0
                  ? ((totalResponses / totalChoices) * 100).toFixed(2)
                  : 0;

              // Vérifie si l'utilisateur actuel a voté
              const userResponse = responsesData.responses.find(
                (response) => response.user_id === currentUserId
              );

              return {
                ...poll,
                responses: responsesData.responses || [],
                totalResponses,
                responsePercentage,
                isVoted: !!userResponse,
                selectedChoice: userResponse ? userResponse.choice_text : null,
              };
            } catch (error) {
              console.error(
                `Erreur lors de la récupération des réponses pour le sondage ${poll._id}:`,
                error
              );
              return {
                ...poll,
                responses: [],
                totalResponses: 0,
                responsePercentage: 0,
                isVoted: false,
                selectedChoice: null,
              };
            }
          })
        );

        setPolls(pollsWithResponses);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des sondages :", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPolls();
  }, [currentUserId]);

  
const handleVote = async (pollId, selectedChoice) => {
  if (!currentUserId) {
    console.error("currentUserId is undefined");
    alert("Erreur: Utilisateur non identifié");
    return;
  }

  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No auth token found");
    alert("Erreur: Token d'authentification manquant");
    return;
  }

  const votePayload = {
    user_id: currentUserId,
    choice_text: selectedChoice.choice_text,
  };

  const url = `http://localhost:5000/api/polls/${pollId}/responses`; 

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(votePayload),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du vote: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Vote response:", data);

    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll._id === pollId
          ? {
              ...poll,
              isVoted: true,
              selectedChoice: selectedChoice.choice_text,
              responses: [...poll.responses, votePayload],
              totalResponses: poll.totalResponses + 1,
            }
          : poll
      )
    );
  } catch (error) {
    console.error("Erreur complète:", error);
    alert(`Erreur lors du vote: ${error.message}`);
  }
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
