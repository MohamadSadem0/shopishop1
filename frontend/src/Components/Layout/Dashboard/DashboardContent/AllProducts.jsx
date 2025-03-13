import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductsByStoreId,
  deleteProduct,
  applyDiscount,
  updateProduct,
  updateProductQuantity, 
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

  // Modal states for discount, update product and update quantity
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false); // NEW
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

  // NEW: State for quantity update data
  const [quantityData, setQuantityData] = useState({
    quantity: "",
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

  // NEW: Open quantity update modal and pre-fill with product's current quantity
  const handleQuantityClick = (product) => {
    setSelectedProductId(product.id);
    setQuantityData({
      quantity: product.quantity,
    });
    setShowQuantityModal(true);
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

  // NEW: Handle quantity update submission
  const handleQuantitySubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    try {
      await dispatch(
        updateProductQuantity({ productId: selectedProductId, quantity: parseInt(quantityData.quantity, 10) })
      ).unwrap();
      alert("Product quantity updated successfully!");
      setShowQuantityModal(false);
      setQuantityData({ quantity: "" });
      setSelectedProductId(null);
    } catch (err) {
      alert("Quantity update failed: " + err);
    }
  };

  const closeModal = () => {
    setShowDiscountModal(false);
    setShowUpdateModal(false);
    setShowQuantityModal(false);
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
    setQuantityData({ quantity: "" });
  };

  // Merge the base product columns with an Actions column that uses our handlers
  const productColumns = [
    ...productColumnsConfig,
    {
      header: "Actions",
      render: (product) => (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleDelete(product.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => handleDiscountClick(product.id)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Discount
          </button>
          <button
            onClick={() => handleEditClick(product)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Edit
          </button>
          {/* NEW: Button to update quantity */}
          <button
            onClick={() => handleQuantityClick(product)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Update Quantity
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

  // NEW: Build quantity fields for the quantity update modal
  const quantityFields = [
    {
      label: "New Quantity",
      name: "quantity",
      type: "number",
      placeholder: "Enter new quantity",
      value: quantityData.quantity,
      onChange: (e) => setQuantityData({ ...quantityData, quantity: e.target.value }),
      required: true,
      min: 0,
    },
  ];

  return (
    <div className="container mx-auto w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-center mb-8">All Products</h2>
      {status === "loading" && (
        <p className="text-center text-gray-500">Loading products...</p>
      )}
      {status === "failed" && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* Table view for medium screens and up */}
      <div className="hidden md:block">
        <ReusableTable columns={productColumns} data={products} />
      </div>

      {/* Card view for small screens */}
      <div className="block md:hidden">
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

      {/* NEW: Quantity Update Modal */}
      <ReusableFormModal
        isVisible={showQuantityModal}
        title="Update Product Quantity"
        fields={quantityFields}
        onSubmit={handleQuantitySubmit}
        onClose={closeModal}
        submitLabel="Update"
      />
    </div>
  );
};

export default AllProducts;
