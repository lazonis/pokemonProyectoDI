//SRP
import React from 'react';
import { TRAINER_SPRITES } from '../../utils/constants'; 
import './AvatarSelector.css';

//Pasamos por props "selectedSprite" para que React reconozca el entrenador seleccionado
    //onSelect para pasar la función que se ejecutará al hacer click
function AvatarSelector({ selectedSprite, onSelect }) {
    return (
        <div className="avatar-grid">
        {/*Usamos nuestro array de urls para mapear cada entrenador por separado */}
            {TRAINER_SPRITES.map((trainer) => (
                <div 
                    key={trainer.id}
                    className={`avatar-option ${selectedSprite === trainer.url ? 'selected' : ''}`}
                    onClick={() => onSelect(trainer.url)}
                >
                    <img src={trainer.url} alt={trainer.name} />
                </div>
            ))}
        </div>
    );
}
export default AvatarSelector;