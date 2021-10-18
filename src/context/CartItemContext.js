import React, { createContext } from "react";

const initialState = {
  cartItems: [],
  products: [],
  isLoading: false,
  hasError: false,
  loadingError: "",
  handleDownVote: () => {},
  handleUpVote: () => {},
  handleSetFavorite: () => {},
  handleAddToCart: () => {},
  handleRemove: () => {},
  handleChange: () => {},
};

const CartItemContext = createContext(initialState);

export default CartItemContext;
