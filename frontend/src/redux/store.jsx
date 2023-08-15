import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authSliceReducer from './slices/authSlice'
import cartSliceReducer from './slices/cartSlice'

const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]:apiSlice.reducer,
        auth: authSliceReducer,
        cart: cartSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true

})

export default store