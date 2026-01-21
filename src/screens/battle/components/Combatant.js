import React from 'react';
import HealthBar from './HealthBar';
import './Combatant.css';

/**
 * Combatant: Renderiza Sprite + Barra de vida + Nombre.
 * isPlayer = true -> Renderiza espalda, alineado abajo-izquierda.
 * isPlayer = false -> Renderiza frente, alineado arriba-derecha.
 */
const Combatant = ({ pokemon, trainerName, isPlayer }) => {
    
    const spriteUrl = isPlayer 
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/${pokemon.id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${pokemon.id}.png`;

    return (
        <div className={`combatant-container ${isPlayer ? 'is-player' : 'is-rival'}`}>
            
            {/* HUD: Nombre y Vida */}
            <div className="combatant-hud">
                <div className="trainer-tag">{trainerName}</div>
                <HealthBar 
                    current={pokemon.currentHp} 
                    max={pokemon.maxHp} 
                    label={pokemon.name} 
                />
            </div>

            {/* SPRITE */}
            <div className="sprite-wrapper">
                <img 
                    src={spriteUrl} 
                    alt={pokemon.name} 
                    className="combatant-sprite"
                />
                {/* Sombra decorativa */}
                <div className="shadow-oval"></div>
            </div>
        </div>
    );
};

export default Combatant;
