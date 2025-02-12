import React from "react";
import { AiOutlineUser, AiOutlineFolderAdd } from "react-icons/ai";
import { FiPackage } from "react-icons/fi";
import { MdOutlineCategory, MdOutlineDashboard } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";

const SuperAdminSidebar = ({ active, setActive }) => {
  return (
    <>
      <div className="w-full h-screen bg-white shadow-sm overflow-y-scroll top-0 left-0 py-5">
        
        <div className="flex items-center w-full p-4 cursor-pointer" onClick={() => setActive(1)}>
          <Link to="/superadmin-dashboard" className="w-full flex items-center">
            <MdOutlineDashboard size={25} color={active === 1 ? "#3957db" : "#555"} />
            <h5 className={` ${active === 1 ? "text-[#3957db]" : "#555"} pl-3 hidden 800px:block text-[18px] font-[600]`}>
              Dashboard
            </h5>
          </Link>
        </div>

        <div className="flex items-center w-full p-4 cursor-pointer" onClick={() => setActive(2)}>
          <Link to="/superadmin-dashboard/users" className="flex w-full items-center">
            <AiOutlineUser size={25} color={active === 2 ? "#3957db" : "#555"} />
            <h5 className={` ${active === 2 ? "text-[#3957db]" : "#555"} pl-3 hidden 800px:block text-[18px] font-[600]`}>
              All Users
            </h5>
          </Link>
        </div>

        <div className="flex items-center w-full p-4 cursor-pointer" onClick={() => setActive(3)}>
          <Link to="/superadmin-dashboard/stores" className="flex w-full items-center">
            <FiPackage size={25} color={active === 3 ? "#3957db" : "#555"} />
            <h5 className={` ${active === 3 ? "text-[#3957db]" : "#555"} pl-3 hidden 800px:block text-[18px] font-[600]`}>
              All Stores
            </h5>
          </Link>
        </div>

        <div className="flex items-center w-full p-4 cursor-pointer" onClick={() => setActive(4)}>
          <Link to="/superadmin-dashboard/create-section" className="flex w-full items-center">
            <AiOutlineFolderAdd size={25} color={active === 4 ? "#3957db" : "#555"} />
            <h5 className={` ${active === 4 ? "text-[#3957db]" : "#555"} pl-3 hidden 800px:block text-[18px] font-[600]`}>
              Create Section
            </h5>
          </Link>
        </div>

        <div className="flex items-center w-full p-4 cursor-pointer" onClick={() => setActive(5)}>
          <Link to="/superadmin-dashboard/create-category" className="flex w-full items-center">
            <VscNewFile size={25} color={active === 5 ? "#3957db" : "#555"} />
            <h5 className={` ${active === 5 ? "text-[#3957db]" : "#555"} pl-3 hidden 800px:block text-[18px] font-[600]`}>
              Create Category
            </h5>
          </Link>
        </div>

        <div className="flex items-center w-full p-4 cursor-pointer" onClick={() => setActive(6)}>
          <Link to="/superadmin-dashboard/categories" className="flex w-full items-center">
            <MdOutlineCategory size={25} color={active === 6 ? "#3957db" : "#555"} />
            <h5 className={` ${active === 6 ? "text-[#3957db]" : "#555"} pl-3 hidden 800px:block text-[18px] font-[600]`}>
              All Categories
            </h5>
          </Link>
        </div>

        <div className="flex items-center w-full p-4 cursor-pointer" onClick={() => setActive(7)}>
          <Link to="/superadmin-dashboard/sections" className="flex w-full items-center">
            <MdOutlineCategory size={25} color={active === 7 ? "#3957db" : "#555"} />
            <h5 className={` ${active === 7 ? "text-[#3957db]" : "#555"} pl-3 hidden 800px:block text-[18px] font-[600]`}>
              All Sections
            </h5>
          </Link>
        </div>

        <div className="flex items-center w-full p-4 cursor-pointer" onClick={() => setActive(8)}>
          <Link to="/superadmin-dashboard/orders" className="flex w-full items-center">
            <FiPackage size={25} color={active === 8 ? "#3957db" : "#555"} />
            <h5 className={` ${active === 8 ? "text-[#3957db]" : "#555"} pl-3 hidden 800px:block text-[18px] font-[600]`}>
              All Orders
            </h5>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SuperAdminSidebar;
