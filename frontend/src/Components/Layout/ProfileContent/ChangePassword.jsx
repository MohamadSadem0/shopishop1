// ChangePassword.js
import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../../Styles/Style";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldVisible, setOldVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match!");
      return;
    }

    try {
      // Call the update-password endpoint
      const response = await axiosInstance.post("/public/auth/update-password", {
        oldPassword,
        newPassword,
      });
      toast.success(response.data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
    }
  };

  return (
    <div className="w-full px-5">
      <h1 className="text-[18px] text-center 800px:text-[25px] font-[600] pb-2 text-[#000000ba]">
        Change Password
      </h1>
      <form
        className="px-4 py-4 w-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        {/* Old Password */}
        <div className="w-full 800px:w-[60%]">
          <label>Old Password</label>
          <div className="relative">
            <input
              type={oldVisible ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border rounded-md"
            />
            {oldVisible ? (
              <AiOutlineEye
                onClick={() => setOldVisible(false)}
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
              />
            ) : (
              <AiOutlineEyeInvisible
                onClick={() => setOldVisible(true)}
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
              />
            )}
          </div>
        </div>

        {/* New Password */}
        <div className="w-full 800px:w-[60%]">
          <label>New Password</label>
          <div className="relative">
            <input
              type={newVisible ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border rounded-md"
            />
            {newVisible ? (
              <AiOutlineEye
                onClick={() => setNewVisible(false)}
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
              />
            ) : (
              <AiOutlineEyeInvisible
                onClick={() => setNewVisible(true)}
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
              />
            )}
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="w-full 800px:w-[60%]">
          <label>Confirm New Password</label>
          <div className="relative">
            <input
              type={confirmVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border rounded-md"
            />
            {confirmVisible ? (
              <AiOutlineEye
                onClick={() => setConfirmVisible(false)}
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
              />
            ) : (
              <AiOutlineEyeInvisible
                onClick={() => setConfirmVisible(true)}
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
              />
            )}
          </div>
        </div>

        <div className="w-full 800px:w-[60%] mt-6 flex justify-center bg-white">
          <input
            type="submit"
            value="Change Password"
            className={`${styles.button} !w-full text-white`}
          />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
