import React, { useState, useEffect } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { MdModeEditOutline } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import GridRow from "../../components/Grid/GridRow";
import Modal from "../../components/Modal/Modal";
import { BASE_URL } from "../../redux/constants";
import CircleLoader from "../../components/CircleLoader/CircleLoader";
import { useGetCategoryQuery } from "../../redux/slices/categorySlice";
import { useUploadImageMutation } from "../../redux/slices/uploadImageSlice";
import {
  useCreateProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../redux/slices/productSlice";
import Message from "../../components/Message/Message";
import Success from "../../components/Success/Success";
import { VscError } from "react-icons/vsc";
import { container, item } from "../../utils/variants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { v4 as uuidv4 } from "uuid";
import { FcFullTrash } from "react-icons/fc";
import Listbox from "../../components/Listbox/Listbox";

const ProductAdminPage = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const toggleAddModal = () => setShowAdd(!showAdd);
  const toggleDeleteModal = () => setShowDelete(!showDelete);
  const toggleUpdateModal = () => setShowUpdate(!showUpdate);

  const [selectedId, setSelectedId] = useState(null);
  const {
    data: products,
    refetch,
    isSuccess,
    isLoading,
  } = useGetProductsQuery();
  return (
    <>
      <h1 className="text-3xl font-semibold text-center text-black dark:text-white py-4">
        Liste des produits
      </h1>
      <div className="px-[3%] w-full min-h-screen">
        <div className="w-full h-max flex justify-end">
          <button
            onClick={toggleAddModal}
            className=" bg-green-900  text-white rounded-full px-4 py-2 "
          >
            Ajouter un produit
          </button>
        </div>
        <div className="py-3">
          <GridRow className="bg-slate-200 text-black py-2 px-2 dark:bg-gray-900 dark:text-white dark:duration-300 duration-300">
            <p>Id</p>
            <p>Nom</p>
            <p>Catégorie</p>
            <p>Image</p>
            <p>Prix</p>
            <p>Qte en stock</p>
            <p>Couleur</p>
            <p>Code couleur</p>
            <p className="text-center">Actions</p>
          </GridRow>
          <motion.div variants={container} initial="hidden" animate="visible">
            {isLoading ? (
              <SkeletonLoading />
            ) : (
              isSuccess && (
                <Tbody
                  toggleDeleteModal={toggleDeleteModal}
                  toggleUpdateModal={toggleUpdateModal}
                  product={products.data}
                  setSelectedId={setSelectedId}
                />
              )
            )}
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showAdd && (
          <AddModal toggleAddModal={toggleAddModal} refetch={refetch} />
        )}
        {showDelete && (
          <DeleteModal
            toggleDeleteModal={toggleDeleteModal}
            refetch={refetch}
            selectedId={selectedId}
          />
        )}
        {showUpdate && (
          <UpdateModal
            toggleUpdateModal={toggleUpdateModal}
            refetch={refetch}
            selectedId={selectedId}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductAdminPage;

function Tbody({
  product,
  toggleDeleteModal,
  setSelectedId,
  toggleUpdateModal,
}) {
  return (
    <>
      {product.map((item) => (
        <GridRow
          key={item.id}
          className="px-2 border-b border-b-slate-500 text-black dark:text-white "
        >
          <p>{item.id}</p>
          <p>{item.productName}</p>
          <p>{item.categorie?.categoryName}</p>

          <p className="flex items-center ">
            <img
              className="w-16 h-16 object-contain"
              src={BASE_URL + "/" + item.image}
            />
          </p>
          <p>{item.prix}</p>
          <p>{item.qteStock}</p>
          <p>{item.color}</p>
          <div className="flex items-center ">
            <div className={`w-12 h-12 rounded-full ${item.colorCode}`}></div>
          </div>

          <div>
            <Actions
              id={item.id}
              openDelete={toggleDeleteModal}
              openUpdate={toggleUpdateModal}
              setSelectedId={setSelectedId}
            />
          </div>
        </GridRow>
      ))}
    </>
  );
}

function Actions({ id, openDelete, setSelectedId, openUpdate }) {
  const deleteFunc = () => {
    setSelectedId(id);
    openDelete();
  };

  const updateFunc = () => {
    setSelectedId(id);
    openUpdate();
  };
  return (
    <div className="w-full  justify-center flex items-center space-x-4">
      <RxCross1
        className="text-2xl text-red-600 cursor-pointer"
        onClick={deleteFunc}
      />
      <MdModeEditOutline
        className="text-2xl text-green-600  "
        onClick={updateFunc}
      />
    </div>
  );
}

function AddModal({ toggleAddModal, refetch }) {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [qteStock, setQteStock] = useState("");
  const [prix, setPrix] = useState("");
  const [color, setColor] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showContent, setShowContent] = useState(true);

  const [uploadImage, { isLoading: loadingUpload }] = useUploadImageMutation();
  const [createProduct, { isLoading, isSuccess, isError }] =
    useCreateProductMutation();

  const uploadFileHandler = async (e) => {
    const formdata = new FormData();

    formdata.append("image", e.target.files[0]);

    try {
      const res = await uploadImage(formdata).unwrap();
      setImage(res.filename);
    } catch (error) {
      console.log(error);
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    if (image === null) return;
    if (productName === "") return;
    if (description === "") return;
    if (qteStock === "") return;
    if (prix === "") return;
    if (color === "") return;
    if (colorCode === "") return;
    if (categoryId === "") return;

    try {
      setShowContent(false);
      const res = await createProduct({
        image,
        productName,
        description,
        qteStock,
        color,
        colorCode,
        prix,
        categoryId,
      }).unwrap();

      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const { data } = useGetCategoryQuery();

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleAddModal();
      }, 2000);
    }
  }, [isSuccess]);
  return (
    <Modal
      closeModal={toggleAddModal}
      options={showContent ? "w-[600px] min-h-[550px]" : "w-[500px] h-[300px]"}
    >
      {showContent && (
        <div className="text-black">
          <h2 className="dark:text-white text-black text-center text-2xl font-semibold">
            Ajouter un produit
          </h2>
          <form onSubmit={formHandler} action="" className="my-2">
            <div className="w-full h-[100px] relative border-slate-950 dark:border-white border border-dashed flex items-center justify-center flex-col">
              <input
                type="file"
                name="photo"
                onChange={uploadFileHandler}
                className="w-full h-full opacity-0 absolute cursor-pointer z-50"
              />
              {image === null ? (
                <>
                  <RiImageAddLine className="dark:text-white text-8xl" />
                  <p className="dark:text-white">Choisir une image</p>
                </>
              ) : loadingUpload ? (
                <div className="w-full h-full  flex items-center justify-center absolute">
                  <CircleLoader options="w-[30%]" white={"dark:stroke-white"} />
                </div>
              ) : (
                <div className="w-full h-[100px] absolute flex items-center justify-center z-10">
                  <img
                    src={BASE_URL + "/" + image}
                    className="w-[95%] h-[95%] object-contain"
                  />
                </div>
              )}
            </div>

            <div className="py-2 grid  grid-cols-[max-content,1fr] items-center ">
              <label className="dark:text-white " htmlFor="">
                Nom du produit :{" "}
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className={`bg-transparent
            outline-none dark:text-white py-1 border-b-2 border-slate-800 dark:border-b-slate-400  text-lg px-2`}
              />
            </div>
            <div className="py-2 grid  grid-cols-[max-content,1fr] items-center ">
              <label className="dark:text-white " htmlFor="">
                Déscription :{" "}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`bg-transparent
            outline-none dark:text-white border-slate-800 py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
              />
            </div>
            <div className="py-2 grid  grid-cols-[2fr,1fr] items-center ">
              <div className="grid  grid-cols-[max-content,1fr] items-center">
                <label className="dark:text-white " htmlFor="">
                  Prix :
                </label>
                <input
                  type="number"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  className={`bg-transparent
            outline-none dark:text-white border-slate-800 py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
                />
              </div>
              <div className="grid  grid-cols-[max-content,1fr] items-center">
                <label className="dark:text-white " htmlFor="">
                  Quantité :
                </label>
                <input
                  type="number"
                  value={qteStock}
                  onChange={(e) => setQteStock(e.target.value)}
                  className={`bg-transparent w-3/4
            outline-none dark:text-white border-slate-800 py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
                />
              </div>
            </div>
            <div className="py-2 grid  grid-cols-[1fr,1fr] items-center ">
              <div className="grid  grid-cols-[max-content,1fr] items-center">
                <label className="dark:text-white " htmlFor="">
                  Couleur :
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={`bg-transparent border-slate-800
            outline-none dark:text-white py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
                />
              </div>
              <div className="grid  grid-cols-[max-content,1fr] items-center">
                <label className="dark:text-white " htmlFor="">
                  Code couleur:
                </label>
                <input
                  type="text"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                  className={`bg-transparent w-3/4
            outline-none dark:text-white py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
                />
              </div>
            </div>
            <div className="py-2 grid  grid-cols-[max-content,1fr] space-x-3 items-center">
              <p className="dark:text-white">Choisir une catégorie : </p>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className=" text-white bg-slate-700 dark:bg-slate-500 outline-none py-2"
                name=""
                id=""
              >
                <option value="">Choisir une catégorie</option>
                {data?.data.map((opt) => (
                  <option className="py-2" key={opt.id} value={opt.id}>
                    {opt.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex items-center justify-center space-x-6 my-4">
              <button
                className="py-2 px-12 text-lg text-white bg-indigo-800 rounded cursor-pointer"
                type="submit"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={toggleAddModal}
                className="py-2 px-12 text-lg text-white bg-red-600 rounded cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </form>
        </div>
      )}
      {!showContent &&
        (isLoading ? (
          <Message
            icon={
              <CircleLoader white={"dark:stroke-white"} options="w-[30%]" />
            }
            message="Ajout en cours"
          />
        ) : isSuccess ? (
          <Message icon={<Success />} message="Ajout réussi" />
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

function SkeletonLoading({}) {
  const product = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <>
      {product.map((item) => (
        <GridRow
          key={uuidv4()}
          className="px-2 border-b border-b-slate-500 text-black dark:text-white "
        >
          <p>
            <Skeleton width={100} height={19} />
          </p>
          <p>
            <Skeleton width={100} height={19} />
          </p>

          <p className="flex items-center ">
            <Skeleton width={60} height={60} circle />
          </p>
          <p>
            <Skeleton width={100} height={19} />
          </p>
          <p>
            <Skeleton width={50} height={19} />
          </p>
          <p>
            <Skeleton width={50} height={19} />
          </p>
          <div className="flex items-center ">
            <Skeleton width={60} height={60} circle />
          </div>

          <div className="flex items-center space-x-3">
            <Skeleton width={40} height={40} circle />
            <Skeleton width={40} height={40} circle />
          </div>
        </GridRow>
      ))}
    </>
  );
}

function DeleteModal({ toggleDeleteModal, refetch, selectedId }) {
  const [deleteProduct, { isLoading, isSuccess, isError }] =
    useDeleteProductMutation();

  const [showContent, setShowContent] = useState(true);

  const deleteHandler = async () => {
    try {
      const res = await deleteProduct(selectedId).unwrap();
      setShowContent(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleDeleteModal();
      }, 1500);
    }
  }, [isSuccess]);

  return (
    <Modal closeModal={toggleDeleteModal} options="w-[550px] h-[350px]">
      {showContent && (
        <div>
          <h1 className="text-center text-xl font-semibold">
            Voulez vous vraiment supprimer cet produit ?
          </h1>
          <div className="w-full h-max py-6 flex items-center justify-center">
            <FcFullTrash className="text-[150px]" />
          </div>
          <div className="w-full flex items-center justify-center space-x-6 my-4">
            <button
              onClick={deleteHandler}
              className="py-2 px-12 text-lg text-white bg-indigo-800 rounded cursor-pointer"
            >
              Supprimer
            </button>
            <button
              type="button"
              onClick={toggleDeleteModal}
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
            message="Suppression en cours"
          />
        ) : isSuccess ? (
          <Message icon={<Success />} message="Suppression réussi" />
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

function UpdateModal({ toggleUpdateModal, refetch, selectedId }) {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [qteStock, setQteStock] = useState("");
  const [prix, setPrix] = useState("");
  const [color, setColor] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showContent, setShowContent] = useState(true);

  const [uploadImage, { isLoading: loadingUpload }] = useUploadImageMutation();

  const [updateProduct, { isLoading, isSuccess, isError }] =
    useUpdateProductMutation();

  const uploadFileHandler = async (e) => {
    const formdata = new FormData();

    formdata.append("image", e.target.files[0]);

    try {
      const res = await uploadImage(formdata).unwrap();
      setImage(res.filename);
    } catch (error) {
      console.log(error);
    }
  };

  const { data } = useGetCategoryQuery();
  const { data: productData, isSuccess: isProduct } =
    useGetProductByIdQuery(selectedId);
  const formHandler = async (e) => {
    e.preventDefault();
    if (image === null) return;
    if (productName === "") return;
    if (description === "") return;
    if (qteStock === "") return;
    if (prix === "") return;
    if (color === "") return;
    if (colorCode === "") return;
    if (categoryId === "") return;

    try {
      const res = await updateProduct({
        image,
        productName,
        description,
        qteStock,
        color,
        colorCode,
        prix,
        categoryId,
        id: selectedId,
      }).unwrap();
      setShowContent(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  function updateState() {
    setImage(productData?.produit.image);
    setProductName(productData?.produit.productName);
    setDescription(productData?.produit.description);
    setQteStock(productData?.produit.qteStock);
    setPrix(productData?.produit.prix);
    setColor(productData?.produit.color);
    setColorCode(productData?.produit.colorCode);
    setCategoryId(productData?.produit?.categorie?.id);
  }

  useEffect(() => {
    if (isProduct) {
      updateState();
    }
  }, [isProduct]);
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleUpdateModal();
      }, 2000);
    }
  }, [isSuccess]);

  return (
    <Modal
      closeModal={toggleUpdateModal}
      options={showContent ? "w-[600px] min-h-[550px]" : "w-[500px] h-[300px]"}
    >
      {showContent && (
        <div>
          <h2 className="dark:text-white text-black  text-center text-2xl font-semibold">
            Modifier un produit
          </h2>
          <form onSubmit={formHandler} action="" className="my-2 text-black">
            <div className="w-full h-[100px] relative border-slate-950 dark:border-white border border-dashed flex items-center justify-center flex-col">
              <input
                type="file"
                name="photo"
                onChange={uploadFileHandler}
                className="w-full h-full opacity-0 absolute cursor-pointer z-50"
              />
              {image === null ? (
                <>
                  <RiImageAddLine className="dark:text-white text-8xl" />
                  <p className="dark:text-white">Choisir une image</p>
                </>
              ) : loadingUpload ? (
                <div className="w-full h-full  flex items-center justify-center absolute">
                  <CircleLoader options="w-[30%]" white={"dark:stroke-white"} />
                </div>
              ) : (
                <div className="w-full h-[100px] absolute flex items-center justify-center z-10">
                  <img
                    src={BASE_URL + "/" + image}
                    className="w-[95%] h-[95%] object-contain"
                  />
                </div>
              )}
            </div>

            <div className="py-2 grid  grid-cols-[max-content,1fr] items-center ">
              <label className="dark:text-white " htmlFor="">
                Nom du produit :{" "}
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className={`bg-transparent
            outline-none dark:text-white py-1 border-b-2 border-slate-800 dark:border-b-slate-400  text-lg px-2`}
              />
            </div>
            <div className="py-2 grid  grid-cols-[max-content,1fr] items-center ">
              <label className="dark:text-white " htmlFor="">
                Déscription :{" "}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`bg-transparent
            outline-none dark:text-white border-slate-800 py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
              />
            </div>
            <div className="py-2 grid  grid-cols-[2fr,1fr] items-center ">
              <div className="grid  grid-cols-[max-content,1fr] items-center">
                <label className="dark:text-white " htmlFor="">
                  Prix :
                </label>
                <input
                  type="number"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  className={`bg-transparent
            outline-none dark:text-white border-slate-800 py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
                />
              </div>
              <div className="grid  grid-cols-[max-content,1fr] items-center">
                <label className="dark:text-white " htmlFor="">
                  Quantité :
                </label>
                <input
                  type="number"
                  value={qteStock}
                  onChange={(e) => setQteStock(e.target.value)}
                  className={`bg-transparent w-3/4
            outline-none dark:text-white border-slate-800 py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
                />
              </div>
            </div>
            <div className="py-2 grid  grid-cols-[1fr,1fr] items-center ">
              <div className="grid  grid-cols-[max-content,1fr] items-center">
                <label className="dark:text-white " htmlFor="">
                  Couleur :
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={`bg-transparent border-slate-800
            outline-none dark:text-white py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
                />
              </div>
              <div className="grid  grid-cols-[max-content,1fr] items-center">
                <label className="dark:text-white " htmlFor="">
                  Code couleur:
                </label>
                <input
                  type="text"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                  className={`bg-transparent w-3/4
            outline-none dark:text-white py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
                />
              </div>
            </div>
            <div className="py-2 grid  grid-cols-[max-content,1fr] space-x-3 items-center">
              <p className="dark:text-white">Choisir une catégorie : </p>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className=" text-white bg-slate-700 dark:bg-slate-500 outline-none py-2"
                name=""
                id=""
              >
                <option value="">Choisir une catégorie</option>
                {data?.data.map((opt) => (
                  <option className="py-2" key={opt.id} value={opt.id}>
                    {opt.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex items-center justify-center space-x-6 my-4">
              <button
                className="py-2 px-12 text-lg text-white bg-indigo-800 rounded cursor-pointer"
                type="submit"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={toggleUpdateModal}
                className="py-2 px-12 text-lg text-white bg-red-600 rounded cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </form>
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
