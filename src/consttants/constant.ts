import {
  Eye,
  Plus,
  MapPinHouse,
  Blocks,
  Hotel,
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  Settings2,
  Building,
  SquaresIntersect,
  TriangleAlert,
  Siren,
  ScanEye,
} from "lucide-react";

export const SIDEBAR_URLS = {
  user: {
    name: "Postcardtrip Admin",
    email: "abc@a.com",
    avatar: "",
  },
  teams: [
    {
      name: "Postcardtrip CMS",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Admin ",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Users",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Destination",
      url: "/destination",
      icon: MapPinHouse,
      isActive: true,
      items: [
        {
          title: "View Destination",
          url: "/destination",
          icon: Eye,
        },
        {
          title: "Add Destination",
          url: "/destination/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Packages",
      url: "#",
      icon: Blocks,
      items: [
        {
          title: "View Packages",
          url: "/package",
          icon: Eye,
        },
        {
          title: "Add Package",
          url: "/package/add",
          icon: Plus,
        },
        {
          title: "View Package Price",
          url: "/package/hotel-price",
          icon: Eye,
        },
        {
          title: "Add Package Price",
          url: "/package/hotel-price/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Hotels",
      url: "#",
      icon: Hotel,
      items: [
        {
          title: "View Hotels",
          url: "/hotel",
          icon: Eye,
        },
        {
          title: "Add Hotel",
          url: "/hotel/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Hotel Image",
      url: "#",
      icon: ScanEye,
      items: [
        {
          title: "View Hotel Images",
          url: "/hotel-images",
          icon: Eye,
        },
        {
          title: "Add Hotel Image",
          url: "/hotel-images/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Cities",
      url: "#",
      icon: Building,
      items: [
        {
          title: "View Cities",
          url: "/city",
          icon: Eye,
        },
        {
          title: "Add City",
          url: "/city/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Itineraries",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "View Itineraries",
          url: "/itineraries",
          icon: Eye,
        },
        {
          title: "Add Itineraries",
          url: "/itineraries/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Inclusion",
      url: "#",
      icon: SquaresIntersect,
      items: [
        {
          title: "View Inclusion",
          url: "/inclusion",
          icon: Eye,
        },
        {
          title: "Add Inclusion",
          url: "/inclusion/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Exclusion",
      url: "#",
      icon: TriangleAlert,
      items: [
        {
          title: "View Exclusion",
          url: "/exclusion",
          icon: Eye,
        },
        {
          title: "Add Exclusion",
          url: "/exclusion/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Highlights",
      url: "#",
      icon: Siren,
      items: [
        {
          title: "View Highlights",
          url: "/highlight",
          icon: Eye,
        },
        {
          title: "Add Highlights",
          url: "/highlight/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
          icon: Eye,
        },
      ],
    },
  ],
};

export const PAGE_LIMIT = [
  { label: 5, value: 5 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 10, value: 10 },
  { label: 25, value: 25 },
  { label: 50, value: 50 },
  { label: 100, value: 100 },
];

export const COUNTRIES = [
  { label: "United States", value: "United States (US)" },
  { label: "India", value: "India (IN)" },
  { label: "Germany", value: "Germany (Gre)" },
  { label: "United Arab Emirates", value: "United Arab Emirates (UAE)" },
  { label: "Indonesia", value: "indonesia" },
  { label: "Canada", value: "Canada" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "France", value: "France" },
  { label: "Italy", value: "Italy" },
  { label: "Spain", value: "Spain" },
  { label: "Japan", value: "Japan" },
  { label: "Australia", value: "Australia" },
  { label: "Brazil", value: "Brazil" },
  { label: "China", value: "China" },
  { label: "Mexico", value: "Mexico" },
  { label: "Thailand", value: "Thailand" },
  { label: "Greece", value: "Greece" },
  { label: "Turkey", value: "Turkey" },
  { label: "Egypt", value: "Egypt" },
  { label: "Morocco", value: "Morocco" },
  { label: "South Africa", value: "South Africa" },
  { label: "Argentina", value: "Argentina" },
  { label: "Chile", value: "Chile" },
  { label: "Peru", value: "Peru" },
  { label: "Iceland", value: "Iceland" },
  { label: "Norway", value: "Norway" },
  { label: "Sweden", value: "Sweden" },
  { label: "Denmark", value: "Denmark" },
  { label: "Netherlands", value: "Netherlands" },
  { label: "Switzerland", value: "Switzerland" },
  { label: "Austria", value: "Austria" },
];
