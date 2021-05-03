import { useState, useEffect } from "react";
import GameButtons from "./components/GameButtons";
import BetButtons from "./components/BetButtons";
import BottomBar from "./components/BottomBar";
import DealButton from "./components/DealButton";
import NewGameButton from "./components/NewGameButton";
import Hand from "./components/Hand";
import Deck from "./deck";

import "./App.css";

function App() {
  const [deck, setDeck] = useState(new Deck());
  const [balance, setBalance] = useState(1000);
  const [win, setWin] = useState(0);
  const [bet, setBet] = useState(0);
  const [playerHand, setPlayerHand] = useState({});
  const [computerHand, setComputerHand] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState("");

  useEffect(() => {
    return isGameOver ? console.log("Game Over") : "";
  });

  const handleNewGame = () => {
    setWin(0);
    setBet(0);
    setComputerHand({});
    setPlayerHand({});
    setIsPlaying(false);
    setIsGameOver(false);
    setGameStatus("");
  };

  const handleBet = (e) => {
    const betAmount = parseInt(e.target.dataset.value);

    if (betAmount <= balance) {
      setBet(bet + betAmount);
      setBalance(balance - betAmount);
    }
  };

  const handleHit = (e) => {
    let hand = playerHand;
    hand.cards.push(deck.getNextCard());

    calculateHandWeight(hand);
    setPlayerHand((prevState) => {
      return { ...prevState, hand };
    });

    if (hand.weight > 21) {
      setGameStatus("bust");
      setIsGameOver(true);
    }

    console.log(computerHand);
  };

  const handleComputerTurn = () => {
    let hand = computerHand;
    let weight = hand.weight;

    while (weight <= 17) {
      hand.cards.push(deck.getNextCard());

      weight = calculateHandWeight(hand);
    }

    setComputerHand(hand);
  };

  const handleStand = (e) => {
    console.log("stand");
    let winAmount = 0;
    const winner = checkWinner();

    handleComputerTurn();

    if (winner === "dealer") {
      setGameStatus(`Dealer has ${computerHand.weight}. You lose!`);
    } else if (winner === "player") {
      winAmount = bet * 2;
      setGameStatus("Player wins!");
    } else if (winner === false) {
      winAmount = bet;
      setGameStatus("Push!");
    }

    setWin(winAmount);
    setBalance(balance + winAmount);
    setIsGameOver(true);
  };

  const checkWinner = () => {
    let computerScore = computerHand.weight;
    let playerScore = playerHand.weight;

    return computerScore > playerScore
      ? "dealer"
      : playerScore > computerScore
      ? "player"
      : playerScore === computerScore
      ? false
      : "";
  };

  const calculateHandWeight = (hand) => {
    let weight = 0;
    hand.cards.forEach((card) => {
      weight += card.weight;
    });

    hand.weight = weight;
    return weight;
  };

  const handleDeal = (e) => {
    let newPlayerHand, newComputerHand;
    deck.shuffle();

    calculateHandWeight(
      (newPlayerHand = {
        cards: [deck.getNextCard(), deck.getNextCard()],
      })
    );

    calculateHandWeight(
      (newComputerHand = {
        cards: [deck.getNextCard(), deck.getNextCard()],
      })
    );

    setDeck(deck);
    setPlayerHand(newPlayerHand);
    setComputerHand(newComputerHand);
    setIsPlaying(true);
  };

  return (
    <div className="App">
      {gameStatus ? <div className="Game-status">{gameStatus}</div> : ""}
      <h1>Blackjack</h1>
      <div className="Computer-wrapper" style={{ marginTop: "3rem" }}>
        {computerHand ? <Hand hand={computerHand} isComputer /> : ""}
      </div>
      <div className="ButtonGroup">
        {isGameOver ? <NewGameButton handleClick={handleNewGame} /> : ""}
        {bet > 0 && !isPlaying ? <DealButton handleDeal={handleDeal} /> : ""}
      </div>
      <div className="Player-wrapper">
        {playerHand ? <Hand hand={playerHand} /> : ""}
      </div>
      <div className="ButtonGroup">
        {isPlaying ? (
          <GameButtons
            handleDeal={handleDeal}
            handleHit={handleHit}
            handleStand={handleStand}
          />
        ) : (
          ""
        )}
        {!isPlaying ? <BetButtons handleBet={handleBet} /> : ""}
      </div>
      <BottomBar balance={balance} bet={bet} win={win} />
    </div>
  );
}

export default App;
