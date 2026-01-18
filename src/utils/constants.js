// src/utils/constants.js

export const GAME_PHASES = {
    REGISTER: 'REGISTER',
    SELECTION: 'SELECTION',
    BATTLE: 'BATTLE'
};

export const CONFIG = {
    MAX_TEAM_SIZE: 6,
    API_LIMIT: 48, // Para paginación
    MAX_POKEMON_ID: 649, // Hasta Gen 5
    get TOTAL_BOXES() {
        return Math.ceil(this.MAX_POKEMON_ID / this.API_LIMIT);
    }
};



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