import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import {CiSettings } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";
import { Link } from "react-router-dom";
 
const DashboardSidebar = ({ active, setActive }) => {
  return (
    <>
      <div
        className="w-full h-screen bg-white shadow-sm overflow-y-scroll top-0 left-0 py-5"
        style={{ scrollbarWidth: "none" }}>
        <div
          className="flex items-center w-full p-4 cursor-pointer"
          title="Dashboard"
          onClick={() => setActive(1)}>
          <Link to="/dashboard" className="w-full flex items-center">
            <RxDashboard size={25} color={active === 1 ? "#3957db" : "#555"} />
            <h5
              className={` ${
                active === 1 ? "text-[#3957db]" : "#555"
              } pl-3 hidden 800px:block text-[18px] font-[600]`}>
              Dashboard
            </h5>
          </Link>
        </div>

        <div
          className="flex items-center w-full p-4 cursor-pointer"
          title="All Orders"
          onClick={() => setActive(2)}>
          <Link to="/dashboard-orders" className="flex w-full items-center">
            <FiShoppingBag
              size={25}
              color={active === 2 ? "#3957db" : "#555"}
            />
            <h5
              className={` ${
                active === 2 ? "text-[#3957db]" : "#555"
              } pl-3 hidden 800px:block text-[18px] font-[600]`}>
              All Orders
            </h5>
          </Link>
        </div>

        <div
          className="flex items-center w-full p-4 cursor-pointer"
          title="All Products"
          onClick={() => setActive(3)}>
          <Link to="/dashboard-products" className="flex w-full items-center">
            <FiPackage size={25} color={active === 3 ? "#3957db" : "#555"} />
            <h5
              className={` ${
                active === 3 ? "text-[#3957db]" : "#555"
              } pl-3 hidden 800px:block text-[18px] font-[600]`}> 
              All Products
            </h5>
          </Link>
        </div>

        <div
          className="flex items-center w-full p-4 cursor-pointer"
          title="Create Product"
          onClick={() => setActive(4)}>
          <Link
            to="/dashboard-create-product"
            className="flex w-full items-center">
            <AiOutlineFolderAdd
              size={25}
              color={active === 4 ? "#3957db" : "#555"}
            />
            <h5
              className={` ${
                active === 4 ? "text-[#3957db]" : "#555"
              } pl-3 hidden 800px:block text-[18px] font-[600]`}>
              Create Product
            </h5>
          </Link>
        </div>


        <div
          className="flex items-center w-full p-4 cursor-pointer"
          title="Discount Codes"
          onClick={() => setActive(9)}>
          <Link to="/dashboard-cupons" className="flex w-full items-center">
            <AiOutlineGift
              size={25}
              color={active === 9 ? "#3957db" : "#555"}
            />
            <h5
              className={` ${
                active === 9 ? "text-[#3957db]" : "#555"
              } pl-3 hidden 800px:block text-[18px] font-[600]`}>
              Discount Codes
            </h5>
          </Link>
        </div>

        <div
          className="flex items-center w-full p-4 cursor-pointer"
          title="Settings"
          onClick={() => setActive(10)}>
          <Link to="/dashboard-settings" className="flex w-full items-center">
            <CiSettings size={25} color={active === 10 ? "#3957db" : "#555"} />
            <h5
              className={` ${
                active === 10 ? "text-[#3957db]" : "#555"
              } pl-3 hidden 800px:block text-[18px] font-[600]`}>
              Settings
            </h5>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
