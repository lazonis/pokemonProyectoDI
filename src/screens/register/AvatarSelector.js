import React from 'react';
// IMPORTANTE: Subimos 2 niveles para llegar a utils
import { TRAINER_SPRITES } from '../../utils/constants'; 
import './AvatarSelector.css';

function AvatarSelector({ selectedSprite, onSelect }) {
    return (
        <div className="avatar-grid">
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