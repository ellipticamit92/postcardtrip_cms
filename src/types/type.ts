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
  id: string;
  name: string;
  country: string;
  description?: string;
  overview?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  packages?: Package[];
  cities?: City[];
}

export interface City {
  id: string;
  name: string;
  description: string;
  destinationId: string;
  hotels: Hotel[];
  packages: Package[];
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  starRating: number;
  cityId: string;
  prices: PackageHotelPrice[];
  images: HotelImage[];
}

export interface HotelImage {
  id: string;
  url: string;
  caption?: string;
  hotelId: string;
}

export interface Package {
  id: string;
  name: string;
  basePrice: number;
  durationDays: number;
  description: string;
  destinationId: string;
  cityId: string;
  itineraries: Itinerary[];
  hotelPrices: PackageHotelPrice[];
}

export interface PackageHotelPrice {
  id: string;
  price: number;
  hotelId: string;
  packageId: string;
}

export interface Itinerary {
  id: string;
  day: number;
  title: string;
  details: string;
  packageId: string;
  highlights: Highlight[];
  inclusions: Inclusion[];
  exclusions: Exclusion[];
  places: ItineraryPlace[];
}

export interface Highlight {
  id: string;
  text: string;
  itineraryId: string;
}

export interface Inclusion {
  id: string;
  text: string;
  itineraryId: string;
}

export interface Exclusion {
  id: string;
  text: string;
  itineraryId: string;
}

export interface ItineraryPlace {
  id: string;
  name: string;
  description: string;
  itineraryId: string;
  images: ItineraryPlaceImage[];
}

export interface ItineraryPlaceImage {
  id: string;
  url: string;
  caption?: string;
  placeId: string;
}
