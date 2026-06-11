import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Hamburger menu for mobile */}
        <button className="menu-btn" onClick={toggleSidebar}>
          &#9776;
        </button>
        <h1 className="app-title">Expense Tracker</h1>
      </div>
      <div className="navbar-right">
        <span>Welcome, {user?.name || user?.email || 'User'}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
