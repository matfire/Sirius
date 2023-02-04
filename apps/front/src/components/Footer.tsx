import { Icon } from "@iconify/react";
import { useContext } from "react";
import { themeContext } from "../contexts/theme.context";

export default function Footer() {
  const { theme, toggleTheme } = useContext(themeContext);

  return (
    <div>
      <div className="flex justify-between">
        <a href="https://github.com/matfire/Sirius">
          <Icon className="h-8 w-auto" icon="mdi:github" />
        </a>
        <button onClick={toggleTheme}>
          <Icon
            className="h-8 w-auto"
            icon={theme === "dark" ? "ph:moon" : "ph:sun"}
          />
        </button>
      </div>
      <div>&copy; {new Date().getFullYear()} - Code Tavern</div>
    </div>
  );
}
