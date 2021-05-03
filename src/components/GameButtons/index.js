import Button from "./Button/index";
import "./styles.css";

function GameButtons() {
  return (
    <div className="GameButtons">
      <Button name="Hit" />
      <Button name="Stand" />
      <Button name="Double" />
      <Button name="Split" />
    </div>
  );
}

export default GameButtons;
