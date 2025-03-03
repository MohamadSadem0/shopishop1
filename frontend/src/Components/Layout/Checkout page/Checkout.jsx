import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../utils/axiosInstance1";
import ShippingInfo from "./ShippingInfo";
import CartData from "./CartData";
import styles from "../../../Styles/Style";

// react-toastify for messages
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  // Get user addresses (if any) from local storage
  const userAddresses = JSON.parse(localStorage.getItem("newAddressCreate"));
  const { cart } = useSelector((state) => state.cart);
  // Get authentication information from Redux state at the top level
  const { token, role } = useSelector((state) => state.auth);

  // Shipping address & other order state values
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [number, setNumber] = useState("");
  const [discountPrice, setDiscountPrice] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // This function is called when the user clicks "Go to Payment"
  const paymentSubmit = async () => {
    // Basic validation of the shipping address fields
    if (!address1 || !zipCode || !country || !city) {
      toast.error("Please choose your delivery address!");
      return;
    }
    
    // Build your shipping address object
    const shippingAddress = {
      address1,
      address2,
      zipCode,
      country,
      city,
    };

    // Build the order data object that you want to send to your backend.
    const orderData = {
      shippingAddress :address1,
      city : city,
      contactNumber:  number,
      discountPrice,
      // Optionally send cart data if needed by your API
      cart,
    };

    try {
      // Optionally, include the token in the header if your API requires authentication.
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      // Post the order data to your backend API endpoint
      const response = await axios.post("/customer/orders/checkout", orderData, config);

      
      // Assuming your backend responds with an order ID and message:
      const { orderId, message } = response.data;
      toast.success(message || "Order created successfully. Proceeding to payment.");

      // Optionally, store the order details locally for further processing on the payment page
      localStorage.setItem(
        "latestOrder",
        JSON.stringify({ orderId, shippingAddress, discountPrice })
      );
      
      // Navigate to the payment page
      navigate("/payment");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        {/* Shipping Info Section */}
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            userAdresses={userAddresses}
            number={number}
            setNumber={setNumber}
          />
        </div>
        {/* Cart Data Section */}
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
          />
        </div>
      </div>
      {/* Button to trigger the order submission and then navigate to payment */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.6 }}
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </motion.div>
      {/* Toast notifications */}
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
  );
};

export default Checkout;
