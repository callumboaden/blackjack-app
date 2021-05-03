import "./styles.css";

function Card({ suit, value }) {
  const cardStyle = {
    color: suit === "♥" || suit === "♦" ? "red" : "black",
  };

  return (
    <div className="Card-wrapper">
      <span style={cardStyle} className="Card-value--top-left">
        {value}
      </span>
      <span style={cardStyle} className="Card-suit">
        {suit}
      </span>
      <span style={cardStyle} className="Card-value--bottom-right">
        {value}
      </span>
    </div>
  );
}

export default Card;
