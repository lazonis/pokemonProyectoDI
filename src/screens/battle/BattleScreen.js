import React from 'react';
import { useBattleLogic } from './hooks/useBattleLogic';
import BattleArena from './components/BattleArena';
import TeamDisplay from '../../components/TeamDisplay';
import ActionButton from '../../components/ActionButton'; // Reutilizamos tu botón
import './BattleScreen.css';

// Recibimos 'onBack' de App.js
const BattleScreen = ({ players, teams, onBack, onReset }) => {
    const {
        loading,
        p1Pokemon, p2Pokemon,
        p1ActiveIx, p2ActiveIx, // Necesitamos saber quién está activo para marcarlo en el grid
        turn,
        battleLogs,
        winner,
        handleAttack,
        handleSwitch // Nueva función
    } = useBattleLogic(teams.p1, teams.p2);

    if (loading || !p1Pokemon || !p2Pokemon) {
        return <div className="loading-msg">Loading battle...</div>;
    }

    // --- LOGICA UI: ¿Cuándo puede interactuar un jugador? ---
    // J1 puede cambiar si es su turno O si le obligan a cambiar
    const canP1Interact = turn === 'p1' || turn === 'p1_forced_switch';
    // J2 puede cambiar si es su turno O si le obligan a cambiar
    const canP2Interact = turn === 'p2' || turn === 'p2_forced_switch';

    return (
        <div className="battle-screen-layout">
            
            {/* --- BOTÓN ATRÁS FLOTANTE (Absoluto o en Grid) --- */}
            {/* Lo pongo aquí para que aparezca arriba a la izquierda visualmente */}
            

            {/* --- COLUMNA IZQUIERDA: EQUIPO J1 --- */}
            <div className={`side-column ${canP1Interact ? 'active-side' : 'inactive-side'}`}>
             
                <ActionButton 
                    label="⬅ GO BACK SELECTION" 
                    onClick={onBack} 
                    variant="secondary"
                />
                
                <TeamDisplay 
                    player={players?.p1} 
                    team={teams.p1} 
                    isActive={canP1Interact} 
                    // Pasamos el índice activo para que se marque visualmente distinto
                    activeIndex={p1ActiveIx} 
                    // Al hacer click, intentamos cambiar de pokemon
                    onSlotClick={(index) => {
                        if (canP1Interact) handleSwitch('p1', index);
                    }}
                    onPanelClick={() => {}} 
                />
            </div>

            {/* --- COLUMNA CENTRAL --- */}
            <div className="center-column">
                <BattleArena 
                    p1Pokemon={p1Pokemon}
                    p2Pokemon={p2Pokemon}
                    battleLogs={battleLogs}
                    onAttack={handleAttack}
                    turn={turn} // Pasamos el turno tal cual ('p1', 'p2_forced_switch', etc)
                    winner={winner}
                    p1Name={players?.p1?.name || "J1"}
                    p2Name={players?.p2?.name || "J2"}
                />
               
            
            </div>

            {/* --- COLUMNA DERECHA: EQUIPO J2 --- */}
            <div className={`side-column ${canP2Interact ? 'active-side' : 'inactive-side'}`}>
            <ActionButton
                    label="⬅ RESET GAME"
                    onClick={onReset}
                    variant="secondary" /* O usa 'primary' si prefieres rojo */
                />
                <TeamDisplay 
                    player={players?.p2} 
                    team={teams.p2} 
                    isActive={canP2Interact}
                    activeIndex={p2ActiveIx}
                    onSlotClick={(index) => {
                        if (canP2Interact) handleSwitch('p2', index);
                    }}
                    onPanelClick={() => {}} 
                />
            </div>
        </div>
    );
};

export default BattleScreen;