import React from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
const textWrapperAnimationVariants = {
  rotate: {
    rotate: [0, -3, 3, -3, 3, -3, 3, 0],
    transition: {
      duration: 2.5,
      ease: "easeInOut",
      yoyo: Infinity,
      delay: 0.5,
    },
  },
};
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="w-screen h-screen fixed bg-black opacity-90 top-0 left-0 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[400px] h-[500px]  mx-auto bg-cyan-200 shadow-sm  rounded-3xl relative overflow-hidden"
      >
        <Confetti className="w-full h-full" />
        <motion.div
          style={{
            backgroundColor: "#05e8ba",
            backgroundImage: "linear-gradient(315deg, #05e8ba 0%, #087ee1 74%)",
          }}
          className="w-32 h-32 mx-auto  my-16 rounded-full  bg-green-600 flex items-center justify-center relative"
        >
          <AnimatedCheckIcon />
        </motion.div>
        <motion.div
          animate="rotate"
          variants={textWrapperAnimationVariants}
          className="text-2xl font-bold mx-auto text-center w-2/3"
        >
          Votre commande a été accépté
        </motion.div>
        <p className="text-center text-sm text-slate-400 my-2">
          Transaction ID: 41988487487488
        </p>
        <Link to="/">
          <button className="bg-orange-500 text-white  py-2 px-6 mx-auto  rounded-full flex items-center  text-lg mb-3">
            Continuez le shopping
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

function AnimatedCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="white"
      width={"75%"}
    >
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export default ThankYou;
