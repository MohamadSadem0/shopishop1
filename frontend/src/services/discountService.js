export const validateDiscountInput = (discountData, productPrice) => {
    const errors = {};
    
    if (!discountData.discountType) {
      errors.discountType = 'Discount type is required';
    }
    
    if (!discountData.discountValue) {
      errors.discountValue = 'Discount value is required';
    } else {
      const value = parseFloat(discountData.discountValue);
      if (isNaN(value)) {
        errors.discountValue = 'Invalid discount value';
      } else if (discountData.discountType === 'PERCENTAGE') {
        if (value <= 0 || value > 100) {
          errors.discountValue = 'Percentage must be between 0-100';
        }
      } else if (value <= 0 || value >= productPrice) {
        errors.discountValue = `Amount must be between 0 and $${productPrice.toFixed(2)}`;
      }
    }
    
    if (discountData.startDate && discountData.endDate) {
      const start = new Date(discountData.startDate);
      const end = new Date(discountData.endDate);
      if (start > end) {
        errors.endDate = 'End date must be after start date';
      }
    }
    
    return errors;
  };
  
  export const calculateDiscountedPrice = (price, discount) => {
    if (!discount || !discount.discountValue) return price;
    
    return discount.discountType === 'PERCENTAGE'
      ? price * (1 - discount.discountValue / 100)
      : price - discount.discountValue;
  };
  
  export const isDiscountActive = (discount) => {
    if (!discount || !discount.discountActive) return false;
    
    const now = new Date();
    const start = discount.discountStartDate ? new Date(discount.discountStartDate) : null;
    const end = discount.discountEndDate ? new Date(discount.discountEndDate) : null;
    
    return (!start || now >= start) && (!end || now <= end);
  };