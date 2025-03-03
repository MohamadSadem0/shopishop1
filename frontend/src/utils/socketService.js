import SockJS from "sockjs-client";
import Stomp from "stompjs";
import baseURL from "../../url";
let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  const socket = new SockJS(`${baseURL}/ws`); // adjust the URL as needed
  stompClient = Stomp.over(socket);
  stompClient.connect({}, () => {
    // Subscribe to the topic that provides stock updates
    stompClient.subscribe("/topic/stockUpdates", (message) => {
      if (message.body) {
        const stockUpdate = JSON.parse(message.body);
        onMessageReceived(stockUpdate);
      }
    });
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect();
  }
};
