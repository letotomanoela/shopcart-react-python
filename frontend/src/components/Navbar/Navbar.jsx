import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Logo from "../../assets/logo.svg";
import { item, container } from "../../utils/variants";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiArrowDownSLine,
  RiShoppingCartLine,
  RiLogoutCircleLine,
  RiAdminLine,
} from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineSearch } from "react-icons/ai";
import CardCategories from "../Card/CardCategories";
import { TbUser } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import Login from "../../layouts/Login";
import Modal from "../Modal/Modal";
import Register from "../../layouts/Register";
import { useSelector, useDispatch } from "react-redux";
import { VscAccount } from "react-icons/vsc";
import { logout } from "../../redux/slices/authSlice";
import { AiOutlineAppstore } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { MdShoppingCartCheckout } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { useGetCategoryQuery } from "../../redux/slices/categorySlice";
import { v4 as uuidv4 } from "uuid";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { useGetUserByIdQuery } from "../../redux/slices/userApiSlice";
import { BASE_URL } from "../../redux/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetProductsByNameQuery } from "../../redux/slices/productSlice";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const toggleModal = () => setToggle(!toggle);
  const [showLogin, setShowLogin] = useState(true);
  const [toggleAccount, setToggleAccount] = useState(false);

  const toggleAccountDropdown = () => setToggleAccount(!toggleAccount);

  const [adminDrop, setAdminDrop] = useState(false);
  const toggleAdmin = () => setAdminDrop(!adminDrop);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [search, setSearch] = useState(false);
  const toggleSearch = () => setSearch(!search);

  const [searchValue, setSearchValue] = useState("");

  const { data: user, isSuccess } = useGetUserByIdQuery(userInfo?.user_id);
  const {
    data: products,
    isLoading,
    isError,
    isFetching,
    isSuccess: success,
    refetch,
    error,
  } = useGetProductsByNameQuery(searchValue);

  const searchFunc = (e) => {
    setSearch(true);
    setSearchValue(e.target.value);
    if (searchValue === "") {
      setSearch(false);
      return;
    }
    refetch();
  };

  return (
    <>
      <nav className="w-full dark:bg-gray-900 dark:text-white dark:duration-300 duration-300 h-20 px-[40px] flex items-center space-x-7 xl:justify-center ">
        <div className="h-full flex items-center">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="h-full font-medium flex items-center"
        >
          <NavlinkDropdown />
        </motion.div>
        <motion.div className="h-max flex items-center border border-gray-500 py-2 px-3 rounded-full relative">
          <input
            onChange={searchFunc}
            value={searchValue}
            className=" outline-none text-sm w-64 bg-transparent"
            placeholder="Rechercher un produit"
          />
          <AiOutlineSearch className="text-xl" />
          {search && (
            <SearchContainer
              isLoading={isLoading}
              isFetching={isFetching}
              success={success}
              isError={isError}
              produits={products}
              error={error}
              close={toggleSearch}
            />
          )}
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="h-full flex items-center space-x-7 self-end"
        >
          {userInfo === null ? (
            <span onClick={toggleModal}>
              <motion.div
                variants={item}
                className="flex items-center space-x-2"
              >
                <TbUser className="text-3xl" />
                <span>Se connecter </span>
              </motion.div>
            </span>
          ) : (
            <motion.div
              variants={item}
              onClick={toggleAccountDropdown}
              className="flex items-center space-x-2 relative cursor-pointer"
            >
              <img
                src={BASE_URL + "/" + user?.data.avatar}
                className="w-12 h-12 object-cover rounded-full"
                alt=""
              />
              <span>{user?.data.fullname}</span>
              {toggleAccount && <UserDropdown open={toggleAccount} />}
            </motion.div>
          )}

          <Link to="/cart">
            <motion.div variants={item} className="flex items-center space-x-2">
              <span className="relative">
                <RiShoppingCartLine className="text-3xl" />
                {cartItems.length !== 0 && (
                  <div className="w-5 h-5 rounded-full text-white bg-green-800 flex items-center justify-center absolute -top-2 -right-2">
                    {cartItems.reduce((a, c) => a + c.qte, 0)}
                  </div>
                )}
              </span>
              <span>Panier </span>
            </motion.div>
          </Link>

          {userInfo?.admin && (
            <motion.div
              variants={item}
              onClick={toggleAdmin}
              className="flex items-center space-x-2 relative cursor-pointer"
            >
              <RiAdminLine className="text-3xl" />
              <span>Administration</span>
              <AdminDropdown open={adminDrop} />
            </motion.div>
          )}
          <SwichTheme />
        </motion.div>
      </nav>
      {toggle &&
        (showLogin ? (
          <LoginModal setShowLogin={setShowLogin} toggleModal={toggleModal} />
        ) : (
          <RegisterModal
            setShowLogin={setShowLogin}
            toggleModal={toggleModal}
          />
        ))}
    </>
  );
};

