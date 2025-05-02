import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import jsonServer from '../api';

const PokemonDetails = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [team, setTeam] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDetails();
    fetchTeam();
  }, [name]);

  const fetchDetails = async () => {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    setPokemon(res.data);
  };

  const fetchTeam = async () => {
    const res = await jsonServer.get('/team');
    setTeam(res.data);
  };

  const addToTeam = async () => {
    if (team.find(p => p.name === pokemon.name)) {
      setMessage(`${pokemon.name.toUpperCase()} is already in your team!`);
      return;
    }

    if (team.length >= 6) {
      setMessage('Team is full! Max 6 Pokémon.');
      return;
    }

    await jsonServer.post('/team', {
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites.front_default
    });

    setMessage(`${pokemon.name.toUpperCase()} added to team!`);
    fetchTeam(); // refresh
  };

  if (!pokemon) return <p>Loading...</p>;

  const statIcons = {
    hp: '❤️',
    attack: '⚔️',
    defense: '🛡️',
    'special-attack': '🔥',
    'special-defense': '🧊',
    speed: '⚡',
  };

  return (
    <div className="container">
      <Link to="/" style={{
  display: 'inline-block',
  padding: '0.5rem 1rem',
  marginBottom: '1rem',
  backgroundColor: '#f0f0f0',
  border: '2px solid #ccc',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
  fontWeight: 'bold',
  transition: 'all 0.2s ease'
}}
  onMouseOver={e => e.target.style.backgroundColor = '#e0e0e0'}
  onMouseOut={e => e.target.style.backgroundColor = '#f0f0f0'}
>
  ← Back to List
</Link>

      <div className="detail-card">
        <h2>{pokemon.name.toUpperCase()}</h2>
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          width={200}
        />
        <button onClick={addToTeam} className="btn">Add to Team</button>
        {message && <p className="message">{message}</p>}

        <div className="info-section">
          <h3>Types</h3>
          <div className="badges">
            {pokemon.types.map(t => (
              <span key={t.type.name} className={`badge type-${t.type.name}`}>
                {t.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>Abilities</h3>
          <div className="badges">
            {pokemon.abilities.map(a => (
              <span key={a.ability.name} className="badge type-normal">
                ✨ {a.ability.name}
              </span>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>Stats</h3>
          <div className="badges">
            {pokemon.stats.map(s => (
              <span key={s.stat.name} className="badge type-normal">
                {statIcons[s.stat.name] || '📊'} {s.base_stat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
