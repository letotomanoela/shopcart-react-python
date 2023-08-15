import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { item } from "../../utils/variants";
import Stars from "../Rating/Stars";
import { formatPrix } from "../../utils/formatPrix";
import { Link } from "react-router-dom";
const CategorieItem = ({ img, title, description, prix, stars, options, id }) => {
  const [full, setFull] = useState(false);

  return (
    <Link to={`/produit/${title}/${id}`}>
      <motion.div
        variants={item}
        className={` ${
          options ? " w-[400px] m-4 " : "w-max"
        } h-[450px] bg-slate-50 pb-5 rounded-lg dark:text-white dark:bg-slate-900`}
      >
        <div
          className={` ${
            options ? "w-[400px] items-center h-[275px] " : "w-full h-[250px]"
          }  flex  justify-center bg-slate-200 dark:bg-slate-900 rounded-lg relative`}
        >
          <motion.img
            whileHover={{
              scale: !options && 1.3,
              transition: { duration: 0.3 },
            }}
            src={img}
            alt=""
            className={`cursor-pointer ${
              options && "w-full h-3/4 object-contain"
            }`}
          />
        </div>
        <div className="w-full px-2 grid grid-cols-[1fr,150px] py-2  `w-[350px]">
          <h2 className="text-base font-medium  ">{title}</h2>
          <h2 className="text-base font-medium text-end ">
            {formatPrix(prix)} MGA
          </h2>
        </div>

        <button className="border hover:text-white hover:border-green-900 hover:bg-green-900 hover:duration-500 duration-500 border-gray-700 py-2 px-5 rounded-full mx-3 my-2">
          Ajouter au panier
        </button>
      </motion.div>
    </Link>
  );
};

export default CategorieItem;
