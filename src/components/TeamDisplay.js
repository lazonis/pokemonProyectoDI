import React from 'react';
import './PokemonList.css'; // Usamos los mismos estilos por ahora

// 
// componente reutilizable en cualquier parte de la pantalla
function TeamDisplay({ 
    playerName, 
    trainerSprite, 
    team, 
    isActive, 
    onActivate 
}) {
    
    // Máximo de pokemons permitidos
    const MAX_TEAM_SIZE = 6;
    const slotsVacios = MAX_TEAM_SIZE - team.length;

    return (
        
        <div 
            className={`team-panel ${isActive ? 'active-turn' : ''}`}
            onClick={onActivate}
        >
            {/* CABECERA DEL ENTRENADOR */}
            <div className="trainer-header">
                <div className="trainer-avatar">
                    <img 
                        src={trainerSprite} 
                        alt={`Entrenador ${playerName}`} 
                    />
                </div>
                <div className="trainer-info">
                    <h3>{playerName}</h3>
                    <small>{isActive ? 'TU TURNO' : 'En espera'}</small>
                </div>
            </div>

            {/* GRID DEL EQUIPO */}
            <div className="team-grid-mini">
                {team.map((poke) => (
                    <div key={poke.id} className="team-slot filled">
                        <img src={poke.image} alt={poke.name}/>
                        <span>{poke.name}</span>
                    </div>
                ))}

                {/* HUECOS VACÍOS */}
                {[...Array(slotsVacios)].map((_, i) => (
                     <div key={`empty-${i}`} className="team-slot empty"></div>
                ))}
            </div>
        </div>
    );
}

export default TeamDisplay;