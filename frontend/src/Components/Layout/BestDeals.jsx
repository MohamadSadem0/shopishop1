import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchBestDeals } from "../../redux/slices/productSlice";
import Product from "./Product";
import styles from "../../Styles/Style";

const BestDeals = () => {
  const dispatch = useDispatch();
  const { bestDeals, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchBestDeals());
  }, [dispatch]);

  if (status === "loading") return <p>Loading best deals...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Best Deals</h1>
      </div>

      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
        {bestDeals.map((product, index) => (
          <Product data={product} key={index} />
        ))}
      </div>
    </div>
  );
};

export default BestDeals;
