import React, { useEffect, useState } from 'react';
import '../css/team.css';

const Team = () => {
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [ajoutMembre, setAjoutMembre] = useState("none");
  const [searchUserTerm, setSearchUserTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [uniqueRoles, setUniqueRoles] = useState([]);
  const [staffForm, setStaffForm] = useState({
    staffRole: 'member',
    description: '',
    promo: '',
    ppicture: null
  });

  const [adminData, setAdminData] = useState({
    description: '',
    ppicture: '/svg/ae2i-logo_dark.svg',
    id: null
  });
  const [isEditingAsso, setIsEditingAsso] = useState(false);
  const [newAssoText, setNewAssoText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const checkAdminStatus = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      setIsAdmin(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/users/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(['admin', 'superadmin'].includes(data.user.role));
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };
  const fetchAllUsers = async () => {
    if (!isAdmin) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5001/api/users/', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAllUsers(data.users);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const fetchStaffUsers = async () => {
    try {
      console.log('Fetching staff users...');
      const response = await fetch('http://localhost:5001/api/users/staff');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const filteredUsers = data.users.filter(user => user.email !== 'admin@ae2i.com');
      console.log('Staff data received:', data);

      if (data.success) {
        setStaffUsers(data.users);

        const roles = data.users
          .filter(user => user.staff && user.staff.staffRole)
          .map(user => user.staff.staffRole);
        const uniqueRolesSet = [...new Set(roles)];
        setUniqueRoles(uniqueRolesSet);

        console.log('Staff users set:', data.users);
      } else {
        throw new Error(data.message || 'Échec de la récupération des membres du staff');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du staff:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await fetch('http://localhost:5001/api/users/admin@ae2i.com', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const staffData = data.user.staff && !Array.isArray(data.user.staff) ?
            data.user.staff : {
              description: "Description par défaut de l'AE2i",
              ppicture: '/svg/ae2i-logo_dark.svg'
            };

          const adminId = data.user._id;
          console.log('Admin ID:', adminId);

          if (!adminId) {
            console.error('No admin ID found in response');
            return;
          }

          setAdminData({
            id: adminId,
            description: staffData.description,
            ppicture: staffData.ppicture
          });
          setNewAssoText(staffData.description);
          setPreviewUrl(staffData.ppicture);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données admin:', error);
    }
  };


  const updateAdminData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!adminData.id) {
        console.error('Erreur impossible de modifier');
        return;
      }

      let imageBase64 = null;
      if (selectedFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(selectedFile);
        });
      }

      const userData = {
        staff: {
          description: newAssoText,
          ppicture: imageBase64 || previewUrl
        }
      };

      const response = await fetch(`http://localhost:5001/api/users/${adminData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAdminData({
            description: newAssoText,
            ppicture: imageBase64 || previewUrl
          });
          setIsEditingAsso(false);
          setSelectedFile(null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données admin:', error);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      await checkAdminStatus();
      await fetchStaffUsers();
      await fetchAdminData();
    };

    initializePage();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers();
    }
  }, [isAdmin]);

  const handleStaffFormChange = (e) => {
    const { name, value } = e.target;
    setStaffForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberAction = async (actionType) => {
    if (!selectedUser) {
      setMessage("Veuillez sélectionner un utilisateur");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const selectedUserData = allUsers.find(user => user._id === selectedUser);

      if (actionType === 'add') {
        if (selectedUserData.staff && typeof selectedUserData.staff === 'object' && !Array.isArray(selectedUserData.staff)) {
          setMessage("Cette personne est déjà membre du staff");
          return;
        }

        const userData = {
          role: "membre",
          staff: {
            staffRole: staffForm.staffRole,
            description: staffForm.description,
            promo: staffForm.promo
          }
        };

        const response = await fetch(`http://localhost:5001/api/users/${selectedUser}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout au staff");
        }

        setMessage("Membre ajouté au staff avec succès");
      } else if (actionType === 'remove') {
        if (!selectedUserData.staff || Array.isArray(selectedUserData.staff) || selectedUserData.staff === null) {
          setMessage("Cette personne n'est pas membre du staff");
          return;
        }

        const userData = {
          role: "user",
          staff: []
        };

        const response = await fetch(`http://localhost:5001/api/users/${selectedUser}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du staff");
        }

        setMessage("Membre retiré du staff avec succès");
      }

      await fetchStaffUsers();
      await fetchAllUsers();
      setSelectedUser(null);
      setStaffForm({
        staffRole: 'member',
        description: '',
        promo: ''
      });

      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error("Error:", error);
      setMessage("Une erreur est survenue: " + error.message);
    }
  };

  const filteredStaffUsers = staffUsers.filter(user => {
    console.log('Filtering user:', user);
    const hasValidStaff = user.staff && typeof user.staff === 'object' && !Array.isArray(user.staff);

    if (!hasValidStaff) return false;

    const matchSearch = (
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchRole = selectedRole === '' || (user.staff && user.staff.staffRole === selectedRole);

    return matchSearch && matchRole;
  });

  const filteredSelectUsers = allUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchUserTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchUserTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUserTerm.toLowerCase())
  );

  const staffRows = [];
  for (let i = 0; i < filteredStaffUsers.length; i += 3) {
    staffRows.push(filteredStaffUsers.slice(i, i + 3));
  }

  if (loading) return <div className="text-center p-4">Chargement en cours...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Erreur: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="banner-top py-6">
        <h1 className="text-4xl font-bold text-left">L'AE2i</h1>
      </div>

      <h3 className="titre_page_ae2i text-2xl mb-6 text-left">Notre Association</h3>

      <div className="presentation_asso">
        <div className="asso_explicatif">
          {!isEditingAsso ? (
            <>
              <div className="image_asso">
                <img src={adminData.ppicture} alt="asso" width="180" />
              </div>
              <div className="texte_asso">
                <p>{adminData.description || "Voici l'association AE2i."}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setIsEditingAsso(true)}
                  className="edit-asso-button"
                >
                  Modifier
                </button>
              )}
            </>
          ) : (
            <div className="edit-asso-container">
              <div className="edit-asso-image-container">
                <img
                  src={previewUrl || adminData.ppicture}
                  alt="Preview"
                  className="edit-asso-preview"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="edit-asso-file-input"
                />
              </div>
              <textarea
                value={newAssoText}
                onChange={(e) => setNewAssoText(e.target.value)}
                placeholder="Description de l'association"
                className="edit-asso-textarea"
              />
              <div className="edit-asso-buttons">
                <button onClick={updateAdminData}>Sauvegarder</button>
                <button onClick={() => {
                  setIsEditingAsso(false);
                  setPreviewUrl(adminData.ppicture);
                  setSelectedFile(null);
                }}>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>



        <div className="contact">
          <h3>Contact de l'AE2i</h3>
          <br />
          <a href="mailto:asso.ae2i@gmail.fr">asso.ae2i@gmail.fr</a>
          <p>
            Rue Raoul Follereau,
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
            placeholder="Rechercher un membre..."
            className="search-input"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-select"
          >
            <option value="">Tous les rôles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          {isAdmin && (
            <div className="admin-buttons">
              <button
                className="ajouter-membre"
                onClick={() => {
                  setAjoutMembre("block");
                  setSelectedUser(null);
                  setSearchUserTerm('');
                  setMessage('');
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 5.99963C0 2.68593 2.68629 -0.000366211 6 -0.000366211H26C29.3137 -0.000366211 32 2.68593 32 5.99963V25.9996C32 29.3133 29.3137 31.9996 26 31.9996H6C2.68629 31.9996 0 29.3133 0 25.9996V5.99963ZM6.4 7.11963C6.4 6.01506 7.29543 5.11963 8.4 5.11963H12.7478C13.8524 5.11963 14.7478 6.01506 14.7478 7.11963V11.4675C14.7478 12.572 13.8524 13.4675 12.7478 13.4675H8.4C7.29543 13.4675 6.4 12.572 6.4 11.4675V7.11963ZM18 15.3046C19.6569 15.3046 21 16.6478 21 18.3046V24.8264C21 26.4832 19.6569 27.8264 18 27.8264H8.17424C5.9651 27.8264 4.17424 26.0355 4.17424 23.8264V18.3046C4.17424 16.6478 5.51739 15.3046 7.17424 15.3046H18Z" fill="white"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0864 15.3031C19.7035 15.3486 21.0004 16.6738 21.0004 18.3019V24.8236C21.0004 26.4517 19.7035 27.7769 18.0864 27.8224V27.8236H23.8256C26.0347 27.8236 27.8256 26.0328 27.8256 23.8236V18.3019C27.8256 16.645 26.4824 15.3019 24.8256 15.3019H18.0864V15.3031Z" fill="#D91663"/>
                  <rect x="19.2002" y="6.39966" width="6.95652" height="6.95652" rx="2" fill="#D91663"/>
                </svg>
                <h3>Gestion membres</h3>
              </button>
            </div>
          )}
        </div>
      </div>

      {staffRows.map((row, rowIndex) => (
        <div key={rowIndex} className="trois_cards">
          {row.map(user => (
            <TeamCard
              key={user._id}
              email={user.email}
              nom={user.lastName}
              prenom={user.firstName}
              staffInfo={user.staff}
            />
          ))}
        </div>
      ))}

      {isAdmin && (
        <div className="ajout-shadow" style={{ display: ajoutMembre }}>
          <div className="ajout-membre">
            <button className="fermer" onClick={() => setAjoutMembre("none")}>
              Fermer
            </button>
            <h3>Gérer les membres du staff</h3>

            {message && (
              <div className={`message ${message.includes('erreur') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <div className="search-container">
              <input
                type="text"
                value={searchUserTerm}
                onChange={(e) => setSearchUserTerm(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="search-input"
              />

              <select
                value={selectedUser || ''}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="user-select"
              >
                <option value="">Sélectionnez un utilisateur</option>
                {filteredSelectUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>

              <div className="button-container">
                <button
                  className="ajouter"
                  onClick={() => handleMemberAction('add')}
                >
                  Ajouter un membre
                </button>
                <button
                  className="supprimer"
                  onClick={() => handleMemberAction('remove')}
                >
                  Retirer un membre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TeamCard = ({ email, nom, prenom, staffInfo }) => {
  console.log('Rendering TeamCard with staffInfo:', staffInfo);
  const hasValidStaffInfo = staffInfo && typeof staffInfo === 'object' && !Array.isArray(staffInfo);
  return (
    <div className="membre_staff">
      <div className="card_content">
        <div className={`image_membre_staff ${!prenom ? 'empty' : ''}`}>
          {prenom && (
            <img
              src={staffInfo?.ppicture || "/svg/base-pp.svg"}
              alt={`${prenom} ${nom}`}
            />
          )}
        </div>
        <div className="contact_membre_staff">
          <h3>{prenom} {nom}</h3>
          <p className="role">{staffInfo?.staffRole || 'Pas de rôle défini'}</p>
          <p className="promo">{staffInfo?.promo ? `${staffInfo.promo}` : 'Pas de promo définie'}</p>
          <p className="description">{staffInfo?.description || 'Pas de description'}</p>
          <div className="info_section">
            <p className="info_label">Contact</p>
            <a href={`mailto:${email}`} className="email">{email}</a>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Team;
