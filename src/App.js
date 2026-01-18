import React, { useState } from 'react';
import './App.css';
import { GAME_PHASES } from './utils/constants';

// --- IMPORTS DE PANTALLAS ---
import RegisterScreen from './screens/register/RegisterScreen';
import SelectionScreen from './screens/selection/SelectionScreen';
import PageLabel from './components/PageLabel';
// import BattleScreen from './screens/battle/BattleScreen'; // (Próximamente)

function App() {
    // Fases / Etapas de la aplicación
    const [phase, setPhase] = useState(GAME_PHASES.REGISTER);

    // Datos de los jugadores (Nombres y Avatares)
    const [players, setPlayers] = useState(null);

    // Datos de los equipos (Los 6 Pokémon de cada uno)
    const [teams, setTeams] = useState(null);

    // 1. Fin del Registro -> Pantalla Selección
    const handleRegisterComplete = (playerData) => {
        console.log("Registro completado:", playerData);
        setPlayers(playerData);
        setPhase(GAME_PHASES.SELECTION);
    };

    // 2. Fin de Selección -> Pantalla Batalla
    const handleBattleStart = (teamData) => {
        console.log("Equipos listos para el combate:", teamData);
        setTeams(teamData);
        setPhase(GAME_PHASES.BATTLE);
    };

    const handleReset = () => {
        setPhase(GAME_PHASES.REGISTER);

        
    };

    return (
        <div className="app-layout" style={{backgroundImage: "url('background_register.png')"}}>

            {/* FASE 1: REGISTRO */}
            {phase === GAME_PHASES.REGISTER && (
                <RegisterScreen onComplete={handleRegisterComplete} />
            )}

            {/* FASE 2: SELECCIÓN DE EQUIPO */}
            {phase === GAME_PHASES.SELECTION && (
                <div style={{marginTop: 20}}>
                    <PageLabel
                    title={"--- CHOOSE YOUR TEAM ---"}
                    subtitle={"First Generation Pokedex "}
                    />
                    <SelectionScreen
                        players={players}
                        onBattleStart={handleBattleStart}
                        onReset={handleReset}
                    />
                </div>
            )}

            {/* FASE 3: BATALLA (Placeholder por ahora) */}
            {phase === GAME_PHASES.BATTLE && (
                <div style={{ textAlign: 'center', marginTop: 50, color: 'white' }}>
                    <h1>BATTLE TIME</h1>
                    <p>ToDo: Implementate BattleScreen and GameLogic</p>
                    {/* Aquí irá <BattleScreen players={players} teams={teams} /> */}
                </div>
            )}

        </div>
    );
}

export default App;