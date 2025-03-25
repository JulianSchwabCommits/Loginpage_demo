import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate   = useNavigate();
  const [users, set_users] = useState([]);
  const [current_admin, set_current_admin] = useState(null);
  const [new_user, set_new_user] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    is_admin: false
  });
  const [edit_mode, set_edit_mode] = useState(false);
  const [edit_user_id, set_edit_user_id] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and is admin
    const current_user = JSON.parse(localStorage.getItem('current_user'));
    if (!current_user || !current_user.is_admin) {
      // Redirect to login if not authenticated or not admin
      navigate('/login');
      return;
    }
    
    set_current_admin(current_user);
    load_users();
  }, [navigate]);

  const load_users = () => {
    const stored_users = JSON.parse(localStorage.getItem('users') || '[]');
    set_users(stored_users);
  };

  const handle_input_change = (e) => {
    const { name, value, type, checked } = e.target;
    set_new_user(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handle_add_user = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!new_user.first_name || !new_user.last_name || !new_user.email || !new_user.password) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Check for duplicate email
    if (!edit_mode && users.some(user => user.email === new_user.email)) {
      alert('A user with this email already exists');
      return;
    }
    
    if (edit_mode) {
      // Update existing user
      const updated_users = users.map(user => 
        user.id === edit_user_id ? { ...new_user, id: edit_user_id } : user
      );
      localStorage.setItem('users', JSON.stringify(updated_users));
      set_users(updated_users);
      
      // Reset form
      set_edit_mode(false);
      set_edit_user_id(null);
    } else {
      // Add new user
      const user_to_add = {
        ...new_user,
        id: Date.now().toString()
      };
      
      const updated_users = [...users, user_to_add];
      localStorage.setItem('users', JSON.stringify(updated_users));
      set_users(updated_users);
    }
    
    // Clear form
    set_new_user({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      is_admin: false
    });
  };

  const handle_edit_user = (user) => {
    set_new_user({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      is_admin: user.is_admin || false
    });
    set_edit_mode(true);
    set_edit_user_id(user.id);
  };

  const handle_delete_user = (user_id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updated_users = users.filter(user => user.id !== user_id);
      localStorage.setItem('users', JSON.stringify(updated_users));
      set_users(updated_users);
      
      // If editing this user, reset the form
      if (edit_mode && edit_user_id === user_id) {
        set_edit_mode(false);
        set_edit_user_id(null);
        set_new_user({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          is_admin: false
        });
      }
    }
  };

  const handle_logout = () => {
    localStorage.removeItem('current_user');
    navigate('/login');
  };

  const handle_back_to_dashboard = () => {
    navigate('/dashboard');
  };

  if (!current_admin) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-actions">
          <button onClick={handle_back_to_dashboard} className="back-button">
            Back to Dashboard
          </button>
          <button onClick={handle_logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="admin-content">
        <section className="admin-form-section">
          <h2 className="section-title">{edit_mode ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handle_add_user} className="admin-form">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={new_user.first_name}
                onChange={handle_input_change}
                required
                className="admin-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={new_user.last_name}
                onChange={handle_input_change}
                required
                className="admin-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={new_user.email}
                onChange={handle_input_change}
                required
                className="admin-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={new_user.password}
                onChange={handle_input_change}
                required
                className="admin-input"
              />
            </div>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="is_admin"
                name="is_admin"
                checked={new_user.is_admin}
                onChange={handle_input_change}
              />
              <label htmlFor="is_admin">
                <span className="admin-privileges-text">Admin Privileges</span>
              </label>
            </div>
            <div className="form-buttons">
              <button type="submit" className="admin-button submit-button">
                {edit_mode ? 'Update User' : 'Add User'}
              </button>
              {edit_mode && (
                <button 
                  type="button" 
                  className="admin-button cancel-button"
                  onClick={() => {
                    set_edit_mode(false);
                    set_edit_user_id(null);
                    set_new_user({
                      first_name: '',
                      last_name: '',
                      email: '',
                      password: '',
                      is_admin: false
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="users-list-section">
          <h2 className="section-title">All Users</h2>
          {users.length === 0 ? (
            <p className="no-users">No users found</p>
          ) : (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.first_name} {user.last_name}</td>
                      <td>{user.email}</td>
                      <td>{user.is_admin ? 'Admin' : 'User'}</td>
                      <td className="actions-cell">
                        <button 
                          onClick={() => handle_edit_user(user)}
                          className="action-button edit-button"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handle_delete_user(user.id)}
                          className="action-button delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Admin; 