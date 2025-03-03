import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSections, deleteSection } from "../../redux/slices/sectionSlice";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ReusableTable from "../../Components/ReusableTable";

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

  // Define the columns for the sections table
  const sectionColumns = [
    {
      header: "Expand",
      render: (section) => (
        <button
          onClick={() => handleRowExpand(section.id)}
          className="flex justify-center items-center text-gray-600 hover:text-blue-500"
        >
          {expandedRow === section.id ? (
            <IoIosArrowUp size={20} />
          ) : (
            <IoIosArrowDown size={20} />
          )}
        </button>
      ),
    },
    {
      header: "Section Name",
      accessor: "name",
    },
    {
      header: "Image",
      render: (section) => (
        <img
          src={section.imageUrl || "https://via.placeholder.com/80"}
          alt={section.name}
          className="w-12 h-12 object-cover rounded-md mx-auto"
        />
      ),
    },
    {
      header: "Actions",
      render: (section) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleDelete(section.id)}
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
        All Sections
      </h2>

      {/* Loading & Error States */}
      {status === "loading" && (
        <p className="text-gray-600 text-center">Loading sections...</p>
      )}
      {status === "failed" && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {status === "succeeded" && sections.length > 0 ? (
        <div>
          <ReusableTable columns={sectionColumns} data={sections} />
          {expandedRow && (
            <div className="bg-gray-50 p-4 mt-2 border border-gray-300 rounded-lg">
              <h3 className="text-lg font-semibold text-center">Section Details</h3>
              <p className="text-sm md:text-base">
                <strong>Section Name:</strong>{" "}
                {sections.find((s) => s.id === expandedRow)?.name}
              </p>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <img
                  src={
                    sections.find((s) => s.id === expandedRow)?.imageUrl ||
                    "https://via.placeholder.com/80"
                  }
                  alt="section"
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-300"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        status === "succeeded" && (
          <p className="text-gray-600 text-center">No sections found.</p>
        )
      )}
    </div>
  );
};

export default AllSections;
