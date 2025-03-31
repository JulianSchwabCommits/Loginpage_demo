import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();
  // state für d benutzerliste
  const [users, set_users] = useState([]);
  // state für de aktuelle admin
  const [current_admin, set_current_admin] = useState(null);
  // state für en neue benutzer
  const [new_user, set_new_user] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    is_admin: false
  });
  // state für de edit modus
  const [edit_mode, set_edit_mode] = useState(false);
  // state für d id vom benutzer wo bearbeitet wird
  const [edit_user_id, set_edit_user_id] = useState(null);

  useEffect(() => {
    // prüef ob de benutzer authentifiziert isch und en admin isch
    const current_user = JSON.parse(localStorage.getItem('current_user'));
    if (!current_user || !current_user.is_admin) {
      // witerleite zum login wenn nit authentifiziert oder kein admin
      navigate('/login');
      return;
    }

    set_current_admin(current_user);
    load_users();
  }, [navigate]);

  const load_users = () => {
    // lade d benutzer vom localstorage
    const stored_users = JSON.parse(localStorage.getItem('users') || '[]');
    set_users(stored_users);
  };

  const handle_input_change = (e) => {
    // aktualisiere de state vom neue benutzer
    const { name, value, type, checked } = e.target;
    set_new_user((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handle_add_user = (e) => {
    e.preventDefault();

    // validiere d inputs
    if (!new_user.first_name || !new_user.last_name || !new_user.email || !new_user.password) {
      alert('please fill in all required fields');
      return;
    }

    // prüef ob d email scho existiert
    if (!edit_mode && users.some((user) => user.email === new_user.email)) {
      alert('a user with this email already exists');
      return;
    }

    if (edit_mode) {
      // aktualisiere en existierende benutzer
      const updated_users = users.map((user) =>
        user.id === edit_user_id ? { ...new_user, id: edit_user_id } : user
      );
      localStorage.setItem('users', JSON.stringify(updated_users));
      set_users(updated_users);

      // reset form
      set_edit_mode(false);
      set_edit_user_id(null);
    } else {
      // neue benutzer hinzufügen
      const user_to_add = {
        ...new_user,
        id: Date.now().toString()
      };

      const updated_users = [...users, user_to_add];
      localStorage.setItem('users', JSON.stringify(updated_users));
      set_users(updated_users);
    }

    // form leere
    set_new_user({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      is_admin: false
    });
  };

  const handle_edit_user = (user) => {
    // setze d state für de edit modus
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
    // benutzer lösche
    if (window.confirm('are you sure you want to delete this user?')) {
      const updated_users = users.filter((user) => user.id !== user_id);
      localStorage.setItem('users', JSON.stringify(updated_users));
      set_users(updated_users);

      // wenn de benutzer grad bearbeitet wird reset form
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
    // benutzer uslogge
    localStorage.removeItem('current_user');
    navigate('/login');
  };

  const handle_back_to_dashboard = () => {
    // zrugg zum dashboard
    navigate('/dashboard');
  };

  if (!current_admin) {
    return <div className="loading">loading...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-actions">
          <button onClick={handle_back_to_dashboard} className="back-button">
            back to dashboard
          </button>
          <button onClick={handle_logout} className="logout-button">
            logout
          </button>
        </div>
      </header>

      <div className="admin-content">
        <section className="admin-form-section">
          <h2 className="section-title">{edit_mode ? 'edit user' : 'add new user'}</h2>
          <form onSubmit={handle_add_user} className="admin-form">
            <div className="form-group">
              <label htmlFor="first_name">Firstname</label>
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
              <label htmlFor="last_name">Lastname</label>
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
              <label htmlFor="email">E-Mail</label>
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
                <span className="admin-privileges-text">Admin privileges</span>
              </label>
            </div>
            <div className="form-buttons">
              <button type="submit" className="admin-button submit-button">
                {edit_mode ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </section>

        <section className="users-list-section">
          <h2 className="section-title">All Users</h2>
          {users.length === 0 ? (
            <p className="no-users">No users found.</p>
          ) : (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>E-Mail</th>
                    <th>Privileges</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.first_name} {user.last_name}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.is_admin ? 'admin' : 'user'}</td>
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