import React, { useEffect, useState } from "react";
import "../css/Polls.css";
import AdminPoll from "./AdminPoll.js";
import AnsweredPolls from "./AnsweredPolls.js";
import PollCard from "./PollCard.js";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [userVotes, setUserVotes] = useState(new Set());

  // 🔹 Sauvegarde des votes en localStorage
  const saveUserVotesToLocalStorage = (votes) => {
    localStorage.setItem("userVotes", JSON.stringify([...votes]));
  };

  // 🔹 Charger les votes stockés et l'utilisateur courant
  useEffect(() => {
    const storedVotes = localStorage.getItem("userVotes");
    if (storedVotes) {
      setUserVotes(new Set(JSON.parse(storedVotes)));
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (token && email) {
        try {
          const response = await fetch(`http://localhost:5001/api/users/${email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setCurrentUserId(data.user._id);
            setRole(data.user.role);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // 🔹 Récupérer les réponses pour un sondage
  const fetchResponses = async (pollId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/polls/${pollId}/responses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des réponses: ${response.statusText}`);
      }

      const responsesData = await response.json();
      return responsesData.responses || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des réponses :", error);
      return [];
    }
  };

  // 🔹 Charger les sondages après le chargement de `currentUserId`
  useEffect(() => {
    if (!currentUserId) return;

    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5001/api/polls/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des sondages: ${response.statusText}`);
        }

        const pollsData = await response.json();

        // 🔄 Charger les réponses pour chaque sondage
        const updatedPolls = await Promise.all(
          pollsData.polls.map(async (poll) => {
            const responses = await fetchResponses(poll._id);
            return {
              ...poll,
              responses,
              isVoted: userVotes.has(poll._id),
            };
          })
        );

        setPolls(updatedPolls);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des sondages :", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPolls();
  }, [currentUserId, userVotes]); // 🔄 Met à jour `polls` immédiatement après le chargement des votes

  // 🔹 Gestion du vote
  const vote = async (pollId, selectedChoice) => {
    if (!currentUserId) {
      alert("Vous devez être connecté pour voter.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Erreur: Token d'authentification manquant");
      return;
    }

    const votePayload = {
      choice: selectedChoice.choice_text,
    };

    try {
      const response = await fetch(`http://localhost:5001/api/polls/${pollId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(votePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erreur API :", errorData);
        throw new Error(`Erreur lors du vote: ${response.status} ${response.statusText}`);
      }

      console.log("✅ Vote enregistré");

      // 🔄 Recharger les réponses après un vote
      const updatedResponses = await fetchResponses(pollId);

      // 🔄 Mise à jour immédiate des sondages après le vote
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll._id === pollId
            ? {
                ...poll,
                isVoted: true,
                selectedChoice: selectedChoice.choice_text,
                responses: updatedResponses,
              }
            : poll
        )
      );

      // 🔄 Mise à jour des votes utilisateur et sauvegarde
      setUserVotes((prevVotes) => {
        const updatedVotes = new Set([...prevVotes, pollId]);
        saveUserVotesToLocalStorage(updatedVotes);
        return updatedVotes;
      });
    } catch (error) {
      console.error("❌ Erreur complète :", error);
      alert(`Erreur lors du vote: ${error.message}`);
    }
  };

  return (
    <div className="polls-container">
      <div className="polls-header">
        <h1 className="polls-title">Sondages</h1>
      </div>
      {role === "admin" || role === "superadmin" && <AdminPoll />}
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
              <PollCard key={poll._id} poll={poll} onVote={vote} />
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
