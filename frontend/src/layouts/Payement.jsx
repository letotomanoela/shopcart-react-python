import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatPrix } from "../utils/formatPrix";
import { v4 as uuidv4 } from "uuid";
import ThankYou from "../components/ThankYou/ThankYou";
import { motion } from "framer-motion";
import { useCreateOrderMutation } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";

const Payement = () => {
  const [paiement, setPaiement] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const { cartItems, prixTotal } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [createOrder, { isLoading, isSuccess }] = useCreateOrderMutation();

  const orderHandler = async () => {
    if (paiement === "") return;
    let commandeItems = [];
    if (cartItems.length > 0) {
      cartItems.forEach((item) => {
        let obj = {
          produitId: item.id,
          qteStock: String(item.qte),
        };
        commandeItems.push(obj);
      });
    }
    let data = {
      payementMethod: paiement,
      payementResult:
        paiement === "Paiement à la livraison" ? "NON PAYE" : "PAYE",
      totalPrix: Number(prixTotal),
      isPaid: paiement === "Paiement à la livraison" ? "NON PAYE" : "PAYE",
      userId: userInfo.user_id,
      commandeItems,
    };

    try {
      const res = await createOrder({ ...data }).unwrap();
      setShowThankYou(true);
      dispatch(clearCart());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.7, delayChildren: 0.2 }}
        className="dark:bg-slate-950 min-h-screen px-[6%] dark:text-white"
      >
        <h1 className="text-3xl font-bold text-center py-5">Payement</h1>
        <div className="w-full grid grid-cols-[2fr,1fr] justify-items-center space-x-5 pb-4 ">
          <div className="border h-auto border-gray-400 dark:border-slate-800 shadow-lg w-full rounded p-4 dark:text-white">
            <h1 className="font-bold text-2xl">
              Vérifier l'article et l'expédition
            </h1>
            <div className="w-full py-4">
              {/* <ItemList /> */}
              {cartItems.map((item) => (
                <ItemList key={item.id} item={item} />
              ))}
            </div>
          </div>
          <div className="border h-max border-gray-400 dark:border-slate-800 shadow-lg w-full rounded p-2 dark:text-white">
            <h1 className="text-2xl font-semibold text-center p-2 ">
              Récapitulatif de la commande
            </h1>
            <div className="px-3">
              <h2 className="text-xl font-semibold py-2">Moyens de payement</h2>
              <RadioBtn
                text="Paypal"
                paiement={paiement}
                value={"Paypal"}
                setValue={setPaiement}
              />
              <RadioBtn
                text="Carte de crédit"
                paiement={paiement}
                value={"Carte de crédit"}
                setValue={setPaiement}
              />
              <RadioBtn
                text="Mobile Money"
                paiement={paiement}
                value={"Mobile Money"}
                setValue={setPaiement}
              />
              <RadioBtn
                text="Paiement à la livraison"
                paiement={paiement}
                value={"Paiement à la livraison"}
                setValue={setPaiement}
              />
            </div>
            <div className="px-3 my-4">
              {cartItems.map((item) => (
                <div
                  key={uuidv4()}
                  className="text-base w-full flex justify-between my-2"
                >
                  <span>
                    {item.productName} ({item.qte})
                  </span>
                  <span>
                    {formatPrix(Number(Number(item.prix) * Number(item.qte)))}
                  </span>
                </div>
              ))}
              <div className="font-bold text-lg w-full flex justify-between my-2">
                <span>Total</span>
                <span>{formatPrix(Number(prixTotal))}</span>
              </div>
              <button
                onClick={orderHandler}
                className="bg-green-900 block w-full rounded-full text-white py-2 text-xl"
              >
                Payer {formatPrix(Number(prixTotal))} MGA
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      {showThankYou && <ThankYou />}
    </>
  );
};

function RadioBtn({ text, value, setValue, paiement }) {
  return (
    <div className="flex items-center ">
      <input
        checked={paiement === value ? true : false}
        id="default-radio-2"
        type="radio"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        name="default-radio"
        className="w-5 h-5 text-blue-600 bg-transparent border-gray-300 dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor="default-radio-2"
        className="ml-2 text-lg font-medium text-gray-900 dark:text-gray-300"
      >
        {text}
      </label>
    </div>
  );
}

function ItemList({ item }) {
  return (
    <>
      <div className="w-full grid grid-cols-[1fr,2fr,1fr] h-[185px] border-b border-slate-600 my-2 last:border-b-0 ">
        <div className="w-[95%] h-[95%] dark:bg-slate-900 bg-slate-300 rounded flex items-center justify-center">
          <img
            className="w-[80%] h-[80%] object-contain"
            src={`http://localhost:8000/${item.image}`}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center px-4">
          <span className="font-bold text-3xl">{item.productName}</span>
          <span className="text-slate-500 text-lg">Couleur : {item.color}</span>
        </div>
        <div className="flex flex-col justify-center items-end">
          <span className="font-bold text-xl">
            {formatPrix(Number(item.prix))} MGA
          </span>
          <span className="text-slate-500 text-lg">Quantité : {item.qte}</span>
        </div>
      </div>
    </>
  );
}
export default Payement;
