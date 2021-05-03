import Button from "./Button/index";
import "./styles.css";

function BetButtons({ handleBet }) {
  return (
    <div className="BetButtons">
      <Button handleBet={handleBet} value="1" />
      <Button handleBet={handleBet} value="5" />
      <Button handleBet={handleBet} value="10" />
      <Button handleBet={handleBet} value="25" />
      <Button handleBet={handleBet} value="100" />
    </div>
  );
}

export default BetButtons;
