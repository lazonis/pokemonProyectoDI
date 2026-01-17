import { useState } from 'react';
import './App.css';
import PokemonList from './components/PokemonList';
import PokemonBox from './components/PokemonBox';
import PokemonDetail from './components/PokemonDetail';
// import BattleArena from './components/BattleArena'; // (Para el futuro)

function App() {
  const [fase, setFase] = useState('SELECCION'); // 'SELECCION' o 'BATALLA'
  const [pokemonJugador, setPokemonJugador] = useState(null);

  const manejarSeleccion = (pokemon) => {
    console.log("Pokemon Elegido:", pokemon.name);
    setPokemonJugador(pokemon);
    setFase('BATALLA'); // Cambiamos de fase
  };

  return (
    <div className="App">
      <div className="App-header">
        
        {fase === 'SELECCION' && (
          <>
            <h1>ELIGE TU COMPAÑERO</h1>
            <PokemonList onSelectPokemon={manejarSeleccion} />
          </>
        )}

        {fase === 'BATALLA' && (
          <div className="battle-placeholder">
            {/* Aquí iría tu componente de batalla futuro */}
            <h2>¡A la batalla con {pokemonJugador.name}!</h2>
            <img src={pokemonJugador.image} alt="fighter" style={{imageRendering:'pixelated', width: 150}}/>
            <br/>
            <button onClick={() => setFase('SELECCION')}>Volver a la Caja</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;