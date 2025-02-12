import { useState } from 'react';
import axios from 'axios';

const useCloudinaryUpload = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'au4omffc');  // Replace with your Cloudinary upload preset

    try {
      setLoading(true);
      const response = await axios.post('https://api.cloudinary.com/v1_1/dctv1qmij/image/upload', formData); // Ensure 'dctv1qmij' is your Cloudinary cloud name
      setImageUrl(response.data.secure_url);  // Use secure_url for HTTPS images
      setLoading(false);
      return response.data.secure_url;  // Return the secure URL of the uploaded image
    } catch (err) {
      setError(err.response ? err.response.data.error.message : 'Upload failed');
      setLoading(false);
      throw err;
    }
  };

  return { uploadImage, imageUrl, loading, error };
};

export default useCloudinaryUpload;
