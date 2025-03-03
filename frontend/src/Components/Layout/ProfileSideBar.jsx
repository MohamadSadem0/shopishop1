

import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// icons
import { RxPerson } from "react-icons/rx";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { AiOutlineLogout } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";

// toast notifications
import { toast, ToastContainer } from "react-toastify";

// redux actions
import { logout } from "../../redux/slices/authSlice";
// Import persistor if using redux-persist
import { persistor } from "../../redux/store";

const ProfileSideBar = ({ active, setActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // logout functionality
  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/login");
    toast("Logout Success");
  };

  return (
    <div className="p-4 z-30 pt-8 min-h-96 bg-white shadow-sm rounded-[10px] w-full">
      <div
        className="flex items-center mb-8 w-full cursor-pointer"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "#3957db" : ""} />
        <span
          className={`pl-3 ${active === 1 ? "text-[#3957db]" : ""} hidden md:block`}
        >
          Profile
        </span>
      </div>

      <div
        className="flex items-center mb-8 w-full cursor-pointer"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag
          size={20}
          color={active === 2 ? "#3957db" : ""}
        />
        <span
          className={`pl-3 ${active === 2 ? "text-[#3957db]" : ""} hidden md:block`}
        >
          Orders
        </span>
      </div>

      <div
        className="flex items-center mb-8 w-full cursor-pointer"
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine
          size={20}
          color={active === 6 ? "#3957db" : ""}
        />
        <span
          className={`pl-3 ${active === 6 ? "text-[#3957db]" : ""} hidden md:block`}
        >
          Change Password
        </span>
      </div>

      <div
        className="flex items-center mb-8 w-full cursor-pointer"
        onClick={() => {
          setActive(8);
          handleLogout();
        }}
      >
        <AiOutlineLogout
          size={20}
          color={active === 8 ? "#3957db" : ""}
        />
        <span
          className={`pl-3 ${active === 8 ? "text-[#3957db]" : ""} hidden md:block`}
        >
          Logout
        </span>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default ProfileSideBar;
