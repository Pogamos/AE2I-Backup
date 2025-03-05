import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../css/Polls.css";

const AdminPoll = () => {
  const [polls, setPolls] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [choices, setChoices] = useState([""]);
  const [role, setRole] = useState(null);
  const [isAddingPoll, setIsAddingPoll] = useState(false);

  // Vérification du rôle admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token && email) {
      fetch(`http://localhost:5000/api/users/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRole(data.user.role);
        })
        .catch((error) => console.error("Erreur récupération rôle :", error));
    }
  }, []);

  // Ajouter une option au sondage
  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  // Modifier le texte d'une option
  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  // Supprimer un sondage
  const handleDeletePoll = async (pollId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce sondage ?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/polls/${pollId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPolls((prev) => prev.filter((poll) => poll._id !== pollId));
      }
    } catch (error) {
      console.error("Erreur suppression sondage :", error);
    }
  };

  // Créer un sondage
  const handleCreatePoll = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newPoll = {
      title,
      description,
      choices: choices.map((choice) => ({ choice_text: choice })),
    };

    try {
      const response = await fetch("http://localhost:5000/api/polls/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPoll),
      });

      if (response.ok) {
        const createdPoll = await response.json();
        setPolls((prev) => [...prev, createdPoll.poll]);
        setTitle("");
        setDescription("");
        setChoices([""]);
        setIsAddingPoll(false);
      }
    } catch (error) {
      console.error("Erreur création sondage :", error);
    }
  };

  // Si l'utilisateur n'est pas admin, on ne montre rien
  if (role !== "admin" || role !== "superadmin") {
    return null;
  }

  return (
    <>
      {/* Bouton pour ouvrir la side-panel */}
      <div className="admin-container">
        <button className="add-poll-button" onClick={() => setIsAddingPoll(true)}>
          ➕ Ajouter un sondage
        </button>
      </div>

      {/* Utilisation de React Portal pour éviter les problèmes de z-index */}
      {createPortal(
        <>
          {/* Overlay en arrière-plan */}
          {isAddingPoll && <div className="overlay" onClick={() => setIsAddingPoll(false)}></div>}

          {/* Side-panel (formulaire) */}
          <div className={`poll-form-container ${isAddingPoll ? "open" : ""}`}>
            <button className="close-button" onClick={() => setIsAddingPoll(false)}>✖</button>
            <div className="poll-form-content">
            <h2>Ajouter un sondage</h2>
            <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="choices">
              {choices.map((choice, index) => (
                <input
                  key={index}
                  type="text"
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
              ))}
              <button onClick={handleAddChoice}>➕ Ajouter une option</button>
            </div>
            </div>
            <button className="create-button" onClick={handleCreatePoll}>Créer le sondage</button>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default AdminPoll;
