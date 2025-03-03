import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../redux/slices/orderSlice";

const Order = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
    
  }, [dispatch]);

  const rows = Array.isArray(orders)
  ? orders.map((order, index) => ({
    
      // Use order.id if available, otherwise fall back to index
      id: order.orderId || index,
      status: order.status || "Pending",
      item_qty: order.orderItems ? order.orderItems.length : 0,
      total: order.totalPrice || order.totalAmount || 0,
    }))
  : [];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor",
    },
    {
      field: "item_qty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "action",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight
              size={20}
              className="cursor-pointer hover:text-[#3957db] transition-colors"
            />
          </Button>
        </Link>
      ),
    },
  ];

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: -500 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -500 }}
      className="pl-8 pt-1"
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </motion.div>
  );
};

export default Order;
