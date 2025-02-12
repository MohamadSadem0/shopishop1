import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSections, deleteSection } from "../../Redux/slices/sectionSlice";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const AllSections = () => {
  const dispatch = useDispatch();
  const { sections, status, error } = useSelector((state) => state.sections);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    dispatch(fetchAllSections());
  }, [dispatch]);

  const handleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDelete = async (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      await dispatch(deleteSection(sectionId)).unwrap();
      alert("Section deleted successfully!");
    }
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 text-center">
        All Sections
      </h2>

      {/* Loading & Error States */}
      {status === "loading" && <p className="text-gray-600 text-center">Loading sections...</p>}
      {status === "failed" && <p className="text-red-600 text-center">{error}</p>}

      {/* Responsive Table Container */}
      {status === "succeeded" && sections.length > 0 ? (
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-gray-700 text-sm md:text-base">
              <tr className="hidden md:table-row">
                <th className="border p-3">Expand</th>
                <th className="border p-3">Section Name</th>
                <th className="border p-3">Image</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr
                  key={section.id}
                  className="text-center border-b border-gray-200 hover:bg-gray-50 transition md:table-row block mb-4 md:mb-0"
                >
                  {/* Mobile View */}
                  <td className="block md:table-cell border p-3">
                    <button
                      onClick={() => handleRowExpand(section.id)}
                      className="flex justify-center items-center text-gray-600 hover:text-blue-500 transition"
                    >
                      {expandedRow === section.id ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </button>
                  </td>
                  <td className="block md:table-cell border p-3 text-xs md:text-sm">
                    <strong className="md:hidden">Section Name:</strong> {section.name}
                  </td>
                  <td className="block md:table-cell border p-3">
                    <strong className="md:hidden">Image:</strong>
                    <img
                      src={section.imageUrl || "https://via.placeholder.com/80"}
                      alt={section.name}
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md mx-auto mt-1 md:mt-0"
                    />
                  </td>
                  <td className="block md:table-cell border p-3 flex flex-col md:flex-row justify-center gap-2">
                    <button
                      onClick={() => handleDelete(section.id)}
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

          {/* Expanded Row Details */}
          {expandedRow && (
            <div className="bg-gray-50 p-4 mt-2 border border-gray-300 rounded-lg">
              <h3 className="text-lg font-semibold text-center">Section Details</h3>
              <p className="text-sm md:text-base">
                <strong>Section Name:</strong> {sections.find((s) => s.id === expandedRow)?.name}
              </p>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <img
                  src={sections.find((s) => s.id === expandedRow)?.imageUrl || "https://via.placeholder.com/80"}
                  alt="section"
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-300"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        status === "succeeded" && <p className="text-gray-600 text-center">No sections found.</p>
      )}
    </div>
  );
};

export default AllSections;
