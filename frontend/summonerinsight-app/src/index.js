import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home.js';
import Summoner from './pages/SummonerPage/Summoner.js';
import NavBar from './components/NavBar.js';

import './assets/css/index.css';
import {SummonerContext} from './Context.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path='/summoner/:regionTag/:gameName/:tagLine' 
        element={
          <SummonerContext>
            <Summoner />
            </SummonerContext>
        } />
    </Routes>
  </Router>
);