import ButtonIcon from "./ButtonIcon";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { useDarkMode } from "../context/useDarkMode";
function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  function handleToggle() {
    toggleDarkMode();
  }
  return (
    <ButtonIcon onClick={handleToggle}>
      {isDarkMode ? <HiOutlineMoon /> : <HiOutlineSun />}
    </ButtonIcon>
  );
}

export default DarkModeToggle;