export default Navbar;

function Navlink({ text }) {
  return (
    <motion.a
      variants={item}
      className="text-lg inline-block mx-3 hover:text-slate-500 cursor-pointer"
      href="#"
    >
      {text}
    </motion.a>
  );
}

function NavlinkDropdown({}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading, refetch, isSuccess } = useGetCategoryQuery();
  const dropdown = {
    hidden: { opacity: 0 },
    visible: open
      ? {
          clipPath: "inset(0% 0% 0% 0% round 10px)",
          opacity: 1,
          transition: {
            type: "spring",
            bounce: 0,
            duration: 0.5,
          },
        }
      : { clipPath: "inset(10% 50% 90% 50% round 10px)" },
  };
  const rotate = {
    visible: {
      rotate: open ? 180 : 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemDropdown = {
    hidden: {
      scale: 0.3,
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
    },
  };
  return (
    <div className="text-lg mx-3  relative ">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 cursor-pointer"
      >
        <span>Catégories</span>{" "}
        <motion.span variants={rotate} animate="visible">
          {" "}
          <RiArrowDownSLine />
        </motion.span>
      </div>

      <motion.div
        variants={dropdown}
        initial="hidden"
        animate="visible"
        className="z-[6000] p-[30px] w-[775px] h-[360px] bg-white dark:bg-slate-950 dark:bg-opacity-90 absolute top-[54px] -left-2 shadow-lg "
      >
        <div className="w-full border-b border-b-gray-900 h-max py-3 mb-3">
          Catégories populaires
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          className="w-full flex flex-wrap "
        >
          {isSuccess &&
            data?.data.map((item) => (
              <Link
                onClick={() => setOpen(false)}
                to={`/category/${item.id}`}
                key={item.photo}
              >
                <CardCategories
                  variant={itemDropdown}
                  img={item.photo}
                  text={item.categoryName}
                  description={item.categorieDescription}
                />
              </Link>
            ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function LoginModal({ toggleModal, setShowLogin }) {
  return (
    <AnimatePresence>
      <Modal closeModal={toggleModal} options="w-max h-max">
        <Login setShowLogin={setShowLogin} setOpen={toggleModal} />
      </Modal>
    </AnimatePresence>
  );
}

function RegisterModal({ toggleModal, setShowLogin }) {
  return (
    <AnimatePresence>
      <Modal closeModal={toggleModal} options="w-max h-max">
        <Register setShowLogin={setShowLogin} />
      </Modal>
    </AnimatePresence>
  );
}

function UserDropdown({ open }) {
  const dispatch = useDispatch();
  const dropdown = {
    hidden: { opacity: 0, clipPath: "inset(10% 50% 90% 50%)" },
    visible: open
      ? {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          transition: {
            type: "spring",
            bounce: 0,
            duration: 0.5,
          },
        }
      : { clipPath: "inset(10% 50% 90% 50%)" },
  };
  return (
    <motion.div
      variants={dropdown}
      onClick={(e) => e.stopPropagation()}
      initial="hidden"
      animate="visible"
      className="w-max px-5 dark:bg-slate-950 dark:bg-opacity-90 py-2 h-max bg-slate-50 absolute top-[54px] -right-4 z-[50000] "
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        className="flex flex-col space-y-3"
      >
        <motion.div
          variants={item}
          className="flex items-center justify-center space-x-5"
        >
          <VscAccount className="text-3xl" />
          <span>Mon compte</span>
        </motion.div>
        <motion.div
          variants={item}
          onClick={() => dispatch(logout())}
          className="flex items-center justify-center space-x-5"
        >
          <RiLogoutCircleLine className="text-3xl" />
          <span>Déconnecter</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function AdminDropdown({ open }) {
  const dispatch = useDispatch();
  const dropdown = {
    hidden: { opacity: 0, clipPath: "inset(10% 50% 90% 50%)" },
    visible: open
      ? {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          transition: {
            type: "spring",
            bounce: 0,
            duration: 0.5,
          },
        }
      : { clipPath: "inset(10% 50% 90% 50%)" },
  };
  return (
    <motion.div
      variants={dropdown}
      onClick={(e) => e.stopPropagation()}
      initial="hidden"
      animate="visible"
      className="w-max px-5 py-2 h-max bg-slate-50 dark:bg-slate-950 dark:bg-opacity-90 absolute top-[54px] right-0 z-[50000] "
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        className="flex flex-col space-y-3"
      >
        <Link to="/admin">
          <motion.div variants={item} className="flex items-center  space-x-5">
            <span className="block w-[30px] h-[30px]">
              <AiOutlineAppstore className="text-3xl" />
            </span>
            <span>Produits</span>
          </motion.div>
        </Link>
        <Link to="/admin/utilisateurs">
          <motion.div variants={item} className="flex items-center  space-x-5">
            <span className="block w-[30px] h-[30px]">
              <FiUsers className="text-3xl" />
            </span>
            <span>Utilisateurs</span>
          </motion.div>
        </Link>
        <Link to="/admin/categories">
          <motion.div variants={item} className="flex items-center  space-x-5">
            <span className="block w-[30px] h-[30px]">
              <BiCategoryAlt className="text-3xl" />
            </span>
            <span>Catégories</span>
          </motion.div>
        </Link>

        <Link to="/admin/commandes">
          <motion.div variants={item} className="flex items-center  space-x-5">
            <span className="block w-[30px] h-[30px]">
              <MdShoppingCartCheckout className="text-3xl" />
            </span>
            <span>Commandes</span>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function SwichTheme({}) {
  const { toggleTheme, dark } = useContext(ThemeContext);
  const [isOn, setIsOn] = useState(dark ? true : false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    toggleTheme();
  };
  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  return (
    <motion.div
      onClick={toggleSwitch}
      className="w-24 h-10 bg-slate-300 dark:bg-opacity-20 rounded-full flex items-center px-2"
    >
      <motion.div
        animate={{
          translateX: isOn ? 50 : 0,
          transition: { duration: 0.3 },
        }}
        transition={spring}
        className="w-8 cursor-pointer h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-900"
      >
        {isOn ? (
          <MdOutlineDarkMode className="text-xl " />
        ) : (
          <MdOutlineLightMode className="text-xl" />
        )}
      </motion.div>
    </motion.div>
  );
}

function SearchContainer({
  produits,
  isLoading,
  isFetching,
  isError,
  success,
  error,
  close
}) {
  // console.log(error);
  return (
    <div className="search-container   z-[7000] w-[700px] flex flex-col space-y-4 p-3 h-[360px] overflow-y-auto bg-slate-100 dark:bg-slate-950 dark:bg-opacity-90  rounded-lg shadow-lg top-10 absolute ">
      {isLoading || isFetching ? (
        <ProductsSearchSkeleton />
      ) : success ? (
        produits?.produit.map((item) => (
          <ProductsSearch produit={item} key={item.id} />
        ))
      ) : (
        isError && (
          <p className="text-center font-bold pt-5 text-lg">
            {error.data.error}
          </p>
        )
      )}
      <div onClick={close} className="absolute right-4 -top-2 cursor-pointer">
        <RxCross1 className="text-xl" />
      </div>
    </div>
  );
}

function ProductsSearch({ produit }) {
  return (
    <Link to={`/produit/${produit.productName}/${produit.id}`}>
      <div className="w-full  flex items-center space-x-5">
        <div className="w-14 h-14 flex items-center justify-center">
          <img
            src={BASE_URL + "/" + produit.image}
            className="w-[90%] h-[90%] object-contain"
            alt=""
          />
        </div>
        <p className="font-semibold">{produit.productName}</p>
      </div>
    </Link>
  );
}

function ProductsSearchSkeleton({}) {
  return (
    <>
      {[7, 8, 20, 14].map((item) => (
        <div key={item} className="w-full  flex items-center space-x-5">
          <Skeleton width={56} height={56} />
          <Skeleton width={600} height={30} />
        </div>
      ))}
    </>
  );
}
