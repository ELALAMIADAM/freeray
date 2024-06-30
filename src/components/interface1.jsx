// Assuming you have a D3Diagram component that needs to be smaller
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Firstbody from "../interface1/firstbody.jsx";
import Alarme from "../interface1/Alarme.jsx";
import Secondbody from "../interface1/Secondbody.jsx";
import D3Diagram from "../interface3/D3Diagram.jsx";
import charbon from '../assets/charbon.png';
import emission from '../assets/emission.jpg';
import arbre from '../assets/arbre.png';
import styles from './Interface1.module.css'; // Import the CSS module
import Weatherdata from '../components/Weatherdata.jsx';

function Interface1() {
  const [data, setData] = useState({
    CO2: 0,
    charbon_: 0,
    arbre_planté: 0,
    Alarme_nb: 0,
    critique: 0,
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
        const response = await axios.get('http://localhost:3001/CO2');
        if (response.data.length > 0) {
          const data = response.data.reduce((acc, item, index) => {
            acc.CO2 = response.data[0].signal_value;
            acc.charbon_ = response.data[0].signal_value;
            acc.arbre_planté = response.data[0].signal_value;
            acc.Alarme_nb = response.data[0].signal_value;
            acc.critique = response.data[0].signal_value;
            acc.Majeur = response.data[0].signal_value;
            acc.Mineur = response.data[0].signal_value;
            acc.Averts = response.data[0].signal_value;
            acc.pv = response.data[0].signal_value;
            acc.load = response.data[0].signal_value;
            acc.grid = response.data[0].signal_value;
            return acc;
          }, {});
          setData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.group}>
          <div className={styles.element}>
            <D3Diagram series={[data.pv, data.load, data.grid]} style={{ maxWidth: '300px' }} />
            {/* <Weatherdata /> */}
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.element}>
            <Secondbody name="Economies charbon standard" valeur={data.charbon_} unite="tonnes" icon={charbon} />
          </div>
          <div className={styles.element}>
            <Secondbody name="CO2 évité" valeur={data.CO2} unite="tonnes" icon={emission} />
          </div>
          <div className={styles.element}>
            <Secondbody name="Équivalent arbres plantés" valeur={data.arbre_planté} icon={arbre} />
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.element}>
            <Alarme name="Alarme" valeur={data.Alarme_nb} />
          </div>
          <div className={styles.element}>
            <Firstbody name="Critique" valeur={data.critique} />
          </div>
          <div className={styles.element}>
            <Firstbody name="Majeur" valeur={data.Majeur} />
          </div>
          <div className={styles.element}>
            <Firstbody name="Mineur" valeur={data.Mineur} />
          </div>
          <div className={styles.element}>
            <Firstbody name="Averts" valeur={data.Averts} />
          </div>
        </div>
      </div>
      <hr />
    </main>
  );
}

export default Interface1;
