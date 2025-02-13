import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories, deleteCategory } from "../../redux/slices/categorySlice";

const AllCategories = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await dispatch(deleteCategory(categoryId)).unwrap();
      alert("Category deleted successfully!");
    }
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 text-center">
        All Categories
      </h2>

      {/* Loading & Error States */}
      {status === "loading" && <p className="text-gray-600 text-center">Loading categories...</p>}
      {status === "failed" && <p className="text-red-600 text-center">{error}</p>}

      {/* Responsive Table Container */}
      {status === "succeeded" && categories.length > 0 ? (
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-gray-700 text-sm md:text-base">
              <tr className="hidden md:table-row">
                <th className="border p-3">Category ID</th>
                <th className="border p-3">Category Name</th>
                <th className="border p-3">Image</th>
                <th className="border p-3">Section ID</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="text-center border-b border-gray-200 hover:bg-gray-50 transition md:table-row block mb-4 md:mb-0"
                >
                  {/* Mobile View */}
                  <td className="block md:table-cell border p-3 text-xs md:text-sm">
                    <strong className="md:hidden">Category ID:</strong> {category.id}
                  </td>
                  <td className="block md:table-cell border p-3 text-xs md:text-sm">
                    <strong className="md:hidden">Category Name:</strong> {category.name}
                  </td>
                  <td className="block md:table-cell border p-3">
                    <strong className="md:hidden">Image:</strong>
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md mx-auto mt-1 md:mt-0"
                    />
                  </td>
                  <td className="block md:table-cell border p-3 text-xs md:text-sm">
                    <strong className="md:hidden">Section ID:</strong> {category.sectionId}
                  </td>
                  <td className="block md:table-cell border p-3 flex flex-col md:flex-row justify-center gap-2">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-white px-3 py-1 text-xs md:text-sm rounded transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button className="bg-blue-500 text-white px-3 py-1 text-xs md:text-sm rounded transition hover:bg-blue-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        status === "succeeded" && <p className="text-gray-600 text-center">No categories found.</p>
      )}
    </div>
  );
};

export default AllCategories;
