import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewCategory, fetchAllCategories } from "../../redux/slices/categorySlice";
import { fetchAllSections } from "../../redux/slices/sectionSlice"; // Fetch sections
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import styles from "../../Styles/Style";
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload";

const CreateCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
  
  const { uploadImage, loading } = useCloudinaryUpload(); // Cloudinary Hook
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");

  const { sections } = useSelector((state) => state.sections);

  useEffect(() => {
    dispatch(fetchAllSections()); // Fetch sections on component mount 
  }, [dispatch]);

  // Handle Image Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    try {
      toast.info("Uploading image...");
      const uploadedImageUrl = await uploadImage(file);
      setImageUrl(uploadedImageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !imageUrl || !selectedSection) {
      toast.error("Please fill out all fields and upload an image!");
      return;
    }

    const categoryData = { name: categoryName, imageUrl, sectionName: selectedSection };

    try {
      await dispatch(createNewCategory(categoryData)).unwrap();
      toast.success("Category Created Successfully!");
      setTimeout(() => navigate("/superadmin-dashboard/categories"), 2000);
    } catch (error) {
      toast.error(error || "Failed to create category.");
    }
  };

  return (
    <>
      <div className="w-full h-[80vh] shadow overflow-y-scroll bg-white py-3 px-5">
        <h5 className="text-[30px] font-Poppins text-center">Create Category</h5>
        <br />
        <form className="800px:flex w-full justify-between flex-wrap" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="w-full 800px:w-[47%]">
            <label className="pb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryName}
              required
              onChange={(e) => setCategoryName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter category name..."
            />
          </div>

          {/* Select Section */}
          <div className="w-full 800px:w-[47%] mt-5">
            <label className="pb-2">
              Select Section <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 block rounded-md border mt-2"
              value={selectedSection}
              required
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Select a section</option>
              {sections.map((section) => (
                <option key={section.name} value={section.name}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Image */}
          <div className="w-full 800px:w-[47%] mt-5">
            <label className="pb-2">
              Upload Category Image <span className="text-red-500">*</span>
            </label>
            <input type="file" id="uploadImage" onChange={handleImageChange} className="hidden" required />
            <label htmlFor="uploadImage" className={`${styles.button} bg-blue-500 text-white mr-3 rounded-md`}>
              {loading ? "Uploading..." : "Upload"}
              <AiOutlinePlusCircle size={30} className="ml-1 cursor-pointer" />
            </label>

            {/* Show uploaded image preview */}
            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="category" className="w-[80px] h-[80px] mt-2 object-cover" />}
          </div>

          {/* Submit Button */}
          <div className="w-full mt-6 flex items-center justify-center">
            <input
              type="submit"
              value={loading ? "Uploading Image..." : "Create Category"}
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

export default CreateCategory;
