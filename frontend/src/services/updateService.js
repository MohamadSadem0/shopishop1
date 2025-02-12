import axiosInstance from '../utils/axiosInstance';
import { getDecryptedToken } from '../utils/decryptToken';

/**
 * Updates an existing category by ID.
 * @param {string} categoryId - The ID of the category to update.
 * @param {Object} categoryData - The updated category details (name, imageUrl).
 * @returns {Object} The updated category data.
 */
export const updateCategoryAPI = async (categoryId, categoryData) => {
  try {
    const token = getDecryptedToken(); // Decrypt the token
    if (!token) throw new Error('No token found');

    // Log the categoryId to ensure it's a valid UUID

    const response = await axiosInstance.put(
      `/admin/category/update/${categoryId}`,
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the JWT token for authentication
        },
      }
    );
    return response.data; // Assuming response.data contains the updated category
  } catch (error) {
    console.error('Failed to update category:', error);
    throw new Error(error.response?.data?.message || 'Error updating category');
  }
};
/**
 * Updates an existing section with authorization.
 * @param {Object} sectionData - Updated data for the section.
 * @returns {Object} The updated section.
 */
export const updateSectionAPI = async (sectionData) => {
  try {
    const token = getDecryptedToken();
    if (!token) throw new Error('Authentication token is not available.');

    const response = await axiosInstance.put(
      `/admin/section/update/${sectionData.id}`,
      sectionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Adjust based on actual API response structure
  } catch (error) {
    console.error('Failed to update section:', error);
    throw error; // Propagate error to handle in the caller component
  }
};

/**
 * Updates an existing section with authorization.
 * @param {Object} productData - Updated data for the section.
 * @returns {Object} The updated section.
 */
export const updateProductAPI = async (productId, categoryId, productData) => {
  try {
    const token = getDecryptedToken();
    if (!token) throw new Error('Authentication token is not available.');

    const response = await axiosInstance.put(
      `/merchant/${categoryId}/${productId}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Adjust based on actual API response structure
  } catch (error) {
    console.error('Failed to update section:', error);
    throw error; // Propagate error to handle in the caller component
  }
};

/**
 * Updates an existing section with authorization.
 * @param {Object} isAvailable - Updated data for the section.
 * @returns {Object} The updated section.
 */
export const updateProductAvailabilityAPI = async (
  productId,
  isAvailable = true
) => {
  try {
    const token = getDecryptedToken();
    if (!token) throw new Error('Authentication token is not available.');

    const response = await axiosInstance.put(
      `/merchant/${productId}/availability`,
      isAvailable,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Adjust based on actual API response structure
  } catch (error) {
    console.error('Failed to update section:', error);
    throw error; // Propagate error to handle in the caller component
  }
};
