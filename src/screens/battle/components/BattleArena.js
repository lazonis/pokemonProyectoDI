// BattleArena.js
import React from 'react';
import Combatant from './Combatant';     // <--- IMPORTAMOS TU COMPONENTE
import ControlPanel from './ControlPanel'; // <--- IMPORTAMOS TU COMPONENTE
import './BattleArena.css';

const BattleArena = ({ p1Pokemon, p2Pokemon, battleLogs, onAttack, turn, winner, p1Name, p2Name }) => {
    
    // Lógica para saber qué botones mostrar en el ControlPanel
    let currentMoves = turn === 'p1' ? p1Pokemon.moves : p2Pokemon.moves;
    let activeName = turn === 'p1' ? p1Name : p2Name;

    return (
        <div className="arena-container">
            
            {/* 1. ZONA VISUAL (STAGE) */}
            <div className="visual-stage">
                {/* RIVAL (Arriba) */}
                <Combatant 
                    pokemon={p2Pokemon} 
                    trainerName={p2Name} 
                    isPlayer={false} 
                />

                {/* JUGADOR (Abajo) */}
                <Combatant 
                    pokemon={p1Pokemon} 
                    trainerName={p1Name} 
                    isPlayer={true} 
                />
            </div>

            {/* 2. ZONA DE CONTROL */}
            <div className="control-area">
                <ControlPanel 
                    logs={battleLogs}
                    moves={currentMoves}
                    onAttack={onAttack}
                    activePlayerName={activeName}
                    winner={winner}
                />
            </div>
        </div>
    );
};
export default BattleArena;