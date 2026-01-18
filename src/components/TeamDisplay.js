import React from 'react';
import { CONFIG } from '../utils/constants'; // Asegúrate de tener la ruta correcta
import './TeamDisplay.css';

function TeamDisplay({
    player,          //{name, avatar}
    team = [],       //equipo de pokemons
    isActive,        // Turno jugador
    onSlotClick,     //Click al pokemon 
    className = ''   //Estilo personalizado
}) {

    // Usamos Array.from para generar siempre los 6 huecos 
    const pokemonBoxes = [...team, ...Array(6 - team.length).fill(null)]

    return (
        <div className={`team-display-container ${isActive ? 'active' : ''} ${className}`}>

            {/* CABECERA (Avatar y Nombre) */}
            <div className="trainer-header">
                <div className="trainer-sprite-frame">
                    {player?.sprite ? (
                        <img src={player.sprite} alt="Sprite" className="trainer-img" />
                    ) : (
                        <div className="no-avatar">?</div>
                    )}
                </div>
                <div className="trainer-info">
                    <h3 className="trainer-name">{player?.name || "Entrenador"}</h3>
                    <div className="team-count">Pokémons: {team.length} / {CONFIG.MAX_TEAM_SIZE}</div>
                </div>
            </div>

            {/* GRID DE POKEMONS */}
            <div className="team-slots-grid">
                {pokemonBoxes.map((poke, index) => (
                    <div
                        key={index}
                        className={`team-slot ${poke ? 'filled' : 'empty'}`}
                        // Solo ejecutamos onSlotClick si hay pokemon y nos han pasado la función
                        onClick={() => poke && onSlotClick && onSlotClick(index)}
                        style={{ cursor: (poke && onSlotClick) ? 'pointer' : 'default' }}
                    >
                        {poke ? (
                            <>
                                <img src={poke.image} alt={poke.name} className="slot-icon" />
                                <span className="slot-name">{poke.name}</span>
                            </>
                        ) : (
                            <span className="empty-label">-</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}


export default TeamDisplay;