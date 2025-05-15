import {getDecryptedToken} from "../utils/decryptToken";
import axiosInstance from "../utils/axiosInstance";

/**
 * Deletes a category by ID.
 * @param {string} categoryId - The ID of the category to delete.
 * @returns {void}
 */
export const deleteCategoryAPI = async (categoryId) => {
    try {
        const token = getDecryptedToken(); // Decrypt the token
      if (!token) throw new Error('No token found');
      

      const response =    await axiosInstance.delete(`/admin/category/delete/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Pass the decrypted JWT token
            }
      });
    } catch (error) {
        console.error('Failed to delete category:', error);
        throw new Error(error.response?.data?.message || 'Error deleting category');
    }
};
/**
 * Deletes a section by its ID with authorization.
 * @param {string} sectionId - The ID of the section to delete.
 * @returns {Object} The response object indicating success or failure.
 */
export const deleteSectionAPI = async (sectionId) => {
    try {
        const token = getDecryptedToken();
        if (!token) throw new Error('Authentication token is not available.');

        const response = await axiosInstance.delete(`/admin/section/delete/${sectionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Adjust based on actual API response structure
    } catch (error) {
        console.error('Failed to delete section:', error);
        throw error; // Propagate error to handle in the caller component
    }
};

/**
 * Deletes a section by its ID with authorization.
 * @param {string} productId - The ID of the section to delete.
 * @returns {Object} The response object indicating success or failure.
 */
export const deleteProductAPI = async (productId) => {
  try {
      const token = getDecryptedToken();
      if (!token) throw new Error('Authentication token is not available.');

      const response = await axiosInstance.delete(`/merchant/products/delete/${productId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data; // Adjust based on actual API response structure
  } catch (error) {
      console.error('Failed to delete product:', error);
      throw error; // Propagate error to handle in the caller component
  }
};