import React from 'react';

// Carga estilos de la págin padre -> SelectionScreen.css
/*ToDo: Comentar el código + funcionalidades/lógica aplicada aquí*/
function PokemonBox({ pokemons, loading, onSelect, isOwned }) {
    return (
        <div className="pc-grid-compact">
            {loading ? (
                <p className="loading">Loading PC data....</p>
            /*Operador ternario*/ 
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