import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { motion } from "framer-motion";
import { container } from "../../utils/variants";

const Stars = ({ stars }) => {
  const itemStars = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        className="mx-3 flex items-center space-x-1"
      >
        {[...Array(stars).keys()].map((elem, index) => (
          <motion.span
            animate={{ transition: { delay: Number(`0.${index + 2}`) } }}
            variants={itemStars}
            key={index}
          >
            <AiFillStar className="text-2xl text-green-600" />
          </motion.span>
        ))}
        {stars !== 5 &&
          [...Array(5 - stars).keys()].map((elem, index) => (
            <motion.span
              animate={{ transition: { delay: Number(`0.${index * 2}`) } }}
              variants={itemStars}
              key={index}
            >
              <AiOutlineStar key={index} className="text-2xl text-green-600" />
            </motion.span>
          ))}
        (121)
      </motion.div>
    </>
  );
};

export default Stars;
