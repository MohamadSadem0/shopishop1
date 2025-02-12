// src/redux/actions/notificationActions.js

// Action to add a notification
export const addNotification = (notification) => ({
    type: 'NEW_NOTIFICATION',
    payload: notification,
});


// If you have connectWebSocket and disconnectWebSocket here, make sure to export them too
export const connectWebSocket = () => (dispatch) => {
    // WebSocket connection logic (if any)
};

export const disconnectWebSocket = () => (dispatch) => {
    // WebSocket disconnection logic (if any)
};
