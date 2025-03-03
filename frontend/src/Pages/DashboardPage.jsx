import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Make sure you have react-router-dom installed and set up
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";

const DashboardPage = () => {
  const [active, setActive] = useState(1);

  return (
    <>
      <DashboardHeader />
      <div className="flex w-full h-screen">
        <div className="w-[70px] 800px:w-[335px] fixed left-0 top-0 h-screen bg-white shadow-lg">
          <DashboardSidebar active={active} setActive={setActive} />
        </div>
        <div className="ml-[70px] 800px:ml-[335px] flex-1 p-8 bg-gray-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
