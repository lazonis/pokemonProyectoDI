import React, { useState } from 'react';
import './SelectionScreen.css';
import { CONFIG } from '../../utils/constants';

import { usePokemonList } from './hooks/usePokemonList';

import PageLabel from '../../components/PageLabel';
import ActionButton from '../../components/ActionButton';
import TeamDisplay from '../../components/TeamDisplay'; 

import Pagination from './Pagination';
import PokemonBox from './PokemonBox';
import PokemonDetail from './PokemonDetail';

// AÑADIDO: onReset en las props
function SelectionScreen({ players, onBattleStart, onReset }) {
    const [equipoP1, setEquipoP1] = useState([]);
    const [equipoP2, setEquipoP2] = useState([]);
    const [jugadorActivo, setJugadorActivo] = useState(1); 
    const [pokemonVisto, setPokemonVisto] = useState(null); 

    const { 
        pokemons, loading, page, setPage, totalPages, getPaginationGroup 
    } = usePokemonList();

    const handleConfirmar = (pokemon) => {
        if (!pokemon) return;

        const agregarAlEquipo = (equipo, setEquipo, turnoSiguiente) => {
            if (equipo.length < CONFIG.MAX_TEAM_SIZE) {
                setEquipo([...equipo, pokemon]);
                const elOtroEquipo = turnoSiguiente === 1 ? equipoP1 : equipoP2;
                if (elOtroEquipo.length < CONFIG.MAX_TEAM_SIZE) {
                    setJugadorActivo(turnoSiguiente);
                }
            }
        };

        if (jugadorActivo === 1) {
            agregarAlEquipo(equipoP1, setEquipoP1, 2);
        } else {
            agregarAlEquipo(equipoP2, setEquipoP2, 1);
        }
        setPokemonVisto(null); 
    };

    const handleRemove = (playerNum, index) => {
        if (playerNum === 1) {
            const nuevo = [...equipoP1];
            nuevo.splice(index, 1);
            setEquipoP1(nuevo);
        } else {
            const nuevo = [...equipoP2];
            nuevo.splice(index, 1);
            setEquipoP2(nuevo);
        }
        // Al borrar, recuperas el turno automáticamente
        setJugadorActivo(playerNum);
    };

    const isOwned = (pokeId) => {
        return equipoP1.some(p => p.id === pokeId) || equipoP2.some(p => p.id === pokeId);
    };

    const isReady = equipoP1.length === CONFIG.MAX_TEAM_SIZE && 
                    equipoP2.length === CONFIG.MAX_TEAM_SIZE;

    return (
        <div className="team-builder-layout">
        
                    <ActionButton 
                        label="⬅ SALIR" 
                        onClick={onReset} 
                        variant="secondary" /* O usa 'primary' si prefieres rojo */
                    />
                

            {/* 2. LATERAL IZQUIERDO */}
            <TeamDisplay 
                className="sidebar-team"
                player={players?.p1}
                team={equipoP1}
                isActive={jugadorActivo === 1}
                onSlotClick={(idx) => handleRemove(1, idx)}
                // NUEVO: Click para cambiar turno
                onPanelClick={() => setJugadorActivo(1)}
            />

            {/* 3. CENTRO (PC) */}
            <div className="main-pc-container" style={{backgroundImage: "url('selection_layout.png')", display: 'flex', flexDirection: 'column'}}>
                <Pagination 
                    page={page} 
                    totalPages={totalPages} 
                    setPage={setPage} 
                    getPaginationGroup={getPaginationGroup}
                />

                <PokemonBox 
                    pokemons={pokemons} 
                    loading={loading} 
                    isOwned={isOwned} 
                    onSelect={setPokemonVisto} 
                />

                {/* BOTÓN BATALLA: SIEMPRE ABAJO */}
                <div style={{ marginTop: 'auto', paddingTop: '10px', textAlign: 'center', minHeight: '50px' }}>
                    {isReady ? (
                        <ActionButton 
                            label="¡A LA BATALLA!" 
                            variant="primary" 
                            onClick={() => onBattleStart({ p1: equipoP1, p2: equipoP2 })}
                        />
                    ) : (
                        <span style={{ color: '#ccc', fontStyle: 'italic', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px' }}>
                            ¡Completad ambos equipos para luchar!
                        </span>
                    )}
                </div>
            </div>

            {/* 4. LATERAL DERECHO */}
            <TeamDisplay 
                className="sidebar-team"
                player={players?.p2}
                team={equipoP2}
                isActive={jugadorActivo === 2}
                onSlotClick={(idx) => handleRemove(2, idx)}
                // NUEVO: Click para cambiar turno
                onPanelClick={() => setJugadorActivo(2)}
            />

            {/* MODAL */}
            <PokemonDetail 
                pokemon={pokemonVisto}
                isTurnP1={jugadorActivo === 1}
                onClose={() => setPokemonVisto(null)}
                onConfirm={handleConfirmar}
            />
        </div>
    );
}

export default SelectionScreen;