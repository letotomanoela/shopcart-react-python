import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopCategories from "../components/Card/TopCategories";
import { container } from "../utils/variants";
import CategorieItem from "../components/Card/CategorieItem";
import { useGetRandomProductsQuery } from "../redux/slices/productSlice";
import { BASE_URL } from "../redux/constants";

const LandingPage = () => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <WrapperSection />
      <CategoriesSection />
      <DayOfferSection />
      <TendancesSection />
    </motion.div>
  );
};

export default LandingPage;

function WrapperSection({}) {
  return (
    <section
      className='z-[200] w-full h-max bg-[url("bg-image.png")]  bg-cover relative 
    overflow-hidden flex justify-end mx-auto'
    >
      <div className="absolute left-0 top-[20%] z-[500]">
        <motion.p
          initial={{ x: -650 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="px-12 my-5 text-6xl font-bold text-green-950 w-3/4"
        >
          Achats Et Grand Magasin
        </motion.p>
        <motion.p
          initial={{ x: -650 }}
          animate={{ x: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 100 }}
          className="px-12 w-[70%] text-lg py-2"
        >
          Le shopping est un passe-temps un peu relaxant pour moi, ce qui est
          parfois troublant pour le solde bancaire.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="ml-10 my-4 px-16 py-4 text-xl bg-green-950 text-white rounded-full "
        >
          En savoir plus
        </motion.button>
      </div>
      <motion.div className="w-[1361px] h-[591px]  overflow-hidden z-10 relative  ">
        <motion.div
          initial={{ top: -64, opacity: 0 }}
          animate={{
            opacity: 1,
            top: 64,
            transition: { delay: 0.9, duration: 0.5 },
          }}
          className="wrapper-1 w-max h-max z-[1000] absolute right-[10%]"
        >
          <img src="wrapper-1.png" alt="" />
        </motion.div>
        <motion.div
          initial={{ top: -280, opacity: 0 }}
          animate={{
            opacity: 1,
            top: 280,
            transition: { delay: 1.1, duration: 0.5 },
          }}
          className="wrapper-1 w-max h-max z-[1000] absolute right-[10%]"
        >
          <img src="wrapper-3.png" alt="" />
        </motion.div>
        <motion.div
          initial={{ top: -270, right: 500, opacity: 0 }}
          animate={{
            opacity: 1,
            top: 320,
            transition: { delay: 1.5, duration: 0.5 },
          }}
          className="wrapper-1 w-max h-max z-[1000] absolute right-[10%]"
        >
          <img src="wrapper-2.png" alt="" />
        </motion.div>
        <motion.div
          initial={{ top: -140, right: 400, opacity: 0 }}
          animate={{
            opacity: 1,
            top: 140,
            transition: { delay: 1.3, duration: 0.5 },
          }}
          className="wrapper-1 w-max h-max z-[1000] absolute right-[10%]"
        >
          <img src="wrapper-4.png" alt="" />
        </motion.div>
        <motion.img
          initial={{ x: 800 }}
          animate={{
            x: 0,
            transition: { delay: 0.3, ease: "easeIn", duration: 0.5 },
          }}
          src="wrapper.png"
          alt=""
          className=" object-cover"
        />
      </motion.div>
    </section>
  );
}

function CategoriesSection({}) {
  const card = [
    { text: "Fourniture", img: "fourniture.png" },
    { text: "Sac à main", img: "sac-a-main.png" },
    { text: "Livres", img: "livres.png" },
    { text: "Technologie", img: "technologie.png" },
    { text: "Baskets", img: "baskets.png" },
    { text: "Voyage", img: "voyage.png" },
  ];

  return (
    <section className="w-full min-h-[50vh] px-[40px] pb-16 dark:bg-slate-950">
      <h1 className="text-3xl font-semibold py-16 dark:text-white">
        Achetez Nos Meilleures Catégories
      </h1>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        className="flex w-full flex-wrap justify-around "
      >
        {card.map((cat) => (
          <TopCategories
            key={cat.text}
            img={`top-categories/${cat.img}`}
            text={cat.text}
          />
        ))}
      </motion.div>
    </section>
  );
}

function DayOfferSection({}) {

  const { data } = useGetRandomProductsQuery();
  

  return (
    <section className="w-full min-h-[50vh] px-[40px] pb-16 dark:bg-slate-950">
      <h1 className="text-3xl font-semibold py-16 dark:text-white">
        Achetez Nos Meilleures Produits
      </h1>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        className="w-[1280px] h-[500px] overflow-x-auto overflow-y-hidden flex space-x-4 todaybest"
      >
        {data?.data.map((el) => (
          <CategorieItem
            key={`${BASE_URL}/${el.image}`}
            img={`${BASE_URL}/${el.image}`}
            description={el.description}
            prix={el.prix}
            title={el.productName}
            id={el.id}
            options={true}
          />
        ))}
      </motion.div>
    </section>
  );
}

function TendancesSection({}) {
  return (
    <section className="w-full min-h-[50vh] px-[40px] dark:bg-slate-950 pb-16">
      <h1 className="text-3xl font-semibold py-16 dark:text-white">
      Des Services Pour Vous Aider À Magasiner

      </h1>
      <div className="grid grid-cols-3 gap-x-16 rounded-lg overflow-hidden max-2xl">
          <div className="h-[500px] bg-slate-400 rounded-lg grid grid-rows-2">
              <div>

              </div>
              <div className="w-full h-full">
                <img src="tendances1.png" alt="" className="w-full h-full object-cover" />
              </div>
          </div>
      </div>
    </section>
  );
}
