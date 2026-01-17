import './PokemonCard.css';
import Types from './Types';

function PokemonCard({ id, name, image, hp, maxHp, type }) {

    const formattedId = String(id).padStart(3, '0')
    // Calculamos el porcentaje de vida para la barra (matemática simple)
    // Si maxHp es 0 (para evitar errores), ponemos 0.
    const hpPercentage = maxHp > 0 ? (hp / maxHp) * 100 : 0;

    return (
        <div className="pokedex-entry">
            {/* Cabecera con Número de Índice */}
            <div className="pokedex-header">
                <span className="pokedex-number">No.{formattedId}</span>
            </div>

            {/* Imagen enmarcada estilo GameBoy */}
            <div className="sprite-container">
                <img src={image} alt={name} className="pokedex-sprite" />
            </div>

            {/* Panel de Datos */}
            <div className="pokedex-info">
                <h3 className="pokedex-name">{name}</h3>

                <div className="pokedex-stats">
                    {/* 2. Usamos tu componente. 
                        Pasamos el tipo en minúscula, tu componente ya maneja 
                        el color y el uppercase con CSS */}
                    <div className="type-container">
                        <Types type={type} />
                    </div>
                    <div className="hp-container">
                        <div className="hp-label">HP {hp}/{maxHp}</div>
                        <div className="hp-bar-bg">
                            <div 
                                className="hp-bar-fill" 
                                style={{ width: `${hpPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PokemonCard;