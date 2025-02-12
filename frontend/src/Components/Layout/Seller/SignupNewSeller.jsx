import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../../Styles/Style";
import { Link, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createStore, resetStore } from "../../../Redux/slices/storeSlice";
import { fetchAllSections } from "../../../Redux/slices/sectionSlice";
import useCloudinaryUpload from "../../../hooks/useCloudinaryUpload"; // Import Cloudinary upload hook

const SignupNewSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch sections from Redux
  const { sections, status } = useSelector((state) => state.sections);
  const { store, loading, error } = useSelector((state) => state.store); 
   const { token } = useSelector((state) => state.auth);


  // Cloudinary Hook
  const { uploadImage } = useCloudinaryUpload();

  // Local state for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    zipCode: "",
    shopDescription: "",
    password: "",
    sectionName: "", 
    imageUrl: "",
  });

  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllSections()); // Fetch sections when the component mounts
  }, [dispatch]);

  useEffect(() => {
    if (store) {
      toast.success("Store created successfully!");
      dispatch(resetStore());
      navigate("/dashboard");
    }
    if (error) {
      toast.error(error);
    }
  }, [store, error, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setUploading(true);
      try {
        const uploadedImageUrl = await uploadImage(file);
        setFormData({ ...formData, imageUrl: uploadedImageUrl });
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Image upload failed. Try again.");
      }
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error("Please upload an image before submitting.");
      return;
    }
    const storeData = { ...formData, token }; // Attach the token properly

    dispatch(createStore(storeData)); // Ensure token is passed correctly
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.h2
          initial={{ opacity: 0, y: -500 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -500 }}
          transition={{ duration: 0.6 }}
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
        >
          Register as a new seller
        </motion.h2>
      </div>
      <div className="mt-8 mx-auto w-[95%] 800px:w-[60%]">
        <motion.div
          initial={{ opacity: 0, y: 500 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 500 }}
          transition={{ duration: 0.6 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          <form className="space-y-6 800px:flex flex-wrap items-center justify-between" onSubmit={handleFormSubmit}>
            <div className="800px:w-[47%]">
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="800px:w-[47%]">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="800px:w-[100%]">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Section Dropdown */}
            <div className="800px:w-[100%]">
              <label className="block text-sm font-medium text-gray-700">Select Section</label>
              <select
                name="sectionName"
                required
                value={formData.sectionName}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a Section</option>
                {status === "loading" ? (
                  <option>Loading...</option>
                ) : (
                  sections.map((section) => (
                    <option key={section.id} value={section.name}>
                      {section.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Image Upload */}
            <div className="flex items-center">
              <label className="ml-5 flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <span>{uploading ? "Uploading..." : "Upload Shop Image"}</span>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileInputChange} className="sr-only" />
              </label>
            </div>

            <div className="w-full">
              <button
                type="submit"
                disabled={loading || uploading}
                className={`group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading || uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading || uploading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default SignupNewSeller;
