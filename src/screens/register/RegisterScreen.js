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

    //Función personalizada que comprueba si los datos de los jugadores se han establecido
    //Si es así, permite pasar a la siguiente fase -> onComplete
    const handleStartGame = () => {
        // Si ambos existen -> RegisterScreen onComplete
        if (p1Data && p2Data) {
            onComplete({ p1: p1Data, p2: p2Data });
        }
    };

    return (
        //TÍTULO PRESENTACIÓN DE LA PÁGINA
        <div className="register-container">
            <PageLabel
                title="PLAYER RESGISTER"
                subtitle="And who are you?"
            />

            <div className="split-screen-layout">

                {/* --- COLUMNA JUGADOR 1 --- */}
                {/* todo: explicar condicion ternaria linea 35*/}
                <div className={`player-column ${p1Data ? 'locked' : ''}`}>
                    
                    <h2 style={{textAlign: "center", textShadow: "3px 3px #ffefff"}} >
                        PLAYER 1 
                        <p style={{fontSize: "0.7rem"}}>Are you a boy or a girl?</p>
                    </h2>

                    <PlayerForm
                        /*todo : explicar cómo a través de la constante TRAINER_SPRITES accede al avatar*/
                        initialSprite={TRAINER_SPRITES[0].url}
                        buttonLabel="READY"
                        /**cuando clickemos ready, se asignan los datos*/
                        onSubmit={(data) => setP1Data({ ...data, id: 1 })}
                    />
                </div>

                {/* DIVISOR VS */}
                <div className="vs-divider">VS</div>

                {/* --- COLUMNA JUGADOR 2 --- */}
                <div className={`player-column ${p2Data ? 'locked' : ''}`}>
                    <h2 style={{textAlign: "center", textShadow: "3px 3px #ffefff"}} >
                        PLAYER 2
                        <p style={{fontSize: "0.7rem"}}>Are you a boy or a girl?</p>
                    </h2>
                    <PlayerForm
                        initialSprite={TRAINER_SPRITES[1].url}
                        buttonLabel="READY"
                        onSubmit={(data) => setP2Data({ ...data, id: 2 })}
                    />
                </div>

            </div>


            {/* --- BOTÓN FINAL DE CAMBIO DE PÁGINA --- */}
            <div className="start-game-actions">
                <ActionButton
                    label="GO CHOOSE YOUR TEAM ➡"
                    //llamamos a la función que eleva el estado para conectar con onComplete (props)
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