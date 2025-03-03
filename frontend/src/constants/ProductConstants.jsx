import React from "react";
import ResizableDescription from "../Components/ResizableDescription";

export const productColumns = [
  { header: "Name", accessor: "name" },
  {
    header: "Description",
    render: (product) => (
      <ResizableDescription
        text={product.description}
        initialHeight={50}
        minHeight={50}
      />
    ),
  },
  { header: "Category", accessor: "categoryName" },
  { header: "Price", render: (product) => `$${product.price}` },
  {
    header: "Image",
    render: (product) => (
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-md mx-auto"
      />
    ),
  },
  { header: "Store ID", accessor: "storeId" },
  {
    header: "Available",
    render: (product) => (
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          product.isAvailable
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {product.isAvailable ? "Yes" : "No"}
      </span>
    ),
  },
];

export const discountFieldsConfig = [
  {
    label: "Discount Price",
    name: "discountPrice",
    type: "number",
    step: "0.01",
  },
  {
    label: "Discount Percent",
    name: "discountPercent",
    type: "number",
    step: "0.01",
  },
  {
    label: "Start Date",
    name: "discountStartDate",
    type: "date",
  },
  {
    label: "End Date",
    name: "discountEndDate",
    type: "date",
  },
];

export const updateFieldsConfig = [
  { label: "Name", name: "name", type: "text" },
  { label: "Description", name: "description", type: "textarea" },
  { label: "Price", name: "price", type: "number", step: "0.01" },
  { label: "Image", name: "image", type: "file" },
  { label: "Category Name", name: "categoryName", type: "text", readOnly: true },
  { label: "Store ID", name: "storeId", type: "text", readOnly: true },
];
