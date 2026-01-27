// Importación de React: necesaria para componentes JSX
import React from 'react';

// Importación nombrada: importa solo CONFIG del archivo constants
// En React, se usa para acceder a constantes globales de configuración
// Named imports permiten importar solo lo necesario, optimizando el bundle
import { CONFIG } from '../utils/constants';

// Importación de CSS específico del componente
import './TeamDisplay.css';

// TODO - COMENTAR Y EXPLICAR CÓDIGO PARA DOCUMENTACIÓN

// Componente funcional con múltiples props: demuestra destructuring avanzado
// Props opcionales: algunos tienen valores por defecto (= ''), otros son opcionales
// En React, los componentes pueden recibir muchas props para ser flexibles
function TeamDisplay({
    player,
    team = [],        // Array vacío por defecto (default props)
    isActive,         // Boolean para estado visual
    activeIndex,      // Number para identificar elemento activo
    onSlotClick,      // Función callback para eventos
    onPanelClick,     // Otra función callback
    className = ''    // String con valor por defecto
}) {

    // Array.fill() y spread operator: crear array con valores por defecto
    // En React, se usa para rellenar listas hasta un tamaño fijo
    // Spread operator (...) copia arrays existentes, fill() añade elementos null
    const pokemonBoxes = [...team, ...Array(CONFIG.MAX_TEAM_SIZE - team.length).fill(null)];

    // JSX Return: estructura compleja con múltiples niveles de anidamiento
    return (
        <div
            // Template literals para combinar clases CSS dinámicamente
            // Conditional classes: clases que se aplican según el estado
            // En React, esto es común para estilos condicionales
            className={`team-display-container ${isActive ? 'active' : ''} ${className}`}
            
            // Event handler condicional: solo asigna onClick si existe la función
            // En React, los event handlers pueden ser opcionales
            onClick={onPanelClick}
            
            // Inline styles condicionales: objetos JavaScript para estilos dinámicos
            // cursor: cambia el puntero del mouse según el estado
            style={{ cursor: onPanelClick && !isActive ? 'pointer' : 'default' }}
            
            // Atributo title: tooltip nativo del navegador
            // En React, se usa para accesibilidad y UX
            title={!isActive && onPanelClick ? "Click to set active player" : ""}
        >
            {/** --- HEADER DEL ENTRENADOR --- **/}
            <div className="trainer-header">
                <div className="trainer-avatar-frame">
                    {/* Conditional Rendering con operador ternario */}
                    {/* En React, se usa para mostrar diferentes elementos según condiciones */}
                    {/* Optional chaining (?): acceso seguro a propiedades anidadas */}
                    {/* Previene errores si player o sprite son undefined */}
                    {(player?.sprite) ? (
                        <img src={player.sprite} alt="Avatar" className="trainer-img" />
                    ) : (
                        <div className="no-avatar">?</div>
                    )}
                </div>
                <div className="trainer-info">
                    {/* Optional chaining para valores por defecto */}
                    {/* Nullish coalescing (||) para fallback cuando es null/undefined */}
                    <h3 className="trainer-name">{player?.name || "Trainer"}</h3>
                    <div className="team-count">Pokémons: {team.length} / {CONFIG.MAX_TEAM_SIZE}</div>
                </div>
            </div>

            {/** --- GRID DE SLOTS --- **/}
            <div className="team-slots-grid">
                {/* Array.map(): renderiza una lista de elementos JSX */}
                {/* En React, se usa para crear componentes dinámicamente desde arrays */}
                {/* key prop: identificador único requerido por React para optimización */}
                {/* Cada iteración crea un elemento JSX diferente */}
                {pokemonBoxes.map((poke, index) => {
                    
                    // Variables locales en el map: calculan estado por elemento
                    // En React, se usa para lógica específica de cada item
                    const isBattling = index === activeIndex;

                    return (
                        <div
                            key={index} // Key única para React's reconciliation algorithm
                            
                            // Múltiples clases condicionales con template literals
                            // Combina clases estáticas con dinámicas basadas en estado
                            className={`team-slot ${poke ? 'filled' : 'empty'} ${isBattling ? 'battling-slot' : ''}`}
                            
                            // Event handler anónimo con arrow function
                            // e.stopPropagation(): previene que el evento burbujee al padre
                            // En React, crucial para nested click handlers
                            onClick={(e) => {
                                e.stopPropagation(); // Detiene propagación del evento
                                if (poke && onSlotClick) {
                                    onSlotClick(index); // Ejecuta callback con el índice
                                }
                            }}
                            
                            // Estilos inline condicionales: objeto con propiedades dinámicas
                            // En React, permite estilos computados en tiempo real
                            style={{ 
                                cursor: (poke && onSlotClick) ? 'pointer' : 'default',
                                // Color dinámico basado en estado
                                borderColor: isBattling ? '#ffcc00' : undefined 
                            }}
                        >
                            {/* Conditional rendering complejo: Fragment con múltiples elementos */}
                            {/* Fragment (<>): agrupa elementos sin añadir div extra al DOM */}
                            {poke ? (
                                <>
                                    <img src={poke.image} alt={poke.name} className="slot-icon" />
                                    <span className="slot-name">{poke.name}</span>
                                    
                                    {/* Conditional rendering simple: && operator */}
                                    {/* Solo muestra el badge si está batallando */}
                                    {isBattling && <div className="battle-badge">FIGHT</div>}
                                    
                                    {/* Conditional rendering con expresión compleja */}
                                    {/* Verifica si existe currentHp antes de renderizar */}
                                    {poke.currentHp !== undefined && (
                                        <div className="mini-hp-bar">
                                            {/* Cálculo dinámico en JSX: expresión matemática */}
                                            {/* En React, se puede hacer cálculos directamente en el JSX */}
                                            <div 
                                                className="mini-hp-fill" 
                                                style={{
                                                    // Cálculo de porcentaje para barra de progreso
                                                    width: `${(poke.currentHp / poke.maxHp) * 100}%`,
                                                    // Color condicional: rojo si vida baja, verde si alta
                                                    background: poke.currentHp < (poke.maxHp * 0.2) ? '#ff4d4d' : '#4caf50'
                                                }}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Elemento alternativo cuando no hay Pokémon
                                <span className="empty-label">-</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Export default: hace el componente disponible para importación
export default TeamDisplay;