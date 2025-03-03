import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axiosInstance1";
import ReactImageMagnify from "react-image-magnify";
import { motion } from "framer-motion";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { addToWishlist, removeFromWishlist } from "../../redux/WishlistAction";
import ProductDetailsInfo from "./ProductDetailsInfo.jsx";
import styles from "../../Styles/Style";

const ProductDetails = ({ data }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const [count, setCount] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!data) return;
    setIsInWishlist(wishlist?.some((item) => item.id === data.id));
  }, [wishlist, data]);

  const incrementCount = () => {
    if (data?.quantity && count >= data.quantity) {
      toast.error("You cannot add more than the available quantity!");
      return;
    }
    setCount((prev) => prev + 1);
  };

  const decrementCount = () => {
    if (count > 1) setCount((prev) => prev - 1);
  };

  const addToCartHandler = async () => {
    if (!data?.id) return;
    if (data?.quantity && count > data.quantity) {
      toast.error("Cannot add more than available quantity!");
      return;
    }
    try {
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
            {/* Left Column: Product Image */}
            <div className="w-full 800px:w-[50%]">
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
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
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
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

            {/* Right Column: Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full 800px:w-[50%] mt-0 800px:mt-9 ml-0 800px:ml-5"
            >
              <h1 className={styles.productTitle}>{data?.name}</h1>
              <p className="mt-2">{data?.description}</p>
              <div className="flex mt-3">
                {data?.effectivePrice && data.effectivePrice < data.price ? (
                  <>
                    <h4 className={styles.productDiscountPrice}>
                      ${data.effectivePrice.toFixed(2)}
                    </h4>
                    <h3 className={styles.price}>
                      ${data.price?.toFixed(2)}
                    </h3>
                  </>
                ) : (
                  <h4 className={styles.productDiscountPrice}>
                    ${data?.price?.toFixed(2)}
                  </h4>
                )}
              </div>

              {/* Quantity and Wishlist */}
              <div className="flex items-center justify-between">
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

              {/* Add to Cart Button */}
              <div className="mt-6 select-none">
                <button
                  className={`${styles.button} text-white !h-11 !rounded-[4px]`}
                  onClick={addToCartHandler}
                >
                  Add to cart <AiOutlineShoppingCart className="ml-2" />
                </button>
              </div>
            </motion.div>
          </div>
          <ToastContainer position="top-right" autoClose={2000} />
        </div>
        <ProductDetailsInfo data={data} />
      </div>
    </div>
  );
};

export default ProductDetails;
