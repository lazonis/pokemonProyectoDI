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

    //ESTADOS NECESARIOS -> EquipoJ1/EquipoJ2 -> Set del turno Actual
    const [equipoP1, setEquipoP1] = useState([]);
    const [equipoP2, setEquipoP2] = useState([]);
    const [jugadorActivo, setJugadorActivo] = useState(1);
    //Pokemon elegido para mostrar el Detalle
    const [pokemonVisto, setPokemonVisto] = useState(null);

    //Estado que recibe los datos después de llamar a la API
    const {
        pokemons, loading, page, setPage, totalPages, getPaginationGroup
    } = usePokemonList();

    //Manejador personal que permite confirmar que añadimos pokemons a nuestro equipo
    //Y gestiona al mismo tiempo la alternancia de turnos entre jugadores
    const handleConfirmar = (pokemon) => {
        //(Guard Clause)
        if (!pokemon) return;
        
        //Función que gestiona el acoplamiento de un pokemon a determinado equipo
        const agregarAlEquipo = (equipo, setEquipo, turnoSiguiente) => {
            if (equipo.length < CONFIG.MAX_TEAM_SIZE) {
                setEquipo([...equipo, pokemon]); //Añdimos el nuevo pokemon seleccionado al final del array del equipo

                //Gestionamos -> cuando un equipo esté lleno, no se alterna de turno
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

    //Manejador personal 
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
        <div>
            <PageLabel
                title={"--- CHOOSE YOUR TEAM ---"}
                subtitle={"First Generation Pokedex "}
            />
            <div className="team-builder-layout">
                <ActionButton
                    label="⬅ GO BACK REGISTER"
                    onClick={onReset}
                    variant="secondary" /* O usa 'primary' si prefieres rojo */
                />

                <ActionButton
                            label="START BATTLE!"
                            variant="primary"
                            onClick={() => onBattleStart({ p1: equipoP1, p2: equipoP2 })}
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
                <div className="main-pc-container" style={{ backgroundImage: "url('selection_layout.png')", display: 'flex', flexDirection: 'column' }}>
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
        </div>
    );
}

export default SelectionScreen;