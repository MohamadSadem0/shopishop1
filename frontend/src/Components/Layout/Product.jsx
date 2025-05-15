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
import { removeFromWishlist, addToWishlist } from "../../redux/WishlistAction";
import axios from "../../utils/axiosInstance1";

// Define DiscountType equivalent for frontend
const DiscountType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED_AMOUNT: "FIXED_AMOUNT",
};

const Product = ({ data }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    setClick(wishlist.some((item) => item.id === data.id));
  }, [wishlist, data]);

  const handleWishlistToggle = () => {
    setClick(!click);
    click ? dispatch(removeFromWishlist(data)) : dispatch(addToWishlist(data));
  };

  const handleAddToCart = async () => {
    if (!data?.id) return;
    try {
      await axios.post("/customer/cart/add", {
        productId: data.id,
        quantity: 1,
      });
      toast.success("Item added to cart!");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to add to cart!");
    }
  };

  if (!data) return null;

  // Parse numbers safely
  const originalPrice = Number(data.originalPrice) || 0;
  const finalPrice = Number(data.finalPrice) || originalPrice;
  const discountValue = Number(data.discountValue) || 0;

  // Calculate discount percentage if available
  const discountPercentage =
    discountValue && data.discountInfo?.discountType === DiscountType.PERCENTAGE
      ? discountValue
      : discountValue && originalPrice > 0
      ? ((discountValue / originalPrice) * 100).toFixed(2)
      : null;

  return (
    <div className="bg-white rounded-lg shadow-sm w-full h-[370px] relative p-3 cursor-pointer">
      {/* Discount badge */}
      {discountValue > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          {discountPercentage}% OFF
        </div>
      )}

      <Link to={`/product/${data.id}`}>
        <img
          src={data.imageUrl || "/default-image.jpg"}
          alt={data.name}
          className="w-full object-contain select-none h-[130px]"
        />
      </Link>

      <Link to={`/product/${data.id}`}>
        <h5 className={`${styles.shop_name} select-none py-3`}>
          {data.categoryName}
        </h5>
        <h4 className="pb-3 font-[500]">
          {data.name.length > 40 ? `${data.name.slice(0, 40)}...` : data.name}
        </h4>
        <div className="flex select-none items-center">
          <span className="mr-2 font-bold">Rating:</span>
          {[...Array(5)].map((_, i) =>
            i < Math.floor(data.averageRating || 0) ? (
              <AiFillStar
                key={i}
                size={20}
                color="#f6Ba00"
                className="mr-1 cursor-pointer"
              />
            ) : (
              <AiOutlineStar
                key={i}
                size={20}
                color="#f6Ba00"
                className="mr-1 cursor-pointer"
              />
            )
          )}
          <span className="text-sm text-gray-500 ml-1">
            ({data.reviews?.length || 0})
          </span>
        </div>
      </Link>

      <div className="py-2 flex flex-col select-none">
        {finalPrice < originalPrice ? (
          <>
            <div className="flex items-center">
              <span className="font-bold mr-1">Price:</span>
              <span className={styles.productDiscountPrice}>
                ${finalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-1">Original:</span>
              <span className="line-through text-gray-500">
                ${originalPrice.toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <span className="font-bold mr-1">Price:</span>
            <span className={styles.productDiscountPrice}>
              ${originalPrice.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="absolute bottom-3 left-3 text-xs text-gray-500">
        {data.quantity > 0 ? (
          <span className="text-green-600">In Stock ({data.quantity})</span>
        ) : (
          <span className="text-red-600">Out of Stock</span>
        )}
      </div>

      <div>
        <button
          onClick={handleWishlistToggle}
          className="absolute top-8 right-3 cursor-pointer"
          aria-label={click ? "Remove from wishlist" : "Add to wishlist"}
        >
          {click ? (
            <AiFillHeart size={22} color="red" />
          ) : (
            <AiOutlineHeart size={22} color="#333" />
          )}
        </button>

        <button
          onClick={() => setOpen(!open)}
          className="absolute top-16 right-3 cursor-pointer"
          aria-label="Quick view"
        >
          <AiOutlineEye size={22} color="#333" />
        </button>

        <button
          onClick={handleAddToCart}
          className="absolute top-24 right-3 cursor-pointer"
          disabled={data.quantity <= 0}
          aria-label="Add to cart"
        >
          <AiOutlineShoppingCart
            size={25}
            color={data.quantity <= 0 ? "#ccc" : "#333"}
          />
        </button>

        {open && <ProductDetailsCart setOpen={setOpen} data={data} />}
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Product;
