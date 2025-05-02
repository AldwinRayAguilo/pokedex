// src/components/PokemonList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsonServer from '../api';

const typeColors = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD'
};

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [confirming, setConfirming] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1025');
      const detailedData = await Promise.all(
        response.data.results.map(async (p) => {
          const res = await axios.get(p.url);
          return res.data;
        })
      );
      setPokemon(detailedData);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleConfirmAdd = async (confirmed) => {
    if (confirmed && confirming) {
      try {
        const res = await jsonServer.get(`/favorites?name=${confirming.name}`);
        if (res.data.length > 0) {
          showToast(`${confirming.name} is already in your favorites.`);
        } else {
          await jsonServer.post('/favorites', { name: confirming.name });
          showToast(`${confirming.name} added to favorites!`);
        }
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
    setConfirming(null);
  };

  const filtered = pokemon.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedTypes.length === 0 || p.types.some(t => selectedTypes.includes(t.type.name)))
  );

  return (
    <div className="container" style={{ padding: '1rem' }}>
      {/* Sticky Navigation Bar */}
      <nav style={navStyle}>
        <div style={navTitleStyle}>📘 Pokédex</div>
        <div style={navLinksStyle}>
          <Link to="/battle" style={linkStyle}>⚔️ Battle</Link>
          <Link to="/team" style={linkStyle}>👥 Team</Link>
          <Link to="/favorites" style={linkStyle}>⭐ Favorites</Link>
        </div>
      </nav>

      {/* Sticky Search Bar */}
      <div style={searchStickyContainerStyle}>
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchStyle}
        />
      </div>

      {/* Type Filter Buttons */}
      <div style={{ margin: '1rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        {Object.entries(typeColors).map(([type, color]) => (
          <button
            key={type}
            onClick={() =>
              setSelectedTypes(prev =>
                prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
              )
            }
            style={{
              backgroundColor: selectedTypes.includes(type) ? color : '#eee',
              color: selectedTypes.includes(type) ? 'white' : '#333',
              border: 'none',
              borderRadius: '999px',
              padding: '0.25rem 0.75rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Pokémon Grid */}
      <div style={gridStyle}>
        {filtered.map((p) => (
          <div
            key={p.id}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <Link to={`/pokemon/${p.name}`} style={{ textAlign: 'center' }}>
              <img src={p.sprites.front_default} alt={p.name} />
              <h4 style={{ marginTop: '0.5rem' }}>
                {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
              </h4>
            </Link>

            <div style={typeWrapperStyle}>
              {p.types.map(t => (
                <span
                  key={t.type.name}
                  style={{
                    backgroundColor: typeColors[t.type.name] || '#ccc',
                    borderRadius: '12px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    color: 'white'
                  }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>

            <button
              onClick={() => setConfirming(p)}
              style={favoriteButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6c200'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffd700'}
            >
              ⭐ Add to Favorites
            </button>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={toastStyle}>{toast}</div>
      )}

      {/* Confirmation Modal */}
      {confirming && (
        <div style={confirmOverlayStyle}>
          <div style={confirmModalStyle}>
            <p>Add <strong style={{ textTransform: 'uppercase' }}>{confirming.name}</strong> to favorites?</p>
            <div style={confirmButtonWrapStyle}>
              <button onClick={() => handleConfirmAdd(true)} style={yesButtonStyle}>Yes</button>
              <button onClick={() => handleConfirmAdd(false)} style={noButtonStyle}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonList;

// --- Styles ---
const navStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  backgroundColor: '#f8f9fa',
  padding: '1rem 2rem',
  borderBottom: '1px solid #ddd',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '0 0 12px 12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  marginBottom: '1rem'
};

const navTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#333',
  flex: '1 0 auto'
};

const navLinksStyle = {
  display: 'flex',
  gap: '1rem',
  flex: '1 0 auto',
  justifyContent: 'flex-end',
  flexWrap: 'wrap'
};

const linkStyle = {
  textDecoration: 'none',
  color: '#007bff',
  fontWeight: 'bold',
  padding: '0.5rem'
};

const searchStickyContainerStyle = {
  position: 'sticky',
  top: '72px',
  zIndex: 999,
  backgroundColor: '#cceeff',
  padding: '0.5rem 0',
  marginBottom: '1rem',
  borderBottom: '1px solid #eee'
};

const searchStyle = {
  width: '100%',
  maxWidth: '400px',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  margin: '0 auto',
  display: 'block'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '1rem'
};

const cardStyle = {
  background: 'white',
  borderRadius: '1rem',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  minHeight: '300px',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'pointer'
};

const typeWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '0.5rem',
  margin: '0.5rem 0',
  minHeight: '1.5rem'
};

const favoriteButtonStyle = {
  marginTop: 'auto',
  backgroundColor: '#ffd700',
  color: '#333',
  fontWeight: 'bold',
  border: 'none',
  padding: '0.5rem',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease'
};

const toastStyle = {
  position: 'fixed',
  bottom: '1rem',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#333',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  zIndex: 10
};

const confirmOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 20
};

const confirmModalStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '1rem',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  minWidth: '280px'
};

const confirmButtonWrapStyle = {
  marginTop: '1rem',
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center'
};

const yesButtonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const noButtonStyle = {
  backgroundColor: '#ccc',
  color: '#333',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer'
};
