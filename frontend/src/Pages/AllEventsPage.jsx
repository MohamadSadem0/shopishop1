import React from "react";
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";
import AllEvents from "../Components/Layout/Dashboard/DashboardContent/AllEvents";

const AllEventsPage = () => {
  return (
    <>
      <DashboardHeader />

      <div className="flex w-full">
      <div className="w-[70px] 800px:w-[335px] fixed left-0 top-0 h-screen bg-white shadow-lg">
      <DashboardSidebar active={5} />
        </div>

        <div className="ml-[70px] 800px:ml-[335px] flex-1 p-8 bg-gray-100 overflow-y-auto">
          <AllEvents />
        </div>
      </div>
    </>
  );
};

export default AllEventsPage;
