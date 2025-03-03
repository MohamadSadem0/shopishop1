import React from "react";

import AllProducts from "../Components/Layout/Dashboard/DashboardContent/AllProducts";
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";

const AllProductPage = () => {
  return (
    <>
      <DashboardHeader />

      <div className="flex w-full">
        {/* <div className="w-[80px] 800px:w-[335px]"> */}
        <div className="w-[70px] 800px:w-[335px] fixed left-0 top-0 h-screen bg-white shadow-lg">

          <DashboardSidebar active={3} />
        </div>

        <div className="ml-[70px] 800px:ml-[335px] flex-1 p-8 bg-gray-100 overflow-y-auto">
          <AllProducts />
        </div>
      </div>
    </>
  );
};

export default AllProductPage;
