import Button from "./Button/index";
import "./styles.css";

function GameButtons({ handleHit, handleStand, handleDouble }) {
  return (
    <div className="GameButtons">
      <Button name="Hit" handleClick={handleHit} />
      <Button name="Stand" handleClick={handleStand} />
      <Button name="Double" handleClick={handleDouble} />
      <Button name="Split" />
    </div>
  );
}

export default GameButtons;
