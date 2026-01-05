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

    const irPaginaSiguiente = () => { if (page < totalPages) setPage(page + 1); };
    const irPaginaAnterior = () => { if (page > 1) setPage(page - 1); };

    return (
        <div className="list-wrapper">
            <h2>Selecciona tu Pokemon</h2>

            <div className="toolbar">
                <span>Ordena por:</span>
                <button className={criterioOrden === 'default' ? 'btn active' : 'btn'} onClick={() => setCriterioOrden('default')}>Original</button>
                <button className={criterioOrden === 'nombre' ? 'btn active' : 'btn'} onClick={() => setCriterioOrden('nombre')}>A-Z</button>
                <button className={criterioOrden === 'tipo' ? 'btn active' : 'btn'} onClick={() => setCriterioOrden('tipo')}>Tipo</button>
            </div>

            <div className="pagination">
                <button className="btn" onClick={irPaginaAnterior} disabled={page === 1 || cargando}>◀</button>
                <span className="page-number">{page} / {totalPages}</span>
                <button className="btn" onClick={irPaginaSiguiente} disabled={page === totalPages || cargando}>▶</button>
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