import React from "react";
import { motion } from "framer-motion";

const TopCategories = ({ img, text }) => {
  const item = {
    hidden: {
      clipPath: "inset(50% 50% 50% 50% round 10px)",

      
      filter: "blur(10px)",
    },
    visible: {
      clipPath: "inset(0% 0% 0% 0% round 10px)",
    
      filter: "blur(0px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.7,
      },
    },
  };

  return (
    <motion.div
      variants={item}
      className="w-[195px] h-[250px] rounded-lg overflow-hidden relative"
    >
      <span className="absolute flex justify-center w-full h-max py-3 text-2xl text-white font-medium">
        {text}
      </span>
      <img src={img} alt="" className="w-full h-full" />
    </motion.div>
  );
};

export default TopCategories;
