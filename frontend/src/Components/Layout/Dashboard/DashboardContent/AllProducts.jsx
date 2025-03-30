import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductsByStoreId,
  deleteProduct,
  applyDiscount,
  updateProduct,
  updateProductQuantity, 
  removeDiscount,
} from "../../../../redux/slices/productSlice";
import useCloudinaryUpload from "../../../../hooks/useCloudinaryUpload";
import ReusableFormModal from "../../../ReusableFormModal";
import ProductCard from "../ProductCard";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);
  const { role, store } = useSelector((state) => state.auth);

  // Modal states
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form states
  const [discountData, setDiscountData] = useState({
    discountType: "PERCENTAGE",
    discountValue: "",
    startDate: "",
    endDate: "",
    name: "",
    minQuantity: 1
  });
  
  const [updateData, setUpdateData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryName: "",
  });
  
  const [quantityData, setQuantityData] = useState({ quantity: "" });

  const { uploadImage, loading: imageUploading } = useCloudinaryUpload();

  // Fetch products based on user role
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (role === "MERCHANT" && store?.storeId) {
          await dispatch(fetchProductsByStoreId(store.storeId)).unwrap();
        } else {
          await dispatch(fetchAllProducts()).unwrap();
        }
      } catch (error) {
        toast.error("Failed to fetch products: " + error.message);
      }
    };

    fetchProducts();
  }, [dispatch, role, store?.storeId]);

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success("Product deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete product: " + (err.message || "Please try again"));
      }
    }
  };

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return format(parseISO(dateString), "yyyy-MM-dd");
  };

  // Handle discount application
  const handleDiscountClick = useCallback((product) => {
    if (!product || isNaN(product.price)) {
      toast.error("Invalid product data");
      return;
    }
    setSelectedProduct(product);
    setDiscountData({
      discountType: product.discountType || "PERCENTAGE",
      discountValue: product.discountValue ? String(product.discountValue) : "",
      startDate: product.discountStartDate ? formatDateForInput(product.discountStartDate) : "",
      endDate: product.discountEndDate ? formatDateForInput(product.discountEndDate) : "",
      name: product.discountName || "",
      minQuantity: product.discountMinQuantity || 1
    });
    setShowDiscountModal(true);
  }, []);

  // Handle discount removal
  const handleRemoveDiscount = async (productId) => {
    if (window.confirm("Are you sure you want to remove the discount?")) {
      try {
        await dispatch(removeDiscount(productId)).unwrap();
        toast.success("Discount removed successfully!");
      } catch (err) {
        toast.error("Failed to remove discount: " + (err.message || "Please try again"));
      }
    }
  };

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct?.id) return;
    
    try {
      const discountValue = parseFloat(discountData.discountValue);
      const originalPrice = parseFloat(selectedProduct.price);
  
      // Frontend validation
      if (isNaN(discountValue)) {
        throw new Error("Please enter a valid discount value");
      }
  
      if (discountData.discountType === "PERCENTAGE") {
        if (discountValue <= 0 || discountValue > 100) {
          throw new Error("Percentage must be between 0 and 100");
        }
      } else {
        if (discountValue <= 0 || discountValue >= originalPrice) {
          throw new Error(`Fixed discount must be between 0 and $${originalPrice.toFixed(2)}`);
        }
      }
  
      if (discountData.endDate && discountData.startDate > discountData.endDate) {
        throw new Error("End date must be after start date");
      }
  
      const response = await dispatch(applyDiscount({ 
        productId: selectedProduct.id, 
        discountData: {
          ...discountData,
          discountValue: discountValue
        } 
      })).unwrap();
  
      closeModal();
      toast.success("Discount applied successfully!");
    } catch (err) {
      if (err.message.includes("less than original price")) {
        toast.error(`Discount must be less than product price ($${selectedProduct.price})`);
      } else if (err.message.includes("modified by another transaction")) {
        toast.error("Product was updated by another user. Please refresh and try again.");
      } else {
        toast.error(err.message || "Failed to apply discount. Please try again.");
      }
    }
  };

  // Handle product edit
  const handleEditClick = useCallback((product) => {
    setSelectedProduct(product);
    setUpdateData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ? String(product.price) : "",
      imageUrl: product.imageUrl || "",
      categoryName: product.category?.name || "",
    });
    setShowUpdateModal(true);
  }, []);

  // Handle product update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct?.id) return;
    try {
      await dispatch(updateProduct({ 
        productId: selectedProduct.id, 
        productData: {
          ...updateData,
          price: parseFloat(updateData.price)
        } 
      })).unwrap();
      toast.success("Product updated successfully!");
      closeModal();
    } catch (err) {
      toast.error("Update failed: " + (err.message || "Please try again"));
    }
  };

  // Handle quantity update
  const handleQuantityClick = useCallback((product) => {
    setSelectedProduct(product);
    setQuantityData({
      quantity: product.quantity ? String(product.quantity) : "0"
    });
    setShowQuantityModal(true);
  }, []);

  // Handle quantity submission
  const handleQuantitySubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct?.id) return;
    try {
      const quantity = parseInt(quantityData.quantity, 10);
      if (isNaN(quantity) || quantity < 0) {
        throw new Error("Please enter a valid quantity");
      }
      
      await dispatch(updateProductQuantity({ 
        productId: selectedProduct.id, 
        quantity: quantity
      })).unwrap();
      toast.success("Quantity updated successfully!");
      closeModal();
    } catch (err) {
      toast.error("Quantity update failed: " + (err.message || "Please try again"));
    }
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const secureUrl = await uploadImage(file);
      setUpdateData(prev => ({ ...prev, imageUrl: secureUrl }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed: " + error.message);
    }
  };

  // Close all modals
  const closeModal = useCallback(() => {
    setShowDiscountModal(false);
    setShowUpdateModal(false);
    setShowQuantityModal(false);
    setSelectedProduct(null);
    setDiscountData({ 
      discountType: "PERCENTAGE",
      discountValue: "",
      startDate: "",
      endDate: "",
      name: "",
      minQuantity: 1
    });
    setUpdateData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      categoryName: "",
    });
    setQuantityData({ quantity: "" });
  }, []);

  // Form field configurations
  const discountFields = [
    {
      label: "Discount Type",
      name: "discountType",
      type: "select",
      options: [
        { value: "PERCENTAGE", label: "Percentage" },
        { value: "FIXED_AMOUNT", label: "Fixed Amount" }
      ],
      value: discountData.discountType,
      onChange: (e) => setDiscountData({ ...discountData, discountType: e.target.value }),
      required: true
    },
    {
      label: discountData.discountType === "PERCENTAGE" ? "Discount Percentage" : "Discount Amount",
      name: "discountValue",
      type: "number",
      placeholder: discountData.discountType === "PERCENTAGE" ? "0-100" : "Amount",
      value: discountData.discountValue,
      onChange: (e) => setDiscountData({ ...discountData, discountValue: e.target.value }),
      required: true,
      min: 0.01,
      max: discountData.discountType === "PERCENTAGE" ? 100 : selectedProduct?.price - 0.01,
      step: "0.01"
    },
    {
      label: "Start Date (Optional)",
      name: "startDate",
      type: "date",
      value: discountData.startDate,
      onChange: (e) => setDiscountData({ ...discountData, startDate: e.target.value }),
      min: format(new Date(), "yyyy-MM-dd")
    },
    {
      label: "End Date (Optional)",
      name: "endDate",
      type: "date",
      value: discountData.endDate,
      onChange: (e) => setDiscountData({ ...discountData, endDate: e.target.value }),
      min: discountData.startDate || format(new Date(), "yyyy-MM-dd")
    },
    {
      label: "Promotion Name (Optional)",
      name: "name",
      type: "text",
      value: discountData.name,
      onChange: (e) => setDiscountData({ ...discountData, name: e.target.value })
    },
    {
      label: "Minimum Quantity (Optional)",
      name: "minQuantity",
      type: "number",
      value: discountData.minQuantity,
      onChange: (e) => setDiscountData({ ...discountData, minQuantity: parseInt(e.target.value) || 1 }),
      min: 1
    }
  ];

  const updateFields = [
    {
      label: "Product Name",
      name: "name",
      type: "text",
      placeholder: "Enter product name",
      value: updateData.name,
      onChange: (e) => setUpdateData({ ...updateData, name: e.target.value }),
      required: true
    },
    {
      label: "Description",
      name: "description",
      type: "textarea",
      placeholder: "Enter product description",
      value: updateData.description,
      onChange: (e) => setUpdateData({ ...updateData, description: e.target.value }),
      required: true
    },
    {
      label: "Price ($)",
      name: "price",
      type: "number",
      placeholder: "Enter product price",
      value: updateData.price,
      onChange: (e) => setUpdateData({ ...updateData, price: e.target.value }),
      required: true,
      min: 0.01,
      step: "0.01"
    },
    {
      label: "Image",
      name: "imageUrl",
      type: "file",
      onChange: handleFileChange,
      accept: "image/*",
      disabled: imageUploading
    },
    {
      label: "Category",
      name: "categoryName",
      type: "text",
      placeholder: "Enter product category",
      value: updateData.categoryName,
      onChange: (e) => setUpdateData({ ...updateData, categoryName: e.target.value }),
      required: true
    }
  ];

  const quantityFields = [
    {
      label: "New Quantity",
      name: "quantity",
      type: "number",
      placeholder: "Enter new quantity",
      value: quantityData.quantity,
      onChange: (e) => setQuantityData({ quantity: e.target.value }),
      required: true,
      min: 0
    }
  ];

  return (
    <div className="container mx-auto w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        {role === "MERCHANT" ? "My Products" : "All Products"}
      </h2>
      
      {status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : status === "failed" ? (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          {error || "Failed to load products"}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              onDiscount={handleDiscountClick}
              onRemoveDiscount={handleRemoveDiscount}
              onEdit={handleEditClick}
              onUpdateQuantity={handleQuantityClick}
              isMerchant={role === "MERCHANT"}
            />
          ))}
        </div>
      )}

      {/* Discount Modal */}
      <ReusableFormModal
        isVisible={showDiscountModal}
        title={selectedProduct?.discountPrice ? "Update Discount" : "Apply Discount"}
        fields={discountFields}
        onSubmit={handleDiscountSubmit}
        onClose={closeModal}
        submitLabel={selectedProduct?.discountPrice ? "Update" : "Apply"}
        isLoading={status === "loading"}
      />

      {/* Update Product Modal */}
      <ReusableFormModal
        isVisible={showUpdateModal}
        title="Edit Product"
        fields={updateFields}
        onSubmit={handleUpdateSubmit}
        onClose={closeModal}
        submitLabel="Save Changes"
        isLoading={status === "loading" || imageUploading}
      />

      {/* Quantity Modal */}
      <ReusableFormModal
        isVisible={showQuantityModal}
        title="Update Product Quantity"
        fields={quantityFields}
        onSubmit={handleQuantitySubmit}
        onClose={closeModal}
        submitLabel="Update Quantity"
        isLoading={status === "loading"}
      />
    </div>
  );
};

export default AllProducts;