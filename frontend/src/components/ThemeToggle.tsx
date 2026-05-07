import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
        >
            {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
};

export default ThemeToggle;
