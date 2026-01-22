import React from 'react';
import BattleLog from './BattleLog';
import MoveSet from './MoveSet';
import './ControlPanel.css'; // CSS para organizar Log vs Botones

const ControlPanel = ({ 
    logs, 
    p1Moves,
    p2Moves,
    onAttack, 
    turn, 
    winner,
    p1Name,
    p2Name
}) => {
    
    // Lógica visual: ¿Qué mostramos a la derecha?
    const renderRightPanel = () => {
        if (winner) {
            return (
                <div className="end-game-box">
                    
                    <p>Winner: {winner} !!</p>
                </div>
            );
        }

        return (
            <div className="moves-container">
                <div className="player-moves">
                    <div className="turn-badge">{p1Name}</div>
                    <MoveSet 
                        moves={p1Moves} 
                        onAttack={(move) => onAttack(move, 'p1')} 
                        disabled={turn !== 'p1'} 
                    />
                </div>
                <div className="player-moves">
                    <div className="turn-badge">{p2Name}</div>
                    <MoveSet 
                        moves={p2Moves} 
                        onAttack={(move) => onAttack(move, 'p2')} 
                        disabled={turn !== 'p2'} 
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="control-panel-container">
            
            <div className="panel-section section-log">
                <BattleLog logs={logs} />
            </div>

            {/* DERECHA: Botonera o Mensaje Final */}
            <div className="panel-section section-actions">
                {renderRightPanel()}
            </div>
        </div>
    );
};

export default ControlPanel;