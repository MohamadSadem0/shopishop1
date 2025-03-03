import React from "react";

const ReusableTable = ({
  columns,
  data,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={
          tableClassName ||
          "w-full bg-white shadow-lg rounded-lg overflow-hidden border-collapse"
        }
      >
        {/* Header: visible on screens 1100px and up */}
        <thead className={headerClassName || "hidden 1100px:table-header-group bg-gray-50"}>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={item.id || rowIndex}
              className={
                rowClassName ||
                "block 1100px:table-row border-b border-gray-200 mb-4 1100px:mb-0 hover:bg-gray-50"
              }
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={
                    cellClassName ||
                    "px-4 py-2 block 1100px:table-cell text-sm text-gray-600 whitespace-nowrap break-words"
                  }
                >
                  {/* Mobile Header Label: visible below 1100px */}
                  <span className="1100px:hidden block font-bold text-gray-700 uppercase tracking-wide mb-1">
                    {col.header}:
                  </span>
                  {col.render ? col.render(item) : item[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
