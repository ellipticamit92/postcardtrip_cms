// lib/store/serverDataStore.ts
import { create } from "zustand";
import { Queries, QueryData, User } from "@/types/type";

interface ServerData {
  title: string;
  date: string;
  userData: User[];
  query: Queries;
  queries: Queries[];
  queryData: QueryData;
}

interface ServerDataState {
  data: ServerData | null;
  userData: User[] | null;
  query: Queries | null;
  queries: Queries[] | null;
  queryData: QueryData;
  setData: (data: ServerData) => void;
  setQuery: (query: Queries) => void;
  setQueries: (query: Queries[]) => void;
  setUserData: (userData: User[]) => void;
  setQueryData: (queryData: QueryData) => void;
}

export const useServerData = create<ServerDataState>((set) => ({
  data: null,
  userData: null,
  query: null,
  queries: null,
  queryData: {
    queries: [],
    totalPages: 0,
    totalCount: 0,
    currentPage: 0,
  },
  setData: (data) => {
    set({
      data,
      userData: data?.userData ?? [],
      query: data?.query ?? {},
      queries: data?.queries ?? [],
      queryData: data?.queryData ?? {},
    });
  },
  setQueries: (queries) => set({ queries }),
  setQuery: (query) => set({ query }),
  setUserData: (userData) => set({ userData }),
  setQueryData: (queryData) => set({ queryData }),
}));
