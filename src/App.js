import './App.css';
import PokemonCard from './components/PokemonCard';

function App() {
  return (
    <div className="App">
      <div className="App-header">

        {
          <PokemonCard
            name={"Bulbasaur"}
            image={"https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/001.png"}
            hp={100}
            maxHp={100}
            type={"verdura"}
          />
        }
        {
          <PokemonCard
            name={"Pikachu" }
            image={"https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Pok%C3%A9mon_Pikachu_art.png/250px-Pok%C3%A9mon_Pikachu_art.png"}
            hp={100}
            maxHp={100}
            type={"tomas edison"}
          />
        }

      </div>
    </div>
  );
}

export default App;
