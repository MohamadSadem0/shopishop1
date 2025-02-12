  import React from "react";
  import { Link } from "react-router-dom";
  import Logo from "../../../Assets/logo.png";
  import avatar from "../../../Assets/avatar.jpg";
  import { AiOutlineUser } from "react-icons/ai";
  import { FiUsers, FiSettings } from "react-icons/fi";
  import { MdOutlineCategory, MdOutlineDashboard } from "react-icons/md";
  import { BsGraphUp } from "react-icons/bs";
  import { AiOutlineFileDone } from "react-icons/ai";

  const SuperAdminHeader = () => {
    const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));
    const photoUrl = superAdminInfo?.photoUrl || avatar;
    const superAdminId = JSON.parse(localStorage.getItem("superAdminId"));

    return (
      <div className="w-full h-[80px] bg-white shadow-md sticky top-0 left-0 flex items-center justify-between px-4 z-50">
        {/* Logo */}
        <Link to={"/superadmin-dashboard"}>
          <img src={Logo} alt="Logo" className="w-[150px] h-[120px]" />
        </Link>

        {/* Quick Access Icons */}
        <div className="flex items-center">
          {/* Manage Users */}
          <div className="800px:flex hidden items-center mr-4">
            <Link to="/superadmin-users">
              <FiUsers
                size={30}
                title="Manage Users"
                className="mx-2 cursor-pointer"
                color="#4c4c4c"
              />
            </Link>
          </div>

          {/* Approve Stores */}
          <div className="800px:flex hidden items-center mr-4">
            <Link to="/superadmin-stores">
              <AiOutlineFileDone
                size={30}
                title="Approve Stores"
                className="mx-2 cursor-pointer"
                color="#4c4c4c"
              />
            </Link>
          </div>

          {/* Manage Categories */}
          <div className="800px:flex hidden items-center mr-4">
            <Link to="/superadmin-categories">
              <MdOutlineCategory
                size={30}
                title="Manage Categories"
                className="mx-2 cursor-pointer"
                color="#4c4c4c"
              />
            </Link>
          </div>

          {/* View Reports */}
          <div className="800px:flex hidden items-center mr-4">
            <Link to="/superadmin-reports">
              <BsGraphUp
                size={30}
                title="View Reports"
                className="mx-2 cursor-pointer"
                color="#4c4c4c"
              />
            </Link>
          </div>

          {/* Site Settings */}
          <div className="800px:flex hidden items-center mr-4">
            <Link to="/superadmin-settings">
              <FiSettings
                size={30}
                title="Site Settings"
                className="mx-2 cursor-pointer"
                color="#4c4c4c"
              />
            </Link>
          </div>

          {/* Profile Picture */}
          <Link to={`/superadmin-profile/${superAdminId}`}>
            <img
              src={photoUrl}
              alt="Super Admin Profile"
              title="Profile"
              className="w-[50px] h-[50px] object-cover cursor-pointer border border-[#3957db] rounded-full mr-3"
            />
          </Link>
        </div>
      </div>
    );
  };

  export default SuperAdminHeader;
