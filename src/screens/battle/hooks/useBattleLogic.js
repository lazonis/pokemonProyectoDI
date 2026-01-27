// Importación de hooks de React y utilidades del juego
// En React, se importa solo lo necesario para optimizar el bundle
// Custom hooks pueden importar otros hooks y funciones utilitarias
import { useState, useEffect } from 'react';
import { calculateDamage, checkFainted, fetchRandomMoves } from '../../../utils/gameLogic';

// Custom Hook complejo: maneja toda la lógica de batalla de Pokémon
// En React, los custom hooks encapsulan lógica de negocio compleja
// Este hook demuestra gestión avanzada de estado y efectos secundarios
// Parámetros: equipos de ambos jugadores (props inmutables)
export const useBattleLogic = (playerTeamProp, rivalTeamProp) => {
    // Múltiples useState: demuestra gestión compleja de estado
    // En React, un hook puede tener múltiples piezas de estado relacionadas
    // loading: controla la UI mientras se inicializa la batalla
    const [loading, setLoading] = useState(true);
    
    // Estados para equipos: arrays de Pokémon con stats completos
    // En React, el estado debe ser inmutable - se crean nuevos arrays
    const [playerTeam, setPlayerTeam] = useState([]);
    const [rivalTeam, setRivalTeam] = useState([]);

    // Índices activos: qué Pokémon está luchando actualmente
    // En React, se usa estado para controlar qué elementos mostrar
    const [p1ActiveIx, setP1ActiveIx] = useState(0);
    const [p2ActiveIx, setP2ActiveIx] = useState(0);

    // Estado de turno: controla el flujo del juego
    // En React, strings descriptivos hacen el código más legible
    // turn puede ser: 'p1', 'p2', 'end', 'p1_forced_switch', 'p2_forced_switch'
    const [turn, setTurn] = useState(null); 
    
    // Logs de batalla: array que acumula mensajes del combate
    // En React, arrays de logs son comunes para mostrar historial
    const [battleLogs, setBattleLogs] = useState([]); 
    
    // Ganador: null mientras continúa, 'p1' o 'p2' cuando termina
    // En React, valores null/undefined son útiles para estados "no establecido"
    const [winner, setWinner] = useState(null);

    // Función helper: añade mensajes al log de batalla
    // En React, funciones pequeñas dentro de hooks mantienen el código organizado
    // Spread operator: crea nuevo array sin mutar el anterior (inmutabilidad)
    const addLog = (msg) => setBattleLogs(prev => [...prev, msg]);

    // useEffect para inicialización: carga datos cuando cambian los props
    // En React, useEffect corre después del render y maneja efectos secundarios
    // Dependency array: [playerTeamProp, rivalTeamProp] - solo cuando cambian los equipos
    // Esto evita recargas innecesarias y optimiza rendimiento
    useEffect(() => {
        // Función async interna: permite usar await dentro de useEffect
        // En React, useEffect no puede ser async directamente, por eso la función interna
        const initBattle = async () => {
            // Early return: si no hay equipos, no hacer nada
            // En React, validaciones tempranas evitan errores y optimizan
            if (!playerTeamProp || !rivalTeamProp) return;
            
            // Loading state: indica que la batalla se está preparando
            // En React, el loading state mejora UX durante operaciones async
            setLoading(true);

            // Función helper: carga datos completos para un equipo
            // En React, funciones helper dentro de useEffect mantienen el código modular
            // Promise.all con map: ejecuta operaciones async en paralelo
            // En React, Promise.all optimiza carga de múltiples recursos
            const loadTeam = async (team) => Promise.all(team.map(async (p) => {
                // Llamada a API externa: obtiene movimientos aleatorios
                // En React, las APIs externas se llaman en useEffect
                const realMoves = await fetchRandomMoves(p.rawMoves);
                
                // Optional chaining y nullish coalescing: acceso seguro a datos
                // En React, previene crashes cuando los datos pueden ser undefined
                const speedStat = p.stats.find(s => s.stat.name === 'speed')?.base_stat || 50;
                
                // Spread operator: combina objetos sin mutar el original
                // En React, la inmutabilidad es clave para el estado
                return {
                    ...p,
                    moves: realMoves,
                    // Cálculo de HP: multiplica por 3 para hacer batallas más largas
                    // En React apps, se pueden hacer cálculos en la transformación de datos
                    currentHp: p.stats[0].base_stat * 3,
                    maxHp: p.stats[0].base_stat * 3,
                    speed: speedStat
                };
            }));

            // Promise.all para ambos equipos: carga en paralelo para mejor rendimiento
            // En React, cargar datos de ambos jugadores simultáneamente mejora UX
            const [p1Loaded, p2Loaded] = await Promise.all([
                loadTeam(playerTeamProp),
                loadTeam(rivalTeamProp)
            ]);

            // Actualizar estado: establece los equipos cargados
            // En React, múltiples setState son batch y eficientes
            setPlayerTeam(p1Loaded);
            setRivalTeam(p2Loaded);
            setLoading(false);

            // Lógica de velocidad: determina quién ataca primero
            // En React, cálculos condicionales determinan el estado inicial
            if (p1Loaded[0].speed >= p2Loaded[0].speed) {
                setTurn('p1');
                addLog(`¡${p1Loaded[0].name} es más rápido!`);
            } else {
                setTurn('p2');
                addLog(`¡${p2Loaded[0].name} es más rápido!`);
            }
        };
        
        // Ejecutar la inicialización
        // En React, llamar la función async dentro del useEffect
        initBattle();
    }, [playerTeamProp, rivalTeamProp]); // Dependency array: recarga cuando cambian los equipos

    // Función handleSwitch: maneja cambios de Pokémon durante batalla
    // En React, las funciones en custom hooks se exponen para que las usen los componentes
    // Parámetros: playerKey ('p1' o 'p2'), newIndex (índice del nuevo Pokémon)
    const handleSwitch = (playerKey, newIndex) => {
        // Validación temprana: no permitir cambios si ya hay ganador
        // En React, validaciones previenen actualizaciones de estado innecesarias
        if (winner) return;

        // Variables dinámicas: asigna valores según el jugador
        // En React, este patrón evita código duplicado para lógica similar
        // Destructuring condicional: asigna diferentes variables según playerKey
        let currentTeam, setTeam, activeIndex, setActiveIndex, playerName, rivalName;
        
        if (playerKey === 'p1') {
            currentTeam = playerTeam; setTeam = setPlayerTeam;
            activeIndex = p1ActiveIx; setActiveIndex = setP1ActiveIx;
            playerName = "J1"; rivalName = "p2";
        } else {
            currentTeam = rivalTeam; setTeam = setRivalTeam;
            activeIndex = p2ActiveIx; setActiveIndex = setP2ActiveIx;
            playerName = "J2"; rivalName = "p1";
        }

        // Validaciones de negocio: reglas del juego
        // En React, la lógica de validación mantiene la integridad del estado
        if (newIndex === activeIndex) return; // No cambiar al mismo Pokémon
        if (currentTeam[newIndex].currentHp <= 0) { // No cambiar a Pokémon debilitado
            addLog("¡Ese Pokémon está debilitado!");
            return;
        }

        // Ejecutar el cambio: actualizar estado
        // En React, setState actualiza la UI automáticamente
        setActiveIndex(newIndex);
        addLog(`${playerName} cambió a ${currentTeam[newIndex].name}.`);

        // Lógica de turno compleja: maneja diferentes escenarios de cambio
        // En React, el estado determina el flujo de la aplicación
        // Cambio forzoso (después de derrota)
        if (turn === `${playerKey}_forced_switch`) {
            setTurn(playerKey); // Ahora te toca atacar
        } 
        // Cambio manual (estratégico)
        else if (turn === playerKey) {
            setTurn(rivalName); // Gastas turno, le toca al rival
        }
    };

    // Función handleAttack: ejecuta ataques y maneja consecuencias
    // En React, las funciones complejas se documentan para claridad
    // Esta función demuestra manejo avanzado de estado y lógica condicional
    const handleAttack = (move, attackerId) => {
        // Múltiples validaciones: previene ataques inválidos
        // En React, validaciones exhaustivas mantienen la integridad del estado
        if (loading || winner || turn !== attackerId) return;

        // Variables dinámicas según atacante: patrón similar a handleSwitch
        // En React, este patrón reduce duplicación de código
        let attacker, defender, setDefenderTeam, defenderTeam, defenderIx;

        if (attackerId === 'p1') {
            attacker = playerTeam[p1ActiveIx];
            defender = rivalTeam[p2ActiveIx];
            defenderTeam = rivalTeam;
            setDefenderTeam = setRivalTeam;
            defenderIx = p2ActiveIx;
        } else {
            attacker = rivalTeam[p2ActiveIx];
            defender = playerTeam[p1ActiveIx];
            defenderTeam = playerTeam;
            setDefenderTeam = setPlayerTeam;
            defenderIx = p1ActiveIx;
        }

        // Cálculo de daño: llama a función utilitaria pura
        // En React, funciones puras son predecibles y testeables
        const { damage, effectiveness } = calculateDamage(attacker, defender, move);
        
        // Math.max: asegura que HP nunca sea negativo
        // En React, validaciones matemáticas previenen estados inválidos
        const newHp = Math.max(0, defender.currentHp - damage);
        
        // Actualización inmutable: crea nuevo array sin mutar el original
        // En React, la inmutabilidad es esencial para que el estado funcione correctamente
        // Spread operator: copia el array, luego actualiza el elemento específico
        const newDefenderTeam = [...defenderTeam];
        newDefenderTeam[defenderIx] = { ...defender, currentHp: newHp };
        setDefenderTeam(newDefenderTeam);

        // Logs descriptivos: construye mensajes dinámicos
        // En React, template literals permiten mensajes contextuales
        const playerName = attackerId === 'p1' ? 'J1' : 'J2';
        let msg = `${playerName}: ${attacker.name} usó ${move.name}.`;
        
        // Efectividad condicional: añade información extra según el resultado
        // En React, lógica condicional en strings mejora la UX
        if (effectiveness === 'super') msg += " (Eficaz!)";
        if (effectiveness === 'weak') msg += " (Resistido)";
        addLog(msg);

        // Lógica de derrota: maneja cuando un Pokémon es derrotado
        // En React, efectos secundarios complejos requieren lógica condicional avanzada
        if (newHp === 0) {
            addLog(`¡${defender.name} se debilitó!`);
            
            // Array.some(): verifica si quedan Pokémon vivos
            // En React, métodos funcionales son comunes para validar arrays
            const hasLivingMembers = newDefenderTeam.some(p => p.currentHp > 0);

            if (!hasLivingMembers) {
                // Victoria: establece ganador y termina batalla
                // En React, múltiples setState en secuencia son batch eficientes
                setWinner(attackerId);
                setTurn('end');
            } else {
                // Cambio forzado: el perdedor debe cambiar de Pokémon
                // En React, estados compuestos controlan flujos complejos
                const loserId = attackerId === 'p1' ? 'p2' : 'p1';
                setTurn(`${loserId}_forced_switch`);
                addLog(`¡${loserId === 'p1' ? 'J1' : 'J2'}, elige otro Pokémon!`);
            }
        } else {
            // Turno normal: pasa al siguiente jugador
            // En React, transiciones de estado determinan el flujo de la UI
            setTurn(attackerId === 'p1' ? 'p2' : 'p1');
        }
    };

    // Return object: expone estado y funciones al componente
    // En React, custom hooks retornan objetos con API clara
    // Esto permite destructuring: const { turn, handleAttack } = useBattleLogic(...)
    // Patrón común para mantener componentes limpios y hooks reutilizables
    return {
        loading,                    // Estado de carga durante inicialización
        p1Pokemon: playerTeam[p1ActiveIx],  // Pokémon activo del jugador 1
        p2Pokemon: rivalTeam[p2ActiveIx],   // Pokémon activo del jugador 2
        p1ActiveIx,                 // Índice para resaltar visualmente
        p2ActiveIx,                 // Índice para resaltar visualmente
        turn,                       // Estado del turno actual
        battleLogs,                 // Array de mensajes de batalla
        winner,                     // Ganador o null si continúa
        handleAttack,               // Función para ejecutar ataques
        handleSwitch                // Función para cambiar Pokémon
    };
};