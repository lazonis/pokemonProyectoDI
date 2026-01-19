import React from 'react';
import './ActionButton.css';

//Componente reutilizable botón que permite pasar por props
//un nombre de botón, una función onClick, un estado y variantes de color
function ActionButton({ label, onClick, disabled, variant = 'primary' }) {
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`btn-action ${variant}`}
        >
            {label}
        </button>
    );
}
export default ActionButton;