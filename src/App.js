import { useState } from 'react';
import PokemonList from './components/PokemonList'
import Battle from './utils/Battle'; // IMPORTANTE
import './App.css';
import { useRef } from 'react';

function App() {
    const [gameState, setGameState] = useState('select');
    const [myPokemon, setMyPokemon] = useState(null);
    const [enemyPokemon, setEnemyPokemon] = useState(null);

    // --- NUEVO: ESTADO DE VOLUMEN (0.0 a 1.0) ---
    const [volume, setVolume] = useState(0.1); // Empezamos bajito (10%)
    const audioRef = useRef(null);

    // Función para detener y rebobinar la música
    const stopMusic = () => {
        if (audioRef.current) {
            audioRef.current.pause(); // Pausa la canción
            audioRef.current.currentTime = 0; // La devuelve al segundo 0:00
        }
    };

    // --- FUNCIÓN PARA CAMBIAR VOLUMEN ---
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const startGame = async (pokemonSeleccionado) => {
        setMyPokemon(pokemonSeleccionado);

        if (audioRef.current) {
            try {
                audioRef.current.volume = volume;
                await audioRef.current.play();
            } catch (error) {
                console.log("El navegador bloqueó el autoplay:", error);
            }
        }

        // Generación del enemigo (Igual que antes)
        const randomId = Math.floor(Math.random() * 151) + 1;
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await res.json();

            const enemyMoves = data.moves.slice(0, 4).map(m => ({
                name: m.move.name,
                url: m.move.url
            }));

            const enemyObj = {
                id: data.id,
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                image: data.sprites.other['official-artwork'].front_default,
                type: data.types[0].type.name,
                hp: data.stats[0].base_stat,
                maxHp: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                moves: enemyMoves
            };

            setEnemyPokemon(enemyObj);
            setGameState('battle');

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="App">

            <audio ref={audioRef} src="/music.mp3" loop />

            {/* --- NUEVO: CONTROL DE VOLUMEN FLOTANTE --- */}
            <div className="volume-control">
                <span style={{ fontSize: '20px' }}>
                    {volume === 0 ? '🔇' : '🔊'}
                </span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>


            <h1>Batalla Pokémon</h1>

            {gameState === 'select' && (
                <PokemonList onSelectPokemon={startGame} />
            )}

            {/* AHORA APP.JS SOLO LLAMA A BATTLESCREEN */}
            {gameState === 'battle' && myPokemon && enemyPokemon && (
                <Battle
                    player={myPokemon}
                    enemy={enemyPokemon}
                    onBack={() => {
                        stopMusic();          // 1. Paramos la música
                        setGameState('select'); // 2. Volvemos al menú} // Función para volver
                    }}
                        
                    />
            )}
        </div>
    );
}

export default App;