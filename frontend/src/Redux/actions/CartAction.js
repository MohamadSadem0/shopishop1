export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART_ITEM = "UPDATE_CART_ITEM"; // Ensure action type is defined

// Add to cart action
export const addTocart = (product) => (dispatch, getState) => {
  dispatch({ type: ADD_TO_CART, payload: product });
  localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
};

// Remove from cart action
export const removeFromCart = (product) => (dispatch, getState) => {
  dispatch({ type: REMOVE_FROM_CART, payload: product });
  localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
};

// Update cart item quantity action
export const updateCartItem = (product) => (dispatch, getState) => {
  dispatch({ type: UPDATE_CART_ITEM, payload: product });
  localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
};

// Ensure all functions are exported properly
export default {
  addTocart,
  removeFromCart,
  updateCartItem,
};
