"use client";

import { PaginationProps } from "@/types/type";
import { FC, useState, ComponentType, useMemo, useCallback } from "react";
import FilterCard from "../organisms/FilterCard";

interface ViewLayoutProps<T> {
  data: T[];
  pagination: PaginationProps;
  filterKey: keyof T;
  GridComponent: ComponentType<{ data: T[]; pagination: PaginationProps }>;
  ListComponent: ComponentType<{ data: T[]; pagination: PaginationProps }>;
  TableComponent: ComponentType<{ data: T[]; pagination: PaginationProps }>;
}

const ViewLayout = <T extends Record<string, any>>({
  data,
  pagination,
  filterKey,
  GridComponent,
  ListComponent,
  TableComponent,
}: ViewLayoutProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");

  const filterData = useMemo(() => {
    return data.filter((item) => {
      const value = item?.[filterKey];
      const stringValue = String(value || "");
      return stringValue.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, filterKey, searchTerm]);

  const componentMap = useMemo(
    () => ({
      grid: GridComponent,
      list: ListComponent,
      table: TableComponent,
    }),
    [GridComponent, ListComponent, TableComponent]
  );

  const renderViewComponent = useCallback(() => {
    const Component = componentMap[viewMode] || componentMap.grid;
    return <Component data={filterData} pagination={pagination} />;
  }, [viewMode, filterData, pagination, componentMap]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleModeChange = useCallback((value: string) => {
    setViewMode(value as "grid" | "list" | "table");
  }, []);

  return (
    <>
      <FilterCard
        searchTerm={searchTerm}
        handleChange={handleSearchChange}
        viewMode={viewMode}
        handleModeChange={handleModeChange}
      />

      <div className="mt-4">{renderViewComponent()}</div>
    </>
  );
};

export default ViewLayout;
