import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../Styles/Style";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

// Import your cart slice thunks 
import { fetchCart, removeFromCart, clearCart } from "../Redux/slices/cartSlice";
import CartSingle from "./Layout/CartSingle"; // A sub-component for rendering a single cart item

const Cart = ({ setOpenCart }) => {
  const dispatch = useDispatch();
  const { items = [], status, error } = useSelector((state) => state.cart);

  // If using Redux for auth
  const token = useSelector((state) => state.auth.token);

  /**
   *  On mount or whenever token changes, fetch the cart from the backend
   *  if the user is logged in.
   */
  useEffect(() => {
    if (token) {
      dispatch(fetchCart()); // <-- no arguments needed
      
    }
  }, [dispatch, token]);

  /**
   * Sum up total price
   */
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  /**
   * Clear entire cart
   */
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  /**
   * If cart is loading from backend
   */
  if (status === "loading") {
    return (
      <div className="fixed w-full h-screen bg-[#0000006b] top-0 left-0 z-50 flex items-center justify-center">
        <p className="bg-white p-4">Loading cart...</p>
      </div>
    );
  }

  /**
   * If fetch failed
   */
  if (status === "failed") {
    return (
      <div className="fixed w-full h-screen bg-[#0000006b] top-0 left-0 z-50 flex items-center justify-center">
        <p className="bg-white p-4 text-red-500">
          Failed to load cart: {error || "Unknown error"}
        </p>
        <button
          className="bg-blue-500 text-white p-2 mt-2 rounded"
          onClick={() => {dispatch(fetchCart())
            console.log(items);}
            
          }
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full fixed h-screen left-0 top-0 z-50 bg-[#0000006b]">
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 right-0 h-full w-[80%] sm:w-[60%] 800px:w-[30%]
                   flex flex-col justify-between shadow-sm bg-white overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Header Icons */}
        <div className="flex w-full p-4 cursor-pointer justify-end items-center">
          <RxCross1 size={20} onClick={() => setOpenCart(false)} />
        </div>

        {/* If cart is empty */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h5 className="text-gray-600">Cart is empty!</h5>
          </div>
        ) : (
          <>
            {/* Items count */}
            <div className={`${styles.noramlFlex} p-4`}>
              <IoBagHandleOutline size={25} />
              <h5 className="pl-3 font-[500] text-[17px]">
                {items.length} Items
              </h5>
            </div>

            {/* Cart Items */}
            <div className="w-full border-t">
              {items.map((item) => (
                <CartSingle key={item.id} data={item} />
                // CartSingle will handle remove or update quantity by dispatching removeFromCart, etc.
              ))}
            </div>

            {/* Cart Footer */}
            <div className="p-4">
              <p className="mb-2">Total: ${totalPrice.toFixed(2)}</p>
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white w-full p-2 mb-2 rounded"
              >
                Clear Cart
              </button>

              {/* Example: navigate to a Checkout route */}
              <button className="bg-blue-500 text-white w-full p-2 rounded">
                Checkout
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
