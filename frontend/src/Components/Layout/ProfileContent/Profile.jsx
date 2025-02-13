import React, { useState } from "react";
import avatar from "../../../assets/avatar.jpg";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../../Styles/Style";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const Profile = ({ setViewProfile }) => {
  // local storage data
  const Email = localStorage.getItem("email");
  const Password = JSON.parse(localStorage.getItem("password"));
  const Number = localStorage.getItem("phoneNbr");
  const { user, role } = useSelector((state) => state.auth);

  const photoUrl = user.photoUrl;
  const Name = user.username;

  // email
  const [email, setEmail] = useState(Email);
  const [password, setPassword] = useState(Password);
  const [name, setName] = useState(Name);
  const [number, setNumber] = useState(Number ? Number : null);

  // photo url
  const profileLogo = localStorage.getItem("photoUrl");

  // handleImageChange
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  // handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // handle form onSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("email", JSON.stringify(email));
    localStorage.setItem("userName", JSON.stringify(name));
    localStorage.setItem("password", JSON.stringify(password));
    localStorage.setItem("number", JSON.stringify(number));
    localStorage.setItem("PhotoUrl", JSON.stringify(photoUrl));

    toast.success("Your information update successful!");
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -500 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -500 }}>
      <div className="flex justify-center w-full">
        <div className="relative h-[150px]">
          <div className="relative h-[150px]">
            <img
              src={photoUrl ? photoUrl : profileLogo ? profileLogo : avatar}
              alt="profile/image"
              className="w-[150px] h-[150px] object-cover rounded-full border-[3px] border-[#3957db]"
              onClick={() => setViewProfile(true)}
            />

            <div className="absolute w-[30px] h-[30px] bg-[#e3e9ee] bottom-[5px] rounded-full flex items-center justify-center right-[5px] cursor-pointer">
              <input
                type="file"
                id="profile/image"
                className="hidden"
                onChange={handleImageChange}
              />

              <label htmlFor="profile/image">
                <AiOutlineCamera className="cursor-pointer" />
              </label>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full px-5">
        <form onSubmit={handleSubmit} aria-={true}>
          <div className="flex w-full flex-wrap pb-3">
            {/* name input */}
            <div className="w-full 800px:w-[50%] pb-4">
              <label htmlFor="name" className="block pb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${styles.input} !w-[95%] focus:border-[#3957db]`}
              />
            </div>

            {/* email input */}
            <div className="w-full 800px:w-[50%] 800px:pb-4 pb-6">
              <label htmlFor="email" className="block pb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.input} !w-[95%] focus:border-[#3957db]`}
              />
            </div>

            {/* phone number input */}
            <div className="w-full 800px:w-[50%] 800px:pb-4 pb-6">
              <label htmlFor="phoneNumber" className="block pb-2">
                Phone Number
              </label>
              <input
                type="number"
                name="phoneNumber"
                id="number"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className={`${styles.input} !w-[95%] focus:border-[#3957db]`}
              />
            </div>

            {/* password input */}
            <div className="w-full 800px:w-[50%] 800px:pb-4 pb-6">
              <label htmlFor="password" className="block pb-2">
                Update Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={password}
                onChange={handlePasswordChange}
                className={`${styles.input} !w-[95%] focus:border-[#3957db]`}
              />
            </div>

            {/* role display */}
            <div className="w-full 800px:w-[50%] 800px:pb-4 pb-6">
              <label className="block pb-2">
                Role
              </label>
              <input
                type="text"
                value={role}
                disabled
                className={`${styles.input} !w-[95%] bg-gray-200 cursor-not-allowed`}
              />
            </div>

            {/* button */}
            <div
              className={`${styles.button} hover:text-white !rounded-[5px] w-[30%] transition !h-11 border bg-transparent border-[#3957db] hover:bg-[#3957db]`}>
              <button type="submit">Update</button>
            </div>
          </div>
          {/* toast message */}
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
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;
