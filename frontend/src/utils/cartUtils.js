export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  state.prixTotal = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.prix * item.qte, 0)
  );

  localStorage.setItem("cart", JSON.stringify(state));
};
