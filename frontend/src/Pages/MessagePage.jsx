import React from "react";

// import gif from "../assets/processing.gif";
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer";

const MessagePage = () => {
  return (
    <>
      <Header />
      <div className="w-full flex items-center flex-col justify-center h-screen">
        <img  alt="image" className="w-[150px] h-[150px]" />
        <h1 className="text-4xl font-[700]">Comming Soon</h1>
      </div>
      <Footer />
    </>
  );
};

export default MessagePage;
