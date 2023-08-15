import React, { useEffect, useRef, useState } from "react";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Stars from "../components/Rating/Stars";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useGetProductsByNameQuery } from "../redux/slices/productSlice";
import { useCreateReviewMutation } from "../redux/slices/reviewSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { formatPrix } from "../utils/formatPrix";
import { addToCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Listbox from "../components/Listbox/Listbox";
import { motion, AnimatePresence } from "framer-motion";
import { container, item } from "../utils/variants";

const ProductPage = () => {
  const { name, id } = useParams();
  const location = useLocation().pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: produits,
    isLoading,
    isSuccess,
    isFetching,
    refetch,
  } = useGetProductsByNameQuery(name);

  const navigate = useNavigate();
  const retour = () => navigate(-1);

  const [selectedProduit, setSelectedProduit] = useState({});

  const [counter, setCounter] = useState(1);

  useEffect(() => {
    if (isSuccess) {
      produits?.produit.forEach((el) => {
        if (el.id === id) {
          setSelectedProduit(el);
        }
      });
    }
  }, [isSuccess, isFetching]);


  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.7, delayChildren: 0.2 }}
      className="w-full min-h-screen px-[40px] dark:bg-slate-950 dark:text-white py-2"
    >
      <button
        onClick={retour}
        className="bg-green-900 text-white  py-2 px-6 rounded flex items-center  text-lg mb-3"
      >
        <RiArrowLeftSLine className="text-3xl" />
        Retour
      </button>

      {isLoading || isFetching ? (
        <ProductSectionSkeleton />
      ) : (
        <>
          <ProductSection
            produit={produits?.produit}
            selectedProduit={selectedProduit}
            setSelectedProduit={setSelectedProduit}
            counter={counter}
            setCounter={setCounter}
          />

          <div className="w-full grid grid-cols-2">
            <DescriptionSection selectedProduit={selectedProduit} />
            <ReviewSection
              reviews={produits?.produit}
              id={selectedProduit.id}
              refetch={refetch}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ProductPage;

function ProductSection({
  produit,
  selectedProduit,
  setSelectedProduit,
  counter,
  setCounter,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...selectedProduit, qte: counter }));
    navigate("/cart");
  };

  return (
    <section className="w-full h-[80vh]  mb-5 flex ">
      <div className="w-1/2 h-full flex flex-col items-center space-y-2 ">
        <div className="w-full h-3/4 flex items-center justify-center bg-slate-200 dark:bg-slate-900 rounded-lg">
          <motion.img
            key={selectedProduit.id}
            initial={{ scale: 0.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            src={`http://localhost:8000/${selectedProduit.image}`}
            className="w-[95%] h-[95%] object-contain"
          />
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full h-1/4 flex justify-center space-x-6 mt-2"
        >
          <ProductColor
            produit={produit}
            selectedProduit={selectedProduit}
            setSelectedProduit={setSelectedProduit}
          />
        </motion.div>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="w-1/2 h-full px-10"
      >
        <motion.h1 variants={item} className="text-3xl font-bold my-2">
          {selectedProduit.productName}
        </motion.h1>
        <motion.p
          variants={item}
          className="text-slate-500 h-[100px] overflow-hidden"
        >
          {selectedProduit.description}
        </motion.p>
        <motion.div variants={item} className="my-5">
          <Stars stars={4} />
        </motion.div>
        <motion.p variants={item} className="text-2xl font-semibold my-2">
          {formatPrix(Number(selectedProduit.prix))} MGA
        </motion.p>
        <motion.p variants={item}>Choississez une couleur</motion.p>
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          key={"ge8d89s5fdxw54"}
          className="flex space-x-2 my-3"
        >
          {produit?.map((elem) => (
            <RoundColor
              key={elem.id}
              bg={elem.colorCode}
              img={elem.image}
              color={elem.color}
              produit={elem}
              setSelectedProduit={setSelectedProduit}
              currentHex={selectedProduit.colorCode}
            />
          ))}
        </motion.div>

        <motion.div
          variants={item}
          className="flex items-center h-max space-x-5 my-2"
        >
          <Listbox
            total={selectedProduit.qteStock}
            itemSelected={counter}
            setSelected={setCounter}
          />
          <p>{selectedProduit.qteStock} produits en stocks restants</p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          key={"ge8dw54"}
          animate="visible"
          className="flex space-x-3"
        >
          <motion.button
            variants={item}
            onClick={addToCartHandler}
            className="bg-green-900 text-white py-3 px-5 rounded-full flex items-center  text-lg my-3"
          >
            Ajouter au panier
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ProductColor({ selectedProduit, setSelectedProduit, produit }) {
  return (
    <>
      {produit?.map(
        (elem, index) =>
          elem.color !== selectedProduit.color &&
          elem.image !== selectedProduit.image && (
            <motion.div
              key={index}
              variants={item}
              onClick={() => {
                setSelectedProduit({
                  ...elem,
                });
              }}
              className="w-1/4 h-full cursor-pointer rounded-md flex items-center justify-center dark:bg-slate-900 bg-slate-300"
            >
              <motion.img
                src={`http://localhost:8000/${elem.image}`}
                alt=""
                className="w-3/4 h-3/4 object-contain"
              />
            </motion.div>
          )
      )}
    </>
  );
}

function RoundColor({
  bg,
  img,
  color,
  setSelectedProduit,
  currentHex,
  produit,
}) {
  const changeColor = () => {
    setSelectedProduit({
      ...produit,
    });
  };
  return (
    <motion.div
      variants={item}
      onClick={changeColor}
      className={`w-14 h-14 rounded-full cursor-pointer ${bg && bg} ${
        currentHex === bg && " border-2 border-indigo-900 "
      }`}
    ></motion.div>
  );
}

export function Counter({ count, setCounter, max, cart }) {
  const minus = () => {
    if (count === 1) return;
    let a = count - 1;
    setCounter(a);
  };

  const plus = () => {
    if (count < max) {
      let a = count + 1;
      setCounter(a);
    } else return;
  };

  return (
    <div
      className={`${
        cart ? "w-1/2" : "w-1/4"
      }  h-max bg-slate-200 dark:bg-slate-900 py-2   rounded-full flex items-center justify-center`}
    >
      <button
        onClick={minus}
        className="w-1/3 h-max flex justify-center text-2xl cursor-pointer"
      >
        <AiOutlineMinus />
      </button>
      <button className="w-1/3 h-max  text-center text-xl cursor-pointer ">
        {count}
      </button>
      <button
        onClick={plus}
        className="w-1/3 h-max flex justify-center cursor-pointer  text-2xl"
      >
        <AiOutlinePlus />
      </button>
    </div>
  );
}

function DescriptionSection({ selectedProduit }) {
  return (
    <div className="w-full p-4 ">
      <h1 className="text-2xl font-semibold">
        Description du {selectedProduit.productName} de couleur{" "}
        {selectedProduit.color}
      </h1>
      <p className="">{selectedProduit.description}</p>
    </div>
  );
}

function ProductSectionSkeleton({}) {
  const ref = useRef();
  return (
    <>
      <section className="w-full h-[75vh] mt-36   mb-5 flex ">
        <div className="w-1/2 h-full flex flex-col items-center space-y-2 ">
          <div
            ref={ref}
            className="w-full h-1/2 flex items-center relative justify-center bg-slate-200 dark:bg-slate-900 rounded-lg"
          >
            <Skeleton
              width={ref.current?.offsetWidth}
              height={ref.current?.offsetHeight}
              className="relative"
            />
          </div>
        </div>
        <div ref={ref} className="w-1/2 h-full px-10">
          <Skeleton width={ref.current?.clientWidth - 50} height={50} />

          <p ref={ref} className="text-slate-500 h-[100px] overflow-hidden">
            <Skeleton width={ref.current?.clientWidth - 50} height={500} />
          </p>
          <div ref={ref} className="my-5">
            <Skeleton width={ref.current?.clientWidth - 50} height={50} />
          </div>
          <p className="text-2xl font-semibold my-2">
            <Skeleton width={200} height={19} />
          </p>
        </div>
      </section>
    </>
  );
}

function ReviewSection({ reviews, id, refetch }) {
  const [comment, setComment] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const createReviewHandler = async () => {
    try {
      const res = await createReview({
        reviewName: `Commentaire ${uuidv4()}`,
        comment,
        produitId: id,
        userId: userInfo.user_id,
      }).unwrap();
      setComment("");
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="p-4">
      <h1 className="text-center text-2xl font-bold">
        Commentaires sur ce produit
      </h1>
      {reviews.map((elem) =>
        elem.reviews.length === 0
          ? ""
          : elem.id === id && (
              <ReviewItem
                key={uuidv4()}
                reviews={elem.reviews}
                userId={userInfo?.user_id}
              />
            )
      )}
      <>
        {userInfo && (
          <textarea
            id="review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="block my-2 p-2.5 w-full outline-none  text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Votre commentaire "
          ></textarea>
        )}
      </>

      <div className="flex flex-col justify-start">
        {comment !== "" && (
          <AnimatePresence>
            <motion.button
              variants={item}
              initial={{ scale: 0.3 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={createReviewHandler}
              className="bg-green-900 w-max self-end text-white py-3 px-5 rounded-full flex items-center  text-lg my-3"
            >
              Commenter
            </motion.button>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

function ReviewItem({ reviews, userId }) {
  return (
    <>
      {reviews.map((review) => (
        <div key={review.id} className="flex items-center space-x-2 my-2">
          <div className="flex flex-row space-x-3 items-center">
            <img
              src={"http://localhost:8000/" + review.user.avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover overflow-hidden"
            />
            <span className="font-semibold">
              {review.userId && userId === review.userId
                ? "Moi"
                : review.user.fullname}
            </span>
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
    </>
  );
}
