import React from "react";

const ReusableCard = ({
  columns,
  data,
  cardClassName,
  labelClassName,
  valueClassName,
}) => {
  return (
    <div className="grid grid-cols-1 400px:grid-cols-1 800px:grid-cols-2 1100px:grid-cols-3 1300px:grid-cols-4 gap-6 mb-2">
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className={
            cardClassName ||
            "bg-white rounded-xl shadow-md p-5 transition transform hover:scale-105"
          }
        >
          {columns.map((col, i) => (
            <div key={i} className="mb-3">
              <div
                className={
                  labelClassName ||
                  "text-xs font-semibold text-gray-500 uppercase tracking-wider"
                }
              >
                {col.header}
              </div>
              <div className={valueClassName || "mt-1 text-sm text-gray-800 break-words"}>
                {col.render ? col.render(item) : item[col.accessor]}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ReusableCard;
