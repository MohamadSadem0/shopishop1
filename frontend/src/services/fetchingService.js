import axiosInstance from '../utils/axiosInstance';
import {getDecryptedToken} from '../utils/decryptToken'; // Import the token decryption function


/**
 * Fetches categories for a specific store from the backend.
 * @param {number} storeId - The ID of the store to fetch categories for.
 * @param {string} token - The JWT token for authentication.
 * @returns {Array} List of categories.
 */
export const fetchCategoriesByStoreIdAPI = async (storeId) => {
  try {
    const response = await axiosInstance.get(`/public/store/${storeId}/categories`, );
    
    return response.data; // Assuming response.data contains an array of categories
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error(error.response?.data?.message || 'Error fetching categories');
  }
};


export const fetchUserDetailsByEmailAPI = async (email) => {
  const token = getDecryptedToken();

  try {
    const response = await axiosInstance.get(`/admin/user`, {
      params: { email }, // Pass email as a query parameter
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in Authorization header
      },
    });
    return response.data; // Return the fetched user details
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    throw error;
  }
};


/**
 * Fetches detailed information about a user by ID, including store details if applicable.
 * @param {number} userId - The ID of the user to fetch.
 * @returns {Promise<Object>} Detailed user information.
 */
export const fetchUserDetailsByIdAPI = async (userId) => {
  try {
    const token = getDecryptedToken();
    if (!token) throw new Error('Authentication token is not available.');

    const response = await axiosInstance.get(`/admin/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    throw new Error(error.response?.data?.message || 'Error fetching user details');
  }
};

/**
 * Fetches all users from the backend.
 * @returns {Promise<Array>} List of users.
 */
export const fetchAllUsersAPI = async () => {
  try {
    const token = getDecryptedToken(); // Decrypt the token
    if (!token) throw new Error('Authentication token is not available.');

    const response = await axiosInstance.get('/admin/all', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the JWT token to the request header
      },
    });
    return response.data; // Assuming response.data contains an array of user data
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error(error.response?.data?.message || 'Error fetching users');
  }
};


/**
 * Fetches all categories from the public API.
 * @returns {Array} List of categories.
 */
export const fetchAllCategoriesAPI = async () => {
  try {
    const response = await axiosInstance.get('/public/category/all');
    
    return response.data; // Assuming response.data contains an array of categories
  } catch (error) {
    console.error('Failed to fetch all categories:', error);
    throw new Error(error.response?.data?.message || 'Error fetching all categories');
  }
};

/**
 * Fetches merchants along with their stores.
 * @returns {Array} List of merchants with their stores.
 */
export const fetchMerchantsWithStoresAPI = async () => {
  const token = getDecryptedToken(); // Decrypt the token from storage
  if (!token) throw new Error('Authentication token is not available.');

  try {
    const response = await axiosInstance.get('/admin/merchants-with-stores', {
      headers: {
        Authorization: `Bearer ${token}` // Include the decrypted JWT token in the request header
      }
    });
    return response.data; // Assuming response.data contains the list of merchants with stores
  } catch (error) {
    console.error('Failed to fetch merchants with stores:', error);
    throw new Error(error.response?.data?.message || 'Error fetching merchants with stores');
  }
};

/**
 * Fetches all products from the public API.
 * @returns {Array} List of products.
 */
export const fetchAllProductsAPI = async () => {
  try {
    const response = await axiosInstance.get('/public/AllProducts');
    
    return response.data; // Assuming response.data contains an array of products
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    throw new Error(error.response?.data?.message || 'Error fetching products');
  }
};

/**
 * Fetches a specific product by its ID.
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Object} The product data.
 */
export const fetchProductByIdAPI = async (productId) => {
  try {
    const response = await axiosInstance.get(`/public/products/${productId}`);
    return response.data; // Assuming response.data contains the product
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw new Error(error.response?.data?.message || 'Error fetching product');
  }
};

/**
 * Fetches all products for a specific category.
 * @param {string} categoryId - The ID of the category to fetch products for.
 * @returns {Array} List of products.
 */
export const fetchProductsByCategoryAPI = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/public/category/${categoryId}`);
    return response.data; // Assuming response.data contains an array of products
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    throw new Error(error.response?.data?.message || 'Error fetching products by category');
  }
};



export const fetchProductsByStoreIdAPI = async (storeId) => {
  try {

    
    const response = await axiosInstance.get(`/public/products/store/${storeId}`

  );
    return response.data; 
  } catch (error) {
    console.error('Failed to fetch products by store:', error);
    throw new Error(error.response?.data?.message || 'Error fetching products by store');
  }
};


/**
 * Fetch all stores from the backend.
 * @returns {Array} List of stores.
 */
export const fetchAllStoresAPI = async () => {
  try {
    const token = getDecryptedToken(); // Decrypt the token
    if (!token) throw new Error('Authentication token is not available.');

    
    const response = await axiosInstance.get('/admin/stores/all', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the JWT token to the request header
      },
    });

    return response.data; // Assuming response.data contains an array of stores
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    throw new Error(error.response?.data?.message || 'Error fetching stores');
  }
};

export const fetchAllApprovedStoresAPI = async () => {
  try {
    const response = await axiosInstance.get('public/stores/all');
    
    return response.data; // Assuming response.data contains an array of stores

  } catch (error) {
    console.error('Failed to fetch stores:', error);
    throw new Error('Error fetching stores');
  }
};

/**
 * Fetches a specific store by its ID.
 * @param {number} storeId - The ID of the store to fetch.
 * @returns {Object} The store data.
 */
export const fetchStoreByIdAPI = async (storeId) => {
  try {
    const response = await axiosInstance.get(`/public/stores/${storeId}`);
    return response.data; // Assuming response.data contains the store details
  } catch (error) {
    console.error('Failed to fetch store by ID:', error);
    throw new Error(error.response?.data?.message || 'Error fetching store');
  }
};

/**
 * Approves a specific store by its ID.
 * @param {number} storeId - The ID of the store to approve.
 * @returns {string} Success message.
 */
export const approveStoreAPI = async (storeId) => {
  try {
    const token = getDecryptedToken(); // Decrypt the token
    if (!token) throw new Error('No token found');

    const response = await axiosInstance.post('/admin/approve', null, {
      params: { storeId },
      headers: {
        Authorization: `Bearer ${token}`, // Add the JWT token to the request header
      },
    });
    return response.data; // Assuming response.data contains a success message
  } catch (error) {
    console.error('Failed to approve store:', error);
    throw new Error(error.response?.data?.message || 'Error approving store');
  }
};


/**
 * Fetches all sections available for the admin.
 * @returns {Array} List of sections.
 */
export const fetchAllSectionsAPI = async () => {
  try {


    const response = await axiosInstance.get('/public/sections');
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch sections:', error);
    throw new Error(error.response?.data?.message || 'Error fetching sections');
  }
};

export const fetchProductsBySectionAPI = async (sectionId) => {
  try {
    const response = await axiosInstance.get(`/public/products/section/${sectionId}`);
    return response.data; // This is the array of products
  } catch (error) {
    console.error('Error fetching products by section:', error);
    throw error;
  }
};
export const fetchPaginatedProductsAPI  = async (page = 0, size = 10, category = "") => {
  try {
    const response = await axiosInstance.get(`/public/products`,{
      params: { page, size, category },
    });
    
    return response.data.data; // This is the array of products
  } catch (error) {
    console.error('Error fetching products by section:', error);
    throw error;
  }
};

export const fetchCategoriesBySectionIdAPI = async (sectionId) => {
  try {
    const response = await axiosInstance.get(`/public/${sectionId}/categories`);
    return response.data; // This is the array of categories
  } catch (error) {
    console.error('Error fetching categories by section ID:', error);
    throw new Error(error.response?.data?.message || 'Error fetching categories by section ID');
  }
};

export const fetchCategoriesBySectionNameAPI = async (sectionName) => {
  try {
    const response = await axiosInstance.get(`/public/category/section/${sectionName}`);
    return response.data; // This is the array of categories
  } catch (error) {
    console.error('Error fetching categories by section name:', error);
    throw new Error(error.response?.data?.message || 'Error fetching categories by section name');
  }
};

/**
 * Fetches all sections from the API with authorization.
 * @returns {Array} List of sections with categories.
 */
export const fetchSectionsAPI = async () => {
  try {
    const response = await axiosInstance.get('/public/sections',)
    return response.data; // Assuming response.data contains the store details
  } catch (error) {
    console.error("fdsfsdfsd");
    throw new Error(error.response?.data?.message || 'Error fetching store');
  }
};
/**
 * Fetches sections along with categories from the API.
 * @returns {Array} List of sections with categories.
 */
export const fetchSectionsWithCategoriesAPI = async () => {
  try {
    const response = await axiosInstance.get('/public/sections-with-categories');
    return response.data; // Assuming response.data contains the list of sections with categories
  } catch (error) {
    console.error('Failed to fetch sections with categories:', error);
    throw error; // Propagate error to handle in the caller component
  }
};
export const fetchDiscountItemsAPI = async () => {
  // Simulate fetching discounts
  return [
    {id: 1, name: 'Discount Burger', url: 'https://via.placeholder.com/150', description: 'Get 50% OFF on Burgers!'},
    {id: 2, name: 'Pizza Deal', url: 'https://via.placeholder.com/150', description: '25% OFF on all pizzas!'},
  ];
};
export const fetchShopiiShopItemsAPI = async () => {
  // Simulate fetching ShopiiShop items
  return [
    {id: 1, name: 'Maryool', url: 'https://via.placeholder.com/200', description: 'Daily Dish, Healthy, Lebanese'},
    {id: 2, name: 'Socrates', url: 'https://via.placeholder.com/200', description: 'Delicious Mediterranean food'},
  ];
};