import React from 'react';
import { CONFIG } from '../utils/constants';
import './TeamDisplay.css';

function TeamDisplay({
    player,
    team = [],
    isActive,
    onSlotClick,
    onPanelClick, // <--- Recibimos la función que permite cambiar de turno de jugador
    className = ''
}) {

    const pokemonBoxes = [...team, ...Array(6 - team.length).fill(null)]

    return (
        // AÑADIDO: onClick y estilo de cursor
        //Contenedor rectangular que contiene toda la información del equipo
        <div
            className={`team-display-container ${isActive ? 'active' : ''} ${className}`}
            onClick={onPanelClick}
            style={{ cursor: !isActive ? 'pointer' : 'default' }}
            title={!isActive ? "Do click to change player's turn" : ""}
        >
            {/**Header del jugador**/}
            {/**
            - Avatar
            - Nombre
            - Total pokemons**/}
            <div className="trainer-header">
                <div className="trainer-avatar-frame">
                    {/* Corrección para que busque avatar o sprite */}
                    {(player?.sprite) ? (
                        <img src={player.sprite} alt="Avatar" className="trainer-img" />
                    ) : (
                        <div className="no-avatar">?</div>
                    )}
                </div>
                <div className="trainer-info">
                    <h3 className="trainer-name">{player?.name || "Entrenador"}</h3>
                    <div className="team-count">Pokémons: {team.length} / {CONFIG.MAX_TEAM_SIZE}</div>
                </div>
            </div>

            {/**Cuerpo del jugador**/}
            <div className="team-slots-grid">
                {/**Mapeamos la posición y pokemons elegidos**/}
                {pokemonBoxes.map((poke, index) => (
                    <div
                        key={index}
                        className={`team-slot ${poke ? 'filled' : 'empty'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }} // Evita cambiar de turno si borras un pokemon

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
            {/*Final del contenedor total*/}
        </div>
    );
}

export default TeamDisplay;