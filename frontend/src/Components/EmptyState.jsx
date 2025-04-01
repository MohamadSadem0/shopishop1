import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ message, actionText, onAction, icon: Icon }) => {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      {Icon && (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
          <Icon className="h-6 w-6 text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.elementType
};

export default EmptyState;