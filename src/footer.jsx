import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>
          <a href="https://www.freeray.ma" target="_blank" rel="noopener noreferrer">Visit our website</a>
        </p>
        <p className="address">&copy; {new Date().getFullYear()} FREERAY</p>
      </div>
    </footer>
  );
}

export default Footer;
