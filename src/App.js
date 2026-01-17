import { useState } from 'react';
import './App.css';
import PokemonList from './components/PokemonList';

function App() {
  const [fase, setFase] = useState('SELECCION'); // 'SELECCION' o 'BATALLA'
  const [equipoP1, setEquipoP1] = useState([]);  
  const [equipoP2, setEquipoP2] = useState([]);  // [NUEVO] Estado Jugador 2

  // Función unificada para agregar (recibe el pokemon y el ID del jugador)
  const agregarAlEquipo = (pokemon, jugadorId) => {
    const equipoActual = jugadorId === 1 ? equipoP1 : equipoP2;
    const setEquipo = jugadorId === 1 ? setEquipoP1 : setEquipoP2;

    // 1. Validar duplicados (en el equipo de ese jugador)
    if (equipoActual.some(p => p.id === pokemon.id)) {
        alert(`¡El Jugador ${jugadorId} ya tiene a este Pokémon!`);
        return;
    }
    // 2. Validar tamaño máximo
    if (equipoActual.length >= 6) {
        alert(`¡Equipo del Jugador ${jugadorId} lleno! (Máximo 6)`);
        return;
    }

    setEquipo([...equipoActual, pokemon]);
  };

  return (
    <div className="App">
        {fase === 'SELECCION' && (
            <div className="selection-screen">
                <h1 style={{textAlign: 'center', color: 'white', margin: '20px 0', textShadow: '2px 2px 4px #000'}}>
                    ORGANIZADOR DE PC POKÉMON
                </h1>
                
                {/* Pasamos ambos equipos y la función de selección */}
                <PokemonList 
                    onSelectPokemon={agregarAlEquipo} 
                    equipoP1={equipoP1}
                    equipoP2={equipoP2}
                />
                
                <div style={{textAlign: 'center', margin: '20px'}}>
                    <button 
                        // Solo habilitar si ambos tienen al menos 1 pokemon
                        disabled={equipoP1.length === 0 || equipoP2.length === 0}
                        onClick={() => setFase('BATALLA')}
                        className="btn-battle-start"
                        style={{
                            padding: '15px 40px', 
                            fontSize: '1.2rem', 
                            cursor: 'pointer',
                            backgroundColor: (equipoP1.length > 0 && equipoP2.length > 0) ? '#ff3333' : '#555',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}
                    >
                        IR A LA BATALLA
                    </button>
                    { (equipoP1.length === 0 || equipoP2.length === 0) &&
                        <p style={{color: '#ff6b6b', marginTop: '10px'}}>
                            * Ambos jugadores necesitan al menos 1 Pokémon
                        </p>
                    }
                </div>
            </div>
        )}

        {fase === 'BATALLA' && (
            <div className="battle-screen" style={{color: 'white', textAlign: 'center', padding: '20px'}}>
                <h2>¡BATALLA POKÉMON!</h2>
                <div style={{display: 'flex', gap: '50px', justifyContent: 'center', marginTop: '40px'}}>
                    <div>
                        <h3>JUGADOR 1</h3>
                        <div style={{display:'flex', gap:'5px'}}>
                           {equipoP1.map(p => <img key={p.id} src={p.image} alt={p.name} width="50"/>)}
                        </div>
                    </div>
                    <div>
                        <h3>JUGADOR 2</h3>
                         <div style={{display:'flex', gap:'5px'}}>
                           {equipoP2.map(p => <img key={p.id} src={p.image} alt={p.name} width="50"/>)}
                        </div>
                    </div>
                </div>
                <br/>
                <button onClick={() => setFase('SELECCION')} style={{padding:'10px 20px', cursor:'pointer'}}>
                    Volver al PC
                </button>
            </div>
        )}
    </div>
  );
}

export default App;