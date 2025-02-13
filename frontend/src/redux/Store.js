import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist"; // ✅ Single import
import storage from "redux-persist/lib/storage"; // Uses localStorage

import authReducer from ".//slices/authSlice";
import  cartReducer  from "./slices/cartSlice";
import { wishlistReducer } from "./Wishlist";
import storeReducer from ".//slices/storeSlice";
import sectionReducer from ".//slices/sectionSlice";
import categorYReducer from ".//slices/categorySlice";
import productReducer from ".//slices/productSlice";

// **Redux Persist Configuration**
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "wishlist"], // ✅ Save only these slices
};

// **Combine Reducers**
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  store: storeReducer,
  sections: sectionReducer,
  category:categorYReducer,
  products:productReducer,
});

// **Apply Persist to Root Reducer**
const persistedReducer = persistReducer(persistConfig, rootReducer);

// **Configure Redux Store**
const Store = configureStore({
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 🔥 Fixes serialization issue with Redux Persist
    }),
});

// **Create Persistor**
export const persistor = persistStore(Store);

export default Store;
