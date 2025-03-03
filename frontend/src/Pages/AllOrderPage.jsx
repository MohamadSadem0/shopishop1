import React from "react";
import AllOrders from "../Components/Layout/Dashboard/DashboardContent/AllOrders";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";

const AllOrderPage = () => {
  return (
    <>
      <DashboardHeader />

      <div className="flex w-full">
      <div className="w-[70px] 800px:w-[335px] fixed left-0 top-0 h-screen bg-white shadow-lg">
      <DashboardSidebar active={2} />
        </div>

        <div className="ml-[70px] 800px:ml-[335px] flex-1 p-8 bg-gray-100 overflow-y-auto">
          <AllOrders />
        </div>
      </div>
    </>
  );
};

export default AllOrderPage;
