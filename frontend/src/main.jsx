import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./redux/store.jsx";

import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import LandingPage from "./layouts/LandingPage.jsx";
import ProductPage from "./layouts/ProductPage.jsx";
import CategoryPage from "./layouts/CategoryPage.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import AdminPage from "./layouts/AdminPage.jsx";
import ProductAdminPage from "./layouts/admin/ProductAdminPage.jsx";
import CategoryAdminPage from "./layouts/admin/CategoryAdminPage.jsx";
import CommandeAdminPage from "./layouts/admin/CommandeAdminPage.jsx";
import UserAdminPage from "./layouts/admin/UserAdminPage.jsx";
import ThemeContextProvider from "./context/ThemeContext.jsx";
import CartPage from "./layouts/CartPage.jsx";
import Payement from "./layouts/Payement.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<LandingPage />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/produit/:name/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path='/payement' element={<Payement/>}/>
 
      <Route path="/" element={<PrivateRoute />}>

        <Route path="/admin" element={<AdminPage />}>
          <Route path="/admin" element={<ProductAdminPage />} />
          <Route path="/admin/categories" element={<CategoryAdminPage />} />
          <Route path="/admin/commandes" element={<CommandeAdminPage />} />
          <Route path="/admin/utilisateurs" element={<UserAdminPage />} />
          
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(

    <Provider store={store}>
      <ThemeContextProvider>
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </Provider>
  
);
