// src/utils/errorHandler.js

import errorMessages from '../messages';

const handleError = (error) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    const status = error.response.status;
    switch (status) {
      case 401:
        return errorMessages.authError;
      case 404:
        return errorMessages.notFound;
      case 500:
        return errorMessages.serverError;
      default:
        return error.response.data?.message || errorMessages.default;
    }
  } else if (error.request) {
    // Request was made but no response was received
    return errorMessages.networkError;
  } else {
    // Something happened in setting up the request
    return error.message || errorMessages.default;
  }
};

export default handleError;
