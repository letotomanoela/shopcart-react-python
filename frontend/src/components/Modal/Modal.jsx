import React from "react";
import { motion } from "framer-motion";
import "./Modal.css";

export default function Modal(props) {
  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 15,
        stiffness: 150,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };
  const flip = {
    hidden: {
      transform: "scale(0) rotateX(-360deg)",
      opacity: 0,
      transition: {
        delay: 0.3,
      },
    },
    visible: {
      transform: "scale(1) rotateX(0deg)",
      opacity: 1,
      transition: {
        duration: 0.5,
      },
      
    },
    exit: {
      transform: "scale(0) rotateX(360deg)",
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1}}
      className={`modal z-[80000]`}
      onClick={props.closeModal && props.closeModal}
    >
      <motion.div
        className={`modal-content dark:bg-slate-900  ${props.options && props.options} `}
        variants={props.flip ? flip : dropIn}
        initial="hidden"
        animate="visible"
        
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {props.children}
      </motion.div>
    </motion.div>
  );
}
