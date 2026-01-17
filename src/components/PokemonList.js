import { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import './PokemonList.css';
import PokemonBox from './PokemonBox';
import PokemonDetail from './PokemonDetail';

function PokemonList({ onSelectPokemon, equipoActualP1 }) {
    const [pokemons, setPokemons] = useState([]); 
    const [page, setPage] = useState(1);          
    const [cargando, setCargando] = useState(false); 
    const [pokemonVisto, setPokemonVisto] = useState(null); 

    const LIMIT = 20; // Aumentamos el límite para llenar la caja grande
    const MAX_POKEMON_ID = 649; 
    const totalPages = Math.ceil(MAX_POKEMON_ID / LIMIT); 

    // --- USE EFFECT (IDÉNTICO AL ANTERIOR, NO CAMBIA) ---
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
                        // Usamos el sprite frontal por defecto. El CSS se encargará de que se vea grande.
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

    // --- MANEJADORES ---
    const handleSlotClick = (poke) => setPokemonVisto(poke);
    
    const handleConfirmar = (poke) => {
        setPokemonVisto(null); // Cerramos el modal flotante
        onSelectPokemon(poke); // Enviamos al padre
    };

    // Helper para saber si un pokemon ya está en el equipo (para marcarlo visualmente si quieres)
    const isInTeam = (pokeId) => equipoActualP1.some(p => p.id === pokeId);

    return (
        // NUEVA ESTRUCTURA PRINCIPAL: 3 COLUMNAS
        <div className="team-builder-layout">
            
            {/* --- COLUMNA IZQUIERDA: EQUIPO JUGADOR 1 --- */}
            <div className="sidebar-team player-1-team">
                <h3>EQUIPO P1 ({equipoActualP1.length}/6)</h3>
                <div className="team-slots-container">
                    {/* Mapeamos el equipo actual */}
                    {equipoActualP1.map((poke) => (
                        // Reusamos PokemonSlot pero con un estilo diferente en CSS para el sidebar
                        <div key={'p1-'+poke.id} className="sidebar-slot">
                            <img src={poke.image} alt={poke.name} className="pixel-sprite-small"/>
                            <span>{poke.name}</span>
                        </div>
                    ))}
                    {/* Rellenamos con huecos vacíos hasta llegar a 6 */}
                    {[...Array(6 - equipoActualP1.length)].map((_, i) => (
                         <div key={'empty-'+i} className="sidebar-slot empty">Vacío</div>
                    ))}
                </div>
            </div>


            {/* --- COLUMNA CENTRAL: LA CAJA ROJA ANCHA --- */}
            <div className="main-pc-box-container">
                 <div className="box-header red-style">
                    <button disabled={page===1} onClick={()=>setPage(page-1)}>◀ ANTERIOR</button>
                    <h2>CAJA {page}</h2>
                    <button disabled={page===totalPages} onClick={()=>setPage(page+1)}>SIGUIENTE ▶</button>
                </div>

                {cargando ? (
                    <div className="loading-text">Cargando PC...</div>
                ) : (
                    <div className="pokemon-grid-wide">
                        {pokemons.map((poke) => (
                            <PokemonBox 
                                key={poke.id} 
                                pokemon={poke} 
                                onClick={setPokemonVisto} // Abre el modal flotante
                                isSelected={isInTeam(poke.id)}
                            />
                        ))}
                    </div>
                )}
                <p className="hint-text">Haz click para ver detalles y añadir al equipo</p>
            </div>


            {/* --- COLUMNA DERECHA: EQUIPO JUGADOR 2 (Placeholder por ahora) --- */}
            <div className="sidebar-team player-2-team">
                <h3>EQUIPO CPU</h3>
                 <div className="team-slots-container waiting">
                    <p>Esperando selección...</p>
                    {/* Aquí harías lo mismo que en el P1 cuando implementes el P2 */}
                </div>
            </div>

            {/* MODAL (Se mantiene igual, flota sobre todo) */}
            <PokemonDetail
                pokemon={pokemonVisto}
                onClose={() => setPokemonVisto(null)}
                onConfirm={handleConfirmar}
            />
        </div>
    );
}

export default PokemonList;