import React from 'react';
import BattleLog from './BattleLog';
import MoveSet from './MoveSet';
import './ControlPanel.css'; // CSS para organizar Log vs Botones

const ControlPanel = ({ 
    logs, 
    moves, 
    onAttack, 
    turn, 
    activePlayerName, 
    winner 
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
            
            <div className="active-moves-box">
                <div className="turn-badge">{activePlayerName}</div>
                <MoveSet 
                    moves={moves} 
                    onAttack={onAttack} 
                    disabled={!!winner} 
                />
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