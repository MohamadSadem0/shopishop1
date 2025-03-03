import React from "react";
import ReusableTable from "../../Components/ReusableTable";

const AllStores = () => {
  const stores = [
    { id: 1, name: "Tech Hub", owner: "John Doe", status: "Approved" },
    { id: 2, name: "Fashion Store", owner: "Jane Smith", status: "Pending" },
  ];

  // Define columns for the stores table
  const storeColumns = [
    { header: "Store ID", accessor: "id" },
    { header: "Store Name", accessor: "name" },
    { header: "Owner", accessor: "owner" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-semibold mb-4">All Stores</h2>
      <ReusableTable columns={storeColumns} data={stores} />
    </div>
  );
};

export default AllStores;
