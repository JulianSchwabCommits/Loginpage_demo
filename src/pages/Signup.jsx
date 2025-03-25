import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const navigate = useNavigate();

  const handle_input_change = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handle_submit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords don't match!");
      return;
    }
    
    // überprüfen, ob der benutzer bereits existiert
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existing_user = users.find(user => user.email === formData.email);
    
    if (existing_user) {
      alert('A user with this email already exists!');
      return;
    }
    
    // Save user data
    const new_user = {
      id: Date.now().toString(),
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password // In a real app, this would be hashed
    };
    
    users.push(new_user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Navigate to login
    alert('Account created successfully! Please login.');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create FJ Bank Account</h2>
        <form onSubmit={handle_submit} className="auth-form">
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handle_input_change}
              required
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handle_input_change}
              required
              className="auth-input"
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handle_input_change}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="submit-button">
            Create Account
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