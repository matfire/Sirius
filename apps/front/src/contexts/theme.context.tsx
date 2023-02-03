import { createContext, useState } from "react";

export const themeContext = createContext({ theme: "dark" })

export default function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("dark")

    return (
        <themeContext.Provider value={{ theme }}>
            {children}
        </themeContext.Provider>
    )
}