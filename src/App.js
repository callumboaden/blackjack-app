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

  const handleNewGame = () => {
    setWin(0);
    setBet(0);
    setComputerHand({});
    setPlayerHand({});
    setIsPlaying(false);
    setIsGameOver(false);
    setGameStatus("");
  };

  const handleReplayGame = () => {
    setBalance(1000);
    handleNewGame();
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
      setGameStatus("Too many!");
      setIsGameOver(true);
    }
  };

  const handleComputerTurn = () => {
    let hand = computerHand;
    let weight = hand.weight;

    while (weight < 17) {
      hand.cards.push(deck.getNextCard());
      weight = calculateHandWeight(hand);
    }

    setComputerHand(hand);
  };

  const handleStand = (betAmount = bet) => {
    let winAmount = 0;

    console.log(`bet: ${betAmount}`);

    handleComputerTurn();
    const winner = checkWinner();

    if (winner === "dealer") {
      setGameStatus(`Dealer has ${computerHand.weight}. You lose!`);
    } else if (winner === "player") {
      if (playerHand.weight === 21 && playerHand.cards.length === 2) {
        winAmount += betAmount * 2 * 1.5;
        setGameStatus("Blackjack!");
      } else {
        winAmount += betAmount * 2;
        setGameStatus("Player wins!");
      }
    } else if (winner === false) {
      winAmount = betAmount;
      setGameStatus("Push!");
    }

    console.log(winAmount);

    setWin(winAmount);
    setBalance(balance + winAmount);
    setIsGameOver(true);
  };

  const checkWinner = () => {
    let computerScore = computerHand.weight;
    let playerScore = playerHand.weight;

    return computerScore > 21
      ? "player"
      : computerScore > playerScore && computerScore <= 21
      ? "dealer"
      : playerScore > computerScore && playerScore <= 21
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

  const handleDouble = () => {
    const betAmount = bet * 2;
    setBet((prevState) => betAmount);
    setBalance((prevState) => prevState + bet);

    console.log("bet" + bet);

    handleHit();
    handleStand(betAmount);
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
      {gameStatus && <div className="Game-status">{gameStatus}</div>}
      <h1>Blackjack</h1>
      <div className="Computer-wrapper" style={{ marginTop: "3rem" }}>
        {computerHand && (
          <Hand hand={computerHand} isGameOver={isGameOver} isDealer />
        )}
      </div>
      <div className="ButtonGroup">
        {balance === 0 && isGameOver && (
          <button onClick={handleReplayGame}>Play again?</button>
        )}
        {isGameOver && balance > 0 && (
          <NewGameButton handleClick={handleNewGame} />
        )}
        {bet > 0 && !isPlaying && <DealButton handleDeal={handleDeal} />}
      </div>
      <div className="Player-wrapper">
        {playerHand && <Hand hand={playerHand} />}
      </div>
      <div className="ButtonGroup">
        {isPlaying && !isGameOver && (
          <GameButtons
            handleDeal={handleDeal}
            handleHit={handleHit}
            handleStand={handleStand}
            handleDouble={handleDouble}
          />
        )}
        {!isPlaying && balance >= 0 && <BetButtons handleBet={handleBet} />}
      </div>
      <BottomBar balance={balance} bet={bet} win={win} />
    </div>
  );
}

export default App;
