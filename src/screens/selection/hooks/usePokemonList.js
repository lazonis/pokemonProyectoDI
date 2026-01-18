import { useState, useEffect } from 'react';
import { CONFIG } from '../../../utils/constants';


export const usePokemonList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const { API_LIMIT, MAX_POKEMON_ID, TOTAL_BOXES} = CONFIG;

    // --- LÓGICA DE PAGINACIÓN PERSONALIZADA ---
    const getPaginationGroup = () => {
        let pages = [1];
        let rangeStart = Math.max(2, page - 1);
        let rangeEnd = Math.min(TOTAL_BOXES - 1, page + 1);

        if (page < 4) rangeEnd = Math.min(TOTAL_BOXES - 1, 4);
        if (page > TOTAL_BOXES - 3) rangeStart = Math.max(2, TOTAL_BOXES - 3);

        if (rangeStart > 2) pages.push('...');
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }
        if (rangeEnd < TOTAL_BOXES - 1) pages.push('...');
        if (TOTAL_BOXES > 1) pages.push(TOTAL_BOXES);
        return pages;
    };

    // --- CARGA DE DATOS ---
    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const offset = (page - 1) * API_LIMIT;
                const url = `https://pokeapi.co/api/v2/pokemon?limit=${API_LIMIT}&offset=${offset}`;
                const respuesta = await fetch(url);
                const datosLista = await respuesta.json();

                const promesasDetalles = datosLista.results.map(async (poke) => {
                    const partesUrl = poke.url.split('/');
                    const id = parseInt(partesUrl[partesUrl.length - 2]);
                    if (id > MAX_POKEMON_ID) return null;
                    
                    const resDetalle = await fetch(poke.url);
                    const data = await resDetalle.json();
                    
                    return {
                        id: data.id, 
                        name: data.name,
                        // TUS SPRITES PERSONALIZADOS
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${data.id}.png`,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/transparent/${data.id}.png`,
                        sprites: data.sprites, // Mantenemos el objeto original por si acaso
                        types: data.types,
                        stats: data.stats,
                        hp: data.stats[0].base_stat, 
                        maxHp: data.stats[0].base_stat,
                        attack: data.stats[1].base_stat, 
                        defense: data.stats[2].base_stat
                    };
                });
                
                const pokemonsCompletos = await Promise.all(promesasDetalles);
                setPokemons(pokemonsCompletos.filter(p => p !== null));
            } catch (error) { 
                console.error("Error:", error); 
            } finally { 
                setLoading(false); 
            }
        };
        cargarDatos();
    }, [page]);

    return {
        pokemons,
        loading,
        page,
        setPage,
        totalPages: TOTAL_BOXES,
        getPaginationGroup
    };
};