// Home.js
import React from 'react';
import IN2 from "../components/interface2.jsx";
import DASH_ADDED from "../components/DASH_ADDED.jsx";
import { Link } from 'react-router-dom';
import './Dashboard.css'
function Dashboard() {
  return (
    <>
    <div>
    {/* <IN2/> */}
    <Link to="/Dashboard/List_insert"><button class='Mbutton' onClick={() => handleAddToDahsboard(slave.logical_address)}>Manage Dashboard</button></Link>
    <DASH_ADDED/>

    </div>
    
    </>
  );
}

export default Dashboard;
