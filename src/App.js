import React, { useState } from 'react';
import './App.css';
import { GAME_PHASES } from './utils/constants';

// --- IMPORT CORRECTO SEGÚN TU ÁRBOL ---
import RegisterScreen from './screens/register/RegisterScreen';

function App() {
  const [phase, setPhase] = useState(GAME_PHASES.REGISTER);
  const [players, setPlayers] = useState(null);

  const handleRegisterComplete = (data) => {
      console.log("Datos recibidos:", data);
      setPlayers(data);
      setPhase(GAME_PHASES.SELECTION);
  };

  return (
    <div className="app-layout">
      
      {/* 1. REGISTRO */}
      {phase === GAME_PHASES.REGISTER && (
          <RegisterScreen onComplete={handleRegisterComplete} />
      )}

      {/* 2. SELECCIÓN (Placeholder para probar que funciona el paso anterior) */}
      {phase === GAME_PHASES.SELECTION && (
          <div style={{textAlign: 'center', marginTop: 50}}>
              <h1>¡SELECCIÓN DE EQUIPO!</h1>
              <p>Hola {players?.p1?.name} y {players?.p2?.name}</p>
          </div>
      )}
      
    </div>
  );
}

export default App;