// src/Components/Layout/CartSingle.js
import React, { useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
/** Import from react-use-cart **/
import { useCart } from "react-use-cart";

const CartSingle = ({ data }) => {
  // Use the react-use-cart hook
  const { updateItemQuantity, removeItem } = useCart();

  // Local state for current quantity
  const [qty, setQty] = useState(data.quantity || 1);

  /**
   * Increment quantity by 1, respecting stock limits
   */
  const increment = () => {
    if (data.stock && qty >= data.stock) {
      toast.error("Stock limit reached!");
      return;
    }
    const newQty = qty + 1;
    setQty(newQty);

    // react-use-cart update
    updateItemQuantity(data.id, newQty);
  };

  /**
   * Decrement quantity, but keep it >= 1
   */
  const decrement = () => {
    if (qty > 1) {
      const newQty = qty - 1;
      setQty(newQty);

      // react-use-cart update
      updateItemQuantity(data.id, newQty);
    }
  };

  /**
   * Remove item from cart entirely
   */
  const handleRemove = () => {
    removeItem(data.id); 
    // Or if your item uses `productId`: removeItem(data.productId)
  };

  return (
    <div className="border-b p-4 flex items-center">
      {/* Increment / Decrement Buttons */}
      <div className="flex items-center mr-4">
        <button
          className="bg-[#e44343] border border-[#e4434373] rounded-full w-[25px]
                     h-[25px] cursor-pointer flex items-center justify-center"
          onClick={increment}
        >
          <HiPlus size={18} color="#fff" />
        </button>

        <span className="px-3">{qty}</span>

        <button
          className="bg-[#a7abb148] rounded-full w-[25px] h-[25px]
                     flex items-center cursor-pointer justify-center"
          onClick={decrement}
        >
          <HiMinus size={18} color="#7d879c" />
        </button>
      </div>

      {/* Product Image */}
      <img
        src={data.imageUrl || "/default-image.jpg"}
        alt="product"
        className="w-[80px] h-[80px] object-contain mr-4"
      />

      {/* Product Info */}
      <div>
        <h1>{data.name || data.productName}</h1>
        <p className="text-[#00000082] font-[400] text-[15px]">
          ${data.price} × {qty}
        </p>
        <p className="font-[600] text-[16px] pt-1 text-[#d02222]">
          ${(data.price * qty).toFixed(2)}
        </p>
      </div>

      {/* Remove Icon */}
      <RxCross1
        size={25}
        className="cursor-pointer ml-auto"
        onClick={handleRemove}
      />
    </div>
  );
};

export default CartSingle;
