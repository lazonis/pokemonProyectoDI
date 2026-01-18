import React, { useState } from 'react';
import './SelectionScreen.css';
import { CONFIG } from '../../utils/constants';

// Hooks y Componentes
import { usePokemonList } from './hooks/usePokemonList';
import PageLabel from '../../components/PageLabel';
import Pagination from './Pagination';
import PokemonBox from './PokemonBox';
import PokemonDetail from './PokemonDetail';
import ActionButton from '../../components/ActionButton';

function SelectionScreen({ players, onBattleStart }) {
    // ESTADOS LOCALES DE SELECCIÓN
    const [equipoP1, setEquipoP1] = useState([]);
    const [equipoP2, setEquipoP2] = useState([]);
    const [jugadorActivo, setJugadorActivo] = useState(1);
    const [pokemonVisto, setPokemonVisto] = useState(null);

    // USAMOS EL HOOK PERSONALIZADO
    const {
        pokemons, loading, page, setPage, totalPages, getPaginationGroup
    } = usePokemonList();

    // --- LÓGICA DE SELECCIÓN ---
    const handleConfirmar = () => {
        if (!pokemonVisto) return;

        if (jugadorActivo === 1) {
            if (equipoP1.length < CONFIG.MAX_TEAM_SIZE) {
                setEquipoP1([...equipoP1, pokemonVisto]);
                // Pasar turno a J2 si tiene hueco
                if (equipoP2.length < 6) setJugadorActivo(2);
            }
        } else {
            if (equipoP2.length < 6) {
                setEquipoP2([...equipoP2, pokemonVisto]);
                // Pasar turno a J1 si tiene hueco
                if (equipoP1.length < 6) setJugadorActivo(1);
            }
        }
        setPokemonVisto(null); // Cerrar modal
    };

    const handleRemove = (jugador, index) => {
        if (jugador === 1) {
            const nuevo = [...equipoP1];
            nuevo.splice(index, 1);
            setEquipoP1(nuevo);
            setJugadorActivo(1);
        } else {
            const nuevo = [...equipoP2];
            nuevo.splice(index, 1);
            setEquipoP2(nuevo);
            setJugadorActivo(2);
        }
    };

    // Helper visual: ¿Ya lo tiene alguien?
    const isOwned = (pokeId) => {
        return equipoP1.some(p => p.id === pokeId) || equipoP2.some(p => p.id === pokeId);
    };

    const isReady = equipoP1.length === 6 && equipoP2.length === 6;

    // --- RENDERIZADO DEL SIDEBAR (Reutilizable) ---
    const renderSidebar = (idJugador, equipo, nombre) => {
        const esMiTurno = jugadorActivo === idJugador && equipo.length < 6;
        return (
            <div
                className={`sidebar-team ${esMiTurno ? 'active-turn' : ''}`}
                onClick={() => equipo.length < 6 && setJugadorActivo(idJugador)}
            >
                <h3>{nombre} </h3>
                <div className="team-slots-container">
                    {equipo.map((poke, i) => (
                        <div
                            key={`${idJugador}-${poke.id}`}
                            className="sidebar-slot filled"
                            onClick={() => handleRemove(idJugador, i)}
                            title="Click para quitar"
                        >
                            <img src={poke.image} alt={poke.name} />
                            <span>{poke.name}</span>
                        </div>
                    ))}
                    {/* Rellenar huecos vacíos */}
                    {[...Array(6 - equipo.length)].map((_, i) => (
                        <div key={`empty-${i}`} className="sidebar-slot empty">Vacío</div>
                    ))}
                </div>
            </div>
        );
    };

    return (


                    
        <div className="team-builder-layout">

            


            {/* IZQUIERDA: JUGADOR 1 */}
            {renderSidebar(1, equipoP1, players?.p1?.name || "JUGADOR 1")}

            {/* CENTRO: PC BOX */}
            <div className="main-pc-container">

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

                {/* BOTÓN FINAL */}
                {isReady && (
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <ActionButton
                            label="¡A LA BATALLA!"
                            variant="primary"
                            onClick={() => onBattleStart({ p1: equipoP1, p2: equipoP2 })}
                        />
                    </div>
                )}
            </div>

            {/* DERECHA: JUGADOR 2 */}
            {renderSidebar(2, equipoP2, players?.p2?.name || "JUGADOR 2")}

            {/* VENTANA FLOTANTE (MODAL GAMEBOY) */}

            <PokemonDetail
                pokemon={pokemonVisto}
                isTurnP1={jugadorActivo === 1}
                onClose={() => setPokemonVisto(null)} // <--- Asegúrate que se llame onClose
                onConfirm={handleConfirmar}
            />
        </div>
    );
}

export default SelectionScreen;