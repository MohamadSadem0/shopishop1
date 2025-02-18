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
import ResizableDescription from "../../../../Components/ResizableDescription";

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

  // State for update data (include all fields that the backend requires)
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

  // Open the update modal and pre-fill with all product data
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
      discountPrice: discountData.discountPrice
        ? parseFloat(discountData.discountPrice)
        : null,
      discountPercent: discountData.discountPercent
        ? parseFloat(discountData.discountPercent)
        : null,
      discountStartDate: discountData.discountStartDate || null,
      discountEndDate: discountData.discountEndDate || null,
    };

    await dispatch(
      applyDiscount({ productId: selectedProductId, discountData: payload })
    ).unwrap();

    setShowDiscountModal(false);
    setDiscountData({
      discountPrice: "",
      discountPercent: "",
      discountStartDate: "",
      discountEndDate: "",
    });
  };

  // Handle update submission: send full product data (even unchanged fields)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    try {
      await dispatch(
        updateProduct({ productId: selectedProductId, productData: updateData })
      ).unwrap();
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

  return (
    <div className="w-full h-full overflow-auto">
      <h2 className="text-3xl font-bold text-center mb-8">All Products</h2>

      {/* Loading & Error States */}
      {status === "loading" && (
        <p className="text-center text-gray-500">Loading products...</p>
      )}
      {status === "failed" && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Store ID</th>
              <th className="py-3 px-4 text-left">Available</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4" title={product.description}>
                  <ResizableDescription
                    text={product.description}
                    initialHeight={50}
                    minHeight={50}
                    // maxHeight={200}
                  />
                </td>
                <td className="py-3 px-4">{product.categoryName}</td>
                <td className="py-3 px-4">${product.price}</td>
                <td className="py-3 px-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md mx-auto"
                  />
                </td>
                <td className="py-3 px-4">{product.storeId}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.isAvailable
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.isAvailable ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-3 px-4 flex justify-center space-x-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <div
                className="text-gray-600 my-2"
                title={product.description}
              >
                <ResizableDescription
                  text={product.description}
                  initialHeight={60}
                  minHeight={60}
                  maxHeight={150}
                />
              </div>
              <p className="text-gray-700">Category: {product.categoryName}</p>
              <p className="text-lg font-bold mt-1">${product.price}</p>
              <p className="text-gray-600">Store ID: {product.storeId}</p>
              <p className="text-gray-600">
                Available:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    product.isAvailable
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {product.isAvailable ? "Yes" : "No"}
                </span>
              </p>
              <div className="flex justify-between mt-4">
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Apply Discount
            </h3>
            <form onSubmit={handleDiscountSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                  value={discountData.discountPrice}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      discountPrice: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Discount Percent
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                  value={discountData.discountPercent}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      discountPercent: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                  value={discountData.discountStartDate}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      discountStartDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                  value={discountData.discountEndDate}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      discountEndDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6">
            <h3 className="text-2xl font-bold mb-4 text-center">Edit Product</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  value={updateData.name}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  value={updateData.description}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  value={updateData.price}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Image</label>
                {updateData.imageUrl && (
                  <img
                    src={updateData.imageUrl}
                    alt="Product"
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {imageUploading && (
                  <p className="text-sm text-gray-600">Uploading image...</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={updateData.categoryName}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Store ID</label>
                <input
                  type="text"
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={updateData.storeId}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
