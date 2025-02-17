// logoutThunk.js
import { logout } from "./slices/authSlice";
import { persistor } from "./Store"; // Adjust the import path as needed

export const logoutUser = () => (dispatch) => {
  // Dispatch the logout action to reset the auth state
  dispatch(logout());
  
  // Purge the persisted state
  persistor.purge();
};
