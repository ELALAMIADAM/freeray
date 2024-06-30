import React from 'react';
import './Secondbody.css';

function Secondbody(props) {
  return (
    <div className="secondbody">
      <div className="icon">
        <img src={props.icon} alt={props.name} />
      </div>
      <div className="content">
        <p className="value">{props.valeur} {props.unite}</p>
        <p className="name">{props.name}</p>
      </div>
    </div>
  );
}

export default Secondbody;
