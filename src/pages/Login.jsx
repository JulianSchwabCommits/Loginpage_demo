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
    // luege, öb de benutzer scho agmäldet isch
    const current_user = JSON.parse(localStorage.getItem('current_user'));
    if (current_user) {
      if (current_user.is_admin) {
        // witerleite zum admin-berich, wenn admin
        navigate('/admin');
      } else {
        // witerleite zum dashboard, wenn nit admin
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handle_input_change = (e) => {
    // aktualisiere s formular, wenn sich d'input-wäert ändere
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // fehler lösche, wenn de benutzer wider tippt
    if (error) setError('');
  };

  const handle_submit = (e) => {
    e.preventDefault();
    
    // benutzer vom localstorage hole
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // benutzer anhand vo de e-mail finde
    const user = users.find(u => u.email === formData.email);
    
    // überprüefe, öb benutzer existiert und s passwort stimmt
    if (user && user.password === formData.password) {
      // aktuelle benutzer (ohni passwort) im localstorage speichere
      const user_info = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_admin: user.is_admin || false
      };
      
      localStorage.setItem('current_user', JSON.stringify(user_info));
      
      // witerleitig zur admin-site, wenn de benutzer en admin isch, sust zum dashboard
      if (user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      // zeige en fehler, wenn d'anmeldeinformatione ungültig sind
      setError('Invalid email or password');
    }
  };

  // funktion zum en admin erstelle, falls no keiner existiert (für demo-zweck)
  const ensure_admin_exists = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // überprüefe, öb en admin existiert
    const admin_exists = users.some(user => user.is_admin);
    
    if (!admin_exists) {
      // standard-admin-benutzer erstelle
      const admin_user = {
        id: Date.now().toString(),
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@admin.com',
        password: 'admin',
        is_admin: true
      };
      
      // alli vorhandene admin-benutzer entferne (zum en saubere zustand gwährleiste)
      const filtered_users = users.filter(user => user.email !== 'admin@admin.com');
      
      const updated_users = [...filtered_users, admin_user];
      localStorage.setItem('users', JSON.stringify(updated_users));
      
      // admin-anmeldeinformatione automatisch usfülle (optional)
      setFormData({
        email: 'admin@admin.com',
        password: 'admin'
      });
    }
  };

  // admin bi bedarf bim lade vo de komponente erstelle
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
            <label htmlFor="email">E-Mail</label>
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
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;