import { useState } from 'react';
import './App.css';
import PokemonList from './components/PokemonList';

// import BattleArena from './components/BattleArena'; // (Para el futuro)

function App() {
  const [fase, setFase] = useState('SELECCION'); // 'SELECCION' o 'BATALLA'
  const [equipoP1, setEquipoP1] = useState([]);  // ARRAY DEL EQUIPO

  const agregarAlEquipo = (pokemon) => {
    // 1. Validar duplicados
    if (equipoP1.some(p => p.id === pokemon.id)) {
        alert("¡Ya tienes a este Pokémon!");
        return;
    }
    // 2. Validar tamaño máximo
    if (equipoP1.length >= 6) {
        alert("¡Equipo lleno! (Máximo 6)");
        return;
    }

    setEquipoP1([...equipoP1, pokemon]);
  };

  return (
    <div className="App">
        {fase === 'SELECCION' && (
            <div className="selection-screen">
                <h1 style={{textAlign: 'center', color: '#333'}}>ORGANIZADOR DE PC POKÉMON</h1>
                <PokemonList 
                    onSelectPokemon={agregarAlEquipo} 
                    equipoActualP1={equipoP1}
                />
                
                {/* Botón para ir a batalla si tienes al menos 1 pokemon */}
                <div style={{textAlign: 'center', margin: '10px'}}>
                    <button 
                        disabled={equipoP1.length === 0}
                        onClick={() => setFase('BATALLA')}
                        style={{padding: '10px 30px', fontSize: '1.2rem', cursor: 'pointer'}}
                    >
                        IR A LA BATALLA ({equipoP1.length}/6)
                    </button>
                </div>
            </div>
        )}

        {fase === 'BATALLA' && (
            <div className="battle-screen">
                <h2>¡BATALLA POKÉMON!</h2>
                <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
                    {equipoP1.map(p => (
                        <img key={p.id} src={p.image} alt={p.name} style={{width: 100, imageRendering: 'pixelated'}} />
                    ))}
                </div>
                <br/>
                <button onClick={() => setFase('SELECCION')}>Volver al PC</button>
            </div>
        )}
    </div>
  );
}

export default App;