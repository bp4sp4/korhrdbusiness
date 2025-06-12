import React from "react";
import DataTable from "@/components/admin/DataTable";
import FilterBar from "@/components/admin/FilterBar";

export default function AgentsAdminPage() {
  // TODO: fetch agent application data, implement filters, etc.
  const data: any[] = [];
  const handleStatusChange = () => {};
  const getStatusBadge = () => null;
  const searchTerm = "";
  const setSearchTerm = () => {};
  const statusFilter = "all";
  const setStatusFilter = () => {};
  const fieldFilter = "all";
  const setFieldFilter = () => {};
  const uniqueFields: string[] = [];

  return (
    <div className="min-h-screen mt-20 bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">설계사 지원 관리</h1>
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          fieldFilter={fieldFilter}
          setFieldFilter={setFieldFilter}
          uniqueFields={uniqueFields}
        />
        <DataTable
          data={data}
          onStatusChange={handleStatusChange}
          getStatusBadge={getStatusBadge}
        />
      </div>
    </div>
  );
}
