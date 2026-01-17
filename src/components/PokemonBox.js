import React from 'react';


function PokemonBox({ pokemon, onClick, isSelected }) {
    return (
        <div 
            className={`pokemon-slot-card ${isSelected ? 'selected' : ''}`} 
            onClick={() => onClick(pokemon)}
        >
            <div className="sprite-container">
                 <img 
                    src={pokemon.image} 
                    alt={pokemon.name} 
                    className="pixel-sprite-large" 
                />
            </div>
            <span className="pokemon-name-label">{pokemon.name}</span>
        </div>
    );
}

export default PokemonBox;