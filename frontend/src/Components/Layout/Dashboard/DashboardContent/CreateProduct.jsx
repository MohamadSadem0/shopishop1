import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../../redux/slices/productSlice";
import { fetchCategoriesBySection } from "../../../../redux/slices/categorySlice";
import { AiOutlinePlusCircle } from "react-icons/ai";
import styles from "../../../../Styles/Style";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import useCloudinaryUpload from "../../../../hooks/useCloudinaryUpload";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploadImage, loading: imageLoading } = useCloudinaryUpload();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const { categories, status: categoryStatus } = useSelector((state) => state.category);
  const { store } = useSelector((state) => state.auth);

  useEffect(() => {
    if (store?.sectionName) {
      dispatch(fetchCategoriesBySection(store.sectionName));
      
    }
  }, [dispatch, store?.sectionName]);

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

    if (!productName || !productDescription || !price || !categoryName || !imageUrl) {
      toast.error("Please fill out all fields and upload an image!");
      return;
    }

    const productData = {
      name: productName,
      description: productDescription,
      price,
      imageUrl,
      categoryName,
      storeId: store?.storeId, // Assign storeId from Redux store
    };

    try {
      await dispatch(createProduct(productData)).unwrap();
      toast.success("Product Created Successfully!");
      setTimeout(() => navigate("/dashboard/dashboard-products"), 2000);
    } catch (error) {
      toast.error(error || "Failed to create product.");
    }
  };

  return (
    <>
      <div className="w-full h-[80vh] shadow overflow-y-scroll bg-white py-3 px-5">
        <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
        <br />
        <form className="800px:flex w-full justify-between flex-wrap" onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="w-full 800px:w-[47%]">
            <label className="pb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={productName}
              required
              onChange={(e) => setProductName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter product name..."
            />
          </div>

          {/* Select Category */}
          <div className="w-full 800px:w-[47%] mt-5">
            <label className="pb-2">
              Select Category <span className="text-red-500">*</span>
            </label>
            {categoryStatus === "loading" ? (
              <p>Loading categories...</p>
            ) : (
              <select
                className="w-full px-3 py-2 block rounded-md border mt-2"
                value={categoryName}
                required
                onChange={(e) => setCategoryName(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories found</option>
                )}
              </select>
            )}
          </div>

          {/* Product Description */}
          <div className="w-full mt-5">
            <label className="pb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={productDescription}
              required
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Enter product description..."
              className="block w-full h-[150px] px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          {/* Product Price */}
          <div className="w-full 800px:w-[47%] mt-5">
            <label className="pb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter product price..."
            />
          </div>

          {/* Upload Image */}
          <div className="w-full mt-5">
            <label className="pb-2">
              Upload Product Image <span className="text-red-500">*</span>
            </label>
            <input type="file" id="uploadImage" onChange={handleImageChange} className="hidden" required />
            <label htmlFor="uploadImage" className={`${styles.button} bg-blue-500 text-white mr-3 rounded-md`}>
              {imageLoading ? "Uploading..." : "Upload"}
              <AiOutlinePlusCircle size={30} className="ml-1 cursor-pointer" />
            </label>

            {/* Show uploaded image preview */}
            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="product" className="w-[80px] h-[80px] mt-2 object-cover" />}
          </div>

          {/* Submit Button */}
          <div className="w-full mt-6 flex items-center justify-center">
            <input
              type="submit"
              value={imageLoading ? "Uploading Image..." : "Create Product"}
              disabled={imageLoading}
              className={`${styles.button} bg-blue-500 text-white rounded-md px-4 py-2 ${
                imageLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default CreateProduct;
