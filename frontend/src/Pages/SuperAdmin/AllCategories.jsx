import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories, deleteCategory } from "../../redux/slices/categorySlice";
import ReusableTable from "../../Components/ReusableTable";

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

  // Define the columns for the categories table
  const categoryColumns = [
    {
      header: "Category ID",
      accessor: "id",
    },
    {
      header: "Category Name",
      accessor: "name",
    },
    {
      header: "Image",
      render: (category) => (
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-12 h-12 object-cover rounded-md mx-auto" 
        />
      ),
    },
    {
      header: "Section ID",
      accessor: "sectionId",
    },
    {
      header: "Actions",
      render: (category) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleDelete(category.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
          >
            Delete
          </button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 text-center">
        All Categories
      </h2>

      {/* Loading & Error States */}
      {status === "loading" && (
        <p className="text-gray-600 text-center">Loading categories...</p>
      )}
      {status === "failed" && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {status === "succeeded" && categories.length > 0 ? (
        <ReusableTable columns={categoryColumns} data={categories} />
      ) : (
        status === "succeeded" && (
          <p className="text-gray-600 text-center">No categories found.</p>
        )
      )}
    </div>
  );
};

export default AllCategories;
