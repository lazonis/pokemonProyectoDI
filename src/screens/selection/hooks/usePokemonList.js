import { useState, useEffect } from 'react';
import { CONFIG } from '../../../utils/constants';

// Custom hook component -> Función de gestión de datos 
// Conexión con la API -> Transformación de los datos a un objeto -> Lógica de paginación

export const usePokemonList = () => {
    //Variable donde guardamos el array que nos da la API
    const [pokemons, setPokemons] = useState([]);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);

    //Constantes globales
    const { API_LIMIT, MAX_POKEMON_ID, TOTAL_BOXES} = CONFIG;

    // --- LÓGICA DE PAGINACIÓN PERSONALIZADA ft Gemini -> Implementar explicación algoritmo ---
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
        //Función asíncrona para hacer el callback
        const cargarDatos = async () => {
            //Todo este proceso requiere tiempo por lo que controlamos mostrar mensaje de Cargando
            setLoading(true);
            try {
                //Cálculo de los pokemons mostrados 
                const offset = (page - 1) * API_LIMIT;

                //URL al que hacemos la llamada
                const url = `https://pokeapi.co/api/v2/pokemon?limit=${API_LIMIT}&offset=${offset}`;

                //CALLBACK para guardar la LISTA de pokimons(LISTA, CONJUNTO DE URLS)
                const respuesta = await fetch(url);
                const datosLista = await respuesta.json();

                //2º CALLBACK -> Recogemos "promesas" de cada apokemon con detalles
                const promesasDetalles = datosLista.results.map(async (poke) => {
                    //Extraemos el id
                    const partesUrl = poke.url.split('/');
                    const id = parseInt(partesUrl[partesUrl.length - 2]);
                    //Si supera el MAX_ID -> devuelve null
                    if (id > MAX_POKEMON_ID) return null;
                    //Respuesta de la llamada que guarda dados concretos de cada pokemon (INDIVIDUAL)
                    const resDetalle = await fetch(poke.url);
                    const data = await resDetalle.json();
                    
                    //Una vez que ya tenemos los datos de cada pokemon completo, 
                    // mapeamos los que nos interesan
                    return {
                        id: data.id, 
                        name: data.name,
                        // urls específicas
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
                
                //Variable donde guardamos todas las peticiones -> await, espera a la carga total
                const pokemonsCompletos = await Promise.all(promesasDetalles);
                setPokemons(pokemonsCompletos.filter(p => p !== null));
            } catch (error) { 
                console.error("Error cargando lista de pokemons:", error); 
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