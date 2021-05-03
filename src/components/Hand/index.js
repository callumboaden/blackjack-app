import Card from "../Card";
import "./styles.css";

function Hand({ hand, isComputer }) {
  return (
    <div className="PlayerHand-wrapper">
      {hand.cards
        ? hand.cards.map((card) => <Card suit={card.suit} value={card.value} />)
        : ""}
      {hand.weight > 0 && !isComputer ? (
        <div className="PlayerHand-weight">{hand.weight}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Hand;
