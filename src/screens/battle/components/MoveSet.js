import React from 'react';
import './MoveSet.css';

/**
 * MoveSet: Grid de 4 botones para atacar.
 * @param {Array} moves - Lista de movimientos
 * @param {Function} onAttack - Función al hacer click
 * @param {boolean} disabled - Si es true, no se puede clickar (turno rival o fin)
 */
const MoveSet = ({ moves, onAttack, disabled }) => {
    return (
        //Contenedor total de movimientos
        <div className="moves-grid">
        {/**MAPEAMOS LOS MOVIMIENTOS DESCARGADOS EN UN MOV POR BOTÓN**/}
            {moves.map((move, index) => (
                <button
                    key={index}
                    className={`move-btn`} // Clase dinámica por tipo
                    onClick={() => onAttack(move)}
                    disabled={disabled}
                >
                    <span className="move-name">{move.name}</span>
                    <span className="move-pp">PP {move.pp || 15}/{move.pp || 15}</span>
                </button>
            ))}
        </div>
    );
};

export default MoveSet;