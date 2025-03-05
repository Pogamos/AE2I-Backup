import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminPage.css';

const AdminPage = () => {
  const [profile, setProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchAdherent, setSearchAdherent] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
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
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération du profil');
        }
        return res.json();
      })
      .then(data => {
        const userProfile = data.user || data;
        setProfile(userProfile);
        const role = userProfile.role ? userProfile.role.toLowerCase() : 'user';
        if (role !== 'admin' && role !== 'superadmin') {
          alert("Accès réservé aux administrateurs et superadministrateurs.");
          navigate('/profile');
          return;
        }
        return fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        return res.json();
      })
      .then(data => {
        const users = data.users || data;
        setAllUsers(users);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [navigate]);

  const adherents = allUsers.filter(user => user.isAdherant);

  const filteredAdherents = adherents.filter(user => {
    const search = searchAdherent.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  });

  const filteredUsers = allUsers.filter(user => {
    const search = searchUser.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  });

  const handleDeleteUser = (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expirée. Veuillez vous reconnecter.");
      navigate('/login');
      return;
    }
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Erreur lors de la suppression de l'utilisateur");
          }
          setAllUsers(allUsers.filter(user => user._id !== userId));
          setMessage("Utilisateur supprimé avec succès.");
        })
        .catch(error => {
          console.error(error);
          setMessage("Une erreur est survenue lors de la suppression.");
        });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expirée. Veuillez vous reconnecter.");
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour du rôle");
      }
      const userToUpdate = allUsers.find(u => u._id === userId);
      setAllUsers(allUsers.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setMessage(`Rôle mis à jour avec succès pour ${userToUpdate ? userToUpdate.firstName : ''}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle :', error);
      setMessage("Une erreur est survenue lors de la mise à jour du rôle.");
    }
  };

  if (loading) {
    return <div className="admin-page-container">Chargement...</div>;
  }

  const userRole = profile.role ? profile.role.toLowerCase() : 'user';

  return (
    <div className="admin-page-container">
      <h1>Tableau de bord administrateur</h1>
      {message && <p className="admin-message">{message}</p>}
      <div className="cards-container">
        {/* Carte adhésion */}
        <div className="card">
          <h2>Liste des adhérents</h2>
          <input
            type="text"
            placeholder="Rechercher un adhérent..."
            value={searchAdherent}
            onChange={(e) => setSearchAdherent(e.target.value)}
            className="search-input"
          />
          <ul className="user-list">
            {filteredAdherents.map(user => (
              <li key={user._id} className="user-item">
                <div>
                  <strong>{user.firstName} {user.lastName}</strong>
                  <p>{user.email}</p>
                  <p>Rôle : {user.role}</p>
                  {userRole === 'superadmin' && (
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  )}
                </div>
                {userRole === 'superadmin' && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Supprimer
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Carte utilisateurs */}
        <div className="card">
          <h2>Liste des utilisateurs</h2>
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="search-input"
          />
          <ul className="user-list">
            {filteredUsers.map(user => (
              <li key={user._id} className="user-item">
                <div>
                  <strong>{user.firstName} {user.lastName}</strong>
                  <p>{user.email}</p>
                  <p>Rôle : {user.role}</p>
                  {userRole === 'superadmin' && (
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  )}
                </div>
                {userRole === 'superadmin' && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Supprimer
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
