import React from 'react';
import './PokemonDetail.css'; // Importing the dedicated styles

/**
 * PokemonDetail Component
 * * Displays a detailed view of a selected Pokemon inside a "Gameboy" style modal.
 * Shows stats (HP, Attack, Defense), type, and an image sprite.
 * * @param {Object} props
 * @param {Object} props.pokemon - The Pokemon data object containing stats, sprites, and types.
 * @param {Function} props.onClose - Function to trigger when closing the modal.
 * @param {Function} props.onConfirm - Function to trigger when selecting/confirming the Pokemon.
 */
function PokemonDetail({ pokemon, onClose, onConfirm }) {
    // If no pokemon data is provided, do not render anything.
    if (!pokemon) return null;

    /**
     * Prevents the click event from bubbling up to the overlay.
     * This ensures clicking the Gameboy body doesn't accidentally close the modal.
     * @param {Event} e - The click event
     */
    const handleCardClick = (e) => {
        e.stopPropagation();
    };

    // Helper to format types. Handles both array (standard API) or string formats.
    // Example output: "FIRE / FLYING"
    const typeStr = pokemon.types
        ? pokemon.types.map(t => t.type.name).join(' / ').toUpperCase()
        : (pokemon.type || '???').toUpperCase();

    // Calculate stat percentage for the progress bars (Max stat assumed as 150 for visual scaling)
    const getStatWidth = (statValue) => `${Math.min(100, (statValue / 150) * 100)}%`;

    return (
        // The Overlay (dark background) closes the modal when clicked
        <div className="detail-modal-overlay" onClick={onClose}>

            {/* The Gameboy Container */}
            <div className="gameboy-body" onClick={handleCardClick}>
                
                {/* Screen Bezel (Dark border around screen) */}
                <div className="gameboy-screen-bezel">

                    {/* Lit Screen (Actual Content) */}
                    <div className="gameboy-screen-content">

                        {/* Close Button (Top Right) */}
                        <button className="gb-close-btn" onClick={onClose} title="Close">×</button>

                        <h2 className="gb-title">
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
                            <div className="gb-type-tag">TYPE: {typeStr}</div>

                            <div className="gb-stats-container">
                                {/* HP Stat Bar */}
                                <div className="stat-row">
                                    <span>HP:</span>
                                    <div className="stat-bar-track">
                                        <div
                                            className="stat-bar-fill"
                                            style={{ width: getStatWidth(pokemon.hp) }}
                                        ></div>
                                    </div>
                                    <span className="stat-val">{pokemon.hp}</span>
                                </div>

                                {/* Attack Stat Bar */}
                                <div className="stat-row">
                                    <span>ATK:</span>
                                    <div className="stat-bar-track">
                                        <div
                                            className="stat-bar-fill"
                                            style={{ width: getStatWidth(pokemon.attack) }}
                                        ></div>
                                    </div>
                                    <span className="stat-val">{pokemon.attack}</span>
                                </div>

                                {/* Defense Stat Bar */}
                                <div className="stat-row">
                                    <span>DEF:</span>
                                    <div className="stat-bar-track">
                                        <div
                                            className="stat-bar-fill"
                                            style={{ width: getStatWidth(pokemon.defense) }}
                                        ></div>
                                    </div>
                                    <span className="stat-val">{pokemon.defense}</span>
                                </div>
                            </div>
                        </div>

                    </div> {/* End screen-content */}
                </div> {/* End screen-bezel */}

                {/* Bottom Control Area (A Button) */}
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