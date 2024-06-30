import profilePic from './assets/freeray.jpg';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={profilePic} alt="profile" className="profile-pic" />
          <span className="site-title">FREERAY</span>
        </div>
        <nav className="navigation">
          <ul className="nav-list">
            <li><Link to="/"><button className="nav-button">Home</button></Link></li>
            <li><Link to="/Dashboard"><button className="nav-button">Dashboard</button></Link></li>
            <li><Link to="/Data"><button className="nav-button">Data</button></Link></li>
            <li>
              <button className="nav-button" onClick={toggleSubMenu}>List</button>
              {showSubMenu && (
                <ul className="sub-menu">
                  <li><Link to="/List/Signal">Signal</Link></li>
                  <li><Link to="/List/Slave">Slave</Link></li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
