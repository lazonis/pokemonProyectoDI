import { useEffect, useState } from 'react';
import './PokemonList.css';
import TeamDisplay from './TeamDisplay';

import PokemonDetail from './PokemonDetail'; // [RECUPERADO] Tu ventana flotante original


function PokemonList({ onSelectPokemon, equipoP1, equipoP2 }) {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [cargando, setCargando] = useState(false);

    // Controla qué pokemon se muestra en la ventana flotante
    const [pokemonVisto, setPokemonVisto] = useState(null);

    // [NUEVO] Controla quién está eligiendo actualmente (1 o 2)
    const [jugadorActivo, setJugadorActivo] = useState(1);

    const LIMIT = 48; // Ajustado para grid 4x6
    const MAX_POKEMON_ID = 649;
    const totalPages = Math.ceil(MAX_POKEMON_ID / LIMIT);


const [infoP1] = useState({ name: "Ash Ketchum"});
    const [infoP2] = useState({ name: "Gary Oak"});


    //PAGINACIÓN
    const getPaginationGroup = () => {
        let pages = [1];
        let rangeStart = Math.max(2, page - 1);
        let rangeEnd = Math.min(totalPages - 1, page + 1);

        if (page < 4) rangeEnd = Math.min(totalPages - 1, 4);
        if (page > totalPages - 3) rangeStart = Math.max(2, totalPages - 3);

        if (rangeStart > 2) pages.push('...');
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }
        if (rangeEnd < totalPages - 1) pages.push('...');
        if (totalPages > 1) pages.push(totalPages);
        return pages;
    };

    const handlePageChange = (item) => {
        if (item === '...') return;
        setPage(item);
    };


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
                        //Sprites de los iconos estilo caja pokemon!!
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${data.id}.png`,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/transparent/${data.id}.png`,
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
            <TeamDisplay 
                playerName={infoP1.name}
                trainerSprite={infoP1.sprite}
                team={equipoP1}
                isActive={jugadorActivo === 1}
                onActivate={() => setJugadorActivo(1)}
            />

            {/* --- CAJA CENTRAL (Grid) --- */}
            <div className="main-pc-container">
                
                {/* Cabecera de Paginación "Estilo Caja" */}
                <div className="pc-pagination-header">
                    <button 
                        className="nav-arrow"
                        disabled={page === 1} 
                        onClick={() => setPage(page - 1)}
                    >◀</button>
                    
                    <div className="box-selector">
                        {getPaginationGroup().map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(item)}
                                className={`box-tab ${page === item ? 'active' : ''} ${item === '...' ? 'dots' : ''}`}
                            >
                                {item === '...' ? '...' : `CAJA ${item}`}
                            </button>
                        ))}
                    </div>

                    <button 
                        className="nav-arrow"
                        disabled={page === totalPages} 
                        onClick={() => setPage(page + 1)}
                    >▶</button>
                </div>

                {/* Grid de Pokemons (Compacto) */}
                <div className="pc-grid-compact">
                    {cargando ? <p className="loading">Cargando datos...</p> : pokemons.map((poke) => (
                        <div 
                            key={poke.id}
                            className={`pokemon-slot-compact ${isOwned(poke.id) ? 'selected' : ''}`} 
                            onClick={() => setPokemonVisto(poke)}
                        >
                            <img src={poke.image} alt={poke.name} className="sprite-compact" />
                            <span className="name-compact">{poke.name}</span>
                        </div>
                    ))}
                </div>
                
            </div>

            {/* --- JUGADOR 2 (Click para activar turno) --- */}
            <TeamDisplay 
                playerName={infoP2.name}
                trainerSprite={infoP2.sprite}
                team={equipoP2}
                isActive={jugadorActivo === 2}
                onActivate={() => setJugadorActivo(2)}
            />

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