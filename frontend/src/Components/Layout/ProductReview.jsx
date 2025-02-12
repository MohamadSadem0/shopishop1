import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const MAX_STARS = 5;

const ProductReview = ({ 
  userName, 
  comment, 
  rating, 
  userImage, 
  createdAt 
}) => {
  // Generate an array of 1..5 to map each star
  const stars = Array.from({ length: MAX_STARS }, (_, i) => i + 1);

  return (
    <div className="mt-5">
      <div className="w-full flex pt-3">
        {/* If userImage is null/undefined, fallback to a default avatar */}
        <img
          src={userImage || "https://via.placeholder.com/40"}
          alt="author/avatar"
          className="w-[40px] h-[40px] rounded-full object-cover"
        />

        <div className="flex flex-col ml-2">
          {/* Reviewer name */}
          <span className="text-[18px] font-[600] ">{userName}</span>

          {/* Review comment */}
          <div className="text-[#242424]">{comment}</div>

          <div className="flex items-center mt-1">
            {/* Review stars */}
            <div className="flex select-none">
              {stars.map((star) =>
                star <= rating ? (
                  <AiFillStar
                    key={star}
                    size={20}
                    color="#f6Ba00"
                    className="mr-1"
                  />
                ) : (
                  <AiOutlineStar
                    key={star}
                    size={20}
                    color="#f6Ba00"
                    className="mr-1"
                  />
                )
              )}
            </div>

            {/* Publish time (simplify or format `createdAt` as needed) */}
            <div className="text-[#33333381] font-[600] ml-5">
              {createdAt ? createdAt.slice(0, 10) : "Unknown date"}
            </div>
          </div>

          <button className="w-fit border-none text-[#216bff] underline hover:no-underline transition cursor-pointer mt-2">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
