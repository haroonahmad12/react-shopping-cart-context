import React, { createContext, useEffect, useReducer } from "react";
import actionTypes from "./actionTypes";

export const initialState = {
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

export const ProductsContext = createContext(initialState);
