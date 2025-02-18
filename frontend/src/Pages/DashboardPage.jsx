import React, { useState } from "react";
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";
import DashboardContent from "../Components/Layout/Dashboard/DashboardContent/DashboardContent";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const [active, setActive] = useState(1);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="overscroll-y-none">
      <DashboardHeader />
      <div className="flex w-full overflow-y-hidden">
        <div className="w-[70px] 800px:w-[335px] overscroll-none">
          <DashboardSidebar active={active} setActive={setActive} userRole={user?.userRole} />
        </div>
        <DashboardContent active={active} userRole={user?.userRole} />
      </div>
    </div>
  );
};

export default DashboardPage;
