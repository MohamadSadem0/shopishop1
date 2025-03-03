// ReusableFormModal.jsx
import React from "react";

const ReusableFormModal = ({
  isVisible,
  title,
  fields,
  onSubmit,
  onClose,
  submitLabel = "Save",
}) => {
  if (!isVisible) return null;

  // Render each field based on its type
  const renderField = (field) => {
    const {
      label,
      name,
      type,
      value,
      onChange,
      options,
      readOnly,
      placeholder,
      step,
      ...rest
    } = field;

    switch (type) {
      case "textarea":
        return (
          <div key={name} className="mb-4">
            <label className="block text-gray-700 mb-1">{label}</label>
            <textarea
              name={name}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              {...rest}
            />
          </div>
        );
      case "select":
        return (
          <div key={name} className="mb-4">
            <label className="block text-gray-700 mb-1">{label}</label>
            <select
              name={name}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              {...rest}
            >
              {options &&
                options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>
          </div>
        );
      case "file":
        return (
          <div key={name} className="mb-4">
            <label className="block text-gray-700 mb-1">{label}</label>
            <input
              type="file"
              name={name}
              onChange={onChange}
              className="w-full"
              {...rest}
            />
          </div>
        );
      default:
        // default is to render an input (works for text, number, date, etc.)
        return (
          <div key={name} className="mb-4">
            <label className="block text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              placeholder={placeholder}
              step={step}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              {...rest}
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6">
        {title && (
          <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
        )}
        <form onSubmit={onSubmit}>
          {fields.map((field) => renderField(field))}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReusableFormModal;
