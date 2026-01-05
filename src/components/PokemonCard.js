import './PokemonCard.css'
function PokemonCard({ name, image, hp, maxHp, type }) {



    return (
        <div className="card">
            <img src={image}
                alt={name}>
            </img>
            <div className="container">
                <h3>{name}</h3>


                <span className="type-badge">Tipo: {type}</span>


                <div className="health-bar-container">
                    <label>HP: {hp} / {maxHp}</label>
                    <progress value={hp} max={maxHp}></progress>
                </div>
            </div>

        </div>
    );
}

export default PokemonCard;