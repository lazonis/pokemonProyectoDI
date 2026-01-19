import React from 'react';
import { useBattleLogic } from './hooks/useBattleLogic';
import BattleArena from './components/BattleArena';
import TeamDisplay from '../../components/TeamDisplay'; // Reutilizamos el componente lateral
import './BattleScreen.css';

const BattleScreen = ({ players, teams }) => {
    const {
        loading,
        p1Pokemon, // Pokemon activo J1
        p2Pokemon, // Pokemon activo J2
        turn,      // 'p1' | 'p2'
        battleLogs,
        winner,
        handleAttack
    } = useBattleLogic(teams.p1, teams.p2);

    if (loading || !p1Pokemon || !p2Pokemon) {
        return <div className="loading-msg">Preparando el estadio...</div>;
    }

    return (
        <div className="battle-layout-classic">
            
            {/* --- COLUMNA IZQUIERDA: EQUIPO J1 --- */}
            <div className="side-panel left">
                <TeamDisplay 
                    player={players?.p1} 
                    team={teams.p1} 
                    isActive={turn === 'p1'} // Se ilumina si es su turno
                    onPanelClick={() => {}} // Desactivamos clicks
                    onSlotClick={() => {}} 
                />
            </div>

            {/* --- COLUMNA CENTRAL: LA BATALLA --- */}
            <div className="center-stage">
                <BattleArena 
                    p1Pokemon={p1Pokemon}
                    p2Pokemon={p2Pokemon}
                    battleLogs={battleLogs}
                    onAttack={(move) => handleAttack(move, turn)} // Pasa el turno actual ('p1' o 'p2')
                    turn={turn}
                    winner={winner}
                    p1Name={players?.p1?.name || "J1"}
                    p2Name={players?.p2?.name || "J2"}
                />
            </div>

            {/* --- COLUMNA DERECHA: EQUIPO J2 --- */}
            <div className="side-panel right">
                <TeamDisplay 
                    player={players?.p2} 
                    team={teams.p2} 
                    isActive={turn === 'p2'} // Se ilumina si es su turno
                    onPanelClick={() => {}}
                    onSlotClick={() => {}} 
                />
            </div>
        </div>
    );
};

export default BattleScreen;