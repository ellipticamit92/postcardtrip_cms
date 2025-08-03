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
      ],
    },
    {
      title: "Hotels",
      url: "#",
      icon: Hotel,
      items: [
        {
          title: "View Hotels",
          url: "/package",
          icon: Eye,
        },
        {
          title: "Add Hotel",
          url: "/package/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "Hotel Image",
      url: "#",
      icon: Hotel,
      items: [
        {
          title: "View Hotel Images",
          url: "/hotel-image",
          icon: Eye,
        },
        {
          title: "Add Hotel Image",
          url: "/hotel-image/add",
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
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
          icon: Eye,
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
];
