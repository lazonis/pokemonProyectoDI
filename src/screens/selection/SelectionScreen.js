import React, { useState } from 'react';
import './SelectionScreen.css';
import { CONFIG } from '../../utils/constants';

// --- HOOKS ---
import { usePokemonList } from './hooks/usePokemonList';

// --- COMPONENTES GLOBALES ---
import PageLabel from '../../components/PageLabel';
import ActionButton from '../../components/ActionButton';
import TeamDisplay from '../../components/TeamDisplay'; // <--- TUS LATERALES

// --- COMPONENTES LOCALES ---
import Pagination from './Pagination';
import PokemonBox from './PokemonBox';
import PokemonDetail from './PokemonDetail';

function SelectionScreen({ players, onBattleStart }) {
    // ESTADOS DEL JUEGO
    const [equipoP1, setEquipoP1] = useState([]);
    const [equipoP2, setEquipoP2] = useState([]);
    const [jugadorActivo, setJugadorActivo] = useState(1); // 1 o 2
    
    // ESTADO DE INTERFAZ
    const [pokemonVisto, setPokemonVisto] = useState(null); // Para el Modal

    // CARGA DE DATOS (Hook limpio)
    const { 
        pokemons, loading, page, setPage, totalPages, getPaginationGroup 
    } = usePokemonList();

    // --- LÓGICA: AÑADIR POKEMON ---
    const handleConfirmar = (pokemon) => {
        if (!pokemon) return;

        // Función auxiliar para añadir y pasar turno
        const agregarAlEquipo = (equipo, setEquipo, turnoSiguiente) => {
            if (equipo.length < CONFIG.MAX_TEAM_SIZE) {
                setEquipo([...equipo, pokemon]);
                // Solo cambiamos de turno si el otro jugador aún tiene hueco
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
        
        setPokemonVisto(null); // Cerrar modal
    };

    // --- LÓGICA: QUITAR POKEMON ---
    const handleRemove = (playerNum, index) => {
        if (playerNum === 1) {
            const nuevo = [...equipoP1];
            nuevo.splice(index, 1);
            setEquipoP1(nuevo);
            setJugadorActivo(1); // Recupera el turno quien borra
        } else {
            const nuevo = [...equipoP2];
            nuevo.splice(index, 1);
            setEquipoP2(nuevo);
            setJugadorActivo(2); // Recupera el turno quien borra
        }
    };

    // Helper: ¿Este pokemon ya está cogido?
    const isOwned = (pokeId) => {
        return equipoP1.some(p => p.id === pokeId) || equipoP2.some(p => p.id === pokeId);
    };

    // ¿Estamos listos para pelear?
    const isReady = equipoP1.length === CONFIG.MAX_TEAM_SIZE && 
                    equipoP2.length === CONFIG.MAX_TEAM_SIZE;

    return (
        <div className="team-builder-layout" style={{backgroundImage: "url('pc_container_bg.png')",
        backgroundSize: 'cover',      // Estira la imagen para cubrir todo el div
    backgroundRepeat: 'no-repeat', // Evita el efecto mosaico
    backgroundPosition: 'center'}}
        >

            {/* 2. LATERAL IZQUIERDO (JUGADOR 1) */}
            <TeamDisplay 
                className="sidebar-team" // Para que se comporte como celda del grid
                player={players?.p1}
                team={equipoP1}
                isActive={jugadorActivo === 1}
                onSlotClick={(idx) => handleRemove(1, idx)}
            />

            {/* 3. COLUMNA CENTRAL (PC BOX) */}
            <div className="main-pc-container" style={{backgroundImage: "url('selection_layout.png')"}} >
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
                    onSelect={setPokemonVisto} // Abre el modal
                />

                {/* Botón de Acción (Solo aparece si están listos) */}
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

            {/* 4. LATERAL DERECHO (JUGADOR 2) */}
            <TeamDisplay 
                className="sidebar-team"
                player={players?.p2}
                team={equipoP2}
                isActive={jugadorActivo === 2}
                onSlotClick={(idx) => handleRemove(2, idx)}
            />

            {/* 5. MODAL FLOTANTE (GAMEBOY) */}
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