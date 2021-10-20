import React, { useContext, useEffect, useReducer } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import NewProduct from "./pages/NewProduct";

import * as api from "./api";

import useLocalStorage from "./hooks/useLocalStorage";
import loadLocalStorageItems from "./utils/loadLocalStorageItems";
import { ProductsContext } from "./context/reducer.js/useReducer";
import { initialState, reducer } from "./context/reducer.js/useReducer";
import actionTypes from "./context/reducer.js/actionTypes";
import { getProducts } from "./api";

function buildNewCartItem(cartItem) {
  if (cartItem.quantity >= cartItem.unitsInStock) {
    return cartItem;
  }

  return {
    id: cartItem.id,
    title: cartItem.title,
    img: cartItem.img,
    price: cartItem.price,
    unitsInStock: cartItem.unitsInStock,
    createdAt: cartItem.createdAt,
    updatedAt: cartItem.updatedAt,
    quantity: cartItem.quantity + 1,
  };
}

const PRODUCTS_LOCAL_STORAGE_KEY = "react-sc-state-products";
const CART_ITEMS_LOCAL_STORAGE_KEY = "react-sc-state-cart-items";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cartItems, products, isLoading, hasError, loadingError } = useContext(
    ProductsContext,
  );
  useLocalStorage(products, PRODUCTS_LOCAL_STORAGE_KEY);
  useLocalStorage(cartItems, CART_ITEMS_LOCAL_STORAGE_KEY);

  function reducer(state, action) {
    switch (action.type) {
      case actionTypes.PRODUCTS_FETCHING:
        console.log("fetching");

        break;

      case actionTypes.PRODUCTS_FETCHING_SUCCESS:
        return {
          ...state,
          products: action.payload.products,
          cartItems: action.payload.cartItems,
        };

        break;

      case actionTypes.PRODUCTS_FETCHING_ERROR:
        console.log("error");
        break;

      case actionTypes.CARTITEMS_FETCHING:
        console.log("Cart Updating");
        break;

      case actionTypes.CARTITEMS_FETCHING_SUCCESS:
        console.log("Cart Updated");
        break;
      case actionTypes.CARTITEMS_FETCHING_ERROR:
        console.log("Cart Update Error");
      default:
        return;
        break;
    }
  }

  useEffect(() => {
    const request = async () => {
      dispatch({ type: actionTypes.PRODUCTS_FETCHING });
      const data = loadLocalStorageItems("react-sc-state", []);
      if (!data) {
        dispatch({ type: actionTypes.PRODUCTS_FETCHING_ERROR, payload: error });
      } else {
        dispatch({
          type: actionTypes.PRODUCTS_FETCHING_SUCCESS,
          payload: data,
        });
      }
    };

    request();
  }, [dispatch]);

  function handleAddToCart(productId) {
    const prevCartItem = cartItems.find((item) => item.id === productId);
    const foundProduct = products.find((product) => product.id === productId);

    if (prevCartItem) {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        if (item.quantity >= item.unitsInStock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      });

      setCartItems(updatedCartItems);
      return;
    }

    const updatedProduct = buildNewCartItem(foundProduct);
    setCartItems((prevState) => [...prevState, updatedProduct]);
  }

  function handleChange(event, productId) {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === productId && item.quantity <= item.unitsInStock) {
        return {
          ...item,
          quantity: Number(event.target.value),
        };
      }

      return item;
    });

    setCartItems(updatedCartItems);
  }

  function handleRemove(productId) {
    const updatedCartItems = cartItems.filter((item) => item.id !== productId);

    setCartItems(updatedCartItems);
  }

  function handleDownVote(productId) {
    const updatedProducts = products.map((product) => {
      if (
        product.id === productId &&
        product.votes.downVotes.currentValue <
          product.votes.downVotes.lowerLimit
      ) {
        return {
          ...product,
          votes: {
            ...product.votes,
            downVotes: {
              ...product.votes.downVotes,
              currentValue: product.votes.downVotes.currentValue + 1,
            },
          },
        };
      }

      return product;
    });

    setProducts(updatedProducts);
  }

  function handleUpVote(productId) {
    const updatedProducts = products.map((product) => {
      if (
        product.id === productId &&
        product.votes.upVotes.currentValue < product.votes.upVotes.upperLimit
      ) {
        return {
          ...product,
          votes: {
            ...product.votes,
            upVotes: {
              ...product.votes.upVotes,
              currentValue: product.votes.upVotes.currentValue + 1,
            },
          },
        };
      }

      return product;
    });

    setProducts(updatedProducts);
  }

  function handleSetFavorite(productId) {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          isFavorite: !product.isFavorite,
        };
      }

      return product;
    });

    setProducts(updatedProducts);
  }

  function saveNewProduct(newProduct) {
    setProducts((prevState) => [newProduct, ...prevState]);
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/new-product">
          <NewProduct saveNewProduct={saveNewProduct} />
        </Route>
        <Route path="/" exact>
          <ProductsContext.Provider
            value={{
              handleDownVote: handleDownVote,
              handleUpVote: handleUpVote,
              handleSetFavorite: handleSetFavorite,
              handleAddToCart: handleAddToCart,
              handleRemove: handleRemove,
              handleChange: handleChange,
            }}
          >
            <Home
              fullWidth
              // cartItems={cartItems}
              // products={products}
              // isLoading={isLoading}
              // hasError={hasError}
              // loadingError={loadingError}
              // handleDownVote={handleDownVote}
              // handleUpVote={handleUpVote}
              // handleSetFavorite={handleSetFavorite}
              // handleAddToCart={handleAddToCart}
              // handleRemove={handleRemove}
              // handleChange={handleChange}
            />
          </ProductsContext.Provider>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
