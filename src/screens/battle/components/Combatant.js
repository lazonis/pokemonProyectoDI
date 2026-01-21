// Combatant.js
import React from 'react';
import HealthBar from './HealthBar';
import './Combatant.css';

const Combatant = ({ pokemon, trainerName, isPlayer }) => {
    
    // Movemos la lógica de sprites AQUÍ (SRP: Single Responsibility Principle)
    const getSprite = () => {
        const baseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white";
        return isPlayer ? `${baseUrl}/back/${pokemon.id}.png` : `${baseUrl}/${pokemon.id}.png`;
    };

    return (
        // Usamos una clase base + una modificadora (is-player / is-rival)
        <div className={`combatant-wrapper ${isPlayer ? 'pos-player' : 'pos-rival'}`}>
            
            {/* HUD */}
            <div className="combatant-hud">
                <div className="trainer-tag">{trainerName}</div>
                <HealthBar current={pokemon.currentHp} max={pokemon.maxHp} label={pokemon.name} />
            </div>

            {/* SPRITE */}
            <div className="sprite-container">
                <img src={getSprite()} alt={pokemon.name} className="pixel-sprite" />
                <div className="shadow"></div>
            </div>
        </div>
    );
};
export default Combatant;