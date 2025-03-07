import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/RegisterPage.css';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (!/\d/.test(password)) return "Le mot de passe doit contenir au moins un chiffre.";
    if (!/[a-zA-Z]/.test(password)) return "Le mot de passe doit contenir au moins une lettre.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Le mot de passe doit contenir au moins un caractère spécial.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Échec de l\'inscription. Veuillez réessayer.');
        return;
      }

      setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      setErrorMessage('Impossible de se connecter au serveur. Réessayez plus tard.');
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Inscription</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Entrez votre prénom"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Entrez votre nom"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre adresse email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmez votre mot de passe"
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="register-button">
          S'inscrire
        </button>
      </form>
      <p className="login-link">
        Déjà un compte ? <a href="/login">Connectez-vous</a>
      </p>
    </div>
  );
};

export default RegisterPage;
