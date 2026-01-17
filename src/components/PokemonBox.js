import React from 'react';


function PokemonBox({ pokemon, onClick }) {
    return (
        <div className="pokemon-slot" onClick={() => onClick(pokemon)}>
            <img 
                src={pokemon.image} 
                alt={pokemon.name} 
                className="pixel-sprite" 
            />
        </div>
    );
}

export default PokemonBox;