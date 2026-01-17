import React from 'react';
// No necesitamos importar CSS aquí si ya está importado en PokemonList.js o App.js
// pero asegúrate de que los estilos de abajo estén en tu archivo .css principal.

const PokemonDetail = ({ pokemon, onClose, onConfirm }) => {
    if (!pokemon) return null;

    // Detenemos la propagación del click dentro de la "consola" para que no se cierre al hacer click en ella
    const handleCardClick = (e) => {
        e.stopPropagation();
    };

    return (
        // El Overlay (fondo oscuro)
        <div className="detail-modal-overlay" onClick={onClose}>
            
            {/* La Carcasa de la Gameboy */}
            <div className="gameboy-body" onClick={handleCardClick}>
                
                

                {/* El bisel oscuro de la pantalla */}
                <div className="gameboy-screen-bezel">
                    
                    {/* La pantalla iluminada (Contenido real) */}
                    <div className="gameboy-screen-content">
                        
                        {/* Botón de cerrar estilo "Select/Start" */}
                        <button className="gb-close-btn" onClick={onClose}>✖</button>

                        <h2 className="gb-title">{pokemon.id} - {pokemon.name.toUpperCase()}</h2>
                        
                        <div className="gb-image-container">
                            <img 
                                src={pokemon.image} 
                                alt={pokemon.name} 
                                className="gb-sprite"
                            />
                        </div>

                        <div className="gb-info-section">
                            <div className="gb-type-tag">TIPO: {pokemon.type.toUpperCase()}</div>
                            
                            <div className="gb-stats-container">
                                <div className="stat-row">
                                    <span>HP:</span>
                                    <div className="stat-bar-track">
                                        <div className="stat-bar-fill hp" style={{width: `${Math.min(100, (pokemon.hp/150)*100)}%`}}></div>
                                    </div>
                                    <span className="stat-val">{pokemon.hp}</span>
                                </div>
                                <div className="stat-row">
                                    <span>ATK:</span>
                                    <div className="stat-bar-track">
                                        <div className="stat-bar-fill atk" style={{width: `${Math.min(100, (pokemon.attack/150)*100)}%`}}></div>
                                    </div>
                                    <span className="stat-val">{pokemon.attack}</span>
                                </div>
                                <div className="stat-row">
                                    <span>DEF:</span>
                                    <div className="stat-bar-track">
                                        <div className="stat-bar-fill def" style={{width: `${Math.min(100, (pokemon.defense/150)*100)}%`}}></div>
                                    </div>
                                    <span className="stat-val">{pokemon.defense}</span>
                                </div>
                            </div>
                        </div>
                    </div> {/* Fin screen-content */}
                </div> {/* Fin screen-bezel */}

                {/* Área de botones inferior */}
                <div className="gameboy-controls-area">
                    <div className="d-pad-decoration"></div>
                    <button className="gb-action-btn-a" onClick={() => onConfirm(pokemon)}>
                        ELEGIR!
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PokemonDetail;