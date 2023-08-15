import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { container, item } from "../../utils/variants";
import { SlOptionsVertical } from "react-icons/sl";
import { RxCross1 } from "react-icons/rx";
import { RiImageAddLine } from "react-icons/ri";
import { MdModeEditOutline } from "react-icons/md";
import { FcFullTrash } from "react-icons/fc";
import Modal from "../../components/Modal/Modal";
import { useUploadImageMutation } from "../../redux/slices/uploadImageSlice";
import CircleLoader from "../../components/CircleLoader/CircleLoader";
import { BASE_URL } from "../../redux/constants";

import {
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useGetCategoryByIdQuery,
  useDeleteCategoryMutation,
} from "../../redux/slices/categorySlice";
import Success from "../../components/Success/Success";
import { VscError } from "react-icons/vsc";
import Message from "../../components/Message/Message";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryAdminPage = () => {
  const [addModal, setAddModal] = useState(false);
  const toggleAddModal = () => setAddModal(!addModal);
  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = () => setUpdateModal(!updateModal);
  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const { data, isLoading, isFetching, isSuccess, refetch } =
    useGetCategoryQuery();

  const [selectedId, setSelectedId] = useState("");
  return (
    <>
      <h1 className="text-3xl font-semibold text-center py-4">
        Liste des catégories
      </h1>
      <div className="px-[5%] w-full h-screen">
        <div className="w-full h-max flex justify-end">
          <button
            onClick={toggleAddModal}
            className=" bg-green-900 text-white rounded-full px-4 py-2 "
          >
            Ajouter une catégorie
          </button>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-wrap "
        >
          {isLoading &&
            [1, 2, 3].map((tab) => <CategorieItemSkeleton key={tab} />)}
          {isSuccess &&
            data?.data.map((item) => (
              <CategorieListItem
                data={item}
                key={item.id}
                setSelectedId={setSelectedId}
                toggleUpdateModal={toggleUpdateModal}
                toggleDeleteModal={toggleDeleteModal}
              />
            ))}
        </motion.div>
      </div>
      <AnimatePresence>
        {addModal && (
          <AddModal toggleAddModal={toggleAddModal} refetch={refetch} />
        )}
        {updateModal && (
          <UpdateModal
            toggleUpdateModal={toggleUpdateModal}
            refetch={refetch}
            id={selectedId}
          />
        )}
        {deleteModal && (
          <DeleteModal
            toggleDeleteModal={toggleDeleteModal}
            refetch={refetch}
            selectedId={selectedId}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoryAdminPage;

function CategorieListItem({
  data,
  toggleUpdateModal,
  setSelectedId,
  toggleDeleteModal,
}) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  return (
    <motion.div
      variants={item}
      className="w-[30%] rounded-lg h-[435px] bg-slate-300 py-2 m-2 text-black dark:text-white dark:bg-slate-900"
    >
      <div className="h-[250px] w-full flex items-center justify-center relative">
        <img
          src={BASE_URL + "/" + data.backgroundPhoto}
          alt=""
          className="w-full h-full object-contain"
        />
        <span
          onClick={toggleOpen}
          className="absolute top-0 right-2 w-10 h-10 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center cursor-pointer"
        >
          <SlOptionsVertical className="text-xl" />
        </span>
        <OptionsFunctionnality
          id={data.id}
          setSelectedId={setSelectedId}
          toggleUpdateModal={toggleUpdateModal}
          toggleDeleteModal={toggleDeleteModal}
          open={open}
        />
      </div>
      <p className="px-2">
        {" "}
        <span className="font-semibold">Nom du catégorie</span> :{" "}
        {data.categoryName}
      </p>
      <p className="px-2">
        {" "}
        <span className="font-semibold">Description</span> :{" "}
        {data.categorieDescription}
      </p>
      <div className="flex items-center space-x-5 px-2 mb-2">
        <span className="font-semibold">Image du catégorie</span>
        <div className="w-12 h-15 ">
          <img
            src={BASE_URL + "/" + data.photo}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}

function OptionsFunctionnality({
  open,
  setSelectedId,
  toggleUpdateModal,
  id,
  toggleDeleteModal,
}) {
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

  const updateFunc = () => {
    setSelectedId(id);
    toggleUpdateModal();
  };

  const deleteFunc = () => {
    setSelectedId(id);
    toggleDeleteModal();
  };

  return (
    <motion.div
      variants={dropdown}
      onClick={(e) => e.stopPropagation()}
      initial="hidden"
      animate="visible"
      className="w-max rounded px-3 py-2 h-max dark:text-white   absolute top-[40px] -right-1 z-[50000] "
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        className="flex flex-col justify-center items-center space-y-2 "
      >
        <motion.div
          variants={item}
          onClick={deleteFunc}
          className="flex items-center bg-slate-200 dark:text-white dark:bg-slate-950 p-2 rounded-full justify-center  space-x-5"
        >
          <RxCross1 className="text-2xl text-red-700" />
        </motion.div>

        <motion.div
          variants={item}
          onClick={updateFunc}
          className="flex items-center  bg-slate-200 dark:text-white dark:bg-slate-950 p-2 rounded-full justify-center  space-x-5"
        >
          <MdModeEditOutline className="text-2xl text-blue-700" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function AddModal({ toggleAddModal, refetch }) {
  const [backgroundPhoto, setBackgroundPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [categoryName, setCategorieName] = useState("");
  const [categorieDescription, setCategorieDescrition] = useState("");
  const [bgPhotoError, setBgPhotoError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [uploadImage, { isLoading: loadingUpload }] = useUploadImageMutation();
  const [createCategory, { isLoading: loading, isSuccess, isError }] =
    useCreateCategoryMutation();

  const [showContent, setShowContent] = useState(true);

  const uploadFileHandler = async (e) => {
    const formdata = new FormData();

    formdata.append("image", e.target.files[0]);

    try {
      const res = await uploadImage(formdata).unwrap();
      if (e.target.name === "background") setBackgroundPhoto(res.filename);
      else setPhoto(res.filename);
    } catch (error) {
      console.log(error);
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    try {
      setShowContent(false);
      const res = await createCategory({
        categorieDescription,
        categoryName,
        photo,
        backgroundPhoto,
      }).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

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
      options={showContent ? "w-[600px] min-h-[600px]" : "w-[500px] h-[300px]"}
    >
      {showContent && (
        <div>
          <h1 className="dark:text-white text-center text-2xl font-semibold">
            Ajouter une catégorie
          </h1>
          <form
            action=""
            onSubmit={formHandler}
            className="w-full h-auto px-3 mt-2"
          >
            <div className="w-full h-[250px] border border-dashed relative ">
              <div className="w-full h-full flex items-center justify-center flex-col">
                <input
                  type="file"
                  name="background"
                  onChange={uploadFileHandler}
                  className="w-full h-full opacity-0 absolute cursor-pointer z-50"
                />
                {backgroundPhoto === null ? (
                  <>
                    <RiImageAddLine className="dark:text-white text-8xl" />
                    <p className="dark:text-white">
                      Choisir une image de fond pour la catégorie
                    </p>
                  </>
                ) : loadingUpload ? (
                  <div className="w-full h-full  flex items-center justify-center absolute">
                    <CircleLoader
                      options="w-[50%]"
                      white={"dark:stroke-white"}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full absolute flex items-center justify-center z-10">
                    <img
                      src={BASE_URL + "/" + backgroundPhoto}
                      className="w-[95%] h-[95%] object-contain"
                    />
                  </div>
                )}
              </div>
              <p className="text-red-500 text-sm text-center">{bgPhotoError}</p>
              <div className="py-2 grid  grid-cols-[max-content,1fr] items-center ">
                <label className="dark:text-white " htmlFor="">
                  Nom du catégorie :{" "}
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategorieName(e.target.value)}
                  className={`bg-transparent
            outline-none dark:text-white py-1 border-b-2 dark:border-b-slate-400 ${
              nameError !== "" && " dark:border-b-red-600 border-b-red-600 "
            } text-lg px-2`}
                />
              </div>

              <div className="py-1 grid  grid-cols-[max-content,1fr] items-center ">
                <label className="dark:text-white " htmlFor="">
                  Description :{" "}
                </label>
                <input
                  type="text"
                  value={categorieDescription}
                  onChange={(e) => setCategorieDescrition(e.target.value)}
                  className={`bg-transparent
              outline-none dark:text-white py-1 border-b-2 dark:border-b-slate-400 ${
                descriptionError !== "" &&
                " dark:border-b-red-600 border-b-red-600 "
              } text-lg px-2`}
                />
              </div>
              <div className="py-1 grid  grid-cols-[max-content,1fr,max-content] items-center space-x-2 relative ">
                <label className="dark:text-white " htmlFor="">
                  Image du catégorie :{" "}
                </label>
                <div className="w-20 h-20 border border-dashed flex items-center justify-center relative">
                  <input
                    type="file"
                    name="photo"
                    onChange={uploadFileHandler}
                    className="w-full h-full opacity-0 absolute cursor-pointer z-50"
                  />
                  {photo === null ? (
                    <>
                      <RiImageAddLine className="dark:text-white text-4xl " />
                    </>
                  ) : loadingUpload ? (
                    <div className="w-full h-full  flex items-center justify-center absolute">
                      <CircleLoader
                        options="w-[40%]"
                        white={"dark:stroke-white"}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full absolute flex items-center justify-center z-10">
                      <img
                        src={BASE_URL + "/" + photo}
                        className="w-[95%] h-[95%] object-contain"
                      />
                    </div>
                  )}
                </div>
                <p className="text-red-500 text-sm text-center">{photoError}</p>
              </div>
              <div className="flex items-center justify-center space-x-6 my-4">
                <button
                  className="py-2 px-12 text-lg text-white bg-indigo-800 rounded cursor-pointer"
                  type="submit"
                >
                  Ajouter
                </button>
                <button
                  onClick={toggleAddModal}
                  type="button"
                  className="py-2 px-12 text-lg text-white bg-red-600 rounded cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {!showContent &&
        (loading ? (
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

function CategorieItemSkeleton() {
  return (
    <motion.div
      variants={item}
      className="w-[30%] rounded-lg h-[435px] bg-slate-300 py-2 m-2"
    >
      <div className="h-[250px] w-full flex items-center justify-center relative">
        <Skeleton width={250} height={250} />
        <Skeleton circle className="w-10 h-10 " />
      </div>
      <p className="px-2">
        {" "}
        <span className="font-semibold">Nom du catégorie</span> :{" "}
        <Skeleton className="w-10 h-4" />
      </p>
      <p className="px-2">
        {" "}
        <span className="font-semibold">Description</span> :{" "}
        <Skeleton className="w-10 h-4" />
      </p>
      <div className="flex items-center space-x-5 px-2 mb-2">
        <span className="font-semibold">Image du catégorie</span>
        <Skeleton width={60} height={60} />
      </div>
    </motion.div>
  );
}

function UpdateModal({ toggleUpdateModal, refetch, id }) {
  const [backgroundPhoto, setBackgroundPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [categoryName, setCategorieName] = useState("");
  const [categorieDescription, setCategorieDescrition] = useState("");
  const [bgPhotoError, setBgPhotoError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [uploadImage, { isLoading: loadingUpload }] = useUploadImageMutation();
  const [updateCategory, { isLoading: loading, isSuccess, isError }] =
    useUpdateCategoryMutation();

  const { data: category, isSuccess: successCat } = useGetCategoryByIdQuery(id);
  const [showContent, setShowContent] = useState(true);

  const uploadFileHandler = async (e) => {
    const formdata = new FormData();

    formdata.append("image", e.target.files[0]);

    try {
      const res = await uploadImage(formdata).unwrap();
      if (e.target.name === "background") setBackgroundPhoto(res.filename);
      else setPhoto(res.filename);
    } catch (error) {
      console.log(error);
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    try {
      setShowContent(false);
      const res = await updateCategory({
        categorieDescription,
        categoryName,
        photo,
        backgroundPhoto,
        id,
      }).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleUpdateModal();
      }, 2000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (successCat) {
      setBackgroundPhoto(category?.data.backgroundPhoto);
      setCategorieDescrition(category?.data.categorieDescription);
      setCategorieName(category?.data.categoryName);
      setPhoto(category?.data.photo);
    }
  }, [successCat]);

  return (
    <Modal
      closeModal={toggleUpdateModal}
      options={
        showContent ? "w-[600px] min-h-[600px] z-[500]" : "w-[500px] h-[300px]"
      }
    >
      {showContent && (
        <div>
          <h1 className="dark:text-white text-center text-2xl font-semibold">
            Modifier une catégorie
          </h1>
          <form
            action=""
            onSubmit={formHandler}
            className="w-full h-auto px-3 mt-2"
          >
            <div className="w-full h-[250px] border border-dashed relative ">
              <div className="w-full h-full flex items-center justify-center flex-col">
                <input
                  type="file"
                  name="background"
                  onChange={uploadFileHandler}
                  className="w-full h-full opacity-0 absolute cursor-pointer z-50"
                />
                {backgroundPhoto === null ? (
                  <>
                    <RiImageAddLine className="dark:text-white text-8xl" />
                    <p className="dark:text-white">
                      Choisir une image de fond pour la catégorie
                    </p>
                  </>
                ) : loadingUpload ? (
                  <div className="w-full h-full  flex items-center justify-center absolute">
                    <CircleLoader
                      options="w-[50%]"
                      white={"dark:stroke-white"}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full absolute flex items-center justify-center z-10">
                    <img
                      src={BASE_URL + "/" + backgroundPhoto}
                      className="w-[95%] h-[95%] object-contain"
                    />
                  </div>
                )}
              </div>
              <p className="text-red-500 text-sm text-center">{bgPhotoError}</p>
              <div className="py-2 grid  grid-cols-[max-content,1fr] items-center ">
                <label className="dark:text-white " htmlFor="">
                  Nom du catégorie :{" "}
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategorieName(e.target.value)}
                  className={`bg-transparent
            outline-none dark:text-white py-1 border-b-2 dark:border-b-slate-400 ${
              nameError !== "" && " dark:border-b-red-600 border-b-red-600 "
            } text-lg px-2`}
                />
              </div>

              <div className="py-1 grid  grid-cols-[max-content,1fr] items-center ">
                <label className="dark:text-white " htmlFor="">
                  Description :{" "}
                </label>
                <input
                  type="text"
                  value={categorieDescription}
                  onChange={(e) => setCategorieDescrition(e.target.value)}
                  className={`bg-transparent
              outline-none dark:text-white py-1 border-b-2 dark:border-b-slate-400 ${
                descriptionError !== "" &&
                " dark:border-b-red-600 border-b-red-600 "
              } text-lg px-2`}
                />
              </div>
              <div className="py-1 grid  grid-cols-[max-content,1fr,max-content] items-center space-x-2 relative ">
                <label className="dark:text-white " htmlFor="">
                  Image du catégorie :{" "}
                </label>
                <div className="w-20 h-20 border border-dashed flex items-center justify-center relative">
                  <input
                    type="file"
                    name="photo"
                    onChange={uploadFileHandler}
                    className="w-full h-full opacity-0 absolute cursor-pointer z-50"
                  />
                  {photo === null ? (
                    <>
                      <RiImageAddLine className="dark:text-white text-4xl " />
                    </>
                  ) : loadingUpload ? (
                    <div className="w-full h-full  flex items-center justify-center absolute">
                      <CircleLoader
                        options="w-[40%]"
                        white={"dark:stroke-white"}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full absolute flex items-center justify-center z-10">
                      <img
                        src={BASE_URL + "/" + photo}
                        className="w-[95%] h-[95%] object-contain"
                      />
                    </div>
                  )}
                </div>
                <p className="text-red-500 text-sm text-center">{photoError}</p>
              </div>
              <div className="flex items-center justify-center space-x-6 my-4">
                <button
                  className="py-2 px-12 text-lg text-white bg-green-800 rounded cursor-pointer"
                  type="submit"
                >
                  Modifier
                </button>
                <button
                  onClick={toggleUpdateModal}
                  type="button"
                  className="py-2 px-12 text-lg text-white bg-red-600 rounded cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {!showContent &&
        (loading ? (
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

function DeleteModal({ toggleDeleteModal, refetch, selectedId }) {
  const [deleteCategory, { isLoading, isSuccess, isError }] =
    useDeleteCategoryMutation();

  const [showContent, setShowContent] = useState(true);

  const deleteHandler = async () => {
    try {
      setShowContent(false);
      const res = await deleteCategory(selectedId).unwrap();
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
            Voulez vous vraiment supprimer cet catégorie ?
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
