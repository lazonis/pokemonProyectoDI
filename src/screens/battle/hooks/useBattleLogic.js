import { useState, useEffect } from 'react';
import { calculateDamage, checkFainted, fetchRandomMoves } from '../../../utils/gameLogic';

export const useBattleLogic = (playerTeamProp, rivalTeamProp) => {
    const [loading, setLoading] = useState(true);
    
    const [playerTeam, setPlayerTeam] = useState([]); // Equipo J1
    const [rivalTeam, setRivalTeam] = useState([]);   // Equipo J2

    const [p1ActiveIx, setP1ActiveIx] = useState(0);
    const [p2ActiveIx, setP2ActiveIx] = useState(0);

    const [turn, setTurn] = useState(null); // 'p1' | 'p2' | 'end'
    const [battleLogs, setBattleLogs] = useState([]); 
    const [winner, setWinner] = useState(null);

    const addLog = (msg) => setBattleLogs(prev => [...prev, msg]);

    // --- 1. INICIALIZACIÓN Y VELOCIDAD ---
    useEffect(() => {
        const initBattle = async () => {
            if (!playerTeamProp || !rivalTeamProp) return;
            setLoading(true);

            // Helper para cargar datos
            const loadTeam = async (team) => Promise.all(team.map(async (p) => {
                const realMoves = await fetchRandomMoves(p.rawMoves);
                
                // Encontramos la stat de velocidad (speed)
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

            // --- LÓGICA DE VELOCIDAD ---
            const p1Speed = p1Loaded[0].speed;
            const p2Speed = p2Loaded[0].speed;

            if (p1Speed >= p2Speed) {
                setTurn('p1');
                addLog(`¡${p1Loaded[0].name} es más rápido! Turno del J1.`);
            } else {
                setTurn('p2');
                addLog(`¡${p2Loaded[0].name} es más rápido! Turno del J2.`);
            }
        };

        initBattle();
    }, [playerTeamProp, rivalTeamProp]);

    // --- 2. MANEJO DE ATAQUE (Genérico) ---
    // attackerId: 'p1' o 'p2'
    const handleAttack = (move, attackerId) => {
        if (loading || winner || turn !== attackerId) return;

        let attacker, defender, setDefenderTeam, defenderTeam, defenderIx;

        // Configurar quién pega a quién
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

        // Cálculos
        const { damage, effectiveness } = calculateDamage(attacker, defender, move);

        // Aplicar Daño
        const newDefenderTeam = [...defenderTeam];
        const newHp = Math.max(0, defender.currentHp - damage);
        newDefenderTeam[defenderIx] = { ...defender, currentHp: newHp };
        setDefenderTeam(newDefenderTeam);

        // Logs
        const playerName = attackerId === 'p1' ? 'J1' : 'J2';
        let msg = `${playerName}: ${attacker.name} usó ${move.name}.`;
        if (effectiveness === 'super') msg += " (Eficaz!)";
        if (effectiveness === 'weak') msg += " (Resistido)";
        addLog(msg);

        // Verificar Derrota
        if (checkFainted(newHp)) {
            addLog(`¡${defender.name} se debilitó!`);
            setWinner(attackerId); // Gana quien atacó
            setTurn('end');
        } else {
            // CAMBIO DE TURNO
            setTurn(attackerId === 'p1' ? 'p2' : 'p1');
        }
    };

    return {
        loading,
        p1Pokemon: playerTeam[p1ActiveIx],
        p2Pokemon: rivalTeam[p2ActiveIx],
        turn,
        battleLogs,
        winner,
        handleAttack
    };
};