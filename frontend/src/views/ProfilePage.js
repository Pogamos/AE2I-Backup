import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (!token || !email) {
      navigate('/login');
      return;
    }
    fetch(`http://localhost:5000/api/users/${email}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des données utilisateur");
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data.user || data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        setLoading(false);
        navigate('/login');
      });
  }, [navigate]);

  const handleEdit = () => {
    setEditableProfile({ ...profile });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expirée. Veuillez vous reconnecter.");
      return;
    }
    try {
      const { _id, ...dataToSend } = editableProfile;
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      };
      const res = await fetch(`http://localhost:5000/api/users/${profile._id}`, options);
      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }
      const data = await res.json();
      setProfile(data.user || editableProfile);
      setMessage('Profil mis à jour avec succès !');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      setMessage('Une erreur est survenue lors de la mise à jour.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
    window.location.reload();
  };

  const handleOpenPasswordModal = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage('');
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const validatePassword = (password) => {
    if (password.length < 8) 
      return "Le mot de passe doit contenir au moins 8 caractères.";
    if (!/\d/.test(password)) 
      return "Le mot de passe doit contenir au moins un chiffre.";
    if (!/[a-zA-Z]/.test(password)) 
      return "Le mot de passe doit contenir au moins une lettre.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) 
      return "Le mot de passe doit contenir au moins un caractère spécial.";
    return null;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setPasswordMessage(passwordError);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expirée. Veuillez vous reconnecter.");
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/change_password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la modification du mot de passe");
      }
      setPasswordMessage("Mot de passe modifié avec succès !");
      setTimeout(() => {
        setIsPasswordModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      setPasswordMessage("Une erreur est survenue lors de la modification du mot de passe.");
    }
  };

  if (loading) {
    return <div className="profile-container">Chargement...</div>;
  }

  const userRole = profile.role ? profile.role.toLowerCase() : 'user';
  const canEdit = userRole === 'admin' || userRole === 'superadmin' || userRole === 'staff';

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mon profil</h1>
      <div className="profile-card">
        <div className="profile-header">
          <svg width="150" height="150" className="profile-image-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6a11cb" stopOpacity="1" />
                <stop offset="100%" stopColor="#2575fc" stopOpacity="1" />
              </linearGradient>
              <clipPath id="clipCircle">
                <circle cx="12" cy="12" r="10" />
              </clipPath>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#grad)" />
            <g clipPath="url(#clipCircle)">
              <path fill="#ffffff" transform="translate(2.4,2.4) scale(0.8)" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </g>
          </svg>
          <div className="profile-info">
            <h2>
              {profile.firstName} {profile.lastName}
            </h2>
            <p>{profile.email}</p>
            <p>Rôle : {profile.role || 'User'}</p>
            {(userRole === 'staff' || userRole === 'admin' || userRole === 'superadmin') && (
              <>
                <p>Description : {profile.bio || 'Aucune description.'}</p>
                <p>Promotion : {profile.promo || 'Non défini'}</p>
                <p>Poste : {profile.poste || 'Non défini'}</p>
              </>
            )}
            <div className="button-group">
              <button className="logout-button" onClick={handleLogout}>Se déconnecter</button>
              {canEdit && <button className="edit-button" onClick={handleEdit}>Modifier mes infos</button>}
              <button className="password-button" onClick={handleOpenPasswordModal}>Modifier mon mot de passe</button>
            </div>
          </div>
        </div>
      </div>
      {canEdit && isModalOpen && (
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
              <label>{userRole === 'staff' ? 'Description :' : 'Bio :'}</label>
              <textarea
                name="bio"
                value={editableProfile.bio || ''}
                onChange={handleInputChange}
                className="modal-input"
                placeholder={userRole === 'staff' ? 'Description' : 'Bio'}
              ></textarea>
              {(userRole === 'staff' || userRole === 'admin' || userRole === 'superadmin') && (
                <>
                  <label>Promotion :</label>
                  <input
                    type="text"
                    name="promo"
                    value={editableProfile.promo || ''}
                    onChange={handleInputChange}
                    className="modal-input"
                    placeholder="Promotion"
                    required
                  />
                  <label>Poste :</label>
                  <input
                    type="text"
                    name="poste"
                    value={editableProfile.poste || ''}
                    onChange={handleInputChange}
                    className="modal-input"
                    placeholder="Poste"
                    required
                  />
                </>
              )}
              <div className="modal-buttons">
                <button type="submit" className="modal-button">Enregistrer</button>
                <button type="button" className="modal-button cancel" onClick={handleCloseModal}>Annuler</button>
              </div>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )}
      {isPasswordModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier le mot de passe</h2>
            <form onSubmit={handlePasswordChange}>
              <label>Ancien mot de passe :</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="modal-input"
                required
              />
              <label>Nouveau mot de passe :</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="modal-input"
                required
              />
              <label>Confirmer le nouveau mot de passe :</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="modal-input"
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="modal-button">Enregistrer</button>
                <button type="button" className="modal-button cancel" onClick={handleClosePasswordModal}>Annuler</button>
              </div>
            </form>
            {passwordMessage && <p className="message">{passwordMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
