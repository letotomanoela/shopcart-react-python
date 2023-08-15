import React, { useState, useEffect } from "react";
import CircleLoader from "../../components/CircleLoader/CircleLoader";
import Modal from "../../components/Modal/Modal";
import {
  useGetUserQuery,
  useChangeUserRoleMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
} from "../../redux/slices/userApiSlice";
import { BASE_URL } from "../../redux/constants";

import { useUploadImageMutation } from "../../redux/slices/uploadImageSlice";

import Message from "../../components/Message/Message";
import Success from "../../components/Success/Success";
import { VscError } from "react-icons/vsc";
import { container, item } from "../../utils/variants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { v4 as uuidv4 } from "uuid";
import { FcFullTrash, FcBusinessman } from "react-icons/fc";
import { RiImageAddLine, RiAdminFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { MdModeEditOutline, MdDeliveryDining,MdPayment } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

const UserAdminPage = () => {
  const [showChangeRole, setShowChangeRole] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const toggleChangeRole = () => setShowChangeRole(!showChangeRole);
  const toggleDeleteModal = () => setShowDelete(!showDelete);
  const toggleUpdateModal = () => setShowUpdate(!showUpdate);

  const [selectedId, setSelectedId] = useState(null);

  const {
    data: users,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetUserQuery();

  return (
    <>
      <h1 className="text-3xl font-semibold text-center text-black dark:text-white py-4">
        Liste des utilisateurs
      </h1>
      <div className="px-[3%] w-full min-h-screen">
        <div className="py-3">
          <UserRow className="bg-slate-200 text-black py-2 px-2 dark:bg-gray-900 dark:text-white dark:duration-300 duration-300">
            <p>Id</p>
            <p>Avatar</p>
            <p>Nom complet</p>
            <p>Adresse</p>
            <p>Email</p>
            <p>Pseudo</p>
            <p>Admin</p>
            <p>Actions</p>
          </UserRow>
          <motion.div variants={container} initial="hidden" animate="visible">
            {isLoading ? (
              <SkeletonLoading />
            ) : (
              isSuccess && (
                <Tbody
                  toggleChangeRole={toggleChangeRole}
                  toggleDeleteModal={toggleDeleteModal}
                  toggleUpdateModal={toggleUpdateModal}
                  users={users?.data}
                  setSelectedId={setSelectedId}
                />
              )
            )}
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showChangeRole && (
          <ChangeRoleModal
            refetch={refetch}
            toggleChangeRole={toggleChangeRole}
            selectedId={selectedId}
          />
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

function UserRow({ children, className }) {
  return (
    <>
      <motion.div
        variants={item}
        className={`w-full py-2 grid space-x-2  grid-cols-[1fr,100px,1fr,1fr,1fr,120px,120px,150px] ${className} items-center justify-center`}
      >
        {children}
      </motion.div>
    </>
  );
}

function Tbody({
  toggleChangeRole,
  toggleDeleteModal,
  toggleUpdateModal,
  setSelectedId,
  users,
}) {
  return (
    <>
      {users.map((user) => (
        <UserRow
          key={user.id}
          className="px-2 border-b border-b-slate-500 text-black dark:text-white "
        >
          <p>{user.id}</p>
          <div>
            {user.avatar !== null && (
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={BASE_URL + "/" + user.avatar}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <p>{user.fullname}</p>
          <p>{user.address}</p>
          <p>{user.email}</p>
          <p>{user.pseudo}</p>
          <p>{user.is_admin === 0 ? "False" : "True"}</p>
          <div>
            <Actions
              id={user.id}
              openChangeRole={toggleChangeRole}
              openDelete={toggleDeleteModal}
              openUpdate={toggleUpdateModal}
              setSelectedId={setSelectedId}
              role={user.is_admin}
            />
          </div>
        </UserRow>
      ))}
    </>
  );
}

function SkeletonLoading({}) {
  const product = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <>
      {product.map((item) => (
        <UserRow
          key={uuidv4()}
          className="px-2 border-b border-b-slate-500 text-black dark:text-white "
        >
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

          <div className="flex items-center space-x-3">
            <Skeleton width={40} height={40} circle />
            <Skeleton width={40} height={40} circle />
            <Skeleton width={40} height={40} circle />
          </div>
        </UserRow>
      ))}
    </>
  );
}

function Actions({
  id,
  setSelectedId,
  openChangeRole,
  openUpdate,
  openDelete,
  role,
}) {
  const deleteFunc = () => {
    setSelectedId(id);
    openDelete();
  };

  const updateFunc = () => {
    setSelectedId(id);
    openUpdate();
  };
  const changeRoleFunc = () => {
    setSelectedId(id);
    openChangeRole();
  };
  return (
    <div className="w-full  justify-center flex items-center space-x-4">
      {role === 0 && (
        <RxCross1
          className="text-2xl text-red-600 cursor-pointer"
          onClick={deleteFunc}
        />
      )}
      <MdModeEditOutline
        className="text-2xl text-green-600  "
        onClick={updateFunc}
      />
      <RiAdminFill
        className="text-2xl text-indigo-600  "
        onClick={changeRoleFunc}
      />
    </div>
  );
}

function ChangeRoleModal({ toggleChangeRole, refetch, selectedId }) {
  const [changeUserRole, { isLoading, isError, isSuccess }] =
    useChangeUserRoleMutation();
  const { data: user, isSuccess: userSuccess } =
    useGetUserByIdQuery(selectedId);
  const [isAdmin, setIsAdmin] = useState(null);

  const [showContent, setShowContent] = useState(true);

  const changeRoleHandler = async () => {
    try {
      const res = await changeUserRole({
        is_admin: isAdmin ? 0 : 1,
        userId: selectedId,
      }).unwrap();
      setShowContent(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleChangeRole();
      }, 1500);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (userSuccess) {
      setIsAdmin(user?.data.is_admin === 0 ? false : true);
    }
  }, [userSuccess]);

  return (
    <Modal closeModal={toggleChangeRole} options="w-[550px] h-[400px]">
      {showContent && (
        <div>
          <h1 className="text-center text-2xl font-semibold text-black dark:text-white">
            {user?.data.is_admin === 0
              ? "Cette utilisateur n'est pas administrateur, voulez vous vraiment le changer en admnistrateur ? "
              : "Cette utilisateur est  administrateur, voulez vous vraiment le changer en simple utilisateur ?"}
          </h1>
          <div className="w-full h-max py-6 flex items-center justify-center">
            <FcBusinessman className="text-[150px]" />
          </div>
          <div className="w-full flex items-center justify-center space-x-6 my-4">
            <button
              onClick={changeRoleHandler}
              className="py-2 px-12 text-lg text-white bg-indigo-800 rounded cursor-pointer"
            >
              Changer
            </button>
            <button
              type="button"
              onClick={toggleChangeRole}
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
            message="Changement en cours"
          />
        ) : isSuccess ? (
          <Message icon={<Success />} message="Changement réussi" />
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

function DeleteModal({ selectedId, toggleDeleteModal, refetch }) {
  const [deleteUser, { isLoading, isSuccess, isError }] =
    useDeleteUserMutation();

  const [showContent, setShowContent] = useState(true);

  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selectedId).unwrap();
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
    <Modal
      closeModal={toggleDeleteModal}
      flip={true}
      options="w-[550px] h-[350px]"
    >
      {showContent && (
        <div>
          <h1 className="text-center text-xl font-semibold">
            Voulez vous vraiment supprimer cet utilisateur ?
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

function UpdateModal({ selectedId, refetch, toggleUpdateModal }) {
  const [avatar, setAvatar] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [showContent, setShowContent] = useState(true);

  const [updateUser, { isLoading, isError, isSuccess }] =
    useUpdateUserMutation();

  const { data: user, isSuccess: userSuccess } =
    useGetUserByIdQuery(selectedId);
  const [uploadImage, { isLoading: loadingUpload }] = useUploadImageMutation();

  const uploadFileHandler = async (e) => {
    const formdata = new FormData();

    formdata.append("image", e.target.files[0]);

    try {
      const res = await uploadImage(formdata).unwrap();
      setAvatar(res.filename);
    } catch (error) {
      console.log(error);
    }
  };

  function updateState() {
    setAddress(user?.data.address === null ? "" : user?.data.address);
    setFullname(user?.data.fullname);
    setEmail(user?.data.email === null ? "" : user?.data.email);
    setAvatar(user?.data.avatar);
  }

  const formHandler = async (e) => {
    e.preventDefault();
    if (fullname === "") return;
    if (address === "") return;
    if (email === "") return;
    if (avatar === "") return;

    try {
      const res = await updateUser({
        fullname,
        address,
        email,
        avatar,
        id: selectedId,
      }).unwrap();
      setShowContent(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userSuccess) updateState();
  }, [userSuccess]);

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
            Modifier un utilisateur
          </h2>
          <form onSubmit={formHandler} action="" className="my-2 text-black">
            <div className="w-[200px] h-[200px] mx-auto relative overflow-hidden border-slate-950 dark:border-white border rounded-full border-dashed flex items-center justify-center">
              <input
                type="file"
                name="photo"
                onChange={uploadFileHandler}
                className="w-full h-full opacity-0 absolute cursor-pointer z-50"
              />
              {avatar === "" || avatar === null ? (
                <>
                  <RiImageAddLine className="dark:text-white text-8xl" />
                </>
              ) : loadingUpload ? (
                <div className="w-full h-full  flex items-center justify-center absolute">
                  <CircleLoader options="w-[30%]" white={"dark:stroke-white"} />
                </div>
              ) : (
                <div className="w-full h-full absolute flex items-center justify-center z-10">
                  <img
                    src={BASE_URL + "/" + avatar}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="py-2 grid  grid-cols-[max-content,1fr] items-center ">
              <label className="dark:text-white " htmlFor="">
                Nom complet :{" "}
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className={`bg-transparent
        outline-none dark:text-white py-1 border-b-2 border-slate-800 dark:border-b-slate-400  text-lg px-2`}
              />
            </div>
            <div className="py-2 grid  grid-cols-[max-content,1fr] items-center ">
              <label className="dark:text-white " htmlFor="">
                Addresse :{" "}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`bg-transparent
        outline-none dark:text-white border-slate-800 py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
              />
            </div>

            <div className="py-2 grid  grid-cols-[max-content,1fr] items-center ">
              <label className="dark:text-white " htmlFor="">
                Email :{" "}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-transparent
        outline-none dark:text-white border-slate-800 py-1 border-b-2 dark:border-b-slate-400  text-lg px-2`}
              />
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

export default UserAdminPage;
