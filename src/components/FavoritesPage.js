// src/components/FavoritesPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsonServer from '../api';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [details, setDetails] = useState([]);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const res = await jsonServer.get('/favorites');
    setFavorites(res.data);

    const data = await Promise.all(
      res.data.map(p =>
        axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`).then(res => res.data)
      )
    );

    setDetails(data);
  };

  const handleRemoveConfirm = async (confirmed) => {
    if (confirmed && confirming) {
      const res = await jsonServer.get(`/favorites?name=${confirming.name}`);
      if (res.data.length > 0) {
        await jsonServer.delete(`/favorites/${res.data[0].id}`);
        fetchFavorites();
      }
    }
    setConfirming(null);
  };

  return (
    <div style={{ background: '#rgb(204, 238, 255)', minHeight: '100vh' }}>
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
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>⭐ Favorites</h2>
        <div style={{ display: 'flex', gap: '1.8rem', fontSize: '1.1rem', fontWeight: '500' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>📘 Pokédex</Link>
          <Link to="/battle" style={{ textDecoration: 'none', color: '#007bff' }}>⚔️ Battle</Link>
          <Link to="/team" style={{ textDecoration: 'none', color: '#00b894' }}>💪 Team</Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 2rem' }}>
        <h2 style={{ margin: '1rem 0', fontSize: '2rem' }}>Your Favorite Pokémon</h2>

        {details.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#777' }}>
            You haven’t added any favorites yet.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            {details.map((pokemon) => (
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

      {/* Modal */}
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
              Remove <strong>{confirming.name.toUpperCase()}</strong> from your favorites?
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

export default FavoritesPage;
