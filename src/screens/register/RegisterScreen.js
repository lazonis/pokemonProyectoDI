// src/screens/register/RegisterScreen.js
import React, { useState } from 'react';
import { TRAINER_SPRITES } from '../../utils/constants';
import PageLabel from '../../components/PageLabel';
import ActionButton from '../../components/ActionButton'; // Importamos tu botón
import PlayerForm from './PlayerForm';
import './RegisterScreen.css';

function RegisterScreen({ onComplete }) {
    // Estado local para guardar los datos cuando se pulsa "READY"
    const [p1Data, setP1Data] = useState(null);
    const [p2Data, setP2Data] = useState(null);

    const handleStartGame = () => {
        // Si ambos existen -> RegisterScreen onComplete
        if (p1Data && p2Data) {
            onComplete({ p1: p1Data, p2: p2Data });
        }
    };

    return (
        <div className="register-container">
            <PageLabel
                title="PLAYER RESGISTER"
                subtitle="And who are you?"
            />
            <div className="split-screen-layout">
                {/* --- COLUMNA JUGADOR 1 --- */}
                {/* Si p1Data tiene datos, añadimos la clase 'locked' */}
                <div className={`player-column ${p1Data ? 'locked' : ''}`}>
                    <PageLabel
                        title="PLAYER 1"
                        subtitle={p1Data ? "" : "Are you a boy or a girl?"}
                    />
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
                    <PageLabel 
                        title="PLAYER 2" 
                        subtitle={p2Data ? "" : "Are you a boy or a girl?"} 
                    />

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
                    label="GO CHOOSE YOUR TEAM ➡"
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