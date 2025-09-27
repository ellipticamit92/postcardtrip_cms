import {
  Eye,
  Plus,
  Hotel,
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  Building,
  SquaresIntersect,
  TriangleAlert,
  Siren,
  ScanEye,
  Home,
  MapPinHouseIcon,
  Package,
  PencilIcon,
  Compass,
  List,
  MapPin,
  Route,
  MessageSquareText,
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
      plan: "Manage your travel content",
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
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Destination",
      url: "/destination",
      icon: MapPinHouseIcon,
    },
    {
      title: "Packages",
      url: "/package",
      icon: Package,
    },
    {
      title: "Tours",
      url: "/tour",
      icon: Compass,
    },

    {
      title: "Cities",
      url: "/city",
      icon: Building,
    },
    {
      title: "Highlights",
      url: "/highlight",
      icon: Siren,
    },
    {
      title: "Inclusions",
      url: "/inclusion",
      icon: SquaresIntersect,
    },
    {
      title: "Exclusions",
      url: "/exclusion",
      icon: TriangleAlert,
    },
    {
      title: "Hotel",
      url: "/hotel",
      icon: Hotel,
    },
    {
      title: "Itineraries",
      url: "/itineraries",
      icon: BookOpen,
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: PencilIcon,
    },
    {
      title: "Inquiry",
      url: "/inquiry",
      icon: MessageSquareText,
    },
    // {
    //   title: "Destination",
    //   url: "/destination",
    //   icon: MapPinHouse,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Card Format",
    //       url: "/destination",
    //       icon: Eye,
    //     },
    //     {
    //       title: "Table Format",
    //       url: "/destination/table",
    //       icon: EyeOff,
    //     },
    //     {
    //       title: "Add Destination",
    //       url: "/destination/add",
    //       icon: Plus,
    //     },
    //   ],
    // },
    // {
    //   title: "Package",
    //   url: "#",
    //   icon: Blocks,
    //   items: [
    //     {
    //       title: "View Package",
    //       url: "/package",
    //       icon: Eye,
    //     },
    //     {
    //       title: "Add Package",
    //       url: "/package/add",
    //       icon: Plus,
    //     },
    //   ],
    // },
    // {
    //   title: "Tour",
    //   url: "#",
    //   icon: Building,
    //   items: [
    //     {
    //       title: "View Tours",
    //       url: "/tour",
    //       icon: Eye,
    //     },
    //     {
    //       title: "Add Tour",
    //       url: "/tour/add",
    //       icon: Plus,
    //     },
    //   ],
    // },
    // {
    //   title: "Hotel",
    //   url: "#",
    //   icon: Hotel,
    //   items: [
    //     {
    //       title: "View Hotel",
    //       url: "/hotel",
    //       icon: Eye,
    //     },
    //     {
    //       title: "Add Hotel",
    //       url: "/hotel/add",
    //       icon: Plus,
    //     },
    //   ],
    // },
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
    // {
    //   title: "Cities",
    //   url: "#",
    //   icon: Building,
    //   items: [
    //     {
    //       title: "View Cities",
    //       url: "/city",
    //       icon: Eye,
    //     },
    //     {
    //       title: "Add City",
    //       url: "/city/add",
    //       icon: Plus,
    //     },
    //   ],
    // },
    // {
    //   title: "Itineraries",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "View Itineraries",
    //       url: "/itineraries",
    //       icon: Eye,
    //     },
    //     {
    //       title: "Add Itineraries",
    //       url: "/itineraries/add",
    //       icon: Plus,
    //     },
    //   ],
    // },
    // {
    //   title: "Inclusion",
    //   url: "#",
    //   icon: SquaresIntersect,
    //   items: [
    //     {
    //       title: "View Inclusion",
    //       url: "/inclusion",
    //       icon: Eye,
    //     },
    //     {
    //       title: "Add Inclusion",
    //       url: "/inclusion/add",
    //       icon: Plus,
    //     },
    //   ],
    // },
    // {
    //   title: "Exclusion",
    //   url: "#",
    //   icon: TriangleAlert,
    //   items: [
    //     {
    //       title: "View Exclusion",
    //       url: "/exclusion",
    //       icon: Eye,
    //     },
    //     {
    //       title: "Add Exclusion",
    //       url: "/exclusion/add",
    //       icon: Plus,
    //     },
    //   ],
    // },
    // {
    //   title: "Highlights",
    //   url: "#",
    //   icon: Siren,
    //   items: [
    //     {
    //       title: "View Highlights",
    //       url: "/highlight",
    //       icon: Eye,
    //     },
    //     {
    //       title: "Add Highlights",
    //       url: "/highlight/add",
    //       icon: Plus,
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //       icon: Eye,
    //     },
    //   ],
    // },
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

export const MONTHS = [
  { label: "January", value: "Jan" },
  { label: "February", value: "Feb" },
  { label: "March", value: "Mar" },
  { label: "April", value: "Apr" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "Aug" },
  { label: "September", value: "Sep" },
  { label: "October", value: "Oct" },
  { label: "November", value: "Nov" },
  { label: "December", value: "Dec" },
];

export const YEARS = [
  {
    label: "2020",
    value: "2020",
  },
  {
    label: "2021",
    value: "2021",
  },
  {
    label: "2022",
    value: "2022",
  },
  {
    label: "2023",
    value: "2023",
  },
  {
    label: "2024",
    value: "2024",
  },
  {
    label: "2025",
    value: "2025",
  },
];

// {
//   title: "View Package Price",
//   url: "/package/hotel-price",
//   icon: Eye,
// },
// {
//   title: "Add Package Price",
//   url: "/package/hotel-price/add",
//   icon: Plus,
// },

export const quickLinks = [
  {
    title: "Add Destination",
    description: "Create a new travel destination",
    icon: MapPin,
    section: "destinations",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100",
    hoverBg: "hover:from-blue-100 hover:to-blue-150",
    textColor: "text-blue-700",
    href: "/destination/add",
  },
  {
    title: "Add Package",
    description: "Design a new travel package",
    icon: Package,
    section: "packages",
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100",
    hoverBg: "hover:from-green-100 hover:to-green-150",
    textColor: "text-green-700",

    href: "/package/add",
  },
  {
    title: "Add Hotel",
    description: "Register a new partner hotel",
    icon: Building,
    section: "hotels",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
    hoverBg: "hover:from-purple-100 hover:to-purple-150",
    textColor: "text-purple-700",
    href: "/hotel/add",
  },
  {
    title: "Add Itinerary",
    description: "Plan a detailed travel itinerary",
    icon: Route,
    section: "itineraries",
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
    hoverBg: "hover:from-orange-100 hover:to-orange-150",
    textColor: "text-orange-700",
    href: "/itineraries/add",
  },
  {
    title: "Add Tour",
    description: "Create a new guided tour",
    icon: Compass,
    section: "tours",
    gradient: "from-teal-500 to-teal-600",
    bgGradient: "from-teal-50 to-teal-100",
    hoverBg: "hover:from-teal-100 hover:to-teal-150",
    textColor: "text-teal-700",
    href: "/tour/add",
  },
  {
    title: "Manage List",
    description: "Add inclusions & exclusions",
    icon: List,
    section: "inclusions-exclusions",
    gradient: "from-pink-500 to-pink-600",
    bgGradient: "from-pink-50 to-pink-100",
    hoverBg: "hover:from-pink-100 hover:to-pink-150",
    textColor: "text-pink-700",
    href: "/destination/add",
  },
];
