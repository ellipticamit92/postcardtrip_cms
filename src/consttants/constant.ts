import {
  Home,
  EyeOff,
  View,
  Eye,
  Plus,
  Diff,
  SquareDivide,
} from "lucide-react";

export const SIDEBAR_URL = {
  navMain: [
    {
      title: "Destinations",
      url: "/destination",
      items: [
        {
          title: "View Destination",
          url: "/destination",
          icon: Plus,
        },
        {
          title: "Add Destination",
          url: "/destination/add",
          icon: Eye,
        },
      ],
    },
    {
      title: "Packages",
      url: "#",
      items: [
        {
          title: "View Packages",
          url: "#",
          icon: EyeOff,
        },
        {
          title: "Add Packages",
          url: "#",
          icon: Diff,
        },
      ],
    },
    {
      title: "Hotels",
      url: "#",
      items: [
        {
          title: "View Hotels",
          url: "#",
          icon: View,
        },
        {
          title: "Add Hotels",
          url: "#",
          icon: SquareDivide,
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
          icon: Home,
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
          icon: Home,
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
  { label: "United States", value: "US" },
  { label: "India", value: "IN" },
  { label: "Germany", value: "DE" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "Dubai", value: "dubai" },
  { label: "Indonesia", value: "indonesia" },
];
