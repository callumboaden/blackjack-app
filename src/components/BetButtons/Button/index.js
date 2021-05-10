import "./styles.css";

function Button({ value, handleBet }) {
  return (
    <button
      class="Button"
      onClick={handleBet}
      className="Button"
      data-value={value}
    >
      {value}
    </button>
  );
}

export default Button;
