import Button from "./Button/index";
import "./styles.css";

function GameButtons({ handleHit, handleStand, handleDouble, handleSplit }) {
  return (
    <div className="GameButtons">
      <Button name="Hit" handleClick={handleHit} />
      <Button name="Stand" handleClick={handleStand} />
      <Button name="Double" handleClick={handleDouble} />
      <Button name="Split" handleClick={handleSplit} />
    </div>
  );
}

export default GameButtons;
