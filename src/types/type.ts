import { Itinerary } from "@prisma/client";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IEH {
  updatedAt: Date;
  createdAt: Date;
  text: string;
  id: number | null;
  type?: string;
}

export interface Highlight extends IEH {
  hlid: number;
}

export interface Inclusion extends IEH {
  lid: number;
}

export interface Exclusion extends IEH {
  eid: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationProps;
}

export interface Option {
  label: string;
  value: string;
}

export type Options = Option[];
export type OptionsNum = {
  label: string;
  value: number;
};

export interface User {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  accounts: Account[];
  sessions: Session[];
}

export interface Account {
  id: number;
  userId: number;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface Session {
  id: number;
  sessionToken: string;
  userId: number;
  expires: Date;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface ItineraryPackageItem {
  package: {
    name: string;
    pid: number;
    destination: {
      name: string;
    };
  };
  itineraries: Itinerary[];
}

export interface ItineraryPackage {
  [packageId: number]: {
    package: {
      name: string;
      pid: number;
      destination: {
        name: string;
      };
    };
    itineraries: Itinerary[];
  };
}

export interface ItineraryPlace {
  itpid: number;
  name: string;
  description: string; // Rich text HTML content
  itineraryId: number;
  // Optional relations
  itinerary?: Itinerary;
  images?: ItineraryPlaceImage[];
}

export interface ItineraryPlaceImage {
  ipiid: number;
  url: string;
  caption?: string | null;
  placeId: number;
  // Optional relations
  place?: ItineraryPlace;
}

export type IEHType = "inclusion" | "exclusion";

export interface HooksProps {
  autoFetch?: boolean;
  initialPage?: number;
  initialLimit?: number;
}

export interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}
