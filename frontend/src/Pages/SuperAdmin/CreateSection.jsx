import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSection } from "../../redux/slices/sectionSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import styles from "../../Styles/Style";
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload"; // Import Cloudinary Hook

const CreateSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { uploadImage, loading } = useCloudinaryUpload(); // Use Cloudinary Upload Hook
  const [sectionName, setSectionName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Handle image selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    try {
      toast.info("Uploading image...");
      const uploadedImageUrl = await uploadImage(file); // Upload to Cloudinary
      setImageUrl(uploadedImageUrl); // Store Cloudinary URL
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sectionName || !imageUrl) {
      toast.error("Please fill out all fields and upload an image!");
      return;
    }

    const sectionData = { name: sectionName, imageUrl };

    try {
      await dispatch(createSection(sectionData)).unwrap();
      toast.success("Section Created Successfully!");
      setTimeout(() => navigate("/superadmin-dashboard/sections"), 2000);
    } catch (error) {
      toast.error(error || "Failed to create section.");
    }
  };

  return (
    <>
      <div className="w-full h-[80vh] shadow overflow-y-scroll bg-white py-3 px-5">
        <h5 className="text-[30px] font-Poppins text-center">Create Section</h5>
        <br />
        <form className="800px:flex w-full justify-between flex-wrap" onSubmit={handleSubmit}>
          {/* Section Name Input */}
          <div className="w-full 800px:w-[47%]">
            <label className="pb-2">
              Section Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={sectionName}
              required
              onChange={(e) => setSectionName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter section name..."
            />
          </div>

          {/* Upload Image Section */}
          <div className="w-full 800px:w-[47%] mt-5">
            <label className="pb-2">
              Upload Section Image <span className="text-red-500">*</span>
            </label>
            <input type="file" id="uploadImage" onChange={handleImageChange} className="hidden" required />
            <label htmlFor="uploadImage" className={`${styles.button} bg-blue-500 text-white mr-3 rounded-md`}>
              {loading ? "Uploading..." : "Upload"}
              <AiOutlinePlusCircle size={30} className="ml-1 cursor-pointer" />
            </label>

            {/* Show uploaded image preview */}
            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="section" className="w-[80px] h-[80px] mt-2 object-cover" />}
          </div>

          {/* Submit Button */}
          <div className="w-full mt-6 flex items-center justify-center">
            <input
              type="submit"
              value={loading ? "Uploading Image..." : "Create Section"}
              disabled={loading}
              className={`${styles.button} bg-blue-500 text-white rounded-md px-4 py-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default CreateSection;
