import React, { useContext } from "react";
import { ProductsContext } from "../../context/reducer.js/useReducer";

import ItemCard from "../ItemCard";

function ProductsListing({ ...props }) {
  const { products } = useContext(ProductsContext);
  console.log(products);
  return (
    <section className="row" {...props}>
      {/* {products.length > 0 &&
        products.map((product) => (
          <ItemCard
            key={product.id}
            id={product.id}
            img={product.img}
            title={product.title}
            shortDescription={product.shortDescription}
            upVotes={product.votes.upVotes}
            //  handleUpVote={handleUpVote}
            downVotes={product.votes.downVotes}
            // handleDownVote={handleDownVote}
            isFavorite={product.isFavorite}
            // handleSetFavorite={handleSetFavorite}
            //handleAddToCart={handleAddToCart}
          />
        ))} */}
    </section>
  );
}

export default ProductsListing;
