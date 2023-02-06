import { Icon } from "@iconify/react";
import { useContext } from "react";
import IconMoon from "../assets/Moon";
import IconSun from "../assets/Sun";
import { themeContext } from "../contexts/theme.context";

export default function Footer() {
  const { theme, toggleTheme } = useContext(themeContext);

  return (
    <div>
      <div className="flex justify-between">
        <a href="https://github.com/matfire/Sirius">
          <Icon className="h-8 w-auto stroke-current" icon="mdi:github" />
        </a>
        <button onClick={toggleTheme}>
          {theme === "dark" ? <IconMoon className="h-8 w-auto stroke-current"
          /> : <IconSun className="h-8 w-auto stroke-current"
          />}
        </button>
      </div>
      <div>&copy; {new Date().getFullYear()} - Code Tavern</div>
    </div>
  );
}
