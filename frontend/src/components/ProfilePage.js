import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editableProfile, setEditableProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
  
      console.log('Token récupéré:', token);
      console.log('Email récupéré:', email);
  
      if (!token || !email) {
        console.error('Token ou email manquant');
        navigate('/login'); // Redirection
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Données du profil récupérées :', response.data);
        setProfile(response.data.user || response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        navigate('/login');
      }
    };
  
    fetchProfile();
  }, [navigate]);
  

  const handleEdit = () => {
    setEditableProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const email = profile.email;
  
    if (!token || !email) {
      console.error('Token ou email manquant');
      alert("Erreur : Vous n'êtes pas authentifié.");
      navigate('/login');
      return;
    }
  
    const dataToUpdate = {
      lastName: editableProfile.lastName,
      firstName: editableProfile.firstName,
      email: editableProfile.email,
    };
  
    console.log("Données envoyées :", dataToUpdate); // Affichage pour debug
  
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${email}`, dataToUpdate, {
        headers: {
          Authorization: `Bearer ${token}`, // Vérifie que ce n'est pas `undefined`
        },
      });
      setProfile(response.data.user || response.data);
      setIsEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      alert('Une erreur est survenue lors de la mise à jour.');
    }
  };
  

  const handleCancel = () => {
    setEditableProfile(null);
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="profile-container">
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mon profil</h1>
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={profile.ppicture ? `http://localhost:5000/${profile.ppicture}` : 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-info">
            <h2>{profile.firstName} {profile.lastName}</h2>
            <p className="profile-email">{profile.email}</p>
          </div>
          <p className="profile-role">Rôle : {profile.role || 'Utilisateur standard'}</p>
        </div>
        <div className="profile-footer">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editableProfile.lastName}
                onChange={(e) => setEditableProfile({ ...editableProfile, lastName: e.target.value })}
                placeholder="Nom"
                className="input-field"
              />
              <input
                type="text"
                value={editableProfile.firstName}
                onChange={(e) => setEditableProfile({ ...editableProfile, firstName: e.target.value })}
                placeholder="Prénom"
                className="input-field"
              />
              <input
                type="email"
                value={editableProfile.email}
                onChange={(e) => setEditableProfile({ ...editableProfile, email: e.target.value })}
                placeholder="Email"
                className="input-field"
              />
              <div className="profile-buttons">
                <button className="profile-button save-button" onClick={handleSave}>
                  Enregistrer
                </button>
                <button className="profile-button cancel-button" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </>
          ) : (
            <button className="profile-button edit-button" onClick={handleEdit}>
              Modifier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
