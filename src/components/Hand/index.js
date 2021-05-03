import Card from "../Card";
import "./styles.css";

function Hand({ hand, isDealer, isGameOver }) {
  return (
    <div className="PlayerHand-wrapper">
      {hand.cards
        ? hand.cards.map((card, i) => (
            <Card
              key={i}
              index={i}
              suit={card.suit}
              value={card.value}
              isDealer={isDealer}
              isGameOver={isGameOver}
            />
          ))
        : ""}
      {hand.weight > 0 && !isDealer ? (
        <div className="PlayerHand-weight">{hand.weight}</div>
      ) : (
        ""
      )}

      {isDealer && isGameOver ? (
        <div className="PlayerHand-weight">{hand.weight}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Hand;
