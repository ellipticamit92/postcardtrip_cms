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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationProps;
}

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

export interface Destination {
  did: number;
  name: string;
  country: string;
  overview?: string | null;
  imageUrl?: string | null;
  updatedAt: Date;
  createdAt: Date;
  // Optional relations
  packages?: Package[];
  cities?: City[];
}

export interface City {
  cid: number;
  name: string;
  description: string; // Rich text HTML content
  destinationId: number;
  // Optional relations
  destination?: Destination;
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
  city?: City;
  prices?: PackageHotelPrice[];
  images?: HotelImage[];
}

export interface Package {
  pid: number;
  name: string;
  basePrice: number;
  durationDays: number;
  description: string;
  destinationId: number;
  cityId: number;
  // Optional relations
  destination?: Destination;
  city?: City;
  itineraries?: Itinerary[];
  hotelPrices?: PackageHotelPrice[];
}

export interface PackageHotelPrice {
  phid: number;
  price: number;
  hotelId: number;
  packageId: number;
  // Optional relations
  hotel?: Hotel;
  package?: Package;
}

export interface Itinerary {
  itid: number;
  day: number;
  title: string;
  details: string; // Rich text HTML content
  packageId: number;
  // Optional relations
  package?: Package;
  highlights?: Highlight[];
  inclusions?: Inclusion[];
  exclusions?: Exclusion[];
  places?: ItineraryPlace[];
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
  itineraryId: number;
  // Optional relations
  itinerary?: Itinerary;
}

export interface Inclusion {
  lid: number;
  text: string;
  itineraryId: number;
  // Optional relations
  itinerary?: Itinerary;
}

export interface Exclusion {
  eid: number;
  text: string;
  itineraryId: number;
  // Optional relations
  itinerary?: Itinerary;
}

export interface HotelImage {
  hiid: number;
  url: string;
  caption?: string | null;
  hotelId: number;
  // Optional relations
  hotel?: Hotel;
}
