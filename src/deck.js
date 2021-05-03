const SUITS = ["♥", "♦", "♠", "♣"];
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export default class Deck {
  constructor(cards = createDeck()) {
    this.cards = cards;
  }

  get numberOfCards() {
    return this.cards.length;
  }

  shuffle() {
    for (let i = this.numberOfCards - 1; i >= 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }

  getNextCard() {
    return this.cards.pop();
  }
}

class Card {
  constructor(suit, value, weight) {
    this.suit = suit;
    this.value = value;
    this.weight = weight;
  }
}

function createDeck() {
  return SUITS.flatMap((suit) => {
    return VALUES.map((value) => {
      return new Card(suit, value, assignWeight(value));
    });
  });
}

function assignWeight(value) {
  return value === "A"
    ? 11
    : value === "J" || value === "Q" || value === "K"
    ? 10
    : parseInt(value);
}
