import "./styles.css";

function Card({ suit, value, index, isDealer, isGameOver }) {
  const cardStyle = {
    color: suit === "♥" || suit === "♦" ? "red" : "black",
  };

  return (
    <div
      style={{
        backgroundColor: index === 1 && isDealer && !isGameOver ? "black" : "",
      }}
      className="Card-wrapper"
    >
      {index === 1 && isDealer && !isGameOver ? (
        <></>
      ) : (
        <>
          <span style={cardStyle} className="Card-value--top-left">
            {value}
          </span>
          <span style={cardStyle} className="Card-suit">
            {suit}
          </span>
          <span style={cardStyle} className="Card-value--bottom-right">
            {value}
          </span>{" "}
        </>
      )}
    </div>
  );
}

export default Card;
