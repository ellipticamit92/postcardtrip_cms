import { Package } from "@prisma/client";

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

export interface City {
  cid: number;
  name: string;
  description: string; // Rich text HTML content
  createdAt: Date;
  // Optional relations
  packages?: Package[];
  hotels?: Hotel[];
}

export interface Hotel {
  hid: number;
  name: string;
  description: string;
  starRating: number;
  cityId: number;
  // Optional relations
  city?: Partial<City>;
  prices?: PackageHotelPrice[];
  images?: HotelImage[];
}

export interface PackageHotelPrice {
  phid: number;
  basePrice: number | null;
  originalPrice: number | null;
  hotelId: number;
  packageId: number;
  // Optional relations
  hotel?: Partial<Hotel>;
  package?: Partial<Package>;
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

export interface Itinerary {
  itid: number;
  day: number;
  title: string;
  details: string; // Rich text HTML content
  packageId: number;
  // Optional relations
  package: Partial<Package>;
  highlights?: Partial<Highlight>[];
  cities?: Partial<City>[];
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

export interface Highlight {
  hlid: number;
  text: string;
  packages: Package[];
  updatedAt: Date;
  createdAt: Date;
}

export interface Inclusion {
  lid: number;
  text: string;
  packages: Package[];
  updatedAt: Date;
  createdAt: Date;
}

export interface Exclusion {
  eid: number;
  text: string;
  packages: Package[];
  updatedAt: Date;
  createdAt: Date;
}

export interface HotelImage {
  hiid: number;
  url: string;
  caption: string | null;
  hotelId: number;
  // Optional relations
  hotel?: Hotel;
}

export interface Tours {
  tid: number;
  text: string;
  description?: string | null;
  icons?: string | null;
}

// export interface Review {
//   id: number;
//   username: string;
//   places: string;
//   review: string;
//   rating: number;
//   packageId?: number | null;
//   destinationId?: number | null;
//   package?: {
//     pid: number;
//     name: string;
//   } | null;
//   destination?: {
//     did: number;
//     name: string;
//   } | null;
//   createdAt: Date;
//   updatedAt: Date;
// }

export type IEHType = "inclusion" | "exclusion" | "highlight";

export interface HooksProps {
  autoFetch?: boolean;
  initialPage?: number;
  initialLimit?: number;
}
