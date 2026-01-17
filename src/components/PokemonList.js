import { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import './PokemonList.css';
import PokemonBox from './PokemonBox';
import PokemonDetail from './PokemonDetail';

function PokemonList({ onSelectPokemon }) {
    //ESTADOS
    const [pokemons, setPokemons] = useState([]); 
    const [page, setPage] = useState(1);          
    const [cargando, setCargando] = useState(false); 
    const [criterioOrden, setCriterioOrden] = useState('default'); 

    //ESTADO POKEMON CLICKADO
    const [pokemonVisto, setPokemonVisto] = useState(null);

    const LIMIT = 20; 
    const MAX_POKEMON_ID = 649; 
    const totalPages = Math.ceil(MAX_POKEMON_ID / LIMIT); 

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
                    const data = await resDetalle.json(); // Variable data

                    return {
                        id: data.id,
                        name: data.name,
                        image: data.sprites.front_default,
                        type: data.types[0].type.name,
                        hp: data.stats[0].base_stat,
                        maxHp: data.stats[0].base_stat,
                        attack: data.stats[1].base_stat,
                        defense: data.stats[2].base_stat,
                        moves: data.moves.slice(0, 4).map(m => ({ 
                            name: m.move.name, url: m.move.url
                        }))
                    };
                });

                const pokemonsCompletos = await Promise.all(promesasDetalles);
                const pokemonsValidos = pokemonsCompletos.filter(p => p !== null);

                setPokemons(pokemonsValidos); 

                setCriterioOrden('default');  

            } catch (error) {
                console.error("Algo salió mal cargando los pokemons:", error);
            } finally {
                setCargando(false); 
            }
        };

        cargarDatos();
    }, [page]); 

    // Lógica de ordenación
    const getPokemonsParaMostrar = () => {
        const copia = [...pokemons];
        if (criterioOrden === 'nombre') return copia.sort((a, b) => a.name.localeCompare(b.name));
        if (criterioOrden === 'tipo') return copia.sort((a, b) => a.type.localeCompare(b.type));
        return copia; 
    };

    const pokemonsVisibles = getPokemonsParaMostrar();

    //HANDLERS
    // Cuando hacen click en un slot de la caja
    const handleSlotClick = (poke) => {
        setPokemonVisto(poke); 
    };

    const handleConfirmar = (poke) => {
        setPokemonVisto(null); // Cerramos modal
        onSelectPokemon(poke); // Avisamos al padre (App.js)
    };



    // --- NUEVO: CALCULA QUÉ NÚMEROS MOSTRAR ---
    const getPaginationGroup = () => {
        // Siempre mostramos la 1
        let pages = [1];

        // Calculamos el rango alrededor de la página actual (ej: si estás en la 5, mostramos 4, 5, 6)
        let rangeStart = Math.max(2, page - 1);
        let rangeEnd = Math.min(totalPages - 1, page + 1);

        // Ajustes visuales para que siempre se vea bonito al principio o final
        if (page < 4) rangeEnd = Math.min(totalPages - 1, 4);
        if (page > totalPages - 3) rangeStart = Math.max(2, totalPages - 3);

        // Añadimos puntos suspensivos si hay hueco
        if (rangeStart > 2) pages.push('...');

        // Añadimos los números centrales
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        // Añadimos puntos suspensivos finales
        if (rangeEnd < totalPages - 1) pages.push('...');

        // Siempre mostramos la última
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    // --- NUEVO: CAMBIAR DE PÁGINA ---
    const handlePageChange = (item) => {
        if (item === '...') return; // Si clicas en los puntos, no pasa nada
        setPage(item);
    };

    return (
        <div className="pc-container-wrapper">
            <div className="pc-box">
                {/* CABECERA DE LA CAJA */}
                <div className="box-header">
                    <h2>CAJA {page}</h2>
                    <div className="pagination-controls">
                        <button disabled={page===1} onClick={()=>setPage(page-1)}>◀</button>
                        <span>{page}/{totalPages}</span>
                        <button disabled={page===totalPages} onClick={()=>setPage(page+1)}>▶</button>
                    </div>
                </div>

                {/* GRID (LA CAJA EN SÍ) */}
                {cargando ? (
                    <div className="loading-text">Cargando datos del PC...</div>
                ) : (
                    <div className="pokemon-grid">
                        {pokemonsVisibles.map((poke) => (
                            <PokemonBox
                                key={poke.id} 
                                pokemon={poke} 
                                onClick={handleSlotClick} 
                            />
                        ))}
                    </div>
                )}
            </div>
            
            <p className="hint-text">Elige un Pokémon para ver sus datos</p>

            {/* MODAL DE DETALLES */}
            <PokemonDetail 
                pokemon={pokemonVisto}
                onClose={() => setPokemonVisto(null)}
                onConfirm={handleConfirmar}
            />
        </div>
    );
}

export default PokemonList;