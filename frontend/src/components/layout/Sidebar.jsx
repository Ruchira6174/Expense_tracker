import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-header">
        <h2>Expense Tracker</h2>
        {/* Mobile close button */}
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={toggleSidebar}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/expenses" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={toggleSidebar}
            >
              Expenses
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/income" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={toggleSidebar}
            >
              Income
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={toggleSidebar}
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
