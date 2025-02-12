// src/utils/reduxFetchUtils.js
export const reduxFetch = async ({ apiFunction, onSuccess, onError }) => {
  try {
    const data = await apiFunction();
    if (onSuccess) onSuccess(data);
    return data;
  } catch (error) {
    if (onError) onError(error);
    throw error;
  }
};
