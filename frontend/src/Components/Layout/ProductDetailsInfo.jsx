import React, { useState } from "react";
import styles from "../../Styles/Style";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductReview from "./ProductReview";

// We'll remove the static images & static stars

const ProductDetailsInfo = ({ data }) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 py-2 800px:px-10 rounded mt-10">
      <div className="flex items-center justify-between w-full border-b pt-10 pb-2 ">
        {/* ====== Product Details Tab ====== */}
        <div className="relative">
          <h5
            className="text-[18px] px-1 leading-5 text-[#000] font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>

        {/* ====== Product Reviews Tab ====== */}
        <div className="relative">
          <h5
            className="text-[18px] px-1 leading-5 text-[#000] font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>

        {/* ====== Seller Info Tab ====== */}
        <div className="relative">
          <h5
            className="text-[18px] px-1 leading-5 text-[#000] font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>

      {/* ====== TAB 1: PRODUCT DETAILS ====== */}
      {active === 1 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
          className="mt-5"
        >
          <p className="text-[18px] pb-5 py-2 whitespace-pre-line leading-8">
            {/*
              If your backend includes a "long description" or "details" in the product object, 
              you can show it here. For now, this is hard-coded text.
            */}
            {data?.description ||
              `Lorem ipsum dolor sit amet consectetur adipisicing elit...`}
          </p>
        </motion.div>
      )}

      {/* ====== TAB 2: PRODUCT REVIEWS ====== */}
      {active === 2 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
          className="mt-5"
        >
          {/* If there are no reviews, display a simple message */}
          {(!data?.reviews || data.reviews.length === 0) && (
            <p className="text-[16px] text-gray-500">
              No reviews yet. Be the first to review this product!
            </p>
          )}

          {/* Map over the reviews from the backend */}
          {data?.reviews?.map((review) => (
            <ProductReview
              key={review.id}
              userName={review.userName}     // from ReviewResponse
              comment={review.comment}       // from ReviewResponse
              rating={review.rating}         // from ReviewResponse
              userImage={null}               // if you have user image, pass it
              createdAt={review.createdAt}   // from ReviewResponse
            />
          ))}
        </motion.div>
      )}

      {/* ====== TAB 3: SELLER INFO ====== */}
      {active === 3 && (
        <div className="w-full block 800px:flex pt-5 pb-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="w-full 800px:w-[50%]"
          >
            <div className="flex items-center">
              {/* If your product data has a store avatar, use: data.storeAvatar  */}
              <img
                src={data?.shop?.shop_avatar?.url || "https://via.placeholder.com/50"}
                alt="avatar/image"
                className="w-[50px] h-[50px] rounded-full"
              />

              <div className="pl-3">
                <h3 className={`${styles.shop_name}`}>{data?.shop?.name || "Unknown Seller"}</h3>
                <h5 className="text-[15px] pb-2">
                  {data?.shop?.ratings || 0} Ratings
                </h5>
              </div>
            </div>
            <p className="mt-4">
              {/*
                If your backend includes a "shop description," show it here.
                For now, it's just placeholder text.
              */}
              Lorem ipsum dolor sit amet consectetur adipisicing elit...
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
            className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex items-end  flex-col"
          >
            <div className="text-left">
              <h5 className="font-[700]">
                Joined on: <span className="font-[500]">21 May,2023</span>
              </h5>
              <h5 className="font-[700] pt-3">
                Total Products: <span className="font-[500]">200</span>
              </h5>
              <h5 className="font-[700] pt-3">
                Total Reviews: <span className="font-[500]">486</span>
              </h5>

              <Link to="/shop/:id">
                <button className={`${styles.button} !h-11 !rounded text-white !mt-3`}>
                  Visit Shop
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsInfo;
