import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // ✅ Import PersistGate
import Store, { persistor } from "./Redux/Store.js";
import { CartProvider } from "react-use-cart";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
      <CartProvider>

        <App />
      </CartProvider>
      </PersistGate>

    </Provider>
  </React.StrictMode>
);
