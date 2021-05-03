import Button from "./Button/index";
import "./styles.css";

function GameButtons({ handleHit }) {
  return (
    <div className="GameButtons">
      <Button name="Hit" handleClick={handleHit} />
      <Button name="Stand" />
      <Button name="Double" />
      <Button name="Split" />
    </div>
  );
}

export default GameButtons;
