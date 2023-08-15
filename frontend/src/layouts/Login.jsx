import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CircleLoader from "../components/CircleLoader/CircleLoader";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/slices/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { motion } from "framer-motion";

const Login = ({ setShowLogin, setOpen }) => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [pseudoError, setPseudoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const formHandler = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPseudoError("");
    if (pseudo === "") {
      setPseudoError("Veuiller entrer votre pseudo");
      return;
    }
    if (password === "") {
      setPasswordError("Veuiller entrer votre mot de passe");
      return;
    }

    try {
      const res = await login({ pseudo, password }).unwrap();

      dispatch(setCredentials({ ...res }));
      setOpen(false);
    } catch (error) {
      const { error: msg, field } = error.data;
      if (field === "pseudo") setPseudoError(msg);
      else setPasswordError(msg);
    }
  };

  return (
    <form className="w-[350px] h-[450px] py-5 overflow-hidden " onSubmit={formHandler}>
      <h1 className="text-center text-3xl font-semibold my-3 dark:text-white">
        Se connecter
      </h1>
      <div className="my-2">
        <label htmlFor="pseudo" className="dark:text-white">
          Pseudo
        </label>
        <motion.input
          type="text"
          name="pseudo"
          value={pseudo}
          
          onChange={(e) => setPseudo(e.target.value)}
          className="w-full py-2 px-3 border dark:bg-transparent dark:text-white border-gray-600 ease-in-out duration-200 rounded outline-none ring-0
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
        />
        <motion.p
          initial={{ x: 300 }}
          animate={{ x: pseudoError !== "" && 0 }}
          exit={{ x: pseudoError === "" && 200 }}
          transition={{ duration: 0.5 }}
          className="text-red-500 text-right"
        >
          {pseudoError}
        </motion.p>
      </div>
      <div className="my-2">
        <label htmlFor="pseudo" className="dark:text-white ">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-2 px-3 border dark:text-white dark:bg-transparent border-gray-600 ease-in-out duration-200 rounded outline-none ring-0
                focus:ring-0 focus:ring-indigo-600 focus:border-indigo-600 focus:ease-in-out focus:duration-200
                "
        />
        <p className="text-red-500">{passwordError}</p>
      </div>

      <button className="flex my-5 items-center justify-center  w-full bg-green-900 text-white py-2 rounded-lg">
        {isLoading ? (
          <CircleLoader white={"stroke-white dark:stroke-white"} />
        ) : (
          "Se connecter"
        )}
      </button>
      <p className="text-center mt-6">
        <span className="dark:text-white">
          Vous n'avez pas encore un compte?<br></br>
          <span
            onClick={() => setShowLogin(false)}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Veuiller s'incrire ici
          </span>
        </span>
      </p>
    </form>
  );
};

export default Login;
