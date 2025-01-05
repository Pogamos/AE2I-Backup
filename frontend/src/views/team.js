import React, { useEffect, useState } from 'react';
import '../css/team.css';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setUsers(data.users);
        } else {
          throw new Error(data.message || 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchSearch = (
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Adaptation des rôles selon votre modèle utilisateur
    const matchRole = selectedRole === '' || user.role === selectedRole;
    
    return matchSearch && matchRole;
  });

  const userRows = [];
  for (let i = 0; i < filteredUsers.length; i += 3) {
    userRows.push(filteredUsers.slice(i, i + 3));
  }

  if (loading) return <div className="text-center p-4">Chargement en cours...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Erreur: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="banner-top py-6">
        <h1 className="text-4xl font-bold text-left">L'AE2i - Association Étudiante 2 l'Informatique</h1>
      </div>
      <h3 className="titre_page_ae2i text-2xl mb-6 text-left">Notre Association</h3>

      <div className="presentation_asso">
        <div className="asso_explicatif">
          <div className="image_asso">
            <img src="/svg/ae2i-logo_dark.svg" alt="staff" width="180" />
          </div>
          <div className="texte_asso">
            <p>Voici l'association AE2i.<br/>Présentation de l'association.</p>
          </div>
        </div>

        <div className="contact">
          <h3>Contact de l'AE2i</h3>
          <br />
          <a href="mailto:asso.ae2i@gmail.fr">asso.ae2i@gmail.fr</a>
          <p>
            Bureau C15 - Rue Raoul Follereau,
            <br /> 13200 Arles
          </p>
          <a href="https://www.instagram.com/ae2i_arles/?hl=fr">Notre Instagram</a>
        </div>
      </div>

      <div className="recherche_staff">
        <div className="titre_page_ae2i_staff">
          <h3 className="titre_page_ae2i text-2xl mb-6 text-left">Notre Équipe</h3>
        </div>
        <div className="barre_recherche_staff">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="user">Membre</option>
            <option value="admin">Administrateur</option>
            <option value="president">Président</option>
            <option value="vicepresident">Vice-président</option>
            <option value="secretaire">Secrétaire</option>
          </select>
        </div>
      </div>

      {userRows.map((row, rowIndex) => (
        <div key={rowIndex} className="trois_cards">
          {row.map(user => (
            <TeamCard
              key={user._id}
              email={user.email}
              nom={user.lastName}
              prenom={user.firstName}
              role={user.role}
              ppicture={user.ppicture}
              isAdherant={user.isAdherant}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const TeamCard = ({ email, nom, prenom, role, ppicture, isAdherant }) => {
  const getRoleDisplay = (role) => {
    const roles = {
      'user': 'Membre',
      'admin': 'Administrateur',
      'president': 'Président',
      'vicepresident': 'Vice-président',
      'secretaire': 'Secrétaire'
    };
    return roles[role] || role;
  };

  return (
    <div className="membre_staff">
      <div className="card_content">
        <div className={`image_membre_staff ${!prenom ? 'empty' : ''}`}>
          {prenom && (
            <img 
              src={ppicture || "/svg/base-pp.svg"} 
              alt={`${prenom} ${nom}`} 
            />
          )}
        </div>
        <div className="contact_membre_staff">
          <h3>{prenom} {nom}</h3>
          <p className="role">{getRoleDisplay(role)}</p>
          <div className="info_section">
            <p className="info_label">Info</p>
            <a href={`mailto:${email}`} className="email">{email}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;