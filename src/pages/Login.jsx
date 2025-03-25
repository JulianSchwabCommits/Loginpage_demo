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
    // Check if user is already authenticated
    const current_user = JSON.parse(localStorage.getItem('current_user'));
    if (current_user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handle_input_change = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handle_submit = (e) => {
    e.preventDefault();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user by email
    const user = users.find(u => u.email === formData.email);
    
    // Check if user exists and password matches
    if (user && user.password === formData.password) {
      // Store current user (without password) in localStorage
      const user_info = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      };
      
      localStorage.setItem('current_user', JSON.stringify(user_info));
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

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