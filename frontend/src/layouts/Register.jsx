import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CircleLoader from "../components/CircleLoader/CircleLoader";
import { useRegisterMutation } from "../redux/slices/userApiSlice";

const Register = ({ setShowLogin }) => {
  const [fullname, setFullname] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfrimPassword] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [pseudoError, setPseudoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfrimPasswordError] = useState("");

  const [register, { isLoading, isSuccess, isError }] = useRegisterMutation();

  const validation = () => {
    if (fullname === "") {
      setFullnameError("Veuiller entrer votre nom complet");
    }
    if (pseudo === "") {
      setPseudoError("Veuillez choisir un pseudo");
    }
    if (password === "") {
      setPasswordError("Veuiller entrer votre mot de passe");
    }
    if (confirmPassword === "") {
      setConfrimPasswordError("Veuiller confirmer votre mot de passse");
    }
    if (password.length < 6) {
      setPasswordError("Aumoins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setConfrimPasswordError("Mot de passe différent");
      return;
    }

    if (
      password === "" ||
      pseudo === "" ||
      password === "" ||
      confirmPassword === ""
    )
      return;
  };

  const rotate = {
    rotate: {
      rotate: [0, -30, 30, -30, 30, -30, 30, 0],
      borderColor: "#ff4545",
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setConfrimPasswordError("");
    setFullnameError("");
    setPasswordError("");
    setPseudoError("");
    setConfrimPasswordError("");
    validation();
    try {
      const res = await register({ fullname, pseudo, password }).unwrap();
      setFullname("");
      setPassword("");
      setPseudo("");
      setConfrimPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="w-[350px] min-h-[500px] py-5 overflow-hidden "
      onSubmit={formHandler}
    >
      <h1 className="text-center text-3xl font-semibold my-3 dark:text-white">
        S'inscrire
      </h1>
      <div className="my-2">
        <label htmlFor="pseudo" className="dark:text-white">
          Nom complet
        </label>
        <motion.input
          /*  variants={rotate}
          animate={fullname === "" && "rotate"} */
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          transition={{ duration: 0.5 }}
          type="text"
          name="pseudo"
          className="w-full  py-2 px-3 border dark:bg-transparent dark:text-white border-gray-600 ease-in-out duration-200 rounded outline-none ring-0 
              focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200 
              "
        />
        {fullnameError !== "" && (
          <AnimatePresence>
            <motion.p
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.5 }}
              className="text-red-500 text-right"
            >
              {fullnameError}
            </motion.p>
          </AnimatePresence>
        )}
      </div>
      <div className="my-2">
        <label htmlFor="pseudo" className="dark:text-white">
          Pseudo
        </label>
        <input
          type="text"
          name="pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          className="w-full py-2 px-3 border dark:bg-transparent dark:text-white border-gray-600 ease-in-out duration-200 rounded outline-none ring-0 
              focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
              "
        />
        {pseudoError !== "" && (
          <AnimatePresence>
            <motion.p
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.5 }}
              className="text-red-500 text-right"
            >
              {pseudoError}
            </motion.p>
          </AnimatePresence>
        )}
      </div>

      <div className="my-2">
        <label htmlFor="pseudo" className="dark:text-white ">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          className="w-full py-2 px-3 border dark:text-white dark:bg-transparent border-gray-600 ease-in-out duration-200 rounded outline-none ring-0 
              focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
              "
        />
        {passwordError !== "" && (
          <AnimatePresence>
            <motion.p
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.5 }}
              className="text-red-500 text-right"
            >
              {passwordError}
            </motion.p>
          </AnimatePresence>
        )}
      </div>
      <div className="my-2">
        <label htmlFor="pseudo" className="dark:text-white ">
          Confimer le mot de passe
        </label>
        <input
          type="password"
          name="password"
          value={confirmPassword}
          onChange={(e) => setConfrimPassword(e.target.value)}
          className="w-full py-2 px-3 border dark:text-white dark:bg-transparent border-gray-600 ease-in-out duration-200 rounded outline-none ring-0 
              focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
              "
        />
        {confirmPasswordError !== "" && (
          <AnimatePresence>
            <motion.p
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.5 }}
              className="text-red-500 text-right"
            >
              {confirmPasswordError}
            </motion.p>
          </AnimatePresence>
        )}
      </div>

      <button className="flex my-5 items-center justify-center  w-full bg-green-900 text-white py-2 rounded-lg">
        {isLoading ? <CircleLoader white={"stroke-white"} /> : "S'inscrire"}
      </button>
      <p className="text-center mt-6">
        <span className="dark:text-white">
          Vous êtes déjà inscrit?<br></br>
          <span
            onClick={() => setShowLogin(true)}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Se connecter
          </span>
        </span>
      </p>
    </form>
  );
};

export default Register;
