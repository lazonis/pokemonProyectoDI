import React from 'react';
import './ActionButton.css';

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