import React, { useState } from "react";
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";
import DashboardContent from "../Components/Layout/Dashboard/DashboardContent/DashboardContent";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const [active, setActive] = useState(1);
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <DashboardHeader />
      <div className="flex w-full">
        <div className="w-[70px] 800px:w-[335px]">
          <DashboardSidebar active={active} setActive={setActive} userRole={user?.userRole} />
        </div>
        <DashboardContent active={active} userRole={user?.userRole} />
      </div>
    </>
  );
};

export default DashboardPage;
