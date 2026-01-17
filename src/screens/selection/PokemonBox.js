import React from 'react';

function PokemonBox({ pokemons, loading, onSelect, isOwned }) {
    return (
        <div className="pc-grid-compact">
            {loading ? (
                <p className="loading">Cargando datos del PC...</p>
            ) : (
                pokemons.map((poke) => (
                    <div 
                        key={poke.id}
                        className={`pokemon-slot-compact ${isOwned(poke.id) ? 'selected' : ''}`} 
                        onClick={() => !isOwned(poke.id) && onSelect(poke)}
                    >
                        <img src={poke.image} alt={poke.name} className="sprite-compact" />
                        <span className="name-compact">{poke.name}</span>
                    </div>
                ))
            )}
        </div>
    );
}

export default PokemonBox;