import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axiosInstance1"; // Or your custom Axios instance
import ReactImageMagnify from "react-image-magnify";
import { motion } from "framer-motion";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";

import { addToWishlist, removeFromWishlist } from "../../Redux/WishlistAction";
import ProductDetailsInfo from "./ProductDetailsInfo.jsx";
import styles from "../../Styles/Style";

const ProductDetails = ({ data }) => {
  const dispatch = useDispatch();

  // Redux: wishlist state
  const { wishlist } = useSelector((state) => state.wishlist);

  // Local state
  const [count, setCount] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if product is in wishlist on mount or when wishlist changes
  useEffect(() => {
    if (!data) return;
    setIsInWishlist(wishlist?.some((item) => item.id === data.id));
  }, [wishlist, data]);

  // Increment quantity
  const incrementCount = () => {
    if (data?.stock && count >= data.stock) {
      toast.error("Product stock is limited!");
      return;
    }
    setCount((prev) => prev + 1);
  };

  // Decrement quantity
  const decrementCount = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };

  // Add to cart via backend
  const addToCartHandler = async () => {
    if (!data?.id) return;
    try {
      // POST to /customer/cart/add with { productId, quantity }
      await axios.post("/customer/cart/add", {
        productId: data.id,
        quantity: count,
      });
      toast.success("Item added to cart!");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to add item to cart!"
      );
    }
  };

  // Wishlist handlers
  const handleWishlistAddItem = () => {
    setIsInWishlist(true);
    dispatch(addToWishlist(data));
  };

  const handleWishlistRemoveItem = () => {
    setIsInWishlist(false);
    dispatch(removeFromWishlist(data));
  };

  if (!data) return null;

  return (
    <div className="bg-white">
      <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
        <div className="w-full py-5">
          <div className="block w-full 800px:flex">
            {/* ===== Left Column: Product Images ===== */}
            <div className="w-full 800px:w-[50%]">
              {/* Desktop Magnify View */}
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5 }}
                className="hidden 800px:block"
              >
                {data?.imageUrl ? (
                  <ReactImageMagnify
                    {...{
                      smallImage: {
                        alt: data.name || "product",
                        isFluidWidth: true,
                        src: data.imageUrl,
                      },
                      largeImage: {
                        src: data.imageUrl,
                        width: 450,
                        height: 800,
                      },
                    }}
                  />
                ) : (
                  <p className="text-gray-500">Image not available</p>
                )}
              </motion.div>

              {/* Mobile Normal Image */}
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5 }}
                className="800px:hidden mx-auto w-full"
              >
                {data?.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={data.name || "product"}
                    className="w-[100%] object-cover"
                  />
                ) : (
                  <p className="text-gray-500">Image not available</p>
                )}
              </motion.div>
            </div>

            {/* ===== Right Column: Product Details ===== */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="w-full 800px:w-[50%] mt-0 800px:mt-9 ml-0 800px:ml-5"
            >
              <h1 className={styles.productTitle}>{data?.name}</h1>
              <p className="mt-2">{data?.description}</p>

              {/* Price display using effectivePrice if it's lower than the base price */}
              <div className="flex mt-3">
                {data?.effectivePrice && data.effectivePrice < data.price ? (
                  <>
                    {/* Discounted price */}
                    <h4 className={styles.productDiscountPrice}>
                      ${data.effectivePrice.toFixed(2)}
                    </h4>
                    {/* Original price (strikethrough) */}
                    <h3 className={styles.price}>
                      ${data.price?.toFixed(2)}
                    </h3>
                  </>
                ) : (
                  // No discount or effectivePrice is equal, just show normal price
                  <h4 className={styles.productDiscountPrice}>
                    ${data?.price?.toFixed(2)}
                  </h4>
                )}
              </div>

              {/* Quantity & Wishlist */}
              <div className="flex items-center justify-between">
                {/* Quantity buttons */}
                <div>
                  <button
                    className="bg-gradient-to-b from-emerald-600 to-emerald-400 text-white px-5 py-2 mt-8 text-[1rem]"
                    onClick={decrementCount}
                  >
                    -
                  </button>
                  <span className="px-5 py-2 bg-gray-200 text-gray-800">
                    {count}
                  </span>
                  <button
                    className="bg-gradient-to-b from-emerald-600 to-emerald-400 text-white px-5 py-2 mt-8 text-[1rem]"
                    onClick={incrementCount}
                  >
                    +
                  </button>
                </div>

                {/* Wishlist icon */}
                <div>
                  {isInWishlist ? (
                    <AiFillHeart
                      size={30}
                      color="red"
                      onClick={handleWishlistRemoveItem}
                      className="cursor-pointer"
                      title="Remove from wishlist"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={30}
                      color="#333"
                      onClick={handleWishlistAddItem}
                      className="cursor-pointer"
                      title="Add to wishlist"
                    />
                  )}
                </div>
              </div>

              {/* Add to Cart button */}
              <div className="mt-6 select-none">
                <button
                  className={`${styles.button} text-white !h-11 !rounded-[4px]`}
                  onClick={addToCartHandler}
                >
                  Add to cart
                  <AiOutlineShoppingCart className="ml-2" />
                </button>
              </div>

              {/* Seller info + message */}
              <div className="flex items-center mt-12">
                <div className="flex items-center">
                  <img
                    src={data?.shop?.shop_avatar?.url || "/default-avatar.png"}
                    alt="Store Avatar"
                    className="w-[50px] h-[50px] rounded-full mr-2"
                  />
                  <div>
                    <h3 className={styles.shop_name}>
                      {data?.storeName || "Unknown Store"}
                    </h3>
                    <h3 className="text-[15px]">
                      ({data?.rating || 0} ratings)
                    </h3>
                  </div>
                </div>

                {/* Example if you add a "Send Message" button in the future */}
                {/* 
                <div>
                  <button
                    className={`${styles.button} bg-[#6443d1] ml-8 !rounded !h-11 text-white`}
                  >
                    Send Message <AiOutlineMessage className="cursor-pointer ml-1" />
                  </button>
                </div>
                */}
              </div>
            </motion.div>
          </div>

          {/* Toast messages */}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
          />
        </div>

        {/* Extra info component */}
        <ProductDetailsInfo data={data} />
        <br />
        <br />
      </div>
    </div>
  );
};

export default ProductDetails;
