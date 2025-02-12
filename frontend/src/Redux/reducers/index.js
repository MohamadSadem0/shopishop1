// src/redux/reducers/index.js

import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Assuming you have an authReducer
import notificationReducer from './notificationReducer'; // Import the notification reducer

const rootReducer = combineReducers({
    auth: authReducer, // Your auth state
    notifications: notificationReducer, // Make sure the notification reducer is combined properly
});

export default rootReducer;
