import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { formatPrix } from "../utils/formatPrix";
import ListboxComponent from "../components/Listbox/Listbox";
import { removeFromCart, addToCart } from "../redux/slices/cartSlice";
import { motion } from "framer-motion";

const CartPage = () => {
  const { cartItems, prixTotal } = useSelector((state) => state.cart);
  const location = useLocation().pathname;
  return (
    <motion.section
      key={location}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.7, delayChildren: 0.2 }}
      className="min-h-[90vh] dark:bg-slate-950 px-[5%] "
    >
      <h1 className="dark:text-white text-4xl font-semibold py-10  ">
        Mon panier
      </h1>
      {cartItems.length !== 0 && (
        <div className="grid grid-cols-[2fr,1fr] space-x-3">
          <div className="border border-gray-400 p-2 rounded h-max mb-4 dark:border-slate-700">
            {cartItems.map((elem) => (
              <CartItem item={elem} key={elem.id} />
            ))}
          </div>
          <div className="border border-gray-400 dark:border-slate-700 rounded h-max py-4">
            <h1 className="dark:text-white text-2xl text-center font-semibold">
              Total prix des produits
            </h1>
            <p className="text-center text-3xl dark:text-white py-3 font-bold ">
              {formatPrix(Number(prixTotal))} MGA{" "}
            </p>
            <Link to="/payement">
              <button className="bg-green-900  text-white py-3 px-5 rounded-full flex items-center  text-lg my-3 mx-auto">
                Procéder au paiement
              </button>
            </Link>
          </div>
        </div>
      )}

      {cartItems.length === 0 && (
        <div className="dark:text-white text-xl ">
          Votre panier est vide
          <br></br>
          <Link to="/">
            <button className="bg-green-900  text-white py-3 px-5 rounded-full flex items-center  text-lg my-3 ">
              Voir les produits
            </button>
          </Link>
        </div>
      )}
    </motion.section>
  );
};

export default CartPage;

function CartItem({ item }) {
  const [selected, setSelected] = useState(item.qte);
  const dispatch = useDispatch();
  const removeFromCartHandler = async () => {
    dispatch(removeFromCart({ ...item, qte: selected }));
  };

  const addToCartHandler = async (product, qte) => {
    dispatch(addToCart({ ...product, qte }));
  };

  useEffect(() => {
    addToCartHandler(item, selected);
  }, [selected]);

  return (
    <>
      <div className=" w-full h-[200px] border-b dark:text-white border-slate-700 last:border-b-0 flex items-center space-x-2 my-2 py-6">
        <div className="w-full h-full grid grid-cols-[150px,1fr,max-content] space-x-3">
          <div className=" h-full p-1 bg-slate-300 dark:bg-slate-900 rounded">
            <img
              src={`http://localhost:8000/${item.image}`}
              className="w-full h-full object-contain"
              alt=""
            />
          </div>
          <div className=" text-xl font-bold flex items-center ">
            {item.productName}
          </div>
          <p className="w-max flex items-center font-semibold">
            {formatPrix(Number(item.prix))} MGA
          </p>
        </div>
        <div className="flex  items-center h-max space-x-5 my-2 px-2 w-max relative">
          <ListboxComponent
            total={item.qteStock}
            itemSelected={selected}
            setSelected={setSelected}
          />
          <div
            onClick={removeFromCartHandler}
            className="w-12 h-12 cursor-pointer rounded bg-slate-400 dark:bg-slate-900 "
          >
            <MdDelete className="text-5xl" />
          </div>
        </div>
      </div>
    </>
  );
}
