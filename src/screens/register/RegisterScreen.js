// src/screens/register/RegisterScreen.js
import React, { useState } from 'react';
import { TRAINER_SPRITES } from '../../utils/constants';
import PageLabel from '../../components/PageLabel';
import ActionButton from '../../components/ActionButton'; // Importamos tu botón
import PlayerForm from './PlayerForm';
import './RegisterScreen.css';

function RegisterScreen({ onComplete }) {
    // Estado local para guardar los datos cuando pulsan "HECHO"
    const [p1Data, setP1Data] = useState(null);
    const [p2Data, setP2Data] = useState(null);

    const handleStartGame = () => {
        // Solo permitimos avanzar si ambos existen
        if (p1Data && p2Data) {
            onComplete({ p1: p1Data, p2: p2Data });
        }
    };

    return (
        <div className="register-container" style={{backgroundImage: "url('/background_register.png')"}}>
            <PageLabel
                title="REGISTRO DE JUGADORES"
                subtitle="¿Y tú quién eres?"
            />

            <div className="split-screen-layout">

                {/* --- COLUMNA JUGADOR 1 --- */}
                {/* Si p1Data tiene datos, añadimos la clase 'locked' */}
                <div className={`player-column ${p1Data ? 'locked' : ''}`}>
                    <PageLabel title="JUGADOR 1" subtitle={p1Data ? "¡Listo!" : "¿Eres un chico o una chica?"} />

                    <PlayerForm
                        initialSprite={TRAINER_SPRITES[0].url}
                        buttonLabel="READY"
                        onSubmit={(data) => setP1Data({ ...data, id: 1 })}
                    />
                </div>

                {/* DIVISOR VS */}
                <div className="vs-divider">VS</div>

                {/* --- COLUMNA JUGADOR 2 --- */}
                <div className={`player-column ${p2Data ? 'locked' : ''}`}>
                    <PageLabel title="JUGADOR 2" subtitle={p2Data ? "¡Listo!" : "¿Eres un chico o una chica?"} />

                    <PlayerForm
                        initialSprite={TRAINER_SPRITES[1].url}
                        buttonLabel="READY"
                        onSubmit={(data) => setP2Data({ ...data, id: 2 })}
                    />
                </div>

            </div>

            {/* --- BOTÓN FINAL DE NAVEGACIÓN --- */}
            <div className="start-game-actions">
                <ActionButton
                    label="IR A LA SELECCIÓN DE POKÉMON ➡"
                    onClick={handleStartGame}
                    // Deshabilitado hasta que AMBOS tengan datos
                    disabled={!p1Data || !p2Data}
                    variant={(!p1Data || !p2Data) ? "secondary" : "primary"}
                />
            </div>

        </div>
    );
}

export default RegisterScreen;