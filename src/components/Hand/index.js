import Card from "../Card";
import "./styles.css";

function Hand({ hand, isDealer, isGameOver, index, activeHand }) {
  return (
    <div
      className="PlayerHand-wrapper"
      style={{ opacity: activeHand === index ? "1" : ".5" }}
    >
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

      {hand.status ? <div>{hand.status}</div> : ""}
    </div>
  );
}

export default Hand;
