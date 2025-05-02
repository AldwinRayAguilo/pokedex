// src/components/BattlePage.js
import React, { useEffect, useState } from 'react';
import jsonServer from '../api';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BattlePage = () => {
  const [team, setTeam] = useState([]);
  const [poke1, setPoke1] = useState(null);
  const [poke2, setPoke2] = useState(null);
  const [poke1Data, setPoke1Data] = useState(null);
  const [poke2Data, setPoke2Data] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    if (poke1) fetchDetails(poke1, setPoke1Data);
  }, [poke1]);

  useEffect(() => {
    if (poke2) fetchDetails(poke2, setPoke2Data);
  }, [poke2]);

  const fetchTeam = async () => {
    const res = await jsonServer.get('/team');
    setTeam(res.data);
  };

  const fetchDetails = async (pokemonName, setter) => {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    setter(res.data);
  };

  const startBattle = async () => {
    if (!poke1 || !poke2 || poke1 === poke2) return;

    const level = 50;
    const getStat = (data, statName) =>
      data.stats.find(s => s.stat.name === statName)?.base_stat || 0;

    const p1 = {
      name: poke1,
      hp: getStat(poke1Data, 'hp'),
      attack: getStat(poke1Data, 'attack'),
      defense: getStat(poke1Data, 'defense'),
      speed: getStat(poke1Data, 'speed'),
      sprite: poke1Data.sprites.front_default,
    };

    const p2 = {
      name: poke2,
      hp: getStat(poke2Data, 'hp'),
      attack: getStat(poke2Data, 'attack'),
      defense: getStat(poke2Data, 'defense'),
      speed: getStat(poke2Data, 'speed'),
      sprite: poke2Data.sprites.front_default,
    };

    let log = [];
    let attacker = p1.speed >= p2.speed ? p1 : p2;
    let defender = attacker === p1 ? p2 : p1;

    const damage = (atk, def) =>
      Math.max(Math.floor((((2 * level / 5 + 2) * atk / def) / 50) + 2), 1);

    while (p1.hp > 0 && p2.hp > 0) {
      const dmg = damage(attacker.attack, defender.defense);
      defender.hp -= dmg;
      log.push(`🗡️ ${attacker.name} hits ${defender.name} for ${dmg} damage! (${defender.hp > 0 ? defender.hp : 0} HP left)`);

      if (defender.hp <= 0) {
        log.push(`🏆 ${attacker.name.toUpperCase()} wins the battle!`);
        break;
      }

      [attacker, defender] = [defender, attacker];
    }

    const winner = p1.hp > 0 ? p1.name : p2.name;

    const battleResult = {
      pokemon1: p1.name,
      pokemon2: p2.name,
      winner,
      log,
      timestamp: new Date().toISOString()
    };

    setResult(battleResult);
    await jsonServer.post('/battles', battleResult);
  };

  return (
    <div style={{ background: 'rgb(204, 238, 255)', minHeight: '100vh', paddingBottom: '2rem' }}>
      {/* Navbar */}
      <div style={{
        backgroundColor: 'white',
        margin: '0 auto',
        marginTop: '2rem',
        marginBottom: '1.5rem',
        borderRadius: '12px',
        padding: '1.2rem 2rem',
        width: '85%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>⚔️ Battle</h2>
        <div style={{ display: 'flex', gap: '1.8rem', fontSize: '1.1rem', fontWeight: '500' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>📘 Pokédex</Link>
          <Link to="/favorites" style={{ textDecoration: 'none', color: '#ff9f1c' }}>⭐ Favorites</Link>
          <Link to="/team" style={{ textDecoration: 'none', color: '#00b894' }}>💪 Team</Link>
        </div>
      </div>

      <div className="battle-container" style={{ width: '85%', margin: '0 auto' }}>
        <h2 className="battle-title" style={{ fontSize: '2rem', marginBottom: '1.2rem' }}>⚔️ Battle Arena</h2>

        <div className="battle-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <select onChange={(e) => setPoke1(e.target.value)} defaultValue="">
            <option value="" disabled>Select Pokémon 1</option>
            {team.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>

          <select onChange={(e) => setPoke2(e.target.value)} defaultValue="">
            <option value="" disabled>Select Pokémon 2</option>
            {team.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>

          <button onClick={startBattle} className="start-btn" style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Start Battle</button>
        </div>

        {(poke1Data || poke2Data) && (
          <div className="battle-display" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '1.5rem'
          }}>
            {poke1Data && (
              <div className="poke-card" style={{ textAlign: 'center' }}>
                <img src={poke1Data.sprites.front_default} alt={poke1} />
                <p style={{ textTransform: 'capitalize' }}>{poke1}</p>
              </div>
            )}
            <span className="vs-text" style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>VS</span>
            {poke2Data && (
              <div className="poke-card" style={{ textAlign: 'center' }}>
                <img src={poke2Data.sprites.front_default} alt={poke2} />
                <p style={{ textTransform: 'capitalize' }}>{poke2}</p>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="battle-result" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>📋 Battle Result</h3>
            <p><strong>{result.pokemon1}</strong> vs <strong>{result.pokemon2}</strong></p>
            <p><strong>Winner:</strong> {result.winner}</p>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>{new Date(result.timestamp).toLocaleString()}</p>
            <div className="battle-log" style={{ marginTop: '1rem' }}>
              <h4>🧾 Battle Log:</h4>
              <ul style={{ paddingLeft: '1.2rem' }}>
                {result.log.map((line, idx) => (
                  <li key={idx} style={{ marginBottom: '0.4rem' }}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattlePage;
