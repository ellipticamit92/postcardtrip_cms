import {
  City,
  Destination,
  Exclusion,
  Inclusion,
  Package,
  Reviews,
  Tours,
  Highlight,
  Inquiry,
  Itinerary,
} from "@prisma/client";
import { PaginationProps } from "../type";

// Extend Destination to include packages
export interface DestinationWithPackages extends Destination {
  packages?: Package[]; // optional, since it may be undefined
}

export interface ItineraryWithPackage extends Itinerary {
  package?: {
    name: string;
    destination: {
      name: string;
    };
  };
  highlights: Highlight[];
}

export interface HighlightWithDestination extends Highlight {
  destination?: Partial<Destination>;
}

export interface PackageWithDestiantion extends Package {
  destination?: Partial<Destination>;
  // itineraries?: Partial<Itinerary>[];
  // hotelPrices?: PackageHotelPrice[];
  // tours?: Partial<Tours>[];
  // imageUrl?: string | null;
  inclusions?: Partial<Inclusion>[];
  exclusions?: Partial<Exclusion>[];
  highlights?: Partial<Highlight>[];
  cities?: Partial<City>[];
}

export interface PackageGridProps {
  data: PackageWithDestiantion[];
  pagination: PaginationProps;
}

export interface PackageTableProps {
  data: PackageWithDestiantion[];
  pagination: PaginationProps;
}

export interface DestinationsProps {
  data: DestinationWithPackages[];
  pagination: PaginationProps;
}

export interface ReviewsTableProps {
  data: ReviewsWithPackageDestination[];
  pagination: PaginationProps;
}

export interface InquiryTableProps {
  data: Inquiry[];
  pagination: PaginationProps;
}

export interface ReviewsWithPackageDestination extends Reviews {
  package?: {
    pid: number;
    name: string;
  } | null;
  destination?: {
    did: number;
    name: string;
    country: string;
  } | null;
}

export interface PackageFormDataType {
  name: string;
  day: number;
  night: number;
  destinationId: number;
  imageUrl: string;
  basePrice: number;
  originalPrice: number;
  threePrice: number;
  fourPrice: number;
  fivePrice: number;
  description: string;
  popular: boolean;
  rating: number;
  overview: string;
  featured: boolean;
  heroTitle: string;
  text: string;
  tours: Tours[];
  cities: City[];
  highlights: Highlight[];
  inclusions: Inclusion[];
  exclusions: Exclusion[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
