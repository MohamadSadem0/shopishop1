import React from "react";

import CreateEvent from "../Components/Layout/Dashboard/DashboardContent/CreateEvent";
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";

const CreateEventPage = () => {
  return (
    <>
      <DashboardHeader />

      <div className="flex w-full">
      <div className="w-[70px] 800px:w-[335px] fixed left-0 top-0 h-screen bg-white shadow-lg">
      <DashboardSidebar active={6} />
        </div>

        <div className="ml-[70px] 800px:ml-[335px] flex-1 p-8 bg-gray-100 overflow-y-auto">
          <CreateEvent />
        </div>
      </div>
    </>
  );
};

export default CreateEventPage;
