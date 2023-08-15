import { useRef } from "react";
import CategorieItem from "../components/Card/CategorieItem";
import { motion } from "framer-motion";
import { container } from "../utils/variants";
import PaginationCategorie from "../components/Categorie/PaginationCategorie";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useParams, useLocation } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../redux/slices/categorySlice";
import { BASE_URL } from "../redux/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryPage = () => {
  window.scrollTo(0,0)
  const { id } = useParams();
  const { data, isSuccess, isLoading } = useGetCategoryByIdQuery(id);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.7, delayChildren: 0.2 }}
      key={useLocation().pathname}
      className="w-full h-auto px-[40px] dark:bg-slate-950 py-4"
    >
      {isLoading ? (
        <CategorieWrapperSkeleton />
      ) : (
        isSuccess && <CategorieWrapper data={data} />
      )}

      {isLoading ? (
        <CategorieItemsListsSkeleton />
      ) : (
        isSuccess && (
          <CategoriesItemLists
            products={data.data.produits}
            title={data.data.categoryName}
          />
        )
      )}

      {/* <PaginationCategorie /> */}
    </motion.div>
  );
};

export default CategoryPage;

function CategorieWrapper({ data }) {
  const ref = useRef();

  return (
    <motion.section
      ref={ref}
      initial={{ clipPath: "inset(10% 50% 50% 50% round 10px)" }}
      animate={{
        clipPath: "inset(0% 0% 0% 0% round 10px)",
        transition: { duration: 1 },
      }}
      className="w-full h-[350px] bg-amber-200 dark:bg-lime-400 duration-300 dark:duration-300 ease-in-out dark:ease-in-out flex justify-between px-10 rounded-xl"
    >
      <div className="h-full px-5 w-3/4 flex items-start justify-center flex-col space-y-4">
        <p className="text-5xl font-semibold text-green-900">
          {data?.data.categoryName}
        </p>
        <button className="py-2 px-5 rounded-full bg-green-900 text-white text-lg self-start ">
          Acheter maintenant
        </button>
      </div>
      <div className="w-1/2 h-full flex items-center">
        <img
          className=" h-full object-cover"
          src={BASE_URL + "/" + data?.data.backgroundPhoto}
          alt=""
        />
      </div>
    </motion.section>
  );
}

function CategoriesItemLists({ products, title }) {
  return (
    <section className="w-full min-h-[500px] px-2">
      <h1 className="text-3xl dark:text-white font-medium my-5">
        {title} pour vous!
      </h1>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-evenly "
      >
        {products.map((el) => (
          <Link key={uuidv4()} to={`/produit/${el.productName}/${el.id}`}>
            <CategorieItem
              img={BASE_URL + "/" + el.image}
              description={el.description}
              prix={el.prix}
              title={el.productName}
              stars={3}
              options={true}
            />
          </Link>
        ))}
      </motion.div>
    </section>
  );
}

function CategorieWrapperSkeleton() {
  const ref = useRef();

  return (
    <section
      ref={ref}
      className="w-full h-[350px]  duration-300 dark:duration-300 ease-in-out dark:ease-in-out rounded-xl"
    >
      <Skeleton
        className="rounded-lg"
        width={ref.current?.clientWidth}
        height={ref.current?.clientHeight}
      />
    </section>
  );
}
function CategorieItemsListsSkeleton({}) {
  const tab = [1, 2, 3, 4, 5, 6];
  const ref = useRef();

  return (
    <section className="w-full min-h-[500px] px-2">
      <h1 className="text-3xl dark:text-white font-medium my-5">
        <Skeleton width={300} height={50} />
      </h1>
      <div className="flex flex-wrap  justify-around">
        {tab.map((item) => (
          <div key={item} ref={ref} className="w-[30%] h-[400px] m-3">
            <Skeleton
              width={ref.current?.clientWidth}
              height={ref.current?.clientHeight}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
