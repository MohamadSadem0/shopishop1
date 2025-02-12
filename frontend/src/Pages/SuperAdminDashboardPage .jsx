import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";
import SuperAdminSidebar from "../Components/Layout/SuperAdmin/SuperAdminSidebar";
import SuperAdminContent from "../Components/Layout/SuperAdmin/SuperAdminContent";


const SuperAdminDashboard = () => {
  const [active, setActive] = useState(1);

  return (
    <>
      <DashboardHeader />
      <div className="flex w-full h-screen">
        {/* Fixed Sidebar */}
        <div className="w-[70px] 800px:w-[335px] fixed left-0 top-0 h-screen bg-white shadow-lg">
          <SuperAdminSidebar active={active} setActive={setActive} />
        </div>

        {/* Dynamic Content */}
        <div className="ml-[70px] 800px:ml-[335px] flex-1 p-8 bg-gray-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
