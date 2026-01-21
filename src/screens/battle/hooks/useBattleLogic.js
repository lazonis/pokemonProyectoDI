import { useState, useEffect } from 'react';
import { calculateDamage, checkFainted, fetchRandomMoves } from '../../../utils/gameLogic';

export const useBattleLogic = (playerTeamProp, rivalTeamProp) => {
    const [loading, setLoading] = useState(true);
    
    const [playerTeam, setPlayerTeam] = useState([]);
    const [rivalTeam, setRivalTeam] = useState([]);

    const [p1ActiveIx, setP1ActiveIx] = useState(0);
    const [p2ActiveIx, setP2ActiveIx] = useState(0);

    // turn puede ser: 'p1', 'p2', 'end', 'p1_forced_switch', 'p2_forced_switch'
    const [turn, setTurn] = useState(null); 
    const [battleLogs, setBattleLogs] = useState([]); 
    const [winner, setWinner] = useState(null);

    const addLog = (msg) => setBattleLogs(prev => [...prev, msg]);

    // --- 1. INICIALIZACIÓN ---
    useEffect(() => {
        const initBattle = async () => {
            if (!playerTeamProp || !rivalTeamProp) return;
            setLoading(true);

            // Helper carga datos
            const loadTeam = async (team) => Promise.all(team.map(async (p) => {
                const realMoves = await fetchRandomMoves(p.rawMoves);
                const speedStat = p.stats.find(s => s.stat.name === 'speed')?.base_stat || 50;
                return {
                    ...p,
                    moves: realMoves,
                    currentHp: p.stats[0].base_stat * 3,
                    maxHp: p.stats[0].base_stat * 3,
                    speed: speedStat
                };
            }));

            const [p1Loaded, p2Loaded] = await Promise.all([
                loadTeam(playerTeamProp),
                loadTeam(rivalTeamProp)
            ]);

            setPlayerTeam(p1Loaded);
            setRivalTeam(p2Loaded);
            setLoading(false);

            // Velocidad inicial
            if (p1Loaded[0].speed >= p2Loaded[0].speed) {
                setTurn('p1');
                addLog(`¡${p1Loaded[0].name} es más rápido!`);
            } else {
                setTurn('p2');
                addLog(`¡${p2Loaded[0].name} es más rápido!`);
            }
        };
        initBattle();
    }, [playerTeamProp, rivalTeamProp]);

    // --- 2. CAMBIO DE POKEMON ---
    const handleSwitch = (playerKey, newIndex) => {
        // Validaciones básicas
        if (winner) return;

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

        // No puedes cambiar al mismo, ni a uno debilitado
        if (newIndex === activeIndex) return;
        if (currentTeam[newIndex].currentHp <= 0) {
            addLog("¡Ese Pokémon está debilitado!");
            return;
        }

        // EJECUTAR EL CAMBIO
        setActiveIndex(newIndex);
        addLog(`${playerName} cambió a ${currentTeam[newIndex].name}.`);

        // LÓGICA DE TURNO TRAS CAMBIO
        // Caso A: Cambio Forzoso (porque murió el anterior)
        if (turn === `${playerKey}_forced_switch`) {
            // Te toca atacar a ti ahora
            setTurn(playerKey); 
        } 
        // Caso B: Cambio Manual (Estratégico)
        else if (turn === playerKey) {
            // Gastas tu turno, le toca al rival
            setTurn(rivalName);
        }
    };

    // --- 3. ATAQUE ---
    const handleAttack = (move, attackerId) => {
        if (loading || winner || turn !== attackerId) return;

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

        // Calcular daño
        const { damage, effectiveness } = calculateDamage(attacker, defender, move);
        const newHp = Math.max(0, defender.currentHp - damage);
        
        // Actualizar equipo defensor
        const newDefenderTeam = [...defenderTeam];
        newDefenderTeam[defenderIx] = { ...defender, currentHp: newHp };
        setDefenderTeam(newDefenderTeam);

        // Logs
        const playerName = attackerId === 'p1' ? 'J1' : 'J2';
        let msg = `${playerName}: ${attacker.name} usó ${move.name}.`;
        if (effectiveness === 'super') msg += " (Eficaz!)";
        if (effectiveness === 'weak') msg += " (Resistido)";
        addLog(msg);

        // --- VERIFICAR DERROTA O CAMBIO ---
        if (newHp === 0) {
            addLog(`¡${defender.name} se debilitó!`);
            
            // ¿Quedan vivos en el equipo defensor?
            const hasLivingMembers = newDefenderTeam.some(p => p.currentHp > 0);

            if (!hasLivingMembers) {
                setWinner(attackerId);
                setTurn('end');
            } else {
                // Forzar cambio al defensor
                const loserId = attackerId === 'p1' ? 'p2' : 'p1';
                setTurn(`${loserId}_forced_switch`);
                addLog(`¡${loserId === 'p1' ? 'J1' : 'J2'}, elige otro Pokémon!`);
            }
        } else {
            // Turno normal
            setTurn(attackerId === 'p1' ? 'p2' : 'p1');
        }
    };

    return {
        loading,
        p1Pokemon: playerTeam[p1ActiveIx],
        p2Pokemon: rivalTeam[p2ActiveIx],
        p1ActiveIx, // Exportamos índices para saber quién está seleccionado visualmente
        p2ActiveIx,
        turn,
        battleLogs,
        winner,
        handleAttack,
        handleSwitch // Exportamos la nueva función
    };
};