import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/css/pages/index.css';
import SearchSummonerBar from './components/SearchSummonerBar.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
        <Route path="/" element={<SearchSummonerBar />} />
    </Routes>
  </Router>
);