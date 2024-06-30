import React from 'react';
import './styles.css'; // You can define your CSS styles in a separate file

function Circle() {
  return (
    <div className="circle-container">
      <div className="top-circle">
        <div className="inner-circle" />
      </div>
      <div className="bottom-circles">
        <div className="bottom-circle">
          <div className="inner-circle" />
          <div className="line" />
        </div>
        <div className="bottom-circle">
          <div className="inner-circle" />
        </div>
      </div>
    </div>
  );
}

export default Circle;
