// src/components/TeamPage.js
import React, { useEffect, useState } from 'react';
import jsonServer from '../api';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TeamPage = () => {
  const [team, setTeam] = useState([]);
  const [teamDetails, setTeamDetails] = useState([]);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    const res = await jsonServer.get('/team');
    setTeam(res.data);

    const details = await Promise.all(
      res.data.map(p =>
        axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`).then(res => res.data)
      )
    );

    setTeamDetails(details);
  };

  const handleRemoveConfirm = async (confirmed) => {
    if (confirmed && confirming) {
      const member = team.find(p => p.name === confirming.name);
      if (member) {
        await jsonServer.delete(`/team/${member.id}`);
        fetchTeam();
      }
    }
    setConfirming(null);
  };

  return (
    <div style={{ background: '#cceeff', minHeight: '100vh' }}>
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
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>💪 Team</h2>
        <div style={{ display: 'flex', gap: '1.8rem', fontSize: '1.1rem', fontWeight: '500' }}>
          <Link to="/battle" style={{ textDecoration: 'none', color: '#007bff' }}>⚔️ Battle</Link>
          <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>📘 Pokédex</Link>
          <Link to="/favorites" style={{ textDecoration: 'none', color: '#ffcc00' }}>⭐ Favorites</Link>
        </div>
      </div>

      <div style={{ padding: '0 2rem' }}>
        <h2 style={{ margin: '1rem 0', fontSize: '2rem' }}>Your Pokémon Team</h2>

        {teamDetails.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#777' }}>
            You haven’t added any Pokémon to your team yet.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            {teamDetails.map((pokemon) => (
              <div key={pokemon.id} style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: 100 }} />
                <h4 style={{ textTransform: 'capitalize', margin: '0.5rem 0', fontSize: '1.2rem' }}>
                  {pokemon.name}
                </h4>
                <p>❤️ {pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat} HP</p>
                <p>⚔️ {pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat} ATK</p>
                <p>⚡ {pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat} SPD</p>
                <button
                  onClick={() => setConfirming(pokemon)}
                  style={{
                    marginTop: '0.5rem',
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirming && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            textAlign: 'center',
            maxWidth: '90%',
            width: '320px'
          }}>
            <p style={{ fontSize: '1.2rem' }}>
              Remove <strong>{confirming.name.toUpperCase()}</strong> from your team?
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => handleRemoveConfirm(true)}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  marginRight: '1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handleRemoveConfirm(false)}
                style={{
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
