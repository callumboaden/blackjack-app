import { useState } from "react";
import GameButtons from "./components/GameButtons/index";
import BetButtons from "./components/BetButtons/index";
import BottomBar from "./components/BottomBar";
import Deck from "./deck";

import "./App.css";

function App() {
  const initialState = {
    deck: new Deck(),
    player: {
      win: 0,
      initialBet: 0,
      balance: 1000,
      hands: [],
    },
    computer: {
      hand: [],
    },
  };

  const [game, setGame] = useState(initialState);
  const [bet, setBet] = useState(0);

  const handleBet = (e) => {
    const betAmount = parseInt(e.target.dataset.value);
    const { balance } = game.player;

    return betAmount <= balance ? setBet(bet + betAmount) : "";
  };

  return (
    <div className="App">
      <GameButtons />
      <BetButtons handleBet={handleBet} />
      <BottomBar
        balance={game.player.balance}
        bet={bet}
        win={game.player.win}
      />
    </div>
  );
}

export default App;
