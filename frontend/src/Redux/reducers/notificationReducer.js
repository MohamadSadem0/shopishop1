const initialState = {
    notifications: [],  // Initial state for notifications
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };
        default:
            return state;
    }
};

export default notificationReducer;
