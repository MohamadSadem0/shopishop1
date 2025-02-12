// BestSellingPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellingProducts } from "../Redux/slices/productSlice";
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer";
import Product from "../Components/Layout/Product";
import styles from "../Styles/Style";
import { motion } from "framer-motion";
// 1) Import react-paginate
import ReactPaginate from "react-paginate";

const BestSellingPage = () => {
  const dispatch = useDispatch();
  // bestSelling: current page's products from Redux
  // bestSellingPage: current page *as known by the server response*
  // error, status, etc.
  const { bestSelling, bestSellingPage, status, error } = useSelector(
    (state) => state.products
  );

  // 2) Track the current page on the client
  //    We'll default to 0 (the first page) for server-side pagination
  const [currentPage, setCurrentPage] = useState(0);

  // 3) On mount (and whenever currentPage changes), fetch that page
  //    from the server with 15 items per page
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchBestSellingProducts({ page: currentPage, size: 15 }));
  }, [dispatch, currentPage]);

  // 4) ReactPaginate calls this handler whenever the user clicks a page
  const handlePageClick = (event) => {
    // event.selected is the new page index
    setCurrentPage(event.selected);
  };

  return (
    <>
      <Header activeHeading={2} />

      <motion.div
        initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -500 }}
        transition={{ duration: 0.5 }}
        className={styles.section}
      >
        <h2 className="text-2xl font-bold mb-4">
          Best Selling (Page {currentPage + 1})
        </h2>

        {status === "loading" && <p>Loading best-selling products...</p>}
        {status === "failed" && (
          <p className="text-red-500">Error: {error}</p>
        )}

        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0 mt-12">
          {bestSelling.map((item, index) => (
            <Product data={item} key={index} />
          ))}
        </div>

        {/* 
          Pagination control with next/prev/numbered pages.
          “pageCount” can be computed from server data if you know
          total items (e.g., totalElements / 15).
          For a quick example, let’s just show 10 pages or so.
        */}
        <div className="mb-8">
          <ReactPaginate
            pageCount={10} // total number of pages (replace with real data if available)
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            onPageChange={handlePageClick}
            forcePage={currentPage} // which page is currently active
            containerClassName="flex items-center justify-center gap-2"
            pageLinkClassName="px-3 py-1 border border-gray-300 hover:bg-gray-200"
            previousLinkClassName="px-3 py-1 border border-gray-300 hover:bg-gray-200"
            nextLinkClassName="px-3 py-1 border border-gray-300 hover:bg-gray-200"
            activeLinkClassName="bg-blue-500 text-white"
            previousLabel="Prev"
            nextLabel="Next"
            breakLabel="..."
          />
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default BestSellingPage;
