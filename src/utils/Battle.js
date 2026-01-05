import { useState, useEffect, useRef } from 'react';
import { calculateDamage } from './Logic'; // Importamos tu lógica
import './Battle.css'; // Importamos estilos

function Battle({ player, enemy, onBack }) {
    // --- ESTADOS ---
    const [view, setView] = useState('intro'); // 'intro' | 'combat' | 'end'
    const [playerHp, setPlayerHp] = useState(player.hp);
    const [enemyHp, setEnemyHp] = useState(enemy.hp);
    const [logs, setLogs] = useState(["¡Comienza el combate!"]);
    const [turn, setTurn] = useState('player'); // 'player' | 'enemy'

    // Estados para animaciones visuales
    const [playerShake, setPlayerShake] = useState(false);
    const [enemyShake, setEnemyShake] = useState(false);

    // Referencia para el scroll del log
    const logBoxRef = useRef(null);

    // --- FUNCIÓN PARA AÑADIR LOGS ---
    const addLog = (message) => {
        setLogs(prev => [message, ...prev]); // Añadimos al principio
    };

    // --- LÓGICA DE ATAQUE ---
    const handleAttack = (moveName) => {
        if (turn !== 'player') return;

        // 1. Calculamos daño AL ENEMIGO
        const result = calculateDamage(player, enemy);
        const newHp = Math.max(0, enemyHp - result.damage);

        // 2. Actualizamos estado
        setEnemyHp(newHp);

        // 3. Animación de daño en el enemigo
        setEnemyShake(true);
        setTimeout(() => setEnemyShake(false), 500); // Quitamos la clase tras 0.5s

        // 4. Feedback en el Log

        let msgEfectividad = "";
        if (result.effectiveness === "super") msgEfectividad = " ¡Es súper efectivo!";
        if (result.effectiveness === "weak") msgEfectividad = " No es muy efectivo...";

        addLog(`${player.name} usó ${moveName}.${msgEfectividad} (-${result.damage} HP)`);

        // 5. Comprobar victoria
        if (newHp === 0) {
            addLog(`¡${enemy.name} se debilitó! ¡GANASTE!`);
            setView('end');
        } else {
            // Cambio de turno tras 1 segundo
            setTurn('enemy');
            setTimeout(enemyTurn, 1500);
        }
    };

    // --- TURNO DEL ENEMIGO ---
    const enemyTurn = () => {
        // El enemigo elige ataque al azar
        const randomMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];

        // ... dentro de enemyTurn ...
        const result = calculateDamage(enemy, player);

        setPlayerHp(prevHp => {
            const newHp = Math.max(0, prevHp - result.damage);

            // --- CÓDIGO NUEVO PARA EL LOG ---
            let msgEfectividad = "";
            if (result.effectiveness === "super") msgEfectividad = " ¡Es súper efectivo!";
            if (result.effectiveness === "weak") msgEfectividad = " No es muy efectivo...";

            addLog(`Rival ${enemy.name} usó ${randomMove.name}.${msgEfectividad} (-${result.damage} HP)`);
            // -------------------------------

            if (newHp === 0) {
                addLog(`¡${player.name} se debilitó! PERDISTE...`);
                setView('end');
            } else {
                setTurn('player');
            }
            return newHp;
        });
    };


    // --- 1. VISTA DE INTRODUCCIÓN ---
    if (view === 'intro') {
        return (
            <div className="battle-container center-content" style={{ flexDirection: 'column', height: '400px' }}>
                <h2>¡{enemy.name} salvaje apareció!</h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <img src={player.image} alt="yo" style={{ width: '100px' }} />
                    <span style={{ fontSize: '20px' }}>VS</span>
                    <img src={enemy.image} alt="rival" style={{ width: '100px' }} />
                </div>
                <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                    <button className="btn active" onClick={() => setView('combat')}>INICIAR BATALLA</button>
                    <button className="btn" onClick={onBack}>HUIR</button>
                </div>
            </div>
        );
    }

    // --- 2. VISTA DE COMBATE ---
    return (
        <div className="battle-container">
            {/* ZONA SUPERIOR: RIVAL */}
            <div className="fighter-zone enemy">
                <div className="stats-box">
                    <p>{enemy.name} <span style={{ fontSize: '10px' }}>Nv.50</span></p>
                    <div className="hp-bar-bg">
                        <div
                            className={`hp-bar-fill ${(enemyHp / enemy.maxHp) < 0.2 ? 'low-health' : ''}`}
                            style={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }}
                        ></div>
                    </div>
                </div>
                {/* Aplicamos la clase shake si enemyShake es true */}
                <img
                    src={enemy.image}
                    alt="rival"
                    className={`sprite ${enemyShake ? 'shake-animation' : ''}`}
                    style={{ width: '150px' }}
                />
            </div>

            {/* ZONA INFERIOR: JUGADOR */}
            <div className="fighter-zone player" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <img
                    src={player.image}
                    alt="yo"
                    className={`sprite ${playerShake ? 'shake-animation' : ''}`}
                    style={{ width: '150px' }}
                />
                <div className="stats-box" style={{ marginLeft: '20px' }}>
                    <p>{player.name} <span style={{ fontSize: '10px' }}>Nv.50</span></p>
                    <div className="hp-bar-bg">
                        <div
                            className={`hp-bar-fill ${(playerHp / player.maxHp) < 0.2 ? 'low-health' : ''}`}
                            style={{ width: `${(playerHp / player.maxHp) * 100}%` }}
                        ></div>
                    </div>
                    <p style={{ textAlign: 'right', fontSize: '10px' }}>{playerHp}/{player.maxHp} HP</p>
                </div>
            </div>

            {/* ZONA DE LOGS */}
            <div className="battle-log" ref={logBoxRef}>
                {logs.map((log, i) => (
                    <div key={i} className="log-entry">{log}</div>
                ))}
            </div>

            {/* ZONA DE CONTROLES */}
            <div className="controls-panel" style={{ marginTop: '10px' }}>
                {view === 'end' ? (
                    <button className="btn active" onClick={onBack} style={{ width: '100%' }}>
                        Volver al Menú
                    </button>
                ) : (
                    <div className="moves-grid">
                        {player.moves.map((move, index) => (
                            <button
                                key={index}
                                className="move-btn"
                                disabled={turn !== 'player'} // Deshabilitar si no es tu turno
                                onClick={() => handleAttack(move.name)}
                            >
                                {move.name}
                            </button>

                        ))}
                        <button className="btn" onClick={onBack}>HUIR</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Battle;