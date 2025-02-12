import React from "react";
import { DataGrid } from "@material-ui/data-grid";

const SuperAdminContent = () => {
  // Static Data
  const users = [
    { id: 1, name: "John Doe", role: "Merchant", status: "Active" },
    { id: 2, name: "Jane Smith", role: "Customer", status: "Inactive" },
    { id: 3, name: "Admin User", role: "Admin", status: "Active" },
  ];

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 100, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    { field: "role", headerName: "Role", minWidth: 150, flex: 0.8 },
    { field: "status", headerName: "Status", minWidth: 150, flex: 0.8 },
  ];

  return (
    <div className="flex-1 p-8 bg-white">
      <h2 className="text-2xl font-semibold mb-4">Super Admin Dashboard</h2>
      <DataGrid rows={users} columns={columns} pageSize={5} autoHeight />
    </div>
  );
};

export default SuperAdminContent;
