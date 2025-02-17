import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  HomePage,
  ProductPage,
  BestSellingPage,
  EventsPage,
  FaqPage,
  LoginPage,
  SignUpPage,
  ProductDetailsPage,
  ProfilePage,
  MessagePage,
  SellerSignUpPage,
  SellerLoginPage,
  SellerProfilePage,
  DashboardPage,
  AllCouponCodesPage,
  AllEventsPage,
  AllProductPage,
  AllOrderPage,
  SellerProfileSettings,
  SellerMessagePage,
  CreateProductPage,
  CreateEventPage,
  WithdrawMoneyPage,
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  OrderDetailsPage,
  SellerOrderDetailsPage,
  TrackOrderPage,
  ForgetPasswordPage,
  SellerForgetPasswordPage,
} from "./Routes";
import SuperAdminDashboardPage from "./Pages/SuperAdminDashboardPage ";
import SuperAdminDashboard from "./Pages/SuperAdminDashboardPage ";

import AllUsers from "./Pages/SuperAdmin/AllUsers";
import AllStores from "./Pages/SuperAdmin/AllStores";
import CreateSection from "./Pages/SuperAdmin/CreateSection";
import CreateCategory from "./Pages/SuperAdmin/CreateCategory";
import AllCategories from "./Pages/SuperAdmin/AllCategories";
import AllSections from "./Pages/SuperAdmin/AllSections";
import AllOrders from "./Pages/SuperAdmin/AllOrders";
import Settings from "./Pages/SuperAdmin/Settings";
import TokenChecker from "./Components/TokenChecker";

// Import PrivateRoute
import PrivateRoute from "./Components/PrivateRoute";
import { useEffect } from "react";

const App = () => {
  useEffect(()=>{
    console.log();
    
  },[])
  return (
    <BrowserRouter>
      <TokenChecker />
      <Routes>
        {/* basic user interface routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />

        {/* Protected route: Only logged in CUSTOMER can access */}
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["CUSTOMER", "MERCHANT", "SUPERADMIN"]}>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Protected route: Only logged in CUSTOMER can access inbox */}
        <Route
          path="/inbox"
          element={
            <PrivateRoute allowedRoles={["CUSTOMER"]}>
              <MessagePage />
            </PrivateRoute>
          }
        />

        {/* seller account routes (public for signup/login) */}
        <Route path="/signup-seller" element={<SellerSignUpPage />} />
        <Route path="/login-seller" element={<SellerLoginPage />} />
        <Route path="/shop/:id" element={<SellerProfilePage />} />

        {/* Protected route: Only logged in MERCHANT can access the dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-cupons"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <AllCouponCodesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <AllEventsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <AllProductPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <AllOrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-settings"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <SellerProfileSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-messages"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <SellerMessagePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <CreateProductPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <CreateEventPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-withdraw-money"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <WithdrawMoneyPage />
            </PrivateRoute>
          }
        />

        {/* Checkout routes (if these should be private, wrap accordingly) */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order/success" element={<OrderSuccessPage />} />

        {/* order detail routes */}
        <Route path="/order/:id" element={<OrderDetailsPage />} />
        <Route path="/seller/order/:id" element={<SellerOrderDetailsPage />} />
        <Route path="/order/track/:id" element={<TrackOrderPage />} />

        {/* forget password */}
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route
          path="/seller/forget-password"
          element={<SellerForgetPasswordPage />}
        />

        {/* Protected route: Only logged in SUPERADMIN can access superadmin-dashboard */}
        <Route
          path="/superadmin-dashboard/*"
          element={
            <PrivateRoute allowedRoles={["SUPERADMIN"]}>
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<AllUsers />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="stores" element={<AllStores />} />
          <Route path="create-section" element={<CreateSection />} />
          <Route path="create-category" element={<CreateCategory />} />
          <Route path="categories" element={<AllCategories />} />
          <Route path="sections" element={<AllSections />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
