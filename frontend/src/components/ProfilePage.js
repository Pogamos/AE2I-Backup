import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      alert("Vous devez être connecté pour accéder à cette page.");
      navigate('/login');
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data.user || response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        setLoading(false);
        alert('Session expirée. Veuillez vous reconnecter.');
        navigate('/login');
      });
  }, [navigate]);

  const handleEdit = () => {
    setEditableProfile({ ...profile }); // Copier les données actuelles dans l'objet modifiable
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expirée. Veuillez vous reconnecter.");
      return;
    }
  
    try {
      let formData;
      if (selectedFile) {
        formData = new FormData();
        Object.keys(editableProfile).forEach((key) => {
          formData.append(key, editableProfile[key]);
        });
        formData.append('ppicture', selectedFile);  // Ajoute le fichier sélectionné
      } else {
        formData = { ...editableProfile };  // Envoie JSON si pas d'image
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      if (selectedFile) {
        headers['Content-Type'] = 'multipart/form-data';
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/users/${editableProfile.email}`,
        formData,
        { headers }
      );
  
      setProfile(response.data.user || editableProfile);  // Met à jour les données
      setMessage('Profil mis à jour avec succès !');
      setIsModalOpen(false);  // Ferme la modale après sauvegarde
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      setMessage('Une erreur est survenue lors de la mise à jour.');
    }
  };
  
  
  

  if (loading) {
    return <div className="profile-container">Chargement...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mon profil</h1>
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={profile.ppicture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-info">
            <h2>
              {profile.firstName} {profile.lastName}
              <button className="edit-button" onClick={handleEdit}>
                Modifier
              </button>
            </h2>
            <p>{profile.email}</p>
            <p>Rôle : {profile.role || 'Utilisateur standard'}</p>
          </div>
        </div>
        <div className="profile-bio">
          <h3>Bio</h3>
          <p>{profile.bio || 'Aucune bio disponible.'}</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier le profil</h2>
            <form onSubmit={handleSave}>
              <label>Prénom :</label>
              <input
                type="text"
                name="firstName"
                value={editableProfile.firstName || ''}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="Prénom"
                required
              />

              <label>Nom :</label>
              <input
                type="text"
                name="lastName"
                value={editableProfile.lastName || ''}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="Nom"
                required
              />

              <label>Email :</label>
              <input
                type="email"
                name="email"
                value={editableProfile.email || ''}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="Email"
                required
              />

              <label>Bio :</label>
              <textarea
                name="bio"
                value={editableProfile.bio || ''}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="Bio"
              ></textarea>

              <label>Photo de profil :</label>
              <input type="file" name="ppicture" onChange={handleFileChange} className="modal-input" />

              <div className="modal-buttons">
                <button type="submit" className="modal-button">
                  Enregistrer
                </button>
                <button type="button" className="modal-button cancel" onClick={handleCloseModal}>
                  Annuler
                </button>
              </div>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
