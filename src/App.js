import { useState } from "react";
import GameButtons from "./components/GameButtons";
import BetButtons from "./components/BetButtons";
import BottomBar from "./components/BottomBar";
import DealButton from "./components/DealButton";
import Hand from "./components/Hand";
import Deck from "./deck";

import "./App.css";

function App() {
  const [deck, setDeck] = useState(new Deck());
  const [win, setWin] = useState(0);
  const [bet, setBet] = useState(0);
  const [balance, setBalance] = useState(1000);
  const [playerHand, setPlayerHand] = useState({});
  const [computerHand, setComputerHand] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  const handleBet = (e) => {
    const betAmount = parseInt(e.target.dataset.value);

    if (betAmount <= balance) {
      setBet(bet + betAmount);
      setBalance(balance - betAmount);
    }
  };

  const calculateHandWeight = (hand) => {
    let weight = 0;
    hand.cards.forEach((card) => {
      weight += card.weight;
    });

    hand.weight = weight;
  };

  const handleDeal = (e) => {
    deck.shuffle();

    let newPlayerHand = {
      cards: [deck.getNextCard(), deck.getNextCard()],
    };

    let newComputerHand = {
      cards: [deck.getNextCard(), deck.getNextCard()],
    };

    calculateHandWeight(newPlayerHand);
    calculateHandWeight(newComputerHand);

    setDeck(deck);
    setPlayerHand(newPlayerHand);
    setComputerHand(newComputerHand);
    setIsPlaying(true);
  };

  return (
    <div className="App">
      <div className="Header">
        <h1>Blackjack</h1>
      </div>
      <div className="Computer-wrapper">
        {computerHand ? <Hand hand={computerHand} isComputer /> : ""}
      </div>
      <div className="ButtonGroup">
        {bet > 0 && !isPlaying ? <DealButton handleDeal={handleDeal} /> : ""}
      </div>
      <div className="Player-wrapper">
        {playerHand ? <Hand hand={playerHand} /> : ""}
      </div>
      <div className="ButtonGroup">
        <GameButtons handleDeal={handleDeal} />
        {!isPlaying ? <BetButtons handleBet={handleBet} /> : ""}
      </div>
      <BottomBar balance={balance} bet={bet} win={win} />
    </div>
  );
}

export default App;
