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

//onReset por si queremos volver a la pantalla de registro
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
    } = usePokemonList(); //hook personalizado con callback + pagination logic 

    //Función personal que permite confirmar que añadimos pokemons a nuestro equipo
    //Y gestiona al mismo tiempo la alternancia de turnos entre jugadores
    const handleConfirmar = (pokemon) => {
        //(Guard Clause)
        if (!pokemon) return;

        //Función que gestiona el acoplamiento de un pokemon a determinado equipo
        const agregarAlEquipo = (equipo, setEquipo, turnoSiguiente) => {
            if (equipo.length < CONFIG.MAX_TEAM_SIZE) {
                setEquipo([...equipo, pokemon]); //Añdimos el nuevo pokemon seleccionado al final del array del equipo
                //los "..." se refiere a posicionar el nuevo pokemon al final de la lista

                //Gestionamos -> cuando un equipo esté lleno, no se alterna de turno
                const elOtroEquipo = turnoSiguiente === 1 ? equipoP1 : equipoP2;
                if (elOtroEquipo.length < CONFIG.MAX_TEAM_SIZE) {
                    setJugadorActivo(turnoSiguiente);
                }
            }
        };
        //Lógica para asegurar la alternancia después de que cada uno elija un pokemon
        //Si el jugador activo es 1
        if (jugadorActivo === 1) {
            //equipo actual j1, actualizamos su equipo, y cambiamos de turno
            agregarAlEquipo(equipoP1, setEquipoP1, 2);
        } else {
            //si no, al revés
            agregarAlEquipo(equipoP2, setEquipoP2, 1);
        }
        //cuando lo agregas al equipo, el detalle se va
        setPokemonVisto(null);
    };

    //Función personal para borrar pokemons de un equipo
    const handleRemove = (playerNum, index) => {
        if (playerNum === 1) {
            const nuevo = [...equipoP1];
            nuevo.splice(index, 1); //quita el pokemon del array equipo (splice)
            setEquipoP1(nuevo);
        } else {
            const nuevo = [...equipoP2];
            nuevo.splice(index, 1);
            setEquipoP2(nuevo);
        }
        // Al borrar, recuperas el turno automáticamente
        setJugadorActivo(playerNum);
    };

    //lógica para evitar duplicados -> some.() = recorre array, si uno coincide (id) 
    //lo comprueba en los dos equipos
    const isOwned = (pokeId) => {
        return equipoP1.some(p => p.id === pokeId) || equipoP2.some(p => p.id === pokeId);
    };

    //Función que controla cuándo se puede iniciar la pelea
    //si ninguno de los dos tiene un solo pokemon, se mantiene en false
    const isReady = equipoP1.length === CONFIG.MAX_TEAM_SIZE &&
        equipoP2.length === CONFIG.MAX_TEAM_SIZE;

    return (
        <div>
            {/* TÍTULO DE LA PÁGINA */}
            <PageLabel
                title={"--- CHOOSE YOUR TEAM ---"}
                subtitle={"First Generation Pokedex "}
            />
            <div className="team-builder-layout">
                {/* BOTÓN NAVEGACIÓN, VOLVER A INICIO*/}
                <ActionButton
                    label="⬅ GO BACK REGISTER"
                    onClick={onReset}
                    variant="secondary" /* O usa 'primary' si prefieres rojo */
                />
                {/* BOTÓN INICIAR BATALLA (onBattleStart) -> devuelve el onComplete para cambiar de fase en App.js*/}
                <ActionButton
                    label="START BATTLE!"
                    variant="primary"
                    onClick={() => onBattleStart({ p1: equipoP1, p2: equipoP2 })}
                />

                {/* 2. LATERAL IZQUIERDO */}
                {/* COMPONENTE DE EQUIPO COMPLETO (jugador, equipo, turno, control de cambio de turno)*/}
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
                    {/* COMPONENTE DE PAGINACIÓN QUE RECIBE DATOS DEL HOOK usePokemonList */}
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                        getPaginationGroup={getPaginationGroup}
                    />
                    {/* CAJA POKEMON CON TODA LA LISTA RECIBIDA DE LA API */}
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
                {/* LO QUE SE VE AL CLICAR UN POKEMON*/}
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