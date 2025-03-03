import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const DropDown = ({ sectionsWithCategories = [], setDropDown }) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  return (
    <div className="absolute top-full left-0 w-[270px] bg-white shadow-lg z-50 rounded-md">
      {sectionsWithCategories.length === 0 ? (
        <p className="text-gray-500 text-center p-4">Loading sections...</p>
      ) : (
        sectionsWithCategories.map((section) => (
          <div
            key={section.id}
            className="relative group"
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {section.categories.length === 0 ? (
              // If no categories, make the entire row clickable to filter by section
              <Link
                to={`/products?section=${encodeURIComponent(section.name)}`}
                className="w-full flex justify-between items-center px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => setDropDown(false)}
              >
                <span>{section.name}</span>
              </Link>
            ) : (
              // If there are categories, show the section row with an arrow
              <div className="w-full flex justify-between items-center px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 cursor-pointer">
                <span>{section.name}</span>
                <IoIosArrowForward />
              </div>
            )}

            {/* Categories Dropdown (appears on hover if there are categories) */}
            {hoveredSection === section.id && section.categories.length > 0 && (
              <div className="absolute top-0 left-full w-[250px] bg-white shadow-lg rounded-md p-3 border border-gray-200">
                {/* Link to filter by the entire section */}
                <Link
                  to={`/products?section=${encodeURIComponent(section.name)}`}
                  className="block px-3 py-2 text-gray-600 hover:text-blue-500 hover:bg-gray-100 rounded-md transition mb-2 font-medium"
                  onClick={() => setDropDown(false)}
                >
                  All {section.name}
                </Link>
                <div className="border-t border-gray-200 mb-2"></div>
                {section.categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-500 hover:bg-gray-100 rounded-md transition"
                    onClick={() => setDropDown(false)}
                  >
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-6 h-6 object-cover rounded-full mr-2"
                    />
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DropDown;
