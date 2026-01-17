import React, { useState } from 'react';
import './App.css';
import { GAME_PHASES } from './utils/constants';

// --- IMPORTS DE PANTALLAS ---
import RegisterScreen from './screens/register/RegisterScreen';
import SelectionScreen from './screens/selection/SelectionScreen';
// import BattleScreen from './screens/battle/BattleScreen'; // (Próximamente)

function App() {
  const [phase, setPhase] = useState(GAME_PHASES.REGISTER);
  
  // Datos de los jugadores (Nombres y Avatares)
  const [players, setPlayers] = useState(null);
  
  // Datos de los equipos (Los 6 Pokémon de cada uno)
  const [teams, setTeams] = useState(null);

  // 1. Fin del Registro -> Vamos a Selección
  const handleRegisterComplete = (playerData) => {
      console.log("Registro completado:", playerData);
      setPlayers(playerData);
      setPhase(GAME_PHASES.SELECTION);
  };

  // 2. Fin de Selección -> Vamos a Batalla
  const handleBattleStart = (teamData) => {
      console.log("Equipos listos para el combate:", teamData);
      setTeams(teamData);
      setPhase(GAME_PHASES.BATTLE);
  };

  return (
    <div className="app-layout">
      
      {/* FASE 1: REGISTRO */}
      {phase === GAME_PHASES.REGISTER && (
          <RegisterScreen onComplete={handleRegisterComplete} />
      )}

      {/* FASE 2: SELECCIÓN DE EQUIPO */}
      {phase === GAME_PHASES.SELECTION && (
          <SelectionScreen 
              players={players} 
              onBattleStart={handleBattleStart} 
          />
      )}
      
      {/* FASE 3: BATALLA (Placeholder por ahora) */}
      {phase === GAME_PHASES.BATTLE && (
          <div style={{textAlign: 'center', marginTop: 50, color: 'white'}}>
              <h1>⚔️ ¡ZONA DE BATALLA! ⚔️</h1>
              <p>Próximamente...</p>
              {/* Aquí irá <BattleScreen players={players} teams={teams} /> */}
          </div>
      )}
      
    </div>
  );
}

export default App;