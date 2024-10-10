import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Secondbody from "../interface1/Secondbody.jsx";
import D3Diagram from "../interface3/D3Diagram.jsx";
import charbon from '../assets/charbon.png';
import emission from '../assets/emission.jpg';
import arbre from '../assets/arbre.png';
import warning from '../assets/warning.png';
import Major from '../assets/Major.png';
import Minor from '../assets/Minor.png';
import AvertsI from '../assets/Averts.jpg';
import interface1 from './Interface1.module.css'; 
import Weatherdata from '../components/Weatherdata.jsx';
import Card from '../interface1/Card.jsx';
import ApexChart from '../components/apex_chart.jsx';
function Interface1() {
  const [data, setData] = useState({
    CO2: 0,
    charbon_: 0,
    arbre_planté: 0,
    Critique: 0,
    Majeur: 0,
    Mineur: 0,
    Averts: 0,
    pv: 0,
    load: 0,
    grid: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseCO2, responsealarm] = await Promise.all([
          axios.get('http://localhost:3001/CO2'),
          axios.get('http://localhost:3001/alarm')
        ]);

        const newData = {};

        if (responseCO2.data.length > 0) {
          const co2Data = responseCO2.data[0].signal_value;
          newData.CO2 = co2Data;
          newData.charbon_ = co2Data / 2.4;
          newData.arbre_planté = Math.ceil(co2Data / 22);
          newData.pv = co2Data;
          newData.load = co2Data;
          newData.grid = co2Data;
        }

        if (responsealarm.data.length > 0) {
          const alarmData = responsealarm.data[0];
          newData.Majeur = alarmData.Majeur;
          newData.Mineur = alarmData.Mineur;
          newData.Critique = alarmData.Critique;
          newData.Averts = alarmData.Averts;
        }

        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className={interface1.dashboard}>
      <div className={interface1.interface1group}>
        <div className={interface1.elementA}>
          <Card icon={warning} valeur={data.Critique} description="Critique" bgColor="#fca752" />
        </div>
        <div className={interface1.elementA}>
          <Card icon={Major} valeur={data.Majeur} description="Majeur" bgColor="#e5f6ff" />
        </div>
        <div className={interface1.elementA}>
          <Card icon={Minor} valeur={data.Mineur} description="Mineur" bgColor="#fff8e5" />
        </div>
        <div className={interface1.elementA}>
          <Card icon={AvertsI} valeur={data.Averts} description="Averts" bgColor="#ffe5e5" />
        </div>
      </div>
      <div className={interface1.container}>
        <div className={interface1.group}>
          <div className={interface1.element}>
            <D3Diagram series={[data.pv, data.load, data.grid]} style={{ maxWidth: '300px' }} />
          </div>
        </div>
        <div className={interface1.group}>
          <div className={interface1.element}>
            <Secondbody name="Economies charbon standard" valeur={data.charbon_} unite="tonnes" icon={charbon} />
          </div>
          <div className={interface1.element}>
            <Secondbody name="CO2 évité" valeur={data.CO2} unite="tonnes" icon={emission} />
          </div>
          <div className={interface1.element}>
            <Secondbody name="Équivalent arbres plantés" valeur={data.arbre_planté} icon={arbre} />
          </div>
        </div>
        <div className={interface1.group}>
          <div className={interface1.elementA}>
            <Weatherdata />
          </div>
        </div>
      </div>
      <div className={interface1.container}>
      <ApexChart/>
      </div>

      <hr />
    </main>
  );
}

export default Interface1;
