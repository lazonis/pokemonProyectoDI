// src/utils/gameLogic.js

// ==========================================
// 1. TABLA DE TIPOS (TYPE CHART)
// ==========================================
const TYPE_CHART = {
    fire: { strong: ['grass', 'ice', 'bug', 'steel'], weak: ['water', 'fire', 'rock', 'dragon'] },
    water: { strong: ['fire', 'ground', 'rock'], weak: ['water', 'grass', 'dragon'] },
    grass: { strong: ['water', 'ground', 'rock'], weak: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon'] },
    electric: { strong: ['water', 'flying'], weak: ['electric', 'grass', 'dragon', 'ground'] },
    psychic: { strong: ['fighting', 'poison'], weak: ['psychic', 'steel'] },
    ice: { strong: ['grass', 'ground', 'flying', 'dragon'], weak: ['fire', 'water', 'ice', 'steel'] },
    dragon: { strong: ['dragon'], weak: ['steel'] },
    normal: { strong: [], weak: ['rock', 'steel'] },
    fighting: { strong: ['normal', 'ice', 'rock', 'dark', 'steel'], weak: ['poison', 'flying', 'psychic', 'bug'] },
    flying: { strong: ['grass', 'fighting', 'bug'], weak: ['electric', 'rock', 'steel'] },
    poison: { strong: ['grass', 'fairy'], weak: ['poison', 'ground', 'rock', 'ghost'] },
    ground: { strong: ['fire', 'electric', 'poison', 'rock', 'steel'], weak: ['grass', 'bug'] },
    rock: { strong: ['fire', 'ice', 'flying', 'bug'], weak: ['fighting', 'ground', 'steel'] },
    bug: { strong: ['grass', 'psychic', 'dark'], weak: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel'] },
    ghost: { strong: ['psychic', 'ghost'], weak: ['dark'] },
    steel: { strong: ['ice', 'rock', 'fairy'], weak: ['fire', 'water', 'electric', 'steel'] }
};

// ==========================================
// 2. CÁLCULO DE DAÑO
// ==========================================
export const calculateDamage = (attacker, defender, move) => {
    // Si faltan datos, no hacemos daño
    if (!attacker || !defender) return { damage: 0, effectiveness: 'normal' };

    // Obtenemos el tipo del ataque (move.type) y del defensor (types[0])
    const attackType = move.type || 'normal';
    const defenderType = defender.types?.[0]?.type?.name || 'normal';

    // Obtenemos el ataque del Pokémon (o 10 por defecto)
    const attackStat = attacker.attack || 10;

    let multiplier = 1;
    let effectiveness = "normal";

    // Buscamos debilidades/fortalezas en la tabla
    const typeInfo = TYPE_CHART[attackType];

    if (typeInfo) {
        if (typeInfo.strong?.includes(defenderType)) {
            multiplier = 2;
            effectiveness = "super";
        } else if (typeInfo.weak?.includes(defenderType)) {
            multiplier = 0.5;
            effectiveness = "weak";
        }
    }

    // Fórmula simple de daño:
    // (Poder del ataque + un poco del ataque del Pokémon) * multiplicador de tipo
    const basePower = move.power || 40;
    const rawDamage = (basePower + (attackStat / 5)) * multiplier;

    return {
        // Aseguramos que siempre haga al menos 1 de daño
        damage: Math.floor(Math.max(1, rawDamage)),
        effectiveness: effectiveness
    };
};

// Función simple para saber si el Pokémon ha caído
export const checkFainted = (hp) => {
    return hp <= 0;
};

// ==========================================
// 3. OBTENER MOVIMIENTOS ALEATORIOS (API)
// ==========================================
export const fetchRandomMoves = async (allMoves) => {
    // 1. Si el Pokémon no tiene movimientos (raro, pero posible), devolvemos uno por defecto
    if (!allMoves || allMoves.length === 0) {
        return [{ name: 'Combate', type: 'normal', power: 50, accuracy: 100, pp: 35 }];
    }

    // 2. Barajar la lista completa y elegir 4
    // Esto es muy rápido porque solo movemos referencias
    const selectedMoves = allMoves
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    // 3. Descargar los detalles de esos 4 movimientos desde la API
    const promises = selectedMoves.map(async (moveSlot) => {
        try {
            const res = await fetch(moveSlot.move.url);
            const data = await res.json();

            // Intentamos buscar el nombre en español ('es'), si no, usamos el inglés
            const spanishName = data.names.find(n => n.language.name === 'es');

            return {
                name: spanishName ? spanishName.name : data.name,
                type: data.type.name,
                // Si el poder es null (ataque de estado), le ponemos 10 para que haga algo de daño en la demo
                power: data.power || 10,
                accuracy: data.accuracy || 100,
                pp: data.pp
            };
        } catch (error) {
            console.error("Error cargando movimiento:", error);
            return null; // Si falla uno, devolvemos null
        }
    });

    // 4. Esperar a que terminen las 4 descargas y filtrar los errores
    const results = await Promise.all(promises);
    return results.filter(m => m !== null);
};