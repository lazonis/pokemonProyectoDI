import React from 'react';
import './HealthBar.css';

/**
 * HealthBar: Muestra la vida restante con una barra animada.
 * @param {number} current - Vida actual
 * @param {number} max - Vida máxima
 * @param {string} label - Nombre del Pokémon
 * @param {number} level - Nivel (opcional, decorativo)
 */
const HealthBar = ({ current, max, label, level = 50 }) => {
    // 1. Calculamos el porcentaje (asegurando que esté entre 0 y 100)
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));

    // 2. Lógica de colores clásica de Pokémon
    let barColor = '#4caf50'; // Verde (Saludable)
    if (percentage < 50) barColor = '#ffeb3b'; // Amarillo (Precaución)
    if (percentage < 20) barColor = '#f44336'; // Rojo (Peligro)

    return (
        <div className="health-box">
            {/* Cabecera: Nombre y Nivel */}
            <div className="health-header">
                <span className="pokemon-name">{label}</span>
                <span className="pokemon-level">Lv.{level}</span>
            </div>

            {/* Contenedor de la barra */}
            <div className="bar-container">
                <div className="hp-label">HP</div>
                <div className="bar-background">
                    <div 
                        className="bar-fill" 
                        style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: barColor 
                        }}
                    ></div>
                </div>
            </div>

            {/* Texto numérico (Ej: 120/150) */}
            <div className="hp-text">
                {current} / {max}
            </div>
        </div>
    );
};

export default HealthBar;