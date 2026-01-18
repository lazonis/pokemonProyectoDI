import { useState, useEffect } from 'react';
import { CONFIG } from '../../../utils/constants';

export const usePokemonList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const { API_LIMIT, MAX_POKEMON_ID, TOTAL_BOXES } = CONFIG;

    // --- LÓGICA DE PAGINACIÓN ACTUALIZADA ---
const getPaginationGroup = () => {
        const total = TOTAL_BOXES;
        const current = page;
        const delta = 2; // Cuántos mostrar a izquierda y derecha
        const range = [];
        
        // Rango de vecinos: Evitamos el 1 y el total para no duplicarlos
        // Ejemplo: Si estoy en la 5, quiero del 3 al 7.
        // Math.max(2, ...) asegura que no bajemos del 1.
        // Math.min(total - 1, ...) asegura que no subamos del total.
        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        // 1. SIEMPRE añadimos la Caja 1
        range.push(1);

        // 2. Puntos suspensivos IZQUIERDA
        // Si entre el 1 y mi rango izquierdo hay hueco (ej: 1 ... 4)
        if (left > 2) {
            range.push('...');
        }

        // 3. Añadimos el rango central (Vecinos + Actual)
        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        // 4. Puntos suspensivos DERECHA
        // Si entre mi rango derecho y el final hay hueco (ej: 8 ... 14)
        if (right < total - 1) {
            range.push('...');
        }

        // 5. SIEMPRE añadimos la Última Caja (si hay más de una)
        if (total > 1) {
            range.push(total);
        }

        return range;
    };

    // --- CARGA DE DATOS (Igual que antes) ---
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
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${data.id}.png`,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/transparent/${data.id}.png`,
                        sprites: data.sprites,
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
    }, [page, API_LIMIT, MAX_POKEMON_ID]);

    return {
        pokemons, loading, page, setPage, totalPages: TOTAL_BOXES, getPaginationGroup
    };
};