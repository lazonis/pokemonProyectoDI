import { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import './PokemonList.css';

function PokemonList({ onSelectPokemon }) {
    const [pokemons, setPokemons] = useState([]); 
    const [page, setPage] = useState(1);          
    const [cargando, setCargando] = useState(false); 
    const [criterioOrden, setCriterioOrden] = useState('default'); 

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
                        image: data.sprites.other['official-artwork'].front_default,
                        type: data.types[0].type.name,
                        hp: data.stats[0].base_stat,
                        maxHp: data.stats[0].base_stat,

                        attack: data.stats[1].base_stat,  // ¡El stat de ataque es vital!
                        defense: data.stats[2].base_stat, // Y defensa para cuando te peguen
                        // AQUÍ ESTÁ LA CLAVE: Usamos 'data' para sacar los movimientos
                        moves: data.moves.slice(0, 4).map(m => ({ 
                            name: m.move.name,
                            url: m.move.url
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
        <div className="list-wrapper">
            <h2>Selecciona tu Pokemon</h2>

            <div className="toolbar">
                <span>Ordena por:</span>
                <button className={criterioOrden === 'default' ? 'btn active' : 'btn'} onClick={() => setCriterioOrden('default')}>Original</button>
                <button className={criterioOrden === 'nombre' ? 'btn active' : 'btn'} onClick={() => setCriterioOrden('nombre')}>A-Z</button>
                <button className={criterioOrden === 'tipo' ? 'btn active' : 'btn'} onClick={() => setCriterioOrden('tipo')}>Tipo</button>
            </div>

            {/* --- BLOQUE DE PAGINACIÓN NUEVO --- */}
            <div className="pagination">
                {/* Botón ATRÁS */}
                <button 
                    className="page-btn arrow" 
                    onClick={() => setPage(page - 1)} 
                    disabled={page === 1 || cargando}
                >
                    &lt;
                </button>

                {/* NÚMEROS (Bucle mágico) */}
                {getPaginationGroup().map((item, index) => (
                    <button
                        key={index}
                        // Si es la página actual, le ponemos clase 'active' para pintarlo amarillo
                        className={`page-btn ${page === item ? 'active' : ''} ${item === '...' ? 'dots' : ''}`}
                        onClick={() => handlePageChange(item)}
                        disabled={item === '...' || cargando}
                    >
                        {item}
                    </button>
                ))}

                {/* Botón SIGUIENTE */}
                <button 
                    className="page-btn arrow" 
                    onClick={() => setPage(page + 1)} 
                    disabled={page === totalPages || cargando}
                >
                    &gt;
                </button>
            </div>

            {cargando ? (
                <div className="loading-msg">Buscando Pokemons...</div>
            ) : (
                <div className="grid-layout">
                    {pokemonsVisibles.map((poke) => (
                        <div key={poke.id} onClick={() => onSelectPokemon(poke)}>
                            <PokemonCard
                                name={poke.name}
                                image={poke.image}
                                type={poke.type}
                                hp={poke.hp}
                                maxHp={poke.maxHp}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PokemonList;