import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { SkeletonTheme } from "react-loading-skeleton";
import { AnimatePresence } from "framer-motion";

import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import Colors from "./components/Color/Colors";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation().pathname;
  const { baseColor, highlightColor } = useContext(ThemeContext);

  return (
    <>
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        <Navbar />
        <AnimatePresence>
          <Outlet  />
        </AnimatePresence>
        <Colors />
      </SkeletonTheme>
    </>
  );
}

export default App;
