"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaginationShadcn } from "../molecules/PaginationShadcn";

type Destination = {
  id: string;
  name: string;
  country: string;
};

export function DestinationTable({ tableData }: { tableData: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<Destination[]>(tableData ?? []);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get("page") || "1");
  const query = searchParams.get("query") || "";
  const limit = 10;

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  };

  const fetchData = async () => {
    /*
    setLoading(true);
    const res = await fetch(
      `/api/destination?page=${page}&limit=${limit}&query=${query}`
    );
    const json = await res.json();
    setData(json.data);
    setTotal(json.total);
    setLoading(false);
    */
  };

  useEffect(() => {
    fetchData();
  }, [page, query]);

  return (
    <div className="space-y-4">
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {data.map((dest) => (
            <div key={dest.id} className="p-4 border rounded-md">
              <h3 className="font-semibold">{dest.name}</h3>
              <p className="text-sm text-muted-foreground">{dest.country}</p>
            </div>
          ))}
        </div>
      )}

      <PaginationShadcn
        page={page}
        totalPages={Math.ceil(total / limit)}
        onPageChange={(newPage) =>
          updateSearchParams("page", newPage.toString())
        }
      />
    </div>
  );
}
