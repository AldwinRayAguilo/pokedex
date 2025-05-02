// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonList from './components/PokemonList';
import PokemonDetails from './components/PokemonDetails';
import BattlePage from './components/BattlePage';
import TeamPage from './components/TeamPage';
import FavoritesPage from './components/FavoritesPage';
import './styles.css';
import './App.css';




function App() {
  return (
    <Router>
      <div>
        <h1 style={{ textAlign: 'center' }}>Pokédex Battle</h1>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
