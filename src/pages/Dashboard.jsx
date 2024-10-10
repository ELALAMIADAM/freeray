// Home.js
import React from 'react';
import IN2 from "../components/interface2.jsx";
import DASH_ADDED from "../components/DASH_ADDED.jsx";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import Layout from '../Layout.jsx';

import './Dashboard.css'
function Dashboard() {
  return (
    <>    
    <Layout>
    <div>
    <Link to="/Dashboard/List_insert"><Button variant="contained" >Manage Dashboard</Button></Link>

    <DASH_ADDED/>

    </div>
    </Layout>
    </>
  );
}

export default Dashboard;
