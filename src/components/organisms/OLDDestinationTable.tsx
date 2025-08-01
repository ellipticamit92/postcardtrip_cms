"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaginationShadcn } from "../molecules/PaginationShadcn";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PAGE_LIMIT } from "@/consttants/constant";

type Destination = {
  id: string;
  name: string;
  country: string;
};

export function OLDDestinationTable({ tableData }: { tableData: any }) {
  const router = useRouter();
  const [data, setData] = useState<Destination[]>(
    tableData?.destinations ?? []
  );
  const [currenttPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(tableData?.totalCount);
  const [totalPages, setTotalPages] = useState(tableData?.totalPages);
  const [pageLimit, setPageLimit] = useState("10");
  const [loading, setLoading] = useState(data?.length === 0);

  const updateSearchParams = (page: number) => {
    setCurrentPage(page);
    router.push(`?page=${page}&limit=${pageLimit}`);
  };

  const handleLimitChange = (pageLimit: string) => {
    setPageLimit(pageLimit);
    router.push(`?page=${currenttPage}&limit=${pageLimit}`);
  };

  const getDestinationPage = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/auth/destination?page=${currenttPage}&limit=${pageLimit}`
      );

      const destinationData = await res.json();
      const { data, limit, totalCount } = destinationData;
      setData(data);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
      setPageLimit(limit);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getDestinationPage();
  }, [currenttPage, pageLimit]);

  /*
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/auth/destination?page=${page}&limit=${limit}&query=${query}`
    );
    const json = await res.json();
    console.log("DEBUG json = ", json);
    console.log("DEBUG json data = ", json.data);
    setData(json.data);
    setTotal(json.total);
    setLoading(false);
  };

*/
  return (
    <div className="space-y-4">
      {/*
      <Input
        placeholder="Search destinations..."
        defaultValue={query}
        onChange={(e) => {
          const val = e.target.value;
          const timeout = setTimeout(() => {
            updateSearchParams("query", val);
          }, 500);
          return () => clearTimeout(timeout);
        }}
        className="max-w-sm"
      />
      */}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {data?.map((dest) => (
            <div key={dest.id} className="p-4 border rounded-md">
              <h3 className="font-semibold">{dest.name}</h3>
              <p className="text-sm text-muted-foreground">{dest.country}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-2 w-48 ">
          <div>Total Counts:</div>
          <div>{totalCount}</div>
        </div>

        <Select onValueChange={handleLimitChange}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="5" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PAGE_LIMIT.map((item) => (
                <SelectItem key={item.value} value={String(item.value)}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <PaginationShadcn
          currentPage={currenttPage}
          totalPages={totalPages}
          onPageChange={(newPage) => updateSearchParams(newPage)}
        />
      </div>
    </div>
  );
}
