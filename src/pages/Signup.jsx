import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  // state für d formularwäärtsch
  const [form_data, set_form_data] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const navigate = useNavigate();

  const handle_input_change = (e) => {
    // aktualisiert s formular bi änderige
    const { name, value } = e.target;
    set_form_data(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handle_submit = (e) => {
    e.preventDefault();
    // luegt, ob d passwörter übereinstimmät
    if (form_data.password !== form_data.confirm_password) {
      alert("passwörter stimmät nid überein!");
      return;
    }
    
    // überprüeft, ob de benutzer scho existiert
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existing_user = users.find(user => user.email === form_data.email);
    
    if (existing_user) {
      alert('en benutzer mit derä e-mail existiert scho!');
      return;
    }
    
    // benutzerdaten spichere
    const new_user = {
      id: Date.now().toString(),
      first_name: form_data.first_name,
      last_name: form_data.last_name,
      email: form_data.email,
      password: form_data.password // würd in echt verschlüsslet
    };
    
    users.push(new_user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // zum login navigiere
    alert('konto erfolgreich erstellt! bitte ahmelde.');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create an account at FJ Bank</h2>
        <form onSubmit={handle_submit} className="auth-form">
          <div className="form-group">
            <label htmlFor="first_name">Firstname</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={form_data.first_name}
              onChange={handle_input_change}
              required
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Lastname</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={form_data.last_name}
              onChange={handle_input_change}
              required
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form_data.email}
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
              value={form_data.password}
              onChange={handle_input_change}
              required
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={form_data.confirm_password}
              onChange={handle_input_change}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;