import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";

import ProductDetailsCart from "./ProductDetailsCart";
import styles from "../../Styles/Style";
import { removeFromWishlist, addToWishlist } from "../../Redux/WishlistAction";
import axios from "../../utils/axiosInstance1"; // Adjust import if needed

const Product = ({ data }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);

  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  // Check if in wishlist on mount or whenever wishlist updates
  useEffect(() => {
    if (!data) return;
    setClick(wishlist.some((item) => item.id === data.id));
  }, [wishlist, data]);

  // Toggle wishlist
  const handleWishlistToggle = () => {
    setClick(!click);
    click
      ? dispatch(removeFromWishlist(data))
      : dispatch(addToWishlist(data));
  };

  // Add to Cart via backend (similar to ProductDetails)
  const handleAddToCart = async () => {
    if (!data?.id) return;

    try {
      await axios.post("/customer/cart/add", {
        productId: data.id,
        quantity: 1, // default quantity = 1
      });
      toast.success("Item added to cart!");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to add to cart!");
    }
  };

  // If no product data, render nothing
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm w-full h-[330px] relative p-3 cursor-pointer">
      {/* Clicking the image or name => Product Details page */}
      <Link to={`/product/${data.id}`}>
        <img
          src={data.imageUrl || "/default-image.jpg"}
          alt={data.name}
          className="w-full object-contain select-none h-[130px]"
        />
      </Link>

      <Link to={`/product/${data.id}`}>
        <h5 className={`${styles.shop_name} select-none py-3`}>
          {data.name}
        </h5>
      </Link>

      <Link to={`/product/${data.id}`}>
        <h4 className="pb-3 font-[500]">
          {data.name.length > 40 ? `${data.name.slice(0, 40)}...` : data.name}
        </h4>

        {/* Example star rating UI */}
        <div className="flex select-none">
          {[...Array(4)].map((_, i) => (
            <AiFillStar
              key={i}
              size={20}
              color="#f6Ba00"
              className="mr-2 cursor-pointer"
            />
          ))}
          <AiOutlineStar size={20} color="#f6Ba00" className="mr-2 cursor-pointer" />
        </div>
      </Link>

      {/* Price (check discount logic) */}
      <div className="py-2 flex items-center select-none justify-between">
        {data?.effectivePrice && data.effectivePrice < data.price ? (
          <>
            <h5 className={styles.productDiscountPrice}>
              ${data.effectivePrice.toFixed(2)}
            </h5>
            <h4 className={styles.price}>
              ${data.price.toFixed(2)}
            </h4>
          </>
        ) : (
          <h5 className={styles.productDiscountPrice}>
            ${data.price.toFixed(2)}
          </h5>
        )}
      </div>

      {/* Wishlist & Cart Actions */}
      <div>
        {/* Wishlist Toggle */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-8 right-3 cursor-pointer"
        >
          {click ? (
            <AiFillHeart size={22} color="red" title="Remove from wishlist" />
          ) : (
            <AiOutlineHeart size={22} color="#333" title="Add to wishlist" />
          )}
        </button>

        {/* Quick View */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute top-16 right-3 cursor-pointer"
        >
          <AiOutlineEye size={22} color="#333" title="Quick view" />
        </button>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="absolute top-24 right-3 cursor-pointer"
        >
          <AiOutlineShoppingCart size={25} color="#333" title="Add to cart" />
        </button>

        {/* Quick View Popup */}
        {open && <ProductDetailsCart setOpen={setOpen} data={data} />}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Product;
