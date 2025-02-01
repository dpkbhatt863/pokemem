import React, { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card';
import Scoreboard from './components/Scoreboard';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

 
  const generateRandomIds = (count, max) => {
    const ids = new Set();
    while (ids.size < count) {
      ids.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(ids);
  };

 
  useEffect(() => {
    const randomIds = generateRandomIds(15, 1010); 
    const pokemonDetails = randomIds.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.json())
        .then((details) => ({
          id: details.id,
          name: details.name,
          image: details.sprites.front_default,
        }))
    );

    Promise.all(pokemonDetails)
      .then((results) => {
        setPokemon(results);
      })
      .catch((error) => console.error("Error fetching Pokémon:", error));
  }, []);

  const handleClick = (id) => {
    if (clickedCards.includes(id)) {
     
      setCurrentScore(0);
      setClickedCards([]);
    } else {
      
      setCurrentScore(currentScore + 1);
      setClickedCards([...clickedCards, id]);
      if (currentScore + 1 > bestScore) {
        setBestScore(currentScore + 1);
      }
    }

    setPokemon((prevPokemon) => prevPokemon.sort(() => Math.random() - 0.5));
  };

  return (
    <div className="App">
      <div className="scoreboard-container">
        <Scoreboard currentScore={currentScore} bestScore={bestScore} />
      </div>
      <div className="game-content">
        <h1>Pokémon Memory Game</h1>
        <p className="instructions">
          Get points by clicking on an image, but don't click on any more than once!
        </p>
        <div className="card-container">
          <div className="card-grid">
            {pokemon.slice(0, 10).map((p) => (
              <Card key={p.id} pokemon={p} onClick={() => handleClick(p.id)} />
            ))}
          </div>
          <div className="card-grid">
            {pokemon.slice(10, 15).map((p) => (
              <Card key={p.id} pokemon={p} onClick={() => handleClick(p.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;