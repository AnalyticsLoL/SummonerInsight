import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.js';
import MatchHistory from './pages/MatchHistory.js';
import NavBar from './components/NavBar.js';
import './assets/css/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/:regionTag/:summonerName/:tagLine' element={<MatchHistory />} />
    </Routes>
  </Router>
);