
import Footer from "./footer.jsx";
import Data from "./pages/Data.jsx";
import React from 'react';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header.jsx';
import Home from './pages/Home.jsx';
import DASH_List from "./pages/DASH_List.jsx";
import List_Slave from './pages/List_Slave.jsx';
import List_Signal from "./pages/List_Signal.jsx";
import Dashboard from "./pages/Dashboard.jsx";
function App() {
  return(
<>

    <Router>
      <div>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/List/Slave" element={<List_Slave />} />
          <Route path="/List/Signal" element={<List_Signal />} />
          <Route path="/Data" element={ <Data/>} />
          <Route path="/Dashboard" element={ <Dashboard/>} />
          <Route path="/Dashboard/List_insert" element={<DASH_List />} />

      </Routes>
      <Footer/>  
        
        
      </div>
    </Router>
 
  </>
);
}

export default App
