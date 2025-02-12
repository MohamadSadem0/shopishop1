import React, { useState } from "react";
import axios from "axios";

const CreateCategory = () => {
  const [name, setName] = useState("");

  const handleCreateCategory = (e) => {
    e.preventDefault();
    axios.post("/api/categories", { name })
      .then(response => {
        alert("Category created successfully!");
        setName("");
      })
      .catch(error => console.error("Error creating category:", error));
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-semibold mb-4">Create Category</h2>
      <form onSubmit={handleCreateCategory}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Category Name" 
          className="border p-2 rounded w-1/2"
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 ml-2 rounded">Create</button>
      </form>
    </div>
  );
};

export default CreateCategory;
