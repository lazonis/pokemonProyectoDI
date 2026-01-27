// gameLogic.js - Archivo con funciones utilitarias en JavaScript
// En React, separamos la lógica de negocio en archivos separados para mantener los componentes limpios.
// Estas funciones son 'puras' (no dependen de estado de React) y pueden ser testeadas fácilmente.

// ==========================================
// 1. TABLA DE TIPOS (TYPE CHART)
// ==========================================
// En JavaScript, podemos definir objetos complejos para representar datos estructurados
// Esta tabla simula el sistema de tipos de Pokémon (fuego vence hierba, etc.)
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
// Función pura para calcular daño: recibe parámetros y devuelve resultado sin efectos secundarios
// En React, las funciones puras son ideales para lógica que no cambia estado
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

// Función asíncrona: usa 'async/await' para manejar operaciones que toman tiempo (como llamadas a APIs)
// En React, las funciones async se usan en useEffect o manejadores de eventos
// fetch() es la API nativa de JavaScript para hacer peticiones HTTP
export const fetchRandomMoves = async (allMoves) => {
  // Array.length: propiedad que nos da el tamaño del array
  // En React, es buena práctica verificar arrays antes de usarlos para evitar errores
  // Esto es defensive programming: manejar casos edge (bordes) como arrays vacíos
  if (!allMoves || allMoves.length === 0) {
    // En React, podemos devolver valores por defecto cuando faltan datos
    // Esto mantiene la UI funcional incluso con datos incompletos
    return [{ name: 'Combate', type: 'normal', power: 50, accuracy: 100, pp: 35 }];
  }

  // Array.sort() con función aleatoria: método funcional para barajar arrays
  // Math.random(): función que devuelve un número aleatorio entre 0 y 1
  // En React apps, se usa para crear efectos aleatorios o selecciones aleatorias
  // Array.slice(): crea una copia superficial de una porción del array
  // En React, se usa para evitar mutar el estado original (principio de inmutabilidad)
  const selectedMoves = allMoves
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  // Array.map(): método funcional que transforma cada elemento del array
  // En React, se usa para renderizar listas de componentes (JSX)
  // Promise.all(): ejecuta múltiples promesas en paralelo y espera a que todas terminen
  // En React, se usa en useEffect para cargar múltiples datos simultáneamente
  const promises = selectedMoves.map(async (moveSlot) => {
    try {
      // Template literals: sintaxis ES6 para concatenar strings con variables
      // En React, se usa en JSX para interpolación de valores
      const res = await fetch(moveSlot.move.url);
      
      // response.ok: propiedad booleana que indica si la respuesta HTTP fue exitosa
      // En React, siempre verificar respuestas de API antes de usar los datos
      if (!res.ok) {
        // En caso de error, devolvemos null
        // Esto permite filtrar errores después con filter()
        return null;
      }

      // response.json(): método que parsea la respuesta JSON
      // En React, los datos de APIs suelen venir en formato JSON
      const data = await res.json();

      // Array.find(): método funcional que busca el primer elemento que cumple una condición
      // En React, se usa para encontrar elementos en arrays de datos
      // Optional chaining (?): sintaxis ES6 para acceder a propiedades anidadas sin errores
      // En React, previene crashes cuando los datos de API pueden ser null/undefined
      const spanishName = data.names.find(n => n.language.name === 'es');

      // Spread operator (...): sintaxis ES6 para copiar propiedades de objetos
      // En React, se usa para actualizar estado sin mutar el original
      // Nullish coalescing (??): operador ES6 que devuelve el valor de la derecha si el izquierdo es null/undefined
      // En React, se usa para valores por defecto en datos de API
      return {
        name: spanishName ? spanishName.name : data.name,
        type: data.type.name,
        // Operador lógico OR (||): devuelve el primer valor truthy
        // En React, se usa para valores fallback cuando los datos pueden ser null
        power: data.power || 10,
        accuracy: data.accuracy || 100,
        pp: data.pp
      };
    } catch (error) {
      // try/catch: manejo de errores en JavaScript
      // En React, usar try/catch en operaciones async para evitar crashes
      console.error("Error cargando movimiento:", error);
      
      // En caso de error, devolvemos null
      // Esto mantiene la app funcional incluso con errores de red
      return null;
    }
  });

  // Promise.all() espera a que todas las promesas se resuelvan
  // Array.filter(): método funcional para filtrar elementos de un array
  // En React, se usa para renderizar listas condicionalmente
  // Aquí filtramos los movimientos que se cargaron correctamente (no son null)
  const results = await Promise.all(promises);
  return results.filter(m => m !== null);
};