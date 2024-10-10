import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
  },
  sidebar: {
    position: 'fixed',
    top: 84,
    left: 0,
    height: '100vh',
    backgroundColor: '#ffffff',
    padding: '20px',
    boxSizing: 'border-box',
    width: '250px',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navListItem: {
    marginBottom: '10px',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#000',
    textDecoration: 'none',
    fontSize: '1em',
    cursor: 'pointer',
    textAlign: 'left',
    padding: '10px 15px',
    width: '100%',
    boxSizing: 'border-box',
  },
  subMenu: {
    listStyle: 'none',
    padding: '10px 0 10px 20px',
    backgroundColor: '#f9f9f9',
    margin: 0,
    borderRadius: '4px',
    display: 'none',
  },
  subMenuItem: {
    margin: '5px 0',
  },
  subMenuLink: {
    color: '#000',
    textDecoration: 'none',
    fontSize: '0.9em',
  },
  showSubMenu: {
    display: 'block',
  },
  main: {
    marginLeft: '250px',
    padding: '20px',
    width: 'calc(100% - 250px)',
  },
};

function Layout({ children }) {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.sidebar}>
        <ul style={styles.navList}>
          <li style={styles.navListItem}><Link to="/Standard"><button style={styles.navButton}>Home</button></Link></li>
          <li style={styles.navListItem}><Link to="/Dashboard"><button style={styles.navButton}>Dashboard</button></Link></li>
          <li style={styles.navListItem}><Link to="/Data"><button style={styles.navButton}>Data</button></Link></li>
          <li style={styles.navListItem}>
            <button style={styles.navButton} onClick={toggleSubMenu}>List</button>
            {showSubMenu && (
              <ul style={{ ...styles.subMenu, ...styles.showSubMenu }}>
                <li style={styles.subMenuItem}><Link to="/List/Signal" style={styles.subMenuLink}>Signal</Link></li>
                <li style={styles.subMenuItem}><Link to="/List/Slave" style={styles.subMenuLink}>Slave</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
