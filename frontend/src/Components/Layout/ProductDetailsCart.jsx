import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

/** React Use Cart */
import { useCart } from "react-use-cart";

/** Redux for wishlist only */
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../redux/WishlistAction";

/** Styles */
import styles from "../../Styles/Style";

const ProductDetailsCart = ({ data, setOpen }) => {
  const dispatch = useDispatch();

  // We still handle wishlist with Redux
  const { wishlist } = useSelector((state) => state.wishlist);

  // react-use-cart
  const { items, addItem } = useCart();

  const [count, setCount] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  /**
   * Add to cart
   */
  const addToCartHandler = () => {
    const isItemExists = items.find((item) => item.id === data.id);
    if (isItemExists) {
      toast.error("Item already in cart.");
      return;
    }

    if (data?.stock && count > data.stock) {
      toast.error("Product stock is limited!");
      return;
    }

    // add to cart
    addItem(
      {
        id: data.id,
        price: data.price,
        name: data.name,
        imageUrl: data.imageUrl,
      },
      count
    );

    toast.success("Item added to cart!");
  };

  /**
   * Check if product is in wishlist
   */
  useEffect(() => {
    if (wishlist?.some((item) => item.id === data.id)) {
      setIsInWishlist(true);
    } else {
      setIsInWishlist(false);
    }
  }, [wishlist, data.id]);

  /**
   * Handle add/remove wishlist
   */
  const handleWishlistRemoveItem = () => {
    setIsInWishlist(false);
    dispatch(removeFromWishlist(data));
  };

  const handleWishlistAddItem = () => {
    setIsInWishlist(true);
    dispatch(addToWishlist(data));
  };

  if (!data) return null;

  return (
    <div className="bg-white">
      <div className="w-full h-screen fixed top-0 left-0 bg-[#00000030] flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, y: -500 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -500 }}
          className="w-[90%] 800px:w-[60%] h-[90vh] 800px:h-[75vh] rounded-md p-4 relative shadow-sm overflow-y-scroll bg-white"
        >
          <RxCross1
            size={40}
            color="#333"
            className="absolute top-1 right-1 cursor-pointer p-2 hover:bg-gray-200 hover:text-gray-50 rounded-full"
            onClick={() => setOpen(false)}
          />

          <div className="block w-full 800px:flex">
            {/* Left Column: Product Image & Shop Info */}
            <div className="800px:w-[50%] w-full">
              <img
                src={data?.imageUrl}
                alt={data?.name || "product"}
                className="w-full h-auto object-cover"
              />

              <div className="flex items-center mt-5">
                <img
                  src={data?.shop?.shop_avatar?.url || "/default-shop-avatar.png"}
                  alt="Shop Avatar"
                  className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                />
                <div>
                  <h3 className={`${styles.shop_name}`}>
                    {data?.shop?.name || "Unknown Shop"}
                  </h3>
                  <h3 className="text-[15px]">({data?.rating || 0}) ratings</h3>
                </div>
              </div>

              <div className={`${styles.button} bg-black !h-11 mt-6 !rounded-[4px]`}>
                <span className="text-white flex items-center">
                  Send message <AiOutlineMessage className="ml-2" />
                </span>
              </div>
              <h5 className="mt-5 text-[16px] text-red-500">
                ({data?.total_sell || 0}) Sold out
              </h5>
            </div>

            {/* Right Column: Details, Qty, Wishlist, Add to cart */}
            <div className="w-full 800px:w-[50%] pt-8 pl-[5px] pr-[5px]">
              <h1 className={`${styles.productTitle} text-[20px]`}>
                {data?.name}
              </h1>

              <p className="mt-3">{data?.description}</p>

              <div className="flex mt-5">
                {data?.discount_price ? (
                  <h4 className={`${styles.productDiscountPrice}`}>
                    ${data.discount_price}
                  </h4>
                ) : (
                  <h4 className={`${styles.productDiscountPrice}`}>
                    ${data?.price}
                  </h4>
                )}
                {data?.price && data.discount_price && (
                  <h3 className={`${styles.price}`}>
                    ${data.price}
                  </h3>
                )}
              </div>

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

              <div className="mt-6 select-none">
                <button
                  className={`${styles.button} text-white !h-11 !rounded-[4px]`}
                  onClick={addToCartHandler}
                >
                  Add to cart <AiOutlineShoppingCart className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Toast message */}
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
    </div>
  );
};

export default ProductDetailsCart;
