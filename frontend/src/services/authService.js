import axiosInstance from '../utils/axiosInstance';
import handleError from '../utils/errorHandler';


/**
 * Handles user login.
 * @param {Object} credentials - User credentials { email, password }
 * @returns {Object} User data
 */
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/public/auth/login', credentials, {
      withCredentials: true,
    });
    
    return response;
  } catch (error) {
    const errorMessage = handleError(error);
    console.error('Login failed:', errorMessage);
    throw new Error(errorMessage);
  }
};


/**
 * Handles user signup.
 * @param {Object} userDetails - User details { name, email, password, ... }
 * @returns {Object} User data
 */
export const signup = async (userDetails) => {
  try {
    // Add a random image URL to userDetails
    userDetails.imageUrl = `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;

    
    const response = await axiosInstance.post('/public/auth/signup', userDetails, {
      withCredentials: true,
    });
    return { user: response.data.user };
  } catch (error) {
    const errorMessage = handleError(error);
    console.error('Signup failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Handles user logout.
 */
export const logout = async () => {
  try {
    await axiosInstance.post('/api/user/logout', {}, {
      withCredentials: true,
    });
    sessionStorage.clear(); // Clear sessionStorage on logout
  } catch (error) {
    const errorMessage = handleError(error);
    console.error('Logout failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const handleGoogleAuth = async (payload) => {
  try {
    const response = await axiosInstance.post('/auth/google', payload); // Adjust the endpoint to match your backend
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token); // Store JWT for further authentication
    }
  } catch (error) {
    console.error('Error during Google authentication', error);
  }
};