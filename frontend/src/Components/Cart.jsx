import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../utils/axiosInstance1"; // your axios instance
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../Styles/Style";
import { useSelector } from "react-redux";

function Cart({ setOpenCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token & role from Redux store
  const { token, role } = useSelector((state) => state.auth);

  const canCheckout = token && (role === "CUSTOMER" || role === "MERCHANT");

  useEffect(() => {
    if (!token) {
      setError("You need to be logged in to view the cart.");
      setLoading(false);
      return;
    }
    fetchCartFromBackend();
  }, [token]);

  const fetchCartFromBackend = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/customer/cart/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data || []);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load cart");
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`/customer/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Item removed from cart!");
      fetchCartFromBackend();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  const handleIncrement = async (item) => {
    if (item.quantity >= item.availableQuantity) {
      toast.error("Reached available stock limit!");
      return;
    }
    try {
      await axios.post(
        "/customer/cart/add",
        {
          productId: item.productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCartFromBackend();
    } catch (err) {
      console.error(err);
      toast.error("Failed to increment item");
    }
  };

  const handleDecrement = async (item) => {
    if (item.quantity <= 1) {
      handleRemoveItem(item.productId);
      return;
    }
    try {
      await axios.post(
        "/customer/cart/add",
        {
          productId: item.productId,
          quantity: -1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCartFromBackend();
    } catch (err) {
      toast.error("Failed to decrement item");
    }
  };

  const totalPrice = cartItems
    .reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="w-full fixed h-screen left-0 top-0 z-50 bg-[#0000006b]">
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 right-0 h-full w-[80%] sm:w-[60%] 800px:w-[30%] flex flex-col justify-between shadow-sm bg-white overflow-y-scroll"
      >
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <p>Loading cart...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex fixed top-3 right-3 pr-3 pt-3 justify-end w-full">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full p-4 cursor-pointer justify-end items-center">
                <RxCross1 size={20} onClick={() => setOpenCart(false)} />
              </div>
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-3 font-[500] text-[17px]">{cartItems.length}</h5>
              </div>
              <br />
              <div className="w-full border-t">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center p-4 border-b">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold text-lg">{item.productName}</h3>
                      <p className="text-sm text-gray-500">
                        Unit Price: ${parseFloat(item.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Available: {item.availableQuantity}
                      </p>
                      <div className="mt-2 flex items-center">
                        <button
                          onClick={() => handleDecrement(item)}
                          className="bg-gray-300 px-3 py-1 rounded"
                        >
                          -
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item)}
                          className="bg-gray-300 px-3 py-1 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-500 font-bold">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-600 text-sm mt-2 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-3 mb-3 mt-7">
              <Link to={canCheckout ? "/checkout" : "/sign-up"}>
                <button className="rounded-[5px] flex items-center justify-center w-[100%] bg-[#e44343] h-[45px] text-white">
                  Checkout Now (USD${totalPrice})
                </button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Cart;
