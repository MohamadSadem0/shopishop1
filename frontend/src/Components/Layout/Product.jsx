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
    click
      ? dispatch(removeFromWishlist(data))
      : dispatch(addToWishlist(data));
  };

  const handleAddToCart = async () => {
    if (!data?.id) return;
    try {
      // Here we use default quantity = 1 for the card view.
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

  return (
    <div className="bg-white rounded-lg shadow-sm w-full h-[330px] relative p-3 cursor-pointer">
      <Link to={`/product/${data.id}`}>
        <img
          src={data.imageUrl || "/default-image.jpg"}
          alt={data.name}
          className="w-full object-contain select-none h-[130px]"
        />
      </Link>

      <Link to={`/product/${data.id}`}>
        <h5 className={`${styles.shop_name} select-none py-3`}>
          Category: {data.categoryName}
        </h5>
      </Link>

      <Link to={`/product/${data.id}`}>
        <h4 className="pb-3 font-[500]">
          Name:{" "}
          {data.name.length > 40 ? `${data.name.slice(0, 40)}...` : data.name}
        </h4>
        <div className="flex select-none items-center">
          <span className="mr-2 font-bold">Rating:</span>
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

      <div className="py-2 flex flex-col select-none">
        {data?.effectivePrice && data.effectivePrice < data.price ? (
          <>
            <div className="flex items-center">
              <span className="font-bold mr-1">Price:</span>
              <span className={styles.productDiscountPrice}>
                ${data.effectivePrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-1">Original Price:</span>
              <span className={styles.price}>
                ${data.price.toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <span className="font-bold mr-1">Price:</span>
            <span className={styles.productDiscountPrice}>
              ${data.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div>
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

        <button
          onClick={() => setOpen(!open)}
          className="absolute top-16 right-3 cursor-pointer"
        >
          <AiOutlineEye size={22} color="#333" title="Quick view" />
        </button>

        <button
          onClick={handleAddToCart}
          className="absolute top-24 right-3 cursor-pointer"
        >
          <AiOutlineShoppingCart size={25} color="#333" title="Add to cart" />
        </button>

        {open && <ProductDetailsCart setOpen={setOpen} data={data} />}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Product;
