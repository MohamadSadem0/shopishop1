import React from "react";
import { BsGraphUp } from "react-icons/bs";
import { MdOutlineCategory, MdOutlineDashboard } from "react-icons/md";
import { FiUsers, FiSettings } from "react-icons/fi";
import { AiOutlineFileDone } from "react-icons/ai";
import styles from "../../../Styles/Style";

const SuperAdminDashboard = () => {
  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold text-[#3957db] mb-6">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-white shadow-md p-6 rounded-lg flex items-center">
          <FiUsers size={30} className="text-[#3957db] mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">1,234</p>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-white shadow-md p-6 rounded-lg flex items-center">
          <MdOutlineCategory size={30} className="text-[#3957db] mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Total Categories</h3>
            <p className="text-2xl font-bold">56</p>
          </div>
        </div>

        {/* Total Reports */}
        <div className="bg-white shadow-md p-6 rounded-lg flex items-center">
          <BsGraphUp size={30} className="text-[#3957db] mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Reports Generated</h3>
            <p className="text-2xl font-bold">312</p>
          </div>
        </div>

        {/* Approved Stores */}
        <div className="bg-white shadow-md p-6 rounded-lg flex items-center">
          <AiOutlineFileDone size={30} className="text-[#3957db] mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Approved Stores</h3>
            <p className="text-2xl font-bold">78</p>
          </div>
        </div>

        {/* Dashboard Summary */}
        <div className="bg-white shadow-md p-6 rounded-lg flex items-center">
          <MdOutlineDashboard size={30} className="text-[#3957db] mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Dashboard Overview</h3>
            <p className="text-2xl font-bold">Active</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white shadow-md p-6 rounded-lg flex items-center">
          <FiSettings size={30} className="text-[#3957db] mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Site Settings</h3>
            <p className="text-2xl font-bold">Configured</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
