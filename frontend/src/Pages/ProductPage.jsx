import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaginatedProducts, resetProducts } from "../redux/slices/productSlice";
import { useSearchParams } from "react-router-dom";
import Header from "../Components/Layout/Header";
import Product from "../Components/Layout/Product";
import Footer from "../Components/Layout/Footer";
import styles from "../Styles/Style";
import { motion } from "framer-motion";

const ProductPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || null;
  const section = searchParams.get("section") || null;

  const { products, status, hasMore, page } = useSelector((state) => state.products);

  const observer = useRef();
  const loadingRef = useRef(false);  // To track loading inside observer callback

  // Update loadingRef whenever status changes
  useEffect(() => {
    loadingRef.current = status === "loading";
  }, [status]);

  // Reset products and fetch first page when category or section change
  useEffect(() => {
    dispatch(resetProducts());
    dispatch(fetchPaginatedProducts({ page: 0, category, section }));
  }, [dispatch, category, section]);

  // Last product ref for infinite scroll
  const lastProductRef = useCallback(
    (node) => {
      if (loadingRef.current) return; // Don't observe while loading

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loadingRef.current // extra safety check
        ) {
          dispatch(fetchPaginatedProducts({ page, category, section }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, page, category, section, dispatch]
  );

  return (
    <>
      <Header activeHeading={3} />

      <motion.div
        initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -500 }}
        transition={{ duration: 0.5 }}
        className={styles.section}
      >
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0 mt-12">
          {products.map((item, index) => {
            const isLast = index === products.length - 1;
            return (
              <div ref={isLast ? lastProductRef : null} key={item.id}>
                <Product data={item} />
              </div>
            );
          })}
        </div>

        {status === "loading" && <p className="text-center text-gray-600">Loading...</p>}

        {!hasMore && (
          <h1 className="text-center font-bold md:text-2xl text-gray-600 mb-16">
            No more products!
          </h1>
        )}
      </motion.div>

      <Footer />
    </>
  );
};

export default ProductPage;
