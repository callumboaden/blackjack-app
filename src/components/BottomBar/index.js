import "./styles.css";

function BottomBar({ balance, bet, win }) {
  return (
    <div className="BottomBar-wrapper">
      <div>Balance: {balance}</div>
      <div>Bet: {bet}</div>
      <div>Win: {win}</div>
    </div>
  );
}

export default BottomBar;
