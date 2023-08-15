import React from 'react'
import { motion } from 'framer-motion';

const Success = () => {
    const icon = {
        hidden: {
          opacity: 0,
          pathLength: 0,
        },
        visible: {
          opacity: 1,
          pathLength: 1,
        },
      };
      return (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 24 24"
        >
          <motion.path
            className="fill-green-800"
            variants={icon}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.2,
              type: "tween",
              ease: "easeInOut",
              duration: 0.3,
            }}
            d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z"
          />
        </motion.svg>
      );s
}

export default Success