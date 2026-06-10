import React from 'react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Hamburger menu for mobile */}
        <button className="menu-btn" onClick={toggleSidebar}>
          &#9776;
        </button>
      </div>
      <div className="navbar-right">
        {/* You can add user profile info or logout button here */}
        <span>Welcome, User</span>
      </div>
    </header>
  );
};

export default Navbar;
