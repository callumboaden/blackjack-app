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
    setPlayerHandList([]);
    setActiveHand(0);
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
    let currentHand = activeHand;
    let handList = [...playerHandList];
    let hand = playerHandList[activeHand];
    let newCard = deck.getNextCard();

    hand.cards.push(newCard);
    calculateHandWeight(hand);
    handList[activeHand] = hand;

    // check if weight is < 21
    if (hand.weight > 21) {
      currentHand++;
      hand.status = "bust";
    }

    setPlayerHandList((prevState) => handList);

    setActiveHand(currentHand);

    if (currentHand !== playerHandList.length) return;

    handleGameOver();
  };

  const handleGameOver = () => {
    let isBust = false;
    let playerWin = 0;
    let playerHands = [...playerHandList];

    for (let i = 0; i < playerHandList.length; i++) {
      if (playerHandList[i].weight <= 21) {
        continue;
      } else {
        isBust = true;
      }
    }

    setIsGameOver(true);

    if (isBust) return;

    const dealerScore = handleComputerTurn();

    playerHands.map((hand) => {
      if (hand.weight === 21 && hand.cards.length === 2) {
        hand.status = "blackjack";
        playerWin += hand.bet * 2 * 1.5;
      } else if (dealerScore > 21 && hand.weight <= 21) {
        hand.status = "win";
        playerWin += hand.bet * 2;
      } else if (hand.weight > 21) {
        hand.status = "bust";
      } else if (dealerScore > hand.weight && dealerScore <= 21) {
        hand.status = "lose";
      } else if (hand.weight > dealerScore) {
        hand.status = "win";
        playerWin += hand.bet * 2;
      } else if (hand.weight === dealerScore) {
        hand.status = "push";
        playerWin += hand.bet;
      }
    });

    setWin(playerWin);
    setBalance((prevState) => prevState + playerWin);
    setPlayerHandList((prevState) => playerHands);
  };

  const handleComputerTurn = () => {
    let hand = computerHand;
    let weight = hand.weight;

    while (weight < 17) {
      hand.cards.push(deck.getNextCard());
      weight = calculateHandWeight(hand);
    }

    setComputerHand(hand);
    return hand.weight;
  };

  const handleStand = () => {
    setActiveHand(activeHand + 1);

    if (activeHand !== playerHandList.length - 1) return;

    handleGameOver();
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

    if (oldHand.cards.length > 2) return;
    if (oldCard1.weight !== oldCard2.weight) return;

    newCard1 = deck.getNextCard();
    newCard2 = deck.getNextCard();

    oldHand.cards[0] = oldCard1;
    oldHand.cards[1] = newCard1;

    calculateHandWeight(
      (oldHand = {
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

    setBet((prevState) => prevState + bet);
    setBalance((prevState) => prevState - bet);
    setPlayerHandList(updatedPlayerHandList);
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
    let updatedBet = bet * 2;
    let updatedHandList = playerHandList;
    let updatedHand = playerHandList[activeHand];
    let newCard = deck.getNextCard();

    updatedHand.cards.push(newCard);
    updatedHand.bet = updatedBet;
    updatedHandList[activeHand] = updatedHand;

    calculateHandWeight(updatedHand);

    setBet((prevState) => prevState + bet);
    setBalance((prevState) => prevState - bet);
    setPlayerHandList((prevState) => updatedHandList);
    setActiveHand((prevState) => prevState + 1);

    if (activeHand !== playerHandList.length - 1) return;

    handleGameOver();
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
    setComputerHand(newComputerHand);
    setIsPlaying(true);
  };

  return (
    <div className="App">
      {gameStatus && <div className="Game-status">{gameStatus}</div>}
      <h1>Blackjack</h1>
      <div className="Computer-wrapper" style={{ marginTop: "3rem" }}>
        {computerHand && (
          <Hand
            hand={computerHand}
            isGameOver={isGameOver}
            isDealer
            activeHand
          />
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
        <div className="Player-hands">
          {playerHandList.map((hand, i) => (
            <Hand hand={hand} key={i} index={i} activeHand={activeHand} />
          ))}
        </div>
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
