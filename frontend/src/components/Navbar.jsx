import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1a1a1a' }}>
        Blog CMS
      </Link>
      <div className="links">
        <Link to="/">Home</Link>
        {user && (user.role === 'admin' || user.role === 'author') && (
          <Link to="/dashboard">Dashboard</Link>
        )}
        {user && <Link to="/editor/new">New Post</Link>}
        {user ? (
          <>
            <span className="meta">Hi, {user.name}</span>
            <button className="btn secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
