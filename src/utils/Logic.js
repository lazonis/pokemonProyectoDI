// src/utils/gameLogic.js

// Clave: Tipo del ATACANTE
// weak: Contra quién es DEBIL (hace la mitad de daño)
// strong: Contra quién es FUERTE (hace el doble de daño)
const typeChart = {
    fire: { weak: 'water', strong: 'grass' },
    water: { weak: 'grass', strong: 'fire' },
    grass: { weak: 'fire', strong: 'water' },
    electric: { weak: 'ground', strong: 'water' },
    ground: { weak: 'grass', strong: 'electric' },
    rock: { weak: 'fighting', strong: 'fire' },
    bug: { weak: 'fire', strong: 'grass' },
    poison: { weak: 'ground', strong: 'grass' },
    fighting: { weak: 'psychic', strong: 'normal' },
    psychic: { weak: 'bug', strong: 'fighting' },
    flying: { weak: 'electric', strong: 'grass' },
    normal: { weak: 'rock', strong: '' } // Normal no es fuerte contra nada
};

export const calculateDamage = (attacker, defender) => {
    // Protección por si falta el stat de ataque
    const attackStat = attacker.attack || 10;
    
    // Asumimos que el tipo del ataque es el mismo que el del Pokémon
    // (Para hacerlo perfecto necesitaríamos el tipo de cada movimiento, pero esto sirve para la demo)
    const attackType = attacker.type;
    const defenderType = defender.type;
    
    let multiplier = 1;
    let effectiveness = "normal";

    // Buscamos en la tabla
    const typeInfo = typeChart[attackType];
    
    if (typeInfo) {
        if (typeInfo.strong === defenderType) {
            multiplier = 2;
            effectiveness = "super"; // Clave corta para identificarlo
        } else if (typeInfo.weak === defenderType) {
            multiplier = 0.5;
            effectiveness = "weak";
        }
    }

    // Fórmula de daño
    const basePower = Math.floor(Math.random() * 20) + 10; 
    const rawDamage = (basePower + (attackStat / 10)) * multiplier;
    
    return {
        damage: Math.floor(rawDamage),
        effectiveness: effectiveness // Devolvemos 'super', 'weak' o 'normal'
    };
};