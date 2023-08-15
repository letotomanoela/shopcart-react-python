import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import {
  useGetOrdersQuery,
  useIsDeliveredMutation,
  useIsPaidMutation,
} from "../../redux/slices/orderSlice";
import { BASE_URL } from "../../redux/constants";
import Message from "../../components/Message/Message";
import Success from "../../components/Success/Success";
import { VscError } from "react-icons/vsc";
import { container, item } from "../../utils/variants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { v4 as uuidv4 } from "uuid";
import { FcPaid } from "react-icons/fc";
import { RiImageAddLine, RiAdminFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { MdModeEditOutline, MdDeliveryDining, MdPayment } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";

const CommandeAdminPage = () => {
  const {
    data: orders,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetOrdersQuery();
  const [selectedId, setSelectedId] = useState(null);
  const [isDeliveredModal, setIsDeliveredModal] = useState(false);
  const [isPaidModal, setIsPaidModal] = useState(false);

  const toggleIsDeliveredModal = () => setIsDeliveredModal(!isDeliveredModal);
  const toggleIsPaidModal = () => setIsPaidModal(!isPaidModal);

  return (
    <>
      <h1 className="text-3xl font-semibold text-center text-black dark:text-white py-4">
        Liste des commandes
      </h1>
      <div className="px-[2%] w-full min-h-screen">
        <div className="py-3">
          <OrderRow className="bg-slate-200 text-black py-2 px-2 dark:bg-gray-900 dark:text-white dark:duration-300 duration-300">
            <p>Id</p>
            <p>Utilisateur</p>
            <p>Produits</p>
            <p>Payé</p>
            <p>Livré</p>
            <p>Date de paiement</p>
            <p>Date de Livraison</p>
            <p>Type de paiement</p>
            <p>Prix total</p>
            <p>Actions</p>
          </OrderRow>
          <motion.div variants={container} initial="hidden" animate="visible">
            {isLoading ? (
              <SkeletonLoading />
            ) : (
              isSuccess && (
                <Tbody
                  toggleIsDeliveredModal={toggleIsDeliveredModal}
                  toggleIsPaidModal={toggleIsPaidModal}
                  setSelectedId={setSelectedId}
                  orders={orders?.commandes}
                />
              )
            )}
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isDeliveredModal && (
          <IsDeliveredModal
            refetch={refetch}
            toggleIsDeliveredModal={toggleIsDeliveredModal}
            selectedId={selectedId}
          />
        )}

        {isPaidModal && (
          <IsPaidModal
            refetch={refetch}
            toggleIsPaidModal={toggleIsPaidModal}
            selectedId={selectedId}
          />
        )}
      </AnimatePresence>
    </>
  );
};

function OrderRow({ children, className }) {
  return (
    <>
      <motion.div
        variants={item}
        className={`w-full py-2 text-black dark:text-white grid space-x-2  grid-cols-[1fr,1fr,1fr,70px,70px,120px,120px,120px,120px,120px] ${className} items-center justify-center`}
      >
        {children}
      </motion.div>
    </>
  );
}

function Tbody({
  orders,
  toggleIsDeliveredModal,
  toggleIsPaidModal,
  setSelectedId,
}) {
  console.log(orders);
  return (
    <>
      {orders.map((order) => (
        <OrderRow key={order.id}>
          <p>{order.id}</p>
          <div className="flex items-center space-x-3 text-black dark:text-white">
            <img
              src={BASE_URL + "/" + order.user.avatar}
              alt=""
              className="w-12 h-12 object-cover overflow-hidden rounded-full"
            />
            <span>{order.user.fullname}</span>
          </div>
          <div>
            {order.commandesItems.map((item) => (
              <div className="flex items-center space-x-2" key={item.id}>
                <p>{item.produit.productName}</p>
              </div>
            ))}
          </div>
          <p>{order.isPaid}</p>
          <p>{order.isDelivered}</p>
          <p>{new Date(order.paidAt).toLocaleDateString()}</p>
          <p>
            {order.deliveredAt !== null
              ? new Date(order.deliveredAt).toLocaleDateString()
              : order.deliveredAt}
          </p>
          <p>{order.payementMethod}</p>
          <p>{order.totalPrix}</p>
          <div>
            {
              <Actions
                id={order.id}
                paid={order.isPaid}
                delivered={order.isDelivered}
                setSelectedId={setSelectedId}
                openIsDelivered={toggleIsDeliveredModal}
                openIsPaid={toggleIsPaidModal}
              />
            }
          </div>
        </OrderRow>
      ))}
    </>
  );
}

function SkeletonLoading({}) {
  const product = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <>
      {product.map((item) => (
        <OrderRow
          key={uuidv4()}
          className="px-2 border-b border-b-slate-500 text-black dark:text-white "
        >
          <p>
            <Skeleton width={100} height={19} />
          </p>
          <p className="flex items-center space-x-2 ">
            <Skeleton width={60} height={60} circle />
            <Skeleton width={100} height={19} />
          </p>
          <p className="flex items-center ">
            <Skeleton width={100} height={19} />
          </p>
          <p>
            <Skeleton width={100} height={19} />
          </p>

          <p>
            <Skeleton width={100} height={19} />
          </p>
          <p>
            <Skeleton width={100} height={19} />
          </p>
          <p>
            <Skeleton width={100} height={19} />
          </p>
          <div className="flex items-center ">
            <Skeleton width={50} height={19} />
          </div>
          <div className="flex items-center ">
            <Skeleton width={50} height={19} />
          </div>

          <div className="flex items-center space-x-3">
            <Skeleton width={40} height={40} circle />
            <Skeleton width={40} height={40} circle />
          </div>
        </OrderRow>
      ))}
    </>
  );
}

function Actions({
  id,
  setSelectedId,
  openIsDelivered,
  openIsPaid,
  paid,
  delivered,
}) {
  const deliveredFunc = () => {
    setSelectedId(id);
    openIsDelivered();
  };

  const paidFunc = () => {
    setSelectedId(id);
    openIsPaid();
  };

  return (
    <div className="w-full  justify-center flex items-center space-x-4">
      {paid === "NON PAYE" && (
        <MdPayment
          onClick={paidFunc}
          className="text-3xl text-green-900 cursor-pointer"
        />
      )}
      {delivered === null && (
        <MdDeliveryDining
          onClick={deliveredFunc}
          className="text-3xl text-yellow-900 cursor-pointer"
        />
      )}
    </div>
  );
}

function IsDeliveredModal({ toggleIsDeliveredModal, refetch, selectedId }) {
  const [isDelivered, { isLoading, isSuccess, isError }] =
    useIsDeliveredMutation();
  const [showContent, setShowContent] = useState(true);

  const isDeliveredHandler = async () => {
    try {
      const res = await isDelivered({ id: selectedId }).unwrap();
      setShowContent(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleIsDeliveredModal();
      }, 1500);
    }
  }, [isSuccess]);

  return (
    <Modal
      closeModal={toggleIsDeliveredModal}
      flip={true}
      options="w-[550px] h-[350px]"
    >
      {showContent && (
        <div>
          <h1 className="text-center text-2xl text-black dark:text-white font-semibold">
            Cet commande a été vraiment livré ?
          </h1>
          <div className="w-full h-max py-6 flex items-center justify-center">
            <TbTruckDelivery className="text-[150px] text-yellow-900" />
          </div>
          <div className="w-full flex items-center justify-center space-x-6 my-4">
            <button
              onClick={isDeliveredHandler}
              className="py-2 px-12 text-lg text-white bg-indigo-800 rounded cursor-pointer"
            >
              OUI
            </button>
            <button
              type="button"
              onClick={toggleIsDeliveredModal}
              className="py-2 px-12 text-lg text-white bg-red-600 rounded cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      {!showContent &&
        (isLoading ? (
          <Message
            icon={
              <CircleLoader white={"dark:stroke-white"} options="w-[30%]" />
            }
            message="Modification en cours"
          />
        ) : isSuccess ? (
          <Message icon={<Success />} message="Modification réussi" />
        ) : (
          isError && (
            <Message
              icon={<VscError className="text-red-500 text-8xl" />}
              message={"Une erreur s'est produite"}
            />
          )
        ))}
    </Modal>
  );
}
function IsPaidModal({ toggleIsPaidModal, refetch, selectedId }) {
  const [isPaid, { isLoading, isSuccess, isError }] = useIsPaidMutation();
  const [showContent, setShowContent] = useState(true);

  const isPaidHandler = async () => {
    try {
      const res = await isPaid({ id: selectedId }).unwrap();
      setShowContent(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleIsPaidModal();
      }, 1500);
    }
  }, [isSuccess]);

  return (
    <Modal
      closeModal={toggleIsPaidModal}
      flip={true}
      options="w-[550px] h-[350px]"
    >
      {showContent && (
        <div>
          <h1 className="text-center text-2xl text-black dark:text-white font-semibold">
            Cet commande a été vraiment payé ?
          </h1>
          <div className="w-full h-max py-6 flex items-center justify-center">
            <FcPaid className="text-[150px] " />
          </div>
          <div className="w-full flex items-center justify-center space-x-6 my-4">
            <button
              onClick={isPaidHandler}
              className="py-2 px-12 text-lg text-white bg-indigo-800 rounded cursor-pointer"
            >
              OUI
            </button>
            <button
              type="button"
              onClick={toggleIsPaidModal}
              className="py-2 px-12 text-lg text-white bg-red-600 rounded cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      {!showContent &&
        (isLoading ? (
          <Message
            icon={
              <CircleLoader white={"dark:stroke-white"} options="w-[30%]" />
            }
            message="Modification en cours"
          />
        ) : isSuccess ? (
          <Message icon={<Success />} message="Modification réussi" />
        ) : (
          isError && (
            <Message
              icon={<VscError className="text-red-500 text-8xl" />}
              message={"Une erreur s'est produite"}
            />
          )
        ))}
    </Modal>
  );
}

export default CommandeAdminPage;
