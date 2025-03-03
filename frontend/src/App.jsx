import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Basic user routes
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
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  OrderDetailsPage,
  SellerOrderDetailsPage,
  TrackOrderPage,
  ForgetPasswordPage,
  SellerForgetPasswordPage,
} from "./Routes";

import ConfirmAccountPage from "./Pages/ConfirmAccountPage";

// Dashboard and merchant pages
import DashboardPage from "./Pages/DashboardPage";
import AllCouponCodesPage from "./Pages/AllCouponCodesPage";
import AllEventsPage from "./Pages/AllEventsPage";
import AllProductPage from "./Pages/AllProductPage";
import AllOrderPage from "./Pages/AllOrderPage";
import SellerProfileSettings from "./Pages/SellerProfileSettings";
import CreateProductPage from "./Pages/CreateProductPage";
import CreateEventPage from "./Pages/CreateEventPage";
import WithdrawMoneyPage from "./Pages/WithdrawMoneyPage";

// NEW: Dashboard Update Quantity Page
import DashboardUpdateQuantityPage from "./Pages/DashboardUpdateQuantityPage";

// SuperAdmin Pages
import SuperAdminDashboard from "./Pages/SuperAdminDashboardPage";
import AllUsers from "./Pages/SuperAdmin/AllUsers";
import AllStores from "./Pages/SuperAdmin/AllStores";
import CreateSection from "./Pages/SuperAdmin/CreateSection";
import CreateCategory from "./Pages/SuperAdmin/CreateCategory";
import AllCategories from "./Pages/SuperAdmin/AllCategories";
import AllSections from "./Pages/SuperAdmin/AllSections";
import AllOrders from "./Pages/SuperAdmin/AllOrders";
import Settings from "./Pages/SuperAdmin/Settings";

// Import PrivateRoute and TokenChecker
import PrivateRoute from "./Components/PrivateRoute";
import TokenChecker from "./Components/TokenChecker";

import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ResetPasswordPage from "./Pages/ResetPasswordPage";

const App = () => {
  return (
    <BrowserRouter>
      <TokenChecker />
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Basic Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/confirm" element={<ConfirmAccountPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />

        {/* Protected Routes (Customers & Merchants) */}
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["CUSTOMER", "MERCHANT", "SUPERADMIN"]}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <PrivateRoute allowedRoles={["CUSTOMER"]}>
              <MessagePage />
            </PrivateRoute>
          }
        />

        {/* Seller Public Routes */}
        <Route path="/signup-seller" element={<SellerSignUpPage />} />
        <Route path="/login-seller" element={<SellerLoginPage />} />
        <Route path="/shop/:id" element={<SellerProfilePage />} />

        {/* Merchant Protected Routes */}
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

        {/* NEW: Merchant Update Quantity Page */}
        <Route
          path="/dashboard-update-quantity"
          element={
            <PrivateRoute allowedRoles={["MERCHANT"]}>
              <DashboardUpdateQuantityPage />
            </PrivateRoute>
          }
        />

        {/* Checkout and Payment Routes */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order/success" element={<OrderSuccessPage />} />

        {/* Order Detail Routes */}
        <Route path="/order/:id" element={<OrderDetailsPage />} />
        <Route path="/seller/order/:id" element={<SellerOrderDetailsPage />} />
        <Route path="/order/track/:id" element={<TrackOrderPage />} />

        {/* Forget Password */}
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/seller/forget-password" element={<SellerForgetPasswordPage />} />

        {/* SuperAdmin Protected Routes */}
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
