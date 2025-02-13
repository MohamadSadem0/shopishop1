import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFeaturedProducts } from "../../redux/slices/productSlice";
import Product from "./Product";
import styles from "../../Styles/Style";

const FeaturedProduct = () => {
  const dispatch = useDispatch();
  const { featuredProducts, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  if (status === "loading") return <p>Loading featured products...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Featured Products</h1>
      </div>

      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
        {featuredProducts.map((product, index) => (
          <Product data={product} key={index} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
