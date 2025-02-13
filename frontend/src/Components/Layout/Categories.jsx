
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSections } from "../../redux/slices/sectionSlice";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/Style";

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { sections, status, error } = useSelector((state) => state.sections);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllSections());
      
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <p className="text-center my-5">Loading sections...</p>;
  }

  if (status === "failed") {
    return <p className="text-center my-5 text-red-500">Error: {error}</p>;
  }

  return (
    <div className={`${styles.section} bg-white mb-12 p-6 rounded-lg`} id="categories">
      <h2 className="text-xl font-bold mb-4">Browse by Sections</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {sections.length > 0 ? (
          sections.map((section) => (
            <div
              key={section.id}
              className="w-full h-[120px] flex items-center justify-between cursor-pointer overflow-hidden border p-3 rounded-md shadow-md hover:shadow-lg transition"
              onClick={() => navigate(`/products?section=${section.name}`)}
            >
              <h4 className="text-[18px] font-semibold">{section.name}</h4>
              {section.imageUrl ? (
                <img
                  src={section.imageUrl}
                  alt={section.name}
                  className="w-[100px] h-[80px] object-cover rounded-md"
                />
              ) : (
                <div className="w-[100px] h-[80px] bg-gray-200 flex items-center justify-center rounded-md">
                  No Image
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No sections available.</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
