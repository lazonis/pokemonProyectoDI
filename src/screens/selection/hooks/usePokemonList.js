// Importación nombrada de hooks específicos de React
// En React, useState y useEffect son los hooks más fundamentales
// useState: maneja estado local en componentes funcionales
// useEffect: maneja efectos secundarios (API calls, suscripciones, etc.)
import { useState, useEffect } from 'react';

// Importación de constantes de configuración
// En React apps, se centralizan configuraciones para fácil mantenimiento
import { CONFIG } from '../../../utils/constants';

// Custom Hook: función que encapsula lógica reutilizable usando hooks de React
// En React, los custom hooks permiten compartir lógica entre componentes
// Convención: nombres empiezan con "use" para que React los reconozca como hooks
// Este hook maneja la lógica de cargar y paginar una lista de Pokémon
export const usePokemonList = () => {
    // useState: hook para estado local - retorna [valor, función para actualizar]
    // En React, useState es inmutable - no se modifica directamente el estado
    // pokemons: array que almacena la lista de Pokémon cargados
    const [pokemons, setPokemons] = useState([]);
    
    // page: número de página actual para paginación
    const [page, setPage] = useState(1);
    
    // loading: boolean que indica si se están cargando datos
    // En React, se usa para mostrar spinners o deshabilitar botones durante loading
    const [loading, setLoading] = useState(false);

    // Destructuring de constantes: extrae valores del objeto CONFIG
    // En React, se usa para acceder a configuración global de forma limpia
    const { API_LIMIT, MAX_POKEMON_ID, TOTAL_BOXES } = CONFIG;

    // Función pura que calcula los números de página para la paginación
    // En React, las funciones puras son predecibles y fáciles de testear
    // Este algoritmo crea el patrón: 1 ... 4 5 6 ... 14
    const getPaginationGroup = () => {
        // Variables locales: calculan el rango visible de páginas
        const total = TOTAL_BOXES;
        const current = page;
        const delta = 1; // Cuántas páginas mostrar a cada lado de la actual
        const range = [];
        
        // Math.max/min: funciones matemáticas para límites
        // En React, se usan para validaciones y cálculos
        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);
        
        // Array.push(): método para añadir elementos a un array
        // En React, se usa para construir arrays de forma imperativa
        range.push(1); // Siempre incluir la primera página
        
        // Lógica condicional para puntos suspensivos
        if (left > 2) {
            range.push('...'); // Puntos suspensivos si hay gap
        }
        
        // Bucle for: itera para añadir páginas del rango central
        // En React, se usan bucles para lógica compleja antes del return
        for (let i = left; i <= right; i++) {
            range.push(i);
        }
        
        // Más lógica condicional para el lado derecho
        if (right < total - 1) {
            range.push('...');
        }
        
        // Incluir la última página si hay más de una
        if (total > 1) {
            range.push(total);
        }
        return range;
    };

    // useEffect: hook para efectos secundarios
    // En React, useEffect corre después del render y puede ser async
    // Dependency array [page, API_LIMIT, MAX_POKEMON_ID]: efecto corre cuando cambian
    // Esto es optimización - evita llamadas API innecesarias
    useEffect(() => {
        // Función async interna: encapsula la lógica de carga de datos
        // En React, las funciones en useEffect pueden ser async
        const cargarDatos = async () => {
            // Actualizar estado de loading: inicia el indicador de carga
            setLoading(true);
            
            try {
                // Cálculo de offset para paginación: (página - 1) * límite
                // En React apps, este patrón es común para APIs paginadas
                const offset = (page - 1) * API_LIMIT;
                
                // Template literals: interpolación de variables en strings
                // En React, se usa para construir URLs dinámicas
                const url = `https://pokeapi.co/api/v2/pokemon?limit=${API_LIMIT}&offset=${offset}`;
                
                // fetch(): API nativa para peticiones HTTP
                // En React, se usa en useEffect para cargar datos externos
                const respuesta = await fetch(url);
                const datosLista = await respuesta.json();

                // Array.map(): transforma cada elemento del array
                // En React, se usa para crear arrays de promesas (Promise.all)
                // Aquí se crean promesas para cargar detalles de cada Pokémon
                const promesasDetalles = datosLista.results.map(async (poke) => {
                    // String.split(): divide la URL para extraer el ID
                    // En React, se usa para parsear datos de APIs
                    const partesUrl = poke.url.split('/');
                    const id = parseInt(partesUrl[partesUrl.length - 2]);
                    
                    // Filtro: solo incluir Pokémon hasta el ID máximo configurado
                    // En React, se usa para limitar datos según requerimientos
                    if (id > MAX_POKEMON_ID) return null;
                    
                    // Segunda llamada API: obtener detalles completos del Pokémon
                    // En React, es común hacer múltiples llamadas API en secuencia
                    const resDetalle = await fetch(poke.url);
                    const data = await resDetalle.json();
                    
                    // Object literal: crear objeto con datos transformados
                    // En React, se usa para normalizar datos de API al formato de la app
                    return {
                        id: data.id, 
                        name: data.name,
                        // Template literals para URLs de imágenes
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${data.id}.png`,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${data.id}.png`,
                        sprites: data.sprites,
                        types: data.types,
                        stats: data.stats,
                        rawMoves: data.moves,
                        // Acceso a array por índice: data.stats[0] es HP
                        hp: data.stats[0].base_stat, 
                        maxHp: data.stats[0].base_stat,
                        attack: data.stats[1].base_stat, 
                        defense: data.stats[2].base_stat
                    };
                });
                
                // Promise.all(): ejecuta todas las promesas en paralelo
                // En React, optimiza el rendimiento al cargar múltiples recursos
                const pokemonsCompletos = await Promise.all(promesasDetalles);
                
                // Array.filter(): remueve elementos null del array
                // En React, se usa para limpiar datos antes de actualizar el estado
                // setPokemons: actualiza el estado con los datos cargados
                setPokemons(pokemonsCompletos.filter(p => p !== null));
            } catch (error) { 
                // try/catch: manejo de errores en operaciones async
                // En React, siempre manejar errores para evitar crashes
                console.error("Error:", error); 
            } finally { 
                // finally: siempre ejecuta, haya error o no
                // En React, se usa para limpiar estado de loading
                setLoading(false); 
            }
        };
        
        // Ejecutar la función de carga
        // En React, useEffect no puede ser async directamente, por eso la función interna
        cargarDatos();
    }, [page, API_LIMIT, MAX_POKEMON_ID]); // Dependency array: cuando cambian estos valores, se recarga

    // Return object: custom hooks retornan un objeto con estado y funciones
    // En React, esto permite destructuring: const { pokemons, loading } = usePokemonList()
    // Patrón común en custom hooks para exponer API limpia
    return {
        pokemons,           // Array de Pokémon cargados
        loading,            // Boolean indicando si está cargando
        page,              // Página actual
        setPage,           // Función para cambiar página
        totalPages: TOTAL_BOXES,  // Total de páginas disponibles
        getPaginationGroup // Función para calcular paginación
    };
};