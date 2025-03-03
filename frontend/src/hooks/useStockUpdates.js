import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { toast } from "react-toastify";

const useStockUpdates = (productId) => {
  const [quantity, setQuantity] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws"); // adjust URL as needed
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/stockUpdates", (message) => {
        if (message.body) {
          const stockUpdate = JSON.parse(message.body);
          if (stockUpdate.productId === productId) {
            setQuantity(stockUpdate.quantity);
            toast.info(`Stock updated: ${stockUpdate.quantity} units available`);
          }
        }
      });
    });
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [productId]);

  return quantity;
};

export default useStockUpdates;
