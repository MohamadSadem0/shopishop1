import React from "react";

const AllStores = () => {
  const stores = [
    { id: 1, name: "Tech Hub", owner: "John Doe", status: "Approved" },
    { id: 2, name: "Fashion Store", owner: "Jane Smith", status: "Pending" },
  ];

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-semibold mb-4">All Stores</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Store ID</th>
              <th className="border p-3">Store Name</th>
              <th className="border p-3">Owner</th>
              <th className="border p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="text-center">
                <td className="border p-3">{store.id}</td>
                <td className="border p-3">{store.name}</td>
                <td className="border p-3">{store.owner}</td>
                <td className="border p-3">{store.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStores;
