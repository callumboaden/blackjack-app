import "./styles.css";

function Button({ value, handleBet }) {
  return (
    <button onClick={handleBet} className="Button" data-value={value}>
      {value}
    </button>
  );
}

export default Button;
