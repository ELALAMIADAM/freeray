import React from 'react';
import IN1 from '../components/interface1.jsx';
import Weatherdata from '../components/Weatherdata.jsx';
import styles from './Home.module.css'; // Import the CSS module
import Layout from '../Layout.jsx';
function Standard() {
  return (
    <>
    <Layout>
    <div className={styles.containers}>
      <div className={styles.chartContainer}>
        <IN1 />
        
      </div>
    </div>
    </Layout>
    </>
  );
}

export default Standard;
