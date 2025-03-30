import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axiosInstance1";
import ReactImageMagnify from "react-image-magnify";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaRegStar
} from "react-icons/fa";
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

  // Check if discount is currently active
  const isDiscountValid = () => {
    if (!data?.hasActiveDiscount) return false;
    const now = new Date();
    return (!data.discountStartDate || new Date(data.discountStartDate) <= now) &&
           (!data.discountEndDate || new Date(data.discountEndDate) >= now);
  };

  // Format discount display
  const formatDiscount = () => {
    if (!data?.hasActiveDiscount) return null;
    
    if (data.discountType === "PERCENTAGE") {
      return `${data.discountValue}% OFF`;
    } else if (data.discountType === "FIXED_AMOUNT") {
      return `$${data.discountValue} OFF`;
    }
    return data.discountName || "Special Offer";
  };

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

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(data));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(data));
      toast.success("Added to wishlist");
    }
    setIsInWishlist(!isInWishlist);
  };

  if (!data) return null;

  // Calculate average rating
  const averageRating = data.reviews?.length > 0 
    ? data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length 
    : 0;

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
                        width: 1200,
                        height: 1800,
                      },
                      enlargedImageContainerDimensions: {
                        width: '150%',
                        height: '100%'
                      }
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
              <div className="flex justify-between items-start">
                <h1 className={styles.productTitle}>{data?.name}</h1>
                <button
                  onClick={toggleWishlist}
                  className="text-2xl"
                >
                  {isInWishlist ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-500 hover:text-red-500" />
                  )}
                </button>
              </div>

              <p className="text-gray-600 mb-2">{data?.categoryName}</p>

              {/* Rating */}
              {averageRating > 0 && (
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {Array(5).fill(0).map((_, i) => (
                      i < Math.round(averageRating) ? 
                        <FaStar key={i} className="text-yellow-400" /> : 
                        <FaRegStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({data.reviews?.length || 0} reviews)
                  </span>
                </div>
              )}

              <p className="mt-2 text-gray-700">{data?.description}</p>

              {/* Price Display */}
              <div className="flex items-center mt-4 gap-3">
                {data.hasActiveDiscount && isDiscountValid() && data.discountedPrice ? (
                  <>
                    <h4 className={styles.productDiscountPrice}>
                      ${data.discountedPrice.toFixed(2)}
                    </h4>
                    <h3 className={styles.price}>
                      ${data.price.toFixed(2)}
                    </h3>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {formatDiscount()}
                    </span>
                  </>
                ) : (
                  <h4 className={styles.productDiscountPrice}>
                    ${data.price.toFixed(2)}
                  </h4>
                )}
              </div>

              {/* Discount Details */}
              {data.hasActiveDiscount && isDiscountValid() && (
                <div className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800">Special Offer</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-600">Discount:</span>{' '}
                      <span className="font-medium">
                        {data.discountType === 'PERCENTAGE'
                          ? `${data.discountValue}%`
                          : `$${data.discountValue}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valid Until:</span>{' '}
                      <span className="font-medium">
                        {data.discountEndDate
                          ? new Date(data.discountEndDate).toLocaleDateString()
                          : 'No expiry'}
                      </span>
                    </div>
                    {data.discountMinQuantity > 1 && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Minimum Quantity:</span>{' '}
                        <span className="font-medium">{data.discountMinQuantity}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mt-3">
                <span className={`text-sm ${
                  data.quantity > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.quantity > 0 
                    ? `${data.quantity} available in stock` 
                    : 'Out of stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              {data.quantity > 0 && (
                <div className="flex items-center mt-6">
                  <span className="mr-3 font-medium">Quantity:</span>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-l"
                    onClick={decrementCount}
                  >
                    -
                  </button>
                  <span className="bg-gray-100 px-4 py-1">
                    {count}
                  </span>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-r"
                    onClick={incrementCount}
                  >
                    +
                  </button>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="mt-6 select-none">
                <button
                  className={`${styles.button} text-white !h-11 !rounded-[4px] flex items-center justify-center ${
                    data.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={addToCartHandler}
                  disabled={data.quantity <= 0}
                >
                  {data.quantity > 0 ? (
                    <>
                      Add to cart <FaShoppingCart className="ml-2" />
                    </>
                  ) : (
                    "Out of Stock"
                  )}
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