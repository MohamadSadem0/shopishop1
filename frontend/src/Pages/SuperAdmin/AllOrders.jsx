import React from "react";

const AllOrders = () => {
  const orders = [
    { id: 1, user: "John Doe", total: "$120", status: "Shipped" },
    { id: 2, user: "Jane Smith", total: "$80", status: "Processing" },
  ];

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Order ID</th>
              <th className="border p-3">Customer</th>
              <th className="border p-3">Total</th>
              <th className="border p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="border p-3">{order.id}</td>
                <td className="border p-3">{order.user}</td>
                <td className="border p-3">{order.total}</td>
                <td className="border p-3">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
