import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  
  useEffect(() => {
    const current_user = JSON.parse(localStorage.getItem('current_user'));
    if (current_user) {
      if (current_user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handle_input_change = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // fehler löschen, wenn der benutzer wieder tippt
    if (error) setError('');
  };

  const handle_submit = (e) => {
    e.preventDefault();
    
    // benutzer aus localstorage holen
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // benutzer anhand der e-mail finden
    const user = users.find(u => u.email === formData.email);
    
    // überprüfen, ob benutzer existiert und passwort übereinstimmt
    if (user && user.password === formData.password) {
      // aktuellen benutzer (ohne passwort) im localstorage speichern
      const user_info = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_admin: user.is_admin || false
      };
      
      localStorage.setItem('current_user', JSON.stringify(user_info));
      
      // weiterleitung zur adminpage, falls benutzer admin ist, ansonsten zum dashboard
      if (user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  // funktion, um einen admin zu erstellen, falls keiner existiert (für demozwecke)
  const ensure_admin_exists = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // prüfen, ob ein admin existiert
    const admin_exists = users.some(user => user.is_admin);
    
    if (!admin_exists) {
      // standard-admin-benutzer erstellen
      const admin_user = {
        id: Date.now().toString(),
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@admin.com',
        password: 'admin',
        is_admin: true
      };
      
      // alle vorhandenen admin-benutzer entfernen (um einen sauberen zustand zu gewährleisten)
      const filtered_users = users.filter(user => user.email !== 'admin@admin.com');
      
      const updated_users = [...filtered_users, admin_user];
      localStorage.setItem('users', JSON.stringify(updated_users));
      
      // admin-anmeldeinformationen automatisch ausfüllen (optional)
      setFormData({
        email: 'admin@admin.com',
        password: 'admin'
      });
    }
  };

  // admin bei bedarf beim mounten der komponente erstellen
  useEffect(() => {
    ensure_admin_exists();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome to FJ Bank</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handle_submit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handle_input_change}
              required
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handle_input_change}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;