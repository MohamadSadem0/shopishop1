import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductsByStoreId,
  deleteProduct,
  applyDiscount,
  updateProduct,
} from "../../../../redux/slices/productSlice";
import useCloudinaryUpload from "../../../../hooks/useCloudinaryUpload";
import ReusableTable from "../../../ReusableTable"; // Adjust the import path as needed
import ReusableCard from "../../../ReusableCard";   // Adjust the import path as needed
import ReusableFormModal from "../../../ReusableFormModal"; // Adjust the import path as needed
import {
  productColumns as productColumnsConfig,
  discountFieldsConfig,
  updateFieldsConfig,
} from "../../../../constants/ProductConstants";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);
  const { role, store } = useSelector((state) => state.auth);

  // Modal states for discount and update
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // State for discount data
  const [discountData, setDiscountData] = useState({
    discountPrice: "",
    discountPercent: "",
    discountStartDate: "",
    discountEndDate: "",
  });

  // State for update data
  const [updateData, setUpdateData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryName: "",
    storeId: "",
  });

  // Use the Cloudinary upload hook
  const { uploadImage, loading: imageUploading } = useCloudinaryUpload();

  useEffect(() => {
    if (role === "MERCHANT" && store?.storeId) {
      dispatch(fetchProductsByStoreId(store.storeId));
    } else {
      dispatch(fetchAllProducts());
      
    }
  }, [dispatch, role, store?.storeId]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await dispatch(deleteProduct(productId)).unwrap();
      alert("Product deleted successfully!");
    }
  };

  // Open the discount modal
  const handleDiscountClick = (productId) => {
    setSelectedProductId(productId);
    setShowDiscountModal(true);
  };

  // Open the update modal and pre-fill with product data
  const handleEditClick = (product) => {
    setSelectedProductId(product.id);
    setUpdateData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryName: product.categoryName,
      storeId: product.storeId,
    });
    setShowUpdateModal(true);
  };

  // Handle file change for updating image
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const secureUrl = await uploadImage(file);
        setUpdateData((prev) => ({ ...prev, imageUrl: secureUrl }));
      } catch (error) {
        alert("Image upload failed. Please try again.");
      }
    }
  };

  // Handle discount submission
  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    const payload = {
      discountPrice: discountData.discountPrice ? parseFloat(discountData.discountPrice) : null,
      discountPercent: discountData.discountPercent ? parseFloat(discountData.discountPercent) : null,
      discountStartDate: discountData.discountStartDate || null,
      discountEndDate: discountData.discountEndDate || null,
    };

    await dispatch(applyDiscount({ productId: selectedProductId, discountData: payload })).unwrap();

    setShowDiscountModal(false);
    setDiscountData({
      discountPrice: "",
      discountPercent: "",
      discountStartDate: "",
      discountEndDate: "",
    });
  };

  // Handle update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    try {
      await dispatch(updateProduct({ productId: selectedProductId, productData: updateData })).unwrap();
      alert("Product updated successfully!");
      setShowUpdateModal(false);
      setUpdateData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryName: "",
        storeId: "",
      });
      setSelectedProductId(null);
    } catch (err) {
      alert("Update failed: " + err);
    }
  };

  const closeModal = () => {
    setShowDiscountModal(false);
    setShowUpdateModal(false);
    setSelectedProductId(null);
    setDiscountData({
      discountPrice: "",
      discountPercent: "",
      discountStartDate: "",
      discountEndDate: "",
    });
    setUpdateData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      categoryName: "",
      storeId: "",
    });
  };

  // Merge the base product columns with an Actions column that uses our handlers
  const productColumns = [
    ...productColumnsConfig,
    {
      header: "Actions",
      render: (product) => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleDelete(product.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={() => handleDiscountClick(product.id)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
          >
            Discount
          </button>
          <button
            onClick={() => handleEditClick(product)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  // Build discount fields using discountFieldsConfig
  const discountFields = discountFieldsConfig.map((field) => ({
    ...field,
    value: discountData[field.name],
    onChange: (e) => setDiscountData({ ...discountData, [field.name]: e.target.value }),
  }));

  // Build update fields using updateFieldsConfig
  const updateFields = updateFieldsConfig.map((field) => ({
    ...field,
    value: updateData[field.name],
    onChange: (e) => setUpdateData({ ...updateData, [field.name]: e.target.value }),
  }));

  return (
    <div className="w-full h-full overflow-y-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">All Products</h2>
      {status === "loading" && <p className="text-center text-gray-500">Loading products...</p>}
      {status === "failed" && <p className="text-center text-red-500">{error}</p>}

      {/* Table view for screens lg (1024px) and up */}
      <div className="hidden lg:block">
        <ReusableTable columns={productColumns} data={products} />
      </div>

      {/* Card view for screens below lg */}
      <div className="block lg:hidden">
        <ReusableCard columns={productColumns} data={products} />
      </div>

      {/* Discount Modal */}
      <ReusableFormModal
        isVisible={showDiscountModal}
        title="Apply Discount"
        fields={discountFields}
        onSubmit={handleDiscountSubmit}
        onClose={closeModal}
        submitLabel="Save"
      />

      {/* Update Modal */}
      <ReusableFormModal
        isVisible={showUpdateModal}
        title="Edit Product"
        fields={updateFields}
        onSubmit={handleUpdateSubmit}
        onClose={closeModal}
        submitLabel="Save"
      />
    </div>
  );
};

export default AllProducts;
