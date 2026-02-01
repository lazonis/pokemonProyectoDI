import React, { useState } from 'react';
import { TRAINER_SPRITES } from '../../utils/constants';
import ActionButton from '../../components/ActionButton';
import AvatarSelector from './AvatarSelector';
import './RegisterScreen.css';

//COMPONENTE QUE CONTROLA LOS DATOS NECESARIOS PARA COMPLETAR EL FORMULARIO
function PlayerForm({ initialSprite, buttonLabel, onSubmit }) {
    // Estado local del formulario 
    const [name, setName] = useState('');
    const [sprite, setSprite] = useState(initialSprite || TRAINER_SPRITES[0].url);

    const handleSubmit = () => {
        // Validación interna del formulario -> Si o si necesita un nombre
        if (!name.trim()) return alert("¡Por favor, escribe un nombre!");

        // Enviamos los datos limpios al padre
        onSubmit({ name, sprite });
    };

    return (
        <div className="register-card">
            {/**Formulario Input del nombre **/}
            <input
                className="register-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                autoFocus
            />
            {/**Llamamos al componente que carga nuestro array de entrenadores y el avatar elegido**/}
            <AvatarSelector
                selectedSprite={sprite}
                onSelect={setSprite}
            />
            {/**Llamamos al componente botón**/}
            <ActionButton
                label={buttonLabel}
                onClick={handleSubmit}
            />
        </div>
    );
}

export default PlayerForm;