import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeContextProvider(props) {
  const [dark, setDark] = useState(localStorage.getItem("theme") || false);
  const [baseColor, setBaseColor] = useState(
    localStorage.getItem("theme") ? "#1F2937" : "#e2e8f0"
  );
  const [highlightColor, setHighlightColor] = useState(
    localStorage.getItem("theme") ? "#111827" : "#f5f5f5"
  );

  const toggleTheme = () => {
    if (dark) {
      setDark(false);
      setBaseColor("#e2e8f0");
      setHighlightColor("#f5f5f5");

      localStorage.removeItem("theme");
    } else {
      setDark(true);
      setBaseColor("#1F2937");
      setHighlightColor("#111827");

      localStorage.setItem("theme", true);
    }
  };

  if (localStorage.getItem("theme")) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  return (
    <ThemeContext.Provider
      value={{ toggleTheme, dark, baseColor, highlightColor }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
