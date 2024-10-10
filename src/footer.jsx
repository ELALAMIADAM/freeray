import React from 'react';

const styles = {
  footer: {
    backgroundColor: '#B0B2B5', // Similar grey background
    textAlign: 'center', // Center align the text
    padding: '20px', // Add some padding
    // position: 'fixed', // Fix the footer at the bottom
    // bottom: 0, // Align it to the bottom
    // width: '100%', // Full width of the page
    // zIndex: 1000, // Ensure it appears above other content
  },
  footerContent: {
    margin: '0 auto',
    maxWidth: '1200px',
  },
  footerLink: {
    color: 'white', // White text for the link
    textDecoration: 'none', // Remove underline
    fontWeight: 'bold',
  },
  address: {
    color: 'white', // White text for the address
    fontSize: '16px', // Slightly larger font size
    marginTop: '10px', // Add some space above
  }
};

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <p>
          <a href="https://www.freeray.ma" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
            Visit our website
          </a>
        </p>
        <p style={styles.address}>&copy; {new Date().getFullYear()} FREERAY</p>
      </div>
    </footer>
  );
}

export default Footer;
