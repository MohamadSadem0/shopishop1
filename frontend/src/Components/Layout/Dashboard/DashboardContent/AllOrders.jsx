import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button } from "@material-ui/core";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreOrders } from "../../../../redux/slices/orderSlice";

const AllOrders = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchStoreOrders());
  }, [dispatch]);

  // When an order is selected, find its details in orders.
  const handleSelectOrder = (orderId) => {
    const orderDetail = orders.find((order) => order.orderId === orderId);
    setSelectedOrder(orderDetail);
  };

  // Map each store order to a row for the DataGrid.
  const rows = orders.map((order) => ({
    id: order.orderId, // order id from backend DTO
    status: order.status,
    item_qty: order.orderItems ? order.orderItems.length : 0,
    total: order.orderItems
      ? order.orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      : 0,
  }));

  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 150, flex: 0.8 },
    { field: "status", headerName: "Status", minWidth: 150, flex: 0.8 },
    {
      field: "item_qty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "action",
      headerName: "",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleSelectOrder(params.row.id)}>
          <AiOutlineArrowRight
            size={20}
            className="cursor-pointer hover:text-[#3957db] transition-colors"
          />
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -500 }}
        className="bg-white"
      >
        {status === "loading" && (
          <div className="text-center mt-4">Loading...</div>
        )}
        {status === "failed" && (
          <div className="text-center text-red-500 mt-4">Error: {error}</div>
        )}
        {(!orders || orders.length === 0) && (
          <div className="text-center mt-4">No orders found.</div>
        )}
        {orders && orders.length > 0 && (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        )}
      </motion.div>

      {/* Order Detail Section */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <p className="mb-2">
            <span className="font-semibold">Order ID:</span>{" "}
            {selectedOrder.orderId}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Order Date:</span>{" "}
            {new Date(selectedOrder.orderDate).toLocaleString()}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Status:</span>{" "}
            {selectedOrder.status}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Shipping Address:</span>{" "}
            {selectedOrder.shippingAddress}, {selectedOrder.cityAddress}
          </p>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Products:</h3>
            <div className="space-y-4">
              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                selectedOrder.orderItems.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex flex-col sm:flex-row items-center p-4 border border-gray-200 rounded-md bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded mr-4 mb-2 sm:mb-0"
                    />
                    <div>
                      <p>
                        <span className="font-semibold">Product:</span>{" "}
                        {item.productName}
                      </p>
                      <p>
                        <span className="font-semibold">Quantity:</span>{" "}
                        {item.quantity}
                      </p>
                      <p>
                        <span className="font-semibold">Price:</span> $
                        {item.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found in this order.</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Close Details
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AllOrders;
