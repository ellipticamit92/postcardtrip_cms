import { useState } from "react";

export type VideMode = "grid" | "list" | "table";

export const useFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<VideMode>("grid");

  return {
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
  };
};
