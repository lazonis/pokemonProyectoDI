import React from 'react';
import HealthBar from './HealthBar';
import BattleLog from './BattleLog';
import MoveSet from './MoveSet';
import './BattleArena.css';

const BattleArena = ({ 
    p1Pokemon, 
    p2Pokemon, 
    battleLogs, 
    onAttack, 
    turn, 
    winner,
    p1Name,
    p2Name
}) => {
    
    // Sprites: J1 de Espalda (Gen 5 Back), J2 de Frente (Gen 5 Front)
    const getBackSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/${id}.png`;
    const getFrontSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${id}.png`;

    // LÓGICA DE CONTROLES DINÁMICOS
    // Decidimos qué movimientos mostrar según de quién sea el turno
    let currentMoves = [];
    let isButtonsDisabled = !!winner; // Si hay ganador, desactivar todo

    if (turn === 'p1') {
        currentMoves = p1Pokemon.moves;
    } else if (turn === 'p2') {
        currentMoves = p2Pokemon.moves;
    }

    return (
        <div className="arena-wrapper">
            
            {/* 1. ESCENARIO VISUAL */}
            <div className="visual-stage">
                
                {/* RIVAL (J2) - Arriba Derecha */}
                <div className="combatant rival">
                    <div className="info-tag">{p2Name}</div>
                    <HealthBar 
                        current={p2Pokemon.currentHp} 
                        max={p2Pokemon.maxHp} 
                        label={p2Pokemon.name} 
                    />
                    <img 
                        src={getFrontSprite(p2Pokemon.id)} 
                        alt="Rival" 
                        className="sprite rival-sprite" 
                    />
                </div>

                {/* JUGADOR (J1) - Abajo Izquierda */}
                <div className="combatant player">
                    <img 
                        src={getBackSprite(p1Pokemon.id)} 
                        alt="Player" 
                        className="sprite player-sprite" 
                    />
                    <HealthBar 
                        current={p1Pokemon.currentHp} 
                        max={p1Pokemon.maxHp} 
                        label={p1Pokemon.name} 
                    />
                     <div className="info-tag">{p1Name}</div>
                </div>
            </div>

            {/* 2. PANEL DE CONTROL UNIFICADO */}
            <div className="control-panel">
                {/* LOG DE BATALLA */}
                <div className="panel-left">
                    <BattleLog logs={battleLogs} />
                </div>
                
                {/* BOTONERA CAMBIANTE */}
                <div className="panel-right">
                    {winner ? (
                        <div className="end-msg">
                            ¡{winner === 'p1' ? p1Name : p2Name} GANA!
                        </div>
                    ) : (
                        <div className="active-controls">
                            <div className="turn-indicator">
                                {turn === 'p1' ? `TURNO DE ${p1Name}` : `TURNO DE ${p2Name}`}
                            </div>
                            <MoveSet 
                                moves={currentMoves} 
                                onAttack={onAttack} 
                                disabled={isButtonsDisabled} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BattleArena;