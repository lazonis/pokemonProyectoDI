import React from 'react';
import { CONFIG } from '../utils/constants';
import './TeamDisplay.css';

/*TODO - COMENTAR Y EXPLICAR CÓDIGO PARA DOCUMENTACIÓN*/ 

function TeamDisplay({
    player,
    team = [],
    isActive,      // Si es el turno de este jugador (Panel iluminado)
    activeIndex,   // <--- NUEVO: Índice del Pokémon luchando actualmente (solo para Battle)
    onSlotClick,   // Función al hacer click en un slot (Borrar o Cambiar)
    onPanelClick,  // Función para cambiar el turno manual en Selección
    className = ''
}) {

    // Rellenamos hasta llegar a 6 huecos
    const pokemonBoxes = [...team, ...Array(CONFIG.MAX_TEAM_SIZE - team.length).fill(null)];

    return (
        <div
            className={`team-display-container ${isActive ? 'active' : ''} ${className}`}
            onClick={onPanelClick}
            style={{ cursor: onPanelClick && !isActive ? 'pointer' : 'default' }}
            title={!isActive && onPanelClick ? "Click to set active player" : ""}
        >
            {/** --- HEADER DEL ENTRENADOR --- **/}
            <div className="trainer-header">
                <div className="trainer-avatar-frame">
                    {(player?.sprite) ? (
                        <img src={player.sprite} alt="Avatar" className="trainer-img" />
                    ) : (
                        <div className="no-avatar">?</div>
                    )}
                </div>
                <div className="trainer-info">
                    <h3 className="trainer-name">{player?.name || "Trainer"}</h3>
                    <div className="team-count">Pokémons: {team.length} / {CONFIG.MAX_TEAM_SIZE}</div>
                </div>
            </div>

            {/** --- GRID DE SLOTS --- **/}
            <div className="team-slots-grid">
                {pokemonBoxes.map((poke, index) => {
                    
                    // ¿Es este el pokemon que está luchando ahora mismo?
                    const isBattling = index === activeIndex;

                    return (
                        <div
                            key={index}
                            // Añadimos clase 'battling-slot' si coincide el índice
                            className={`team-slot ${poke ? 'filled' : 'empty'} ${isBattling ? 'battling-slot' : ''}`}
                            
                            // CORRECCIÓN IMPORTANTE AQUÍ:
                            onClick={(e) => {
                                e.stopPropagation(); // Evita seleccionar el panel entero
                                if (poke && onSlotClick) {
                                    onSlotClick(index); // ¡Ejecutamos la acción!
                                }
                            }}
                            
                            style={{ 
                                cursor: (poke && onSlotClick) ? 'pointer' : 'default',
                                // Opcional: Borde diferente si es el activo
                                borderColor: isBattling ? '#ffcc00' : undefined 
                            }}
                        >
                            {poke ? (
                                <>
                                    <img src={poke.image} alt={poke.name} className="slot-icon" />
                                    <span className="slot-name">{poke.name}</span>
                                    
                                    {/* Indicador visual de "EN COMBATE" (Opcional) */}
                                    {isBattling && <div className="battle-badge">FIGHT</div>}
                                    
                                    {/* Barra de vida mini (Opcional para ver salud en el banquillo) */}
                                    {poke.currentHp !== undefined && (
                                        <div className="mini-hp-bar">
                                            <div 
                                                className="mini-hp-fill" 
                                                style={{
                                                    width: `${(poke.currentHp / poke.maxHp) * 100}%`,
                                                    background: poke.currentHp < (poke.maxHp * 0.2) ? '#ff4d4d' : '#4caf50'
                                                }}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <span className="empty-label">-</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TeamDisplay;