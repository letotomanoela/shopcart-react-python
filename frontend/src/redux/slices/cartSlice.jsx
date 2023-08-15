import { createSlice } from "@reduxjs/toolkit";
import { addDecimals, updateCart } from "../../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exitItem = state.cartItems.find((x) => x.id === item.id);

      if (exitItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.id === exitItem.id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      updateCart(state);
    },
    removeFromCart: (state, action) => {
      console.log(action.payload);
      state.cartItems = state.cartItems.filter(
        (x) => x.id !== action.payload.id
      );
      return updateCart(state);
    },
    clearCart: (state, action) => {
      state.cartItems = [];
      localStorage.removeItem("cart");

    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
