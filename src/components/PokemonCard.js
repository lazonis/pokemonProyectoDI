import './PokemonCard.css';
import Types from './Types';

function PokemonCard({ name, image, hp, maxHp, type }) {
    
    // Calculamos el porcentaje de vida para la barra (matemática simple)
    // Si maxHp es 0 (para evitar errores), ponemos 0.
    const hpPercentage = maxHp > 0 ? (hp / maxHp) * 100 : 0;

    return (
        /* Usamos backticks `` para mezclar texto y variables */
        /* La clase será algo como "poke-card fire" o "poke-card water" */
        <div className={`poke-card ${type}`}>
            
            <div className="img-container">
                <img src={image} alt={name} className="poke-sprite" />
            </div>

            <div className="poke-info">
                <h3 className="poke-name">{name}</h3>
                
                <div className="badges-wrapper">
                    <Types type={type} />
                </div>

                {/* Barra de vida */}
                <div className="hp-container">
                    <div className="hp-label">HP: {hp}/{maxHp}</div>
                    {/* Barra visual personalizada */}
                    <div className="hp-bar-bg">
                        <div 
                            className="hp-bar-fill" 
                            style={{ width: `${hpPercentage}%` }} // El ancho depende de la vida
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PokemonCard;