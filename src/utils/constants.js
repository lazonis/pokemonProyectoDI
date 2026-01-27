// constants.js - Archivo de constantes en JavaScript
// En React/proyectos JS, las constantes se definen con 'const' para valores que no cambian.
// Se agrupan en objetos para organizar mejor el código.
// Se exportan con 'export' para usarlas en otros archivos con 'import'.

// Objeto con las fases del juego: REGISTER, SELECTION, BATTLE
// En React, usamos objetos para constantes en lugar de strings sueltos (mejor mantenibilidad)
export const GAME_PHASES = {
    REGISTER: 'REGISTER', // Fase inicial: registro de nombres y avatares de jugadores
    SELECTION: 'SELECTION', // Fase intermedia: selección de equipos de Pokémon
    BATTLE: 'BATTLE' // Fase final: combate entre equipos
};

// Objeto CONFIG con configuración del juego
// En JavaScript, podemos tener getters en objetos para calcular valores dinámicamente
export const CONFIG = {
    MAX_TEAM_SIZE: 6, // Número máximo de Pokémon por equipo
    API_LIMIT: 48, // Límite de resultados por página en la API
    MAX_POKEMON_ID: 649, // ID máximo de Pokémon (hasta Gen 5)

    // Getter: función que se ejecuta cuando se accede a la propiedad
    // Calcula el total de cajas basado en otros valores
    get TOTAL_BOXES() {
        return Math.ceil(this.MAX_POKEMON_ID / this.API_LIMIT);
    }
};

//Al no tener una API de propio, importamos de forma manual los urls de los avatares que queremos
export const TRAINER_SPRITES = [
    // GEN 2 (Johto - HGSS)
    { id: 'ethan', name: 'Ethan', url: 'https://play.pokemonshowdown.com/sprites/trainers/ethan.png' },
    { id: 'lyra', name: 'Lyra', url: 'https://play.pokemonshowdown.com/sprites/trainers/lyra.png' },
    // GEN 3 (Hoenn - ORAS/Emerald)
    { id: 'brendan', name: 'Brendan', url: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png' },
    { id: 'may', name: 'May', url: 'https://play.pokemonshowdown.com/sprites/trainers/may.png' },
    // GEN 4 (Sinnoh - Platinum/DP)
    { id: 'lucas', name: 'Lucas', url: 'https://play.pokemonshowdown.com/sprites/trainers/lucas.png' },
    { id: 'dawn', name: 'Dawn', url: 'https://play.pokemonshowdown.com/sprites/trainers/dawn.png' },
    // GEN 5 (Unova/Teselia - BW)
    { id: 'hilbert', name: 'Hilbert', url: 'https://play.pokemonshowdown.com/sprites/trainers/hilbert.png' },
    { id: 'hilda', name: 'Hilda', url: 'https://play.pokemonshowdown.com/sprites/trainers/hilda.png' },
];