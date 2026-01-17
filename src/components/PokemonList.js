import { useEffect, useState } from 'react';
import './PokemonList.css';

import PokemonDetail from './PokemonDetail'; // [RECUPERADO] Tu ventana flotante original

function PokemonList({ onSelectPokemon, equipoP1, equipoP2 }) {
    const [pokemons, setPokemons] = useState([]); 
    const [page, setPage] = useState(1);          
    const [cargando, setCargando] = useState(false); 
    
    // Controla qué pokemon se muestra en la ventana flotante
    const [pokemonVisto, setPokemonVisto] = useState(null); 
    
    // [NUEVO] Controla quién está eligiendo actualmente (1 o 2)
    const [jugadorActivo, setJugadorActivo] = useState(1);

    const LIMIT = 24; // Ajustado para grid 4x6
    const MAX_POKEMON_ID = 649; 
    const totalPages = Math.ceil(MAX_POKEMON_ID / LIMIT); 

    // --- Carga de datos (Igual que tu código original) ---
    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true); 
            try {
                const offset = (page - 1) * LIMIT;
                const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`;
                const respuesta = await fetch(url);
                const datosLista = await respuesta.json();

                const promesasDetalles = datosLista.results.map(async (poke) => {
                    const partesUrl = poke.url.split('/');
                    const id = parseInt(partesUrl[partesUrl.length - 2]);
                    if (id > MAX_POKEMON_ID) return null;
                    const resDetalle = await fetch(poke.url);
                    const data = await resDetalle.json();
                    return {
                        id: data.id, name: data.name,
                        image: data.sprites.front_default, 
                        type: data.types[0].type.name, hp: data.stats[0].base_stat, maxHp: data.stats[0].base_stat,
                        attack: data.stats[1].base_stat, defense: data.stats[2].base_stat
                    };
                });
                const pokemonsCompletos = await Promise.all(promesasDetalles);
                setPokemons(pokemonsCompletos.filter(p => p !== null)); 
            } catch (error) { console.error("Error:", error); } finally { setCargando(false); }
        };
        cargarDatos();
    }, [page]); 

    // Al confirmar en el modal, se agrega al jugador activo
    const handleConfirmar = (poke) => {
        setPokemonVisto(null); // Cerrar modal
        onSelectPokemon(poke, jugadorActivo); // Guardar en App.js
    };

    // Helper para saber si el pokemon ya lo tiene el jugador actual (para marcarlo visualmente)
    const equipoActual = jugadorActivo === 1 ? equipoP1 : equipoP2;
    const isOwned = (pokeId) => equipoActual.some(p => p.id === pokeId);

    return (
        <div className="team-builder-layout">
            
            {/* --- JUGADOR 1 (Click para activar turno) --- */}
            <div 
                className={`sidebar-team player-1 ${jugadorActivo === 1 ? 'active-turn' : ''}`}
                onClick={() => setJugadorActivo(1)}
            >
                <h3>JUGADOR 1 {jugadorActivo === 1 && '🔴'}</h3>
                <div className="team-slots-container">
                    {equipoP1.map((poke) => (
                        <div key={'p1-'+poke.id} className="sidebar-slot filled">
                            <img src={poke.image} alt={poke.name}/>
                            <span>{poke.name}</span>
                        </div>
                    ))}
                    {[...Array(6 - equipoP1.length)].map((_, i) => (
                         <div key={'e1-'+i} className="sidebar-slot empty">Vacío</div>
                    ))}
                </div>
            </div>

            {/* --- CAJA CENTRAL (Grid) --- */}
           <div className="pc-grid">
    {cargando ? <p className="loading">Cargando...</p> : pokemons.map((poke) => (
        
        /* CÓDIGO INTEGRADO (Ya no usamos PokemonBox) */
        <div 
            key={poke.id}
            className={`pokemon-slot-card ${isOwned(poke.id) ? 'selected' : ''}`} 
            onClick={() => setPokemonVisto(poke)}
        >
            <div className="sprite-container">
                    <img 
                    src={poke.image} 
                    alt={poke.name} 
                    className="pixel-sprite-large" 
                />
            </div>
            <span className="pokemon-name-label">{poke.name}</span>
        </div>
        /* FIN DEL CAMBIO */

    ))}
</div>

            {/* --- JUGADOR 2 (Click para activar turno) --- */}
            <div 
                className={`sidebar-team player-2 ${jugadorActivo === 2 ? 'active-turn' : ''}`}
                onClick={() => setJugadorActivo(2)}
            >
                <h3>JUGADOR 2 {jugadorActivo === 2 && '🔴'}</h3>
                 <div className="team-slots-container">
                    {equipoP2.map((poke) => (
                        <div key={'p2-'+poke.id} className="sidebar-slot filled">
                            <img src={poke.image} alt={poke.name}/>
                            <span>{poke.name}</span>
                        </div>
                    ))}
                    {[...Array(6 - equipoP2.length)].map((_, i) => (
                         <div key={'e2-'+i} className="sidebar-slot empty">Vacío</div>
                    ))}
                </div>
            </div>

            {/* --- TU VENTANA FLOTANTE ORIGINAL --- */}
            {/* Solo nos aseguramos de que el CSS del detalle tenga contraste */}
            <PokemonDetail
                pokemon={pokemonVisto}
                onClose={() => setPokemonVisto(null)}
                onConfirm={handleConfirmar}
            />
        </div>
    );
}

export default PokemonList;