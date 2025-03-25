import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Home from './pages/Home'

// Protected route component for authenticated users
const Protected_route = ({ children }) => {
  const current_user = JSON.parse(localStorage.getItem('current_user'));
  
  if (!current_user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Protected route component for admin users
const Admin_route = ({ children }) => {
  const current_user = JSON.parse(localStorage.getItem('current_user'));
  
  if (!current_user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }
  
  if (!current_user.is_admin) {
    // Redirect to dashboard if authenticated but not admin
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
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
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
