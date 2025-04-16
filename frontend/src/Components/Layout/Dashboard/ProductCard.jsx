import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaTimes, FaTag, FaInfoCircle } from "react-icons/fa";

const ProductCard = ({ 
  product, 
  onDelete, 
  onDiscount, 
  onEdit, 
  onUpdateQuantity,
  onRemoveDiscount,
  isMerchant
}) => {
  const [showDetails, setShowDetails] = useState(false);
  useEffect(()=>{
    console.log(product);
    
  },[])

  const toggleDetails = () => setShowDetails(!showDetails);

  // Calculate average rating
  const averageRating = product.averageRating || 
    (product.reviews?.length > 0 ? 
      product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length : 
      0);

  // Render star rating
  const renderRating = (size = 'text-sm') => {
    return Array(5).fill(0).map((_, i) => (
      i < Math.round(averageRating) ? 
        <FaStar key={i} className={`text-yellow-400 ${size}`} /> : 
        <FaRegStar key={i} className={`text-yellow-400 ${size}`} />
    ));
  };

  // Check if discount is currently valid
  const isDiscountValid = product.discountInfo !== null;

  // Calculate discount percentage
  const discountPercentage = isDiscountValid && product.originalPrice && product.finalPrice ?
    Math.round(((product.originalPrice - product.finalPrice) / product.originalPrice) * 100) : 0;

  // Format price with currency
  const formatPrice = (price) => {
    if (!price) return "$0.00";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Product Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 relative group border border-gray-100">
        {/* Discount Ribbon */}
        {isDiscountValid && (
          <div className="absolute top-3 left-0 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-r-md shadow-lg z-10 flex items-center">
            <FaTag className="mr-1.5" />
            <span className="font-semibold">
              {product.discountInfo.discountType === "PERCENTAGE" 
                ? `${product.discountInfo.discountValue}% OFF` 
                : `${formatPrice(product.discountInfo.discountValue)} OFF`}
            </span>
            {product.discountInfo.endDate && (
              <span className="ml-2 text-[0.65rem] font-normal bg-white/20 px-1 py-0.5 rounded">
                Ends {formatDate(product.discountInfo.endDate)}
              </span>
            )}
          </div>
        )}

        {/* Product Image */}
        <div 
          className="h-48 overflow-hidden cursor-pointer relative bg-gray-50"
          onClick={toggleDetails}
        >
          <img 
            src={product.imageUrl || "https://via.placeholder.com/300?text=No+Image"} 
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-4"
          />
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 rounded-full p-2 text-gray-700 shadow-md">
              <FaInfoCircle className="text-lg" />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 pt-3">
          <div className="flex justify-between items-start mb-2">
            <h3 
              className="text-lg font-semibold text-gray-800 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer"
              onClick={toggleDetails}
            >
              {product.name}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
              {product.categoryName}
            </span>
          </div>

          {/* Price Display */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              {/* Current Price */}
              <span className={`text-xl font-bold ${isDiscountValid ? 'text-red-600' : 'text-gray-900'}`}>
                {formatPrice(product.finalPrice)}
              </span>
              
              {/* Original Price */}
              {isDiscountValid && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-medium">
                    Save {discountPercentage}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stock and Rating */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className={`text-sm ${product.isAvailable ? 'text-gray-700' : 'text-red-500'} flex items-center`}>
                <span className={`w-2 h-2 rounded-full mr-1.5 ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {product.isAvailable ? `In Stock (${product.quantity})` : "Out of stock"}
              </span>
            </div>
            <div className="flex items-center">
              {averageRating > 0 ? (
                <>
                  <div className="flex mr-1">{renderRating('text-xs')}</div>
                  <span className="text-xs text-gray-500">
                    ({product.reviews?.length || 0})
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-400">No reviews</span>
              )}
            </div>
          </div>

          {/* Sales count and quick actions */}
          <div className="mt-3 flex justify-between items-center">
            {product.totalSell > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {product.totalSell}+ sold
              </span>
            )}
            <button 
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleDetails();
              }}
            >
              View details
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center shadow-sm z-10">
              <h2 className="text-xl font-bold flex items-center">
                {product.name}
                {isDiscountValid && (
                  <span className="ml-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                    <FaTag className="mr-1" />
                    {product.discountInfo.discountType === "PERCENTAGE" 
                      ? `${product.discountInfo.discountValue}% OFF` 
                      : `${formatPrice(product.discountInfo.discountValue)} OFF`}
                  </span>
                )}
              </h2>
              <button 
                onClick={toggleDetails}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* Left Column - Product Info */}
              <div>
                <div className="mb-6 bg-gray-50 rounded-lg overflow-hidden">
                  <img 
                    src={product.imageUrl || "https://via.placeholder.com/500?text=No+Image"} 
                    alt={product.name}
                    className="w-full h-64 object-contain"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Description</h3>
                  <p className="text-gray-700">
                    {product.description || "No description available."}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Pricing Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span className="font-medium">{formatPrice(product.originalPrice)}</span>
                    </div>
                    
                    {isDiscountValid && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium text-green-600">
                            {product.discountInfo.discountType === "PERCENTAGE" 
                              ? `${product.discountInfo.discountValue}%` 
                              : formatPrice(product.discountInfo.discountValue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">You Save:</span>
                          <span className="font-medium text-green-600">
                            {formatPrice(product.originalPrice - product.finalPrice)} ({discountPercentage}%)
                          </span>
                        </div>
                        {product.discountInfo.startDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Discount Started:</span>
                            <span>{formatDate(product.discountInfo.startDate)}</span>
                          </div>
                        )}
                        {product.discountInfo.endDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Discount Ends:</span>
                            <span className="text-red-500 font-medium">
                              {formatDate(product.discountInfo.endDate)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                      <span className="text-gray-800 font-semibold">Final Price:</span>
                      <span className={`text-xl font-bold ${isDiscountValid ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatPrice(product.finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Reviews and Actions */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Product Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{product.categoryName}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Availability:</span>
                      <span className={`font-medium ${product.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                        {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity Available:</span>
                      <span className="font-medium">{product.quantity}</span>
                    </div>
                    
                    {product.totalSell > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Sold:</span>
                        <span className="font-medium">{product.totalSell}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Store:</span>
                      <span className="font-medium">{product.storeName || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b flex items-center justify-between">
                    <span>Customer Reviews</span>
                    {averageRating > 0 && (
                      <span className="flex items-center text-sm font-normal">
                        {renderRating('text-base')}
                        <span className="ml-1 text-gray-600">
                          ({averageRating.toFixed(1)} from {product.reviews?.length || 0} reviews)
                        </span>
                      </span>
                    )}
                  </h3>
                  
                  {product.reviews?.length > 0 ? (
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div className="flex mr-2">
                                {Array(5).fill(0).map((_, i) => (
                                  i < review.rating ? 
                                    <FaStar key={i} className="text-yellow-400 text-sm" /> : 
                                    <FaRegStar key={i} className="text-yellow-400 text-sm" />
                                ))}
                              </div>
                              <span className="font-medium">{review.userName}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No reviews yet</p>
                  )}
                </div>

                {/* Action Buttons - Only show for merchants */}
                {isMerchant && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product.id);
                        toggleDetails();
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      Delete Product
                    </button>
                    {isDiscountValid ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveDiscount(product.id);
                          toggleDetails();
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        Remove Discount
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDiscount(product);
                          toggleDetails();
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        Add Discount
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product);
                        toggleDetails();
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      Edit Product
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateQuantity(product);
                        toggleDetails();
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                      disabled={!product.isAvailable}
                    >
                      Update Stock
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;