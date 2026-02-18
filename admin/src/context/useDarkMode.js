import { useContext } from "react";
import { DarkModeContext } from "./DarkModeContext";
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode was used outside of DarkModeProvider");
  }
  return context;
}
