import React from 'react';
// Carga estilos de la págin padre -> SelectionScreen.css



function PokemonDetail({ pokemon, onClose, onConfirm}) {
    if (!pokemon) return null;

    // Evita que el click dentro de la Gameboy cierre el modal
    const handleCardClick = (e) => {
        e.stopPropagation();
    };

    // Helper para formatear los tipos (funciona si es array o string)
    // conexión con la api + format de como devuelve los datos de tipo
    // chatgepeteada funcional
    const typeStr = pokemon.types
        ? pokemon.types.map(t => t.type.name).join(' / ').toUpperCase()
        : (pokemon.type || '???').toUpperCase();

    return (
        // El Overlay (fondo oscuro) cierra al hacer click fuera
        <div className="detail-modal-overlay" onClick={onClose}>

            {/* La Carcasa de la Gameboy */}
            <div className="gameboy-body" onClick={handleCardClick}>
                {/* El bisel oscuro de la pantalla */}
                <div className="gameboy-screen-bezel">

                    {/* La pantalla iluminada (Contenido real) */}
                    <div className="gameboy-screen-content">

                        {/* Botón de cerrar */}
                        <button className="gb-close-btn" onClick={onClose} title="Cerrar">×</button>

                        <h2 className="gb-title">
                            {/* Feedback visual de turno */}
                            {pokemon.name}
                        </h2>

                        <div className="gb-image-container">
                            <img
                                src={pokemon.sprite}
                                alt={pokemon.name}
                                className="gb-sprite"
                            />
                        </div>

                        <div className="gb-info-section">
                            <div className="gb-type-tag">TIPO: {typeStr}</div>

                            <div className="gb-stats-container">
                                {/* HP */}
                                <div className="stat-row">
                                    <span>HP:</span>
                                    <div className="stat-bar-track">
                                        <div
                                            className="stat-bar-fill"
                                            style={{ width: `${Math.min(100, (pokemon.hp / 150) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="stat-val">{pokemon.hp}</span>
                                </div>

                                {/* ATK */}
                                <div className="stat-row">
                                    <span>ATK:</span>
                                    <div className="stat-bar-track">
                                        <div
                                            className="stat-bar-fill"
                                            style={{ width: `${Math.min(100, (pokemon.attack / 150) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="stat-val">{pokemon.attack}</span>
                                </div>

                                {/* DEF */}
                                <div className="stat-row">
                                    <span>DEF:</span>
                                    <div className="stat-bar-track">
                                        <div
                                            className="stat-bar-fill"
                                            style={{ width: `${Math.min(100, (pokemon.defense / 150) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="stat-val">{pokemon.defense}</span>
                                </div>
                            </div>
                        </div>

                    </div> {/* Fin screen-content */}
                </div> {/* Fin screen-bezel */}

                {/* Área de botones inferior */}
                <div className="gameboy-controls-area">
                    <button className="gb-action-btn-a" onClick={() => onConfirm(pokemon)}>
                        A
                    </button>
                </div>

            </div>
        </div>
    );
}

export default PokemonDetail;