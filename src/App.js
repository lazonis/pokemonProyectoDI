import React, { useState } from 'react';
import './App.css';
import { GAME_PHASES } from './utils/constants';

// --- IMPORTS DE PANTALLAS ---
import RegisterScreen from './screens/register/RegisterScreen';
import SelectionScreen from './screens/selection/SelectionScreen';
import PageLabel from './components/PageLabel';
import BattleScreen from './screens/battle/BattleScreen';

function App() {
    const [phase, setPhase] = useState(GAME_PHASES.REGISTER);
    const [players, setPlayers] = useState(null);
    const [teams, setTeams] = useState(null);

    const handleRegisterComplete = (playerData) => {
        setPlayers(playerData);
        setPhase(GAME_PHASES.SELECTION);
    };

    const handleBattleStart = (teamData) => {
        setTeams(teamData);
        setPhase(GAME_PHASES.BATTLE);
    };

    // --- NUEVO: Volver a selección sin borrar jugadores ---
    const handleBackToSelection = () => {
        // Solo cambiamos la fase, 'players' se mantiene en memoria
        setPhase(GAME_PHASES.SELECTION);
    };

    const handleReset = () => {
        setPlayers(null); // Aquí sí borramos todo
        setTeams(null);
        setPhase(GAME_PHASES.REGISTER);
    };

    return (
        <div className="app-layout" style={{ backgroundImage: "url('background_register.png')" }}>

            <div className="game-viewport">
                {/* FASE 1: REGISTRO */}
                {phase === GAME_PHASES.REGISTER && (
                    <RegisterScreen onComplete={handleRegisterComplete} />
                )}

                {/* FASE 2: SELECCIÓN */}
                {phase === GAME_PHASES.SELECTION && (
                    <SelectionScreen
                        players={players}
                        onBattleStart={handleBattleStart}
                        onReset={handleReset}
                    />
                )}

                {/* FASE 3: BATALLA */}
                {phase === GAME_PHASES.BATTLE && (
                    <div style={{ width: '100%', height: '100%' }}>
                        <PageLabel
                            title={"--- CHOOSE YOUR TEAM ---"}
                            subtitle={"First Generation Pokedex "}
                        />
                        
                        {/* Pasamos la nueva función onBack */}
                        <BattleScreen
                            players={players}
                            teams={teams}
                            onBack={handleBackToSelection}
                            onReset={handleReset}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;