// src/Card.js
import React from 'react';
import './Card.css';

const Card = (props) => {
  return (
    <div className="cardC" style={{ backgroundColor: props.bgColor }}>
      <div className="iconC">
      <img src={props.icon}  />
      </div>
      <div className="numberC">{props.valeur}</div>
      <div className="descriptionC">{props.description}</div>
    </div>
  );
};

export default Card;
