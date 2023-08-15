import React from "react";
import { motion } from "framer-motion";

const Message = ({ icon, message }) => {
  return (
    <motion.div
      initial={{ translateX: -100 }}
      animate={{ translateX: 0 }}
      exit={{ translateX: 500 }}
      transition={{ duration: 0.1}}
      className="success-result w-full h-full flex flex-col items-center justify-center"
    >
     {icon}
      <h1 className="text-xl text-black dark:text-white">{message}</h1>
    </motion.div>
  );
};

export default Message;
