import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../../redux/slices/orderSlice";

const OrderDetails = () => {
  const { id } = useParams(); // orderId from the URL
  const dispatch = useDispatch();
  const { order, status, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  if (status === "loading")
    return <div className="text-center text-lg mt-4">Loading...</div>;
  if (status === "failed")
    return (
      <div className="text-center text-red-500 mt-4">
        Error: {error}
      </div>
    );
  if (!order)
    return <div className="text-center mt-4">No order found.</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Order Details</h1>

      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-600">
            <span className="font-semibold">Order ID:</span> {order.orderId}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Placed on:</span>{" "}
            {new Date(order.orderDate).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Status:</span> {order.status}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Total Price:</span> ${order.totalPrice}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700">
          <span className="font-semibold">Shipping Address:</span>{" "}
          {order.shippingAddress}, {order.cityAddress}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
        <div key={item.orderItemId} className="flex flex-col sm:flex-row items-center p-4 border border-gray-200 rounded-md bg-gray-50">
        <img src={item.image} alt={item.productName} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4" />
        <div>
           <p className="text-gray-800"><span className="font-semibold">Product:</span> {item.productName}</p>
           <p className="text-gray-800"><span className="font-semibold">Quantity:</span> {item.quantity}</p>
           <p className="text-gray-800"><span className="font-semibold">Price:</span> ${item.price}</p>
        </div>
     </div>
     
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
