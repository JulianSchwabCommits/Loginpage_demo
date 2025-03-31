import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Home from './pages/Home'

// gschützti route komponente für authentifizierte benutzer
const Protected_route = ({ children }) => {
  const current_user = JSON.parse(localStorage.getItem('current_user'));
  
  if (!current_user) {
    // witerleite zu login wänn nit authentifiziert
    return <Navigate to="/login" />;
  }
  
  return children;
};

// gschützti route komponente für admin benutzer
const Admin_route = ({ children }) => {
  const current_user = JSON.parse(localStorage.getItem('current_user'));
  
  if (!current_user) {
    // witerleite zu login wänn nit authentifiziert
    return <Navigate to="/login" />;
  }
  
  if (!current_user.is_admin) {
    // witerleite zum dashboard wänn authentifiziert aber nit admin
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <Protected_route>
                <Dashboard />
              </Protected_route>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <Admin_route>
                <Admin />
              </Admin_route>
            } 
          />
          {/* catch all route - witerleite zu login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
