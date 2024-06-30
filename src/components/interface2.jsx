import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Firstbody from "../interface2/firstbody.jsx";
// import Secondbody from "../interface2/Secondbody.jsx";
// import Thirdbody from "../interface2/thirdbody.jsx";
import GR from "./graph_yield.jsx";
function interface1() {

  const [data, setData] = useState({
    CO2: 0,
    charbon_: 0,
    arbre_planté: 0
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/CO2`);
        if (response.data.length > 0) {
          const data = response.data.reduce((acc, item, index) => {
            acc.CO2 = response.data[0].signal_value;
            acc.charbon_ = response.data[1].signal_value;
            acc.arbre_planté = response.data[1].signal_value;
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

    return(
  <main>
    
    {/* <div class="container">
  
    <div class="group">
    <div class="element">
    <Thirdbody  name='charge' valeur={data.CO2} unite='tonnes'/></div>
    <div class="element">
    <Thirdbody  name='solar' valeur={data.charbon_} unite='tonnes'/></div>
    <div class="element">
    <Thirdbody  name='battery' valeur={data.arbre_planté} unite='tonnes'/></div>
    <div class="element">
    <Thirdbody  name='connecteur' valeur={data.CO2}unite='tonnes'/></div>
    <div class="element">
    <Thirdbody name='réseau' valeur={data.CO2}/></div>
    </div>
    <div class="group">
    <div class="element">
    <Secondbody  name='Bilan energetique' valeur={data.CO2} unite=''/></div>
    
    </div>
    <div class="group">
    <div class="element">
    <Firstbody  name='rendement' valeur={data.CO2}/></div>
    <div class="element">
    <Firstbody name='Economies de CO2 TOTAL' valeur={data.CO2}/></div>
    
    </div>
    </div> */}
    
      <GR/>
    
    
    
    
    </main>
    
  );
  }
  
  export default interface1
  