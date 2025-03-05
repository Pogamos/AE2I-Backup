import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const translateError = (error) => {
    if (error.includes("Invalid email or password")) {
      return "Adresse e-mail ou mot de passe incorrect.";
    }
    if (error.includes("User not found")) {
      return "Utilisateur introuvable. Vérifiez votre e-mail.";
    }
    if (error.includes("Invalid password")) {
      return "Mot de passe incorrect.";
    }
    return "Échec de la connexion. Vérifiez vos identifiants.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(translateError(data.error || ""));
        return;
      }

      console.log('Données de connexion reçues :', data);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('email', email);
      
      if (data.user && data.user.role) {
        localStorage.setItem('userRole', data.user.role.toLowerCase());
      } else {
        localStorage.setItem('userRole', '');
      }
      navigate('/myaccount');
      window.location.reload();


    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage('Impossible de se connecter au serveur. Vérifiez votre connexion.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Connexion</h1>
      <form className="login-form" onSubmit={handleSubmit}>
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button">
          Se connecter
        </button>
      </form>
      <p className="register-link">
        Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
      </p>
    </div>
  );
};

export default LoginPage;
