import React from "react";
import "./CircleLoader.css";

const CircleLoader = ({ rayon, options, white }) => {
  return (
    <svg viewBox="25 25 50 50" className={`circle-loader ${options}`}>
      <circle
        r={rayon ? rayon : 15}
        cy="50"
        cx="50"
        className={`stroke-slate-900 dark:stroke-slate-600 ${white && white} `}
      ></circle>
    </svg>
  );
};

export default CircleLoader;
