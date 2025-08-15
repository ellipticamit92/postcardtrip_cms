// lib/store/serverDataStore.ts
import { create } from "zustand";
import { User } from "@/types/type";

interface ServerData {
  title: string;
  date: string;
  userData: User[];
  query: any;
  queries: any[];
  queryData: any;
}

interface ServerDataState {
  data: ServerData | null;
  userData: User[] | null;
  query: any | null;
  queries: any[] | null;
  queryData: any;
  setData: (data: ServerData) => void;
  setQuery: (query: any) => void;
  setQueries: (query: any[]) => void;
  setUserData: (userData: User[]) => void;
  setQueryData: (queryData: any) => void;
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
