import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext < ThemeContextType > ({
    theme: "system",
    setTheme: () => { },
    resolvedTheme: "light",
});

export const useTheme = () => useContext(ThemeContext);

const getSystemTheme = (): "light" | "dark" =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState < Theme > (() => {
        const stored = localStorage.getItem("theme") as Theme | null;
        return stored || "system";
    });

    const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(resolvedTheme);
        localStorage.setItem("theme", theme);
    }, [theme, resolvedTheme]);

    useEffect(() => {
        if (theme !== "system") return;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => setTheme("system"); // re-trigger
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
