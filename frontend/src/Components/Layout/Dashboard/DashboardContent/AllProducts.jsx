import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductsByStoreId,
  deleteProduct,
  applyDiscount, // discount thunk
  updateProduct, // new update thunk
} from "../../../../redux/slices/productSlice";

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
    // add other fields as needed
  });

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
      // pre-fill additional fields as necessary
    });
    setShowUpdateModal(true);
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

  // Handle update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    try {
      await dispatch(
        updateProduct({ productId: selectedProductId, productData: updateData })
      ).unwrap();
      alert("Product updated successfully!");
      setShowUpdateModal(false);
      setUpdateData({ name: "", description: "", price: "" });
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
    setUpdateData({ name: "", description: "", price: "" });
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>

      {/* Loading State */}
      {status === "loading" && (
        <p className="text-gray-600 text-center">Loading products...</p>
      )}

      {/* Error State */}
      {status === "failed" && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {/* Products Table */}
      {status === "succeeded" && products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Name</th>
                <th className="border p-3">Description</th>
                <th className="border p-3">Category</th>
                <th className="border p-3">Price</th>
                <th className="border p-3">Image</th>
                <th className="border p-3">Store ID</th>
                <th className="border p-3">Available</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="text-center">
                  <td className="border p-3">{product.name}</td>
                  <td className="border p-3">{product.description}</td>
                  <td className="border p-3">{product.categoryName}</td>
                  <td className="border p-3">${product.price}</td>
                  <td className="border p-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  </td>
                  <td className="border p-3">{product.storeId}</td>
                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        product.isAvailable
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {product.isAvailable ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleDiscountClick(product.id)}
                      className="bg-emerald-500 text-white px-3 py-1 rounded"
                    >
                      Discount
                    </button>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        status === "succeeded" && (
          <p className="text-gray-600 text-center">No products found.</p>
        )
      )}

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-[400px]">
            <h3 className="text-xl font-semibold mb-4">Apply Discount</h3>
            <form onSubmit={handleDiscountSubmit} className="space-y-3">
              <div>
                <label className="block mb-1">Discount Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border px-2 py-1 rounded"
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
                <label className="block mb-1">Discount Percent</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border px-2 py-1 rounded"
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
                <label className="block mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full border px-2 py-1 rounded"
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
                <label className="block mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full border px-2 py-1 rounded"
                  value={discountData.discountEndDate}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      discountEndDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-[400px]">
            <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={updateData.name}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={updateData.description}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border px-2 py-1 rounded"
                  value={updateData.price}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, price: e.target.value })
                  }
                />
              </div>
              {/* Add additional fields as needed */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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
