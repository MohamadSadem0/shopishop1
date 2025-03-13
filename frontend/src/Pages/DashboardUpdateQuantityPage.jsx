import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/Style";

const DashboardUpdateQuantityPage = () => {
  const [productId, setProductId] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!productId || newQuantity === "") {
      toast.error("Please fill in both fields.");
      return;
    }
    try {
      // This API call sends a PUT request to update the product's quantity.
      // The authenticated merchant's token is attached automatically (if configured in axios instance).
      const response = await axiosInstance.put(
        `/merchant/product/update-quantity/${productId}`,
        { quantity: parseInt(newQuantity, 10) }
      );
      toast.success("Product quantity updated successfully!");
      // Optionally, navigate back or refresh the product list.
      setTimeout(() => navigate("/dashboard-products"), 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update product quantity."
      );
    }
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-3xl font-bold text-center mb-8">Update Product Quantity</h2>
      <form onSubmit={handleUpdate} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Product ID</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter Product ID"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">New Quantity</label>
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            placeholder="Enter new quantity"
            min="0"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className={`${styles.button} bg-blue-500 text-white rounded-md px-4 py-2`}
        >
          Update Quantity
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default DashboardUpdateQuantityPage;
