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
  const [playerHandList, setPlayerHandList] = useState([]);
  const [activeHand, setActiveHand] = useState(0);
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
    if (betAmount > balance) return;
    setBet(bet + betAmount);
    setBalance(balance - betAmount);
  };

  const handleHit = (e) => {
    let hand = playerHand;
    hand.cards.push(deck.getNextCard());

    calculateHandWeight(hand);
    setPlayerHand((prevState) => {
      return { ...prevState, hand };
    });

    if (hand.weight < 21) return;
    setGameStatus("Too many!");
    setIsGameOver(true);
  };

  const handleComputerTurn = () => {
    let hand = computerHand;
    let weight = hand.weight;

    while (weight < 17) {
      hand.cards.push(deck.getNextCard());
      weight = calculateHandWeight(hand);
    }

    setComputerHand(hand);
    return hand;
  };

  const updateGameStatus = (winner, betAmount = bet) => {
    return winner === "dealer" && playerHand.weight > 21
      ? { winAmount: 0, updatedGameStatus: "Bust!" }
      : winner === "dealer"
      ? {
          winAmount: 0,
          updatedGameStatus: `Dealer has ${computerHand.weight}. You lose!`,
        }
      : winner === "player" &&
        playerHand.weight === 21 &&
        playerHand.cards.length === 2
      ? { winAmount: betAmount * 2 * 1.5, updatedGameStatus: `Blackjack!` }
      : winner === "player"
      ? {
          winAmount: betAmount * 2,
          updatedGameStatus: `${playerHand.weight}. You win!`,
        }
      : winner === false
      ? { winAmount: betAmount, updatedGameStatus: "Push!" }
      : "";
  };

  const handleStand = () => {
    handleComputerTurn();
    const winner = checkWinner();
    const { winAmount, updatedGameStatus } = updateGameStatus(winner);

    setWin(winAmount);
    setBalance(balance + winAmount);
    setGameStatus(updatedGameStatus);
    setIsGameOver(true);
  };

  const handleSplit = () => {
    console.log("Split Hand");
    let oldHand,
      newHand,
      oldCard1,
      oldCard2,
      newCard1,
      newCard2,
      updatedPlayerHandList;

    oldHand = playerHandList[activeHand];

    oldCard1 = oldHand.cards[0];
    oldCard2 = oldHand.cards[1];
    newCard1 = deck.getNextCard();
    newCard2 = deck.getNextCard();

    oldHand.cards[0] = oldCard1;
    oldHand.cards[1] = newCard1;

    calculateHandWeight(
      (newHand = {
        cards: [oldCard1, newCard1],
        bet,
      })
    );

    calculateHandWeight(
      (newHand = {
        cards: [oldCard2, newCard2],
        bet,
      })
    );

    updatedPlayerHandList = [oldHand, newHand];

    setPlayerHandList(updatedPlayerHandList);
  };

  const checkWinner = () => {
    let computerScore = computerHand.weight;
    let playerScore = playerHand.weight;

    return computerScore > 21
      ? "player"
      : playerScore > 21
      ? "dealer"
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
    let winner = "";
    let updatedBet = bet * 2;
    let updatedBalance = balance - bet;
    let updatedPlayerHand = playerHand;
    let updatedComputerHand = computerHand;

    if (updatedBet > balance || playerHand.cards.length > 2) return;

    updatedPlayerHand.cards.push(deck.getNextCard());
    calculateHandWeight(updatedPlayerHand);
    setBet(updatedBet);
    setPlayerHand(updatedPlayerHand);

    if (updatedPlayerHand.weight < 21) {
      updatedComputerHand = handleComputerTurn();
    }

    winner = checkWinner();

    const { winAmount, updatedGameStatus } = updateGameStatus(
      winner,
      updatedBet
    );

    setBalance(updatedBalance + winAmount);
    setWin(winAmount);
    setGameStatus(updatedGameStatus);
    setIsGameOver(true);
  };

  const handleDeal = (e) => {
    let updatedPlayerHandList = [];
    let newPlayerHand, newComputerHand;
    deck.shuffle();

    calculateHandWeight(
      (newPlayerHand = {
        cards: [deck.getNextCard(), deck.getNextCard()],
        bet,
      })
    );

    calculateHandWeight(
      (newComputerHand = {
        cards: [deck.getNextCard(), deck.getNextCard()],
      })
    );

    updatedPlayerHandList.push(newPlayerHand);
    setPlayerHandList(updatedPlayerHandList);
    setDeck(deck);
    // setPlayerHand(newPlayerHand);
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
        {playerHandList.map((hand, i) => (
          <Hand hand={hand} key={i} index={i} activeHand />
        ))}
      </div>
      <div className="ButtonGroup">
        {isPlaying && !isGameOver && (
          <GameButtons
            handleDeal={handleDeal}
            handleHit={handleHit}
            handleStand={handleStand}
            handleDouble={handleDouble}
            handleSplit={handleSplit}
          />
        )}
        {!isPlaying && balance >= 0 && <BetButtons handleBet={handleBet} />}
      </div>
      <BottomBar balance={balance} bet={bet} win={win} />
    </div>
  );
}

export default App;
