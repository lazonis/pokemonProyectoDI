import React from 'react';

function PokemonDetail({ pokemon, onClose, onConfirm }) {
    if (!pokemon) return null;

    // Lógica simple para deducir la región por ID
    const getRegion = (id) => {
        if (id <= 151) return "Kanto";
        if (id <= 251) return "Johto";
        if (id <= 386) return "Hoenn";
        if (id <= 493) return "Sinnoh";
        return "Unova/Otras";
    };

    // Cálculos para la barra de vida
    const hpPercent = Math.min((pokemon.hp / pokemon.maxHp) * 100, 100);
    
    // Color dinámico (Verde > 50%, Amarillo > 20%, Rojo < 20%)
    let hpColor = '#4caf50'; // Verde
    if (hpPercent <= 50) hpColor = '#ffeb3b'; // Amarillo
    if (hpPercent <= 20) hpColor = '#f44336'; // Rojo

    return (
        <div className="detail-modal-overlay" onClick={onClose}>
            {/* stopPropagation evita que el click dentro del modal lo cierre */}
            <div className="detail-card" onClick={(e) => e.stopPropagation()}>
                
                {/* Cabecera con Sprite Grande y Nombre */}
                <div className="modal-header">
                    <img src={pokemon.image} alt={pokemon.name} className="big-sprite" />
                    <h3>{pokemon.name.toUpperCase()}</h3>
                </div>

                {/* Info Principal */}
                <div className="stats-container">
                    <p><strong>Región:</strong> {getRegion(pokemon.id)}</p>
                    <p><strong>Tipo:</strong> {pokemon.type}</p>
                    
                    {/* Stats de Combate */}
                    <div className="combat-stats">
                        <div className="stat-item">
                            <span>ATAQUE</span>
                            <strong>{pokemon.attack}</strong>
                        </div>
                        <div className="stat-item">
                            <span>DEFENSA</span>
                            <strong>{pokemon.defense}</strong>
                        </div>
                    </div>

                    {/* Barra de Vida */}
                    <div className="hp-section">
                        <small>PS: {pokemon.hp}/{pokemon.maxHp}</small>
                        <div className="hp-bar-bg">
                            <div 
                                className="hp-fill" 
                                style={{ width: `${hpPercent}%`, backgroundColor: hpColor }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>VOLVER</button>
                    <button className="btn-confirm" onClick={() => onConfirm(pokemon)}>¡ELEGIR!</button>
                </div>

            </div>
        </div>
    );
}

export default PokemonDetail;