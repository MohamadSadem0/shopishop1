import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStoreProducts,
  fetchProductsByStoreId,
  deleteProduct,
  updateProduct,
  updateProductQuantity,
  resetStoreProducts,
} from "../../../../redux/slices/productSlice";
import {
  applyDiscount,
  removeDiscount,
  resetDiscountStatus,
} from "../../../../redux/slices/discountSlice";
import useCloudinaryUpload from "../../../../hooks/useCloudinaryUpload";
import ReusableFormModal from "../../../ReusableFormModal";
import ProductCard from "../ProductCard";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../LoadingSpinner";
import EmptyState from "../../../EmptyState.jsx";
import InfiniteScroll from "react-infinite-scroll-component";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { 
    products,
    storeProducts,
    status: productStatus, 
    error: productError,
    storeProductsHasMore,
    storeProductsCursorId,
    storeProductsCursorDate
  } = useSelector((state) => state.products);
  
  const {
    items: discountedProducts,
    loading: discountLoading,
    error: discountError,
    operationStatus: discountStatus,
  } = useSelector((state) => state.discount);
  
  const { role, store } = useSelector((state) => state.auth);

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form states
  const [discountData, setDiscountData] = useState({
    discountType: "PERCENTAGE",
    discountValue: "",
    startDate: "",
    endDate: "",
    name: "",
    minQuantity: 1,
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

  // Modal types
  const MODAL_TYPES = {
    DISCOUNT: "DISCOUNT",
    UPDATE: "UPDATE",
    QUANTITY: "QUANTITY",
  };

  // Fetch initial products based on user role
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        dispatch(resetStoreProducts());
        
        if (role === "MERCHANT" && store?.storeId) {
          await dispatch(fetchProductsByStoreId({ 
            storeId: store.storeId,
            size: 10
          })).unwrap();
        } else if (role === "CUSTOMER" || role === "ADMIN") {
          await dispatch(fetchStoreProducts({ 
            storeId: store?.storeId,
            size: 10
          })).unwrap();
        }
      } catch (error) {
        toast.error("Failed to fetch products: " + error.message);
      }
    };

    fetchInitialProducts();
  }, [dispatch, role, store?.storeId]);

  // Handle discount operation status changes
  useEffect(() => {
    if (discountStatus === "succeeded") {
      toast.success("Discount operation completed successfully!");
      dispatch(resetDiscountStatus());
      closeModal();
    } else if (discountStatus === "failed") {
      toast.error(discountError || "Discount operation failed");
      dispatch(resetDiscountStatus());
    }
  }, [discountStatus, discountError, dispatch]);

  // Load more products for infinite scroll
  const loadMoreProducts = async () => {
    if (productStatus === 'loading') return;
    
    try {
      if (role === "MERCHANT" && store?.storeId) {
        await dispatch(fetchProductsByStoreId({ 
          storeId: store.storeId,
          cursorId: storeProductsCursorId,
          cursorDate: storeProductsCursorDate,
          size: 10
        })).unwrap();
      } else {
        await dispatch(fetchStoreProducts({ 
          storeId: store?.storeId,
          cursorId: storeProductsCursorId,
          cursorDate: storeProductsCursorDate,
          size: 10
        })).unwrap();
      }
    } catch (error) {
      toast.error("Failed to load more products: " + error.message);
    }
  };

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
    if (!product || isNaN(product.originalPrice)) {
      toast.error("Invalid product data");
      return;
    }
    setSelectedProduct(product);
    setDiscountData({
      discountType: product.discountInfo?.discountType || "PERCENTAGE",
      discountValue: product.discountInfo?.discountValue
        ? String(product.discountInfo.discountValue)
        : "",
      startDate: product.discountInfo?.startDate
        ? formatDateForInput(product.discountInfo.startDate)
        : "",
      endDate: product.discountInfo?.endDate
        ? formatDateForInput(product.discountInfo.endDate)
        : "",
      name: product.discountInfo?.name || "",
      minQuantity: product.discountInfo?.minQuantity || 1,
    });
    setActiveModal(MODAL_TYPES.DISCOUNT);
  }, []);

  // Handle discount removal
  const handleRemoveDiscount = async (productId) => {
    if (window.confirm("Are you sure you want to remove the discount?")) {
      try {
        await dispatch(removeDiscount(productId)).unwrap();
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
      const originalPrice = parseFloat(selectedProduct.originalPrice);
  
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
          throw new Error(
            `Fixed discount must be between 0 and $${originalPrice.toFixed(2)}`
          );
        }
      }
  
      if (discountData.endDate && discountData.startDate > discountData.endDate) {
        throw new Error("End date must be after start date");
      }
  
      await dispatch(
        applyDiscount({
          productId: selectedProduct.id,
          discountData: {
            ...discountData,
            discountValue: discountValue,
          },
        })
      ).unwrap();
    } catch (err) {
      const errorMessage = err?.message || "Failed to apply discount. Please try again.";
      
      if (typeof errorMessage === 'string') {
        if (errorMessage.includes("less than original price")) {
          toast.error(
            `Discount must be less than product price ($${selectedProduct.originalPrice})`
          );
        } else if (errorMessage.includes("modified by another transaction")) {
          toast.error(
            "Product was updated by another user. Please refresh and try again."
          );
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  // Handle product edit
  const handleEditClick = useCallback((product) => {
    setSelectedProduct(product);
    setUpdateData({
      name: product.name || "",
      description: product.description || "",
      price: product.originalPrice ? String(product.originalPrice) : "",
      imageUrl: product.imageUrl || "",
      categoryName: product.categoryName || "",
    });
    setActiveModal(MODAL_TYPES.UPDATE);
  }, []);

  // Handle product update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct?.id) return;

    try {
      const price = parseFloat(updateData.price);
      if (isNaN(price)) {
        throw new Error("Please enter a valid price");
      }

      await dispatch(
        updateProduct({
          productId: selectedProduct.id,
          productData: {
            ...updateData,
            price: price,
          },
        })
      ).unwrap();

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
      quantity: product.quantity ? String(product.quantity) : "0",
    });
    setActiveModal(MODAL_TYPES.QUANTITY);
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

      await dispatch(
        updateProductQuantity({
          productId: selectedProduct.id,
          quantity: quantity,
        })
      ).unwrap();

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
      setUpdateData((prev) => ({ ...prev, imageUrl: secureUrl }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed: " + error.message);
    }
  };

  // Close all modals
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelectedProduct(null);
    setDiscountData({
      discountType: "PERCENTAGE",
      discountValue: "",
      startDate: "",
      endDate: "",
      name: "",
      minQuantity: 1,
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

  // Form field configurations (same as before)
  const discountFields = [
    // ... (same as before)
  ];

  const updateFields = [
    // ... (same as before)
  ];

  const quantityFields = [
    // ... (same as before)
  ];

  // Determine which products to display based on role
  const displayProducts = role === "MERCHANT" ? storeProducts : products;

  // Merge product data with discount data
  const mergedProducts = displayProducts.map((product) => {
    const discountInfo = discountedProducts.find((dp) => dp.id === product.id);
    return {
      ...product,
      ...(discountInfo || {}),
    };
  });

  return (
    <div className="container mx-auto w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        {role === "MERCHANT" ? "My Products" : "All Products"}
      </h2>

      {productStatus === "loading" && mergedProducts.length === 0 ? (
        <LoadingSpinner />
      ) : productStatus === "failed" ? (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          {productError || "Failed to load products"}
        </div>
      ) : mergedProducts.length === 0 ? (
        <EmptyState
          message="No products found"
          actionText={role === "MERCHANT" ? "Add New Product" : undefined}
          onAction={
            role === "MERCHANT" ? () => {/* Add your add product handler */} : undefined
          }
        />
      ) : (
        <InfiniteScroll
          dataLength={mergedProducts.length}
          next={loadMoreProducts}
          hasMore={storeProductsHasMore}
          loader={<LoadingSpinner />}
          endMessage={
            <p className="text-center text-gray-500 mt-4">
              You've seen all products
            </p>
          }
          scrollableTarget="scrollableDiv"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mergedProducts.map((product) => (
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
        </InfiniteScroll>
      )}

      {/* Modals (same as before) */}
      <ReusableFormModal
        isVisible={activeModal === MODAL_TYPES.DISCOUNT}
        title={selectedProduct?.discountInfo ? "Update Discount" : "Apply Discount"}
        fields={discountFields}
        onSubmit={handleDiscountSubmit}
        onClose={closeModal}
        submitLabel={selectedProduct?.discountInfo ? "Update" : "Apply"}
        isLoading={discountLoading}
      />

      <ReusableFormModal
        isVisible={activeModal === MODAL_TYPES.UPDATE}
        title="Edit Product"
        fields={updateFields}
        onSubmit={handleUpdateSubmit}
        onClose={closeModal}
        submitLabel="Save Changes"
        isLoading={productStatus === "loading" || imageUploading}
      />

      <ReusableFormModal
        isVisible={activeModal === MODAL_TYPES.QUANTITY}
        title="Update Product Quantity"
        fields={quantityFields}
        onSubmit={handleQuantitySubmit}
        onClose={closeModal}
        submitLabel="Update Quantity"
        isLoading={productStatus === "loading"}
      />
    </div>
  );
};

export default AllProducts;