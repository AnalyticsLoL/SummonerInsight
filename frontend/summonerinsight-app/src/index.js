import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

import Home from './pages/Home.js';
import Summoner from './pages/SummonerPage/Summoner.js';
import NavBar from './components/NavBar.js';

import './assets/css/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/summoner/:regionTag/:gameName/:tagLine' element={<Summoner />} />
        </Routes>
      </Router>
    </PersistGate>
  </Provider>
);