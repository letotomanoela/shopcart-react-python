import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { motion } from "framer-motion";

const AdminPage = () => {
  const location = useLocation().pathname
  return (
    <motion.div
      key={location}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.7, delayChildren: 0.2 }}
      className="dark:bg-slate-950 text-white"
    >
      <Outlet />
    </motion.div>
  );
};

export default AdminPage;
