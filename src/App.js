// App.js - Componente principal de la aplicación (React Functional Component)
// En React, los componentes funcionales son funciones que devuelven JSX (HTML-like).
// Este componente maneja el estado global del juego usando el hook useState.
// Los hooks permiten usar estado y efectos en componentes funcionales (antes solo en clases).

import React, { useState } from 'react'; // Importamos useState para manejar estado
import './App.css';
import { GAME_PHASES } from './utils/constants';

// --- IMPORTS DE PANTALLAS ---
// En React, podemos importar componentes de otros archivos para reutilizarlos
import RegisterScreen from './screens/register/RegisterScreen'; // Pantalla de registro de jugadores
import SelectionScreen from './screens/selection/SelectionScreen'; // Pantalla de selección de equipos
import PageLabel from './components/PageLabel'; // Componente para etiquetas de página
import BattleScreen from './screens/battle/BattleScreen'; // Pantalla de batalla

function App() { // Componente funcional principal
    // useState: Hook que crea estado local. Devuelve [valor, función para actualizar valor]
    // Estado inicial: fase REGISTER, players y teams null
    const [phase, setPhase] = useState(GAME_PHASES.REGISTER);
    const [players, setPlayers] = useState(null);
    const [teams, setTeams] = useState(null);

    // Función propia definida para controlar eventos: se pasa como prop a componentes hijos abajo en el return
    // Cuando RegisterScreen llama onComplete, actualiza el estado -> Fase selección
    const handleRegisterComplete = (playerData) => {
        setPlayers(playerData); // Actualiza estado y datos de jugadores
        setPhase(GAME_PHASES.SELECTION); // Renderiza la siguiente pantalla
    };

    // Similar: maneja el inicio de batalla
    const handleBattleStart = (teamData) => {
        setTeams(teamData); //Pokemons de cada jugador
        setPhase(GAME_PHASES.BATTLE);
    };

    // Función para volver atrás: solo cambia fase, mantiene estado
    const handleBackToSelection = () => {
        setPhase(GAME_PHASES.SELECTION);
    };

    // Función para resetear: volvemos a pantalla de inicio
    const handleReset = () => {
        setPlayers(null);
        setTeams(null);
        setPhase(GAME_PHASES.REGISTER);
    };

    // El return contiene JSX: sintaxis para escribir HTML en JavaScript
    // Renderiza estos JSX a través del DOM (objetos en la memoria del navegador)
    return (
        <div className="app-layout" style={{ backgroundImage: "url('background_register.png')" }}>
            {/* Contenedor principal */}
            <div className="game-viewport">

                {/*FASE DE REGISTRO -> COMPONENTE PANTALLA*/}
                {phase === GAME_PHASES.REGISTER && (
                    <RegisterScreen onComplete={handleRegisterComplete} />
                )}
                {/*FASE DE SELECCIÓN -> COMPONENTE PANTALLA*/}
                {phase === GAME_PHASES.SELECTION && (
                    <SelectionScreen
                        players={players} // Props: pasan datos del padre al hijo
                        onBattleStart={handleBattleStart}
                        onReset={handleReset}
                    />
                )}
                {/*FASE DE BATALLA  -> COMPONENTE PANTALLA*/}
                {phase === GAME_PHASES.BATTLE && (
                    <div>
                        <PageLabel
                            title={"--- CHOOSE YOUR TEAM ---"}
                            subtitle={"First Generation Pokedex "}
                        />
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