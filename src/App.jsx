import { useState, useMemo, useEffect } from "react";

// ââ DATA MODEL ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const LISTING_SCHEMA = {
  id: "number",
  name: "string",
  address: "string",
  city: "string",
  state: "string",
  stateAbbr: "string",
  zip: "string",
  phone: "string",
  website: "string",
  hours: "object",
  latitude: "number",
  longitude: "number",
  googleRating: "number",
  reviewCount: "number",
  priceRange: "string ($, $$, $$$)",
  categories: "string[]",
  services: "string[]",
  groupPackages: "boolean",
  minAge: "number",
  bringYourOwn: "boolean",
  description: "string",
  imageUrl: "string",
};

// ââ SAMPLE DATA (real businesses from research) âââââââââââââââââââââââââââââ
const LISTINGS = [
  {
    id: 1,
    name: "Smash Brothers NY",
    address: "1204 Niagara St",
    city: "Niagara Falls",
    state: "New York",
    stateAbbr: "NY",
    zip: "14303",
    phone: "(716) 299-8317",
    website: "https://www.smashbrothersny.com",
    googleRating: 4.7,
    reviewCount: 312,
    priceRange: "$$",
    categories: ["Rage Room", "Smash Room", "Date Night"],
    services: ["Solo smash", "Group sessions", "Date night packages", "Corporate events"],
    groupPackages: true,
    minAge: 12,
    bringYourOwn: true,
    description:
      "Niagara Falls' premier rage room experience. Smash Brothers NY offers solo and group sessions where you can destroy electronics, dishes, and furniture in a safe, controlled environment. Popular for date nights and team building.",
  },
  {
    id: 2,
    name: "Raze Up Smash Therapy Rooms",
    address: "308 Willis Ave",
    city: "New York",
    state: "New York",
    stateAbbr: "NY",
    zip: "10454",
    phone: "(347) 269-5255",
    website: "https://razeup.com",
    googleRating: 4.8,
    reviewCount: 487,
    priceRange: "$$$",
    categories: ["Rage Room", "Therapy", "Stress Relief"],
    services: ["Smash therapy", "Guided destruction", "VIP room", "Birthday parties"],
    groupPackages: true,
    minAge: 10,
    bringYourOwn: false,
    description:
      "Located in the Mott Haven neighborhood of the South Bronx, Raze Up has revolutionized stress relief with their innovative smash therapy concept. Their guided destruction sessions combine physical release with therapeutic elements.",
  },
  {
    id: 3,
    name: "Rage Cage Brooklyn",
    address: "123 Atlantic Ave",
    city: "Brooklyn",
    state: "New York",
    stateAbbr: "NY",
    zip: "11201",
    phone: "(347) 799-1773",
    website: "https://ragecage.nyc",
    googleRating: 4.5,
    reviewCount: 256,
    priceRange: "$$",
    categories: ["Rage Room", "Smash Room", "Entertainment"],
    services: ["Solo sessions", "Couples smash", "Group events", "Neon rage room"],
    groupPackages: true,
    minAge: 14,
    bringYourOwn: true,
    description:
      "Brooklyn's only rage room, Rage Cage offers a vibrant destruction experience with neon-lit rooms and curated playlists. Smash TVs, printers, dishes, and more in their industrial Dumbo-adjacent space.",
  },
  {
    id: 4,
    name: "Angry Cactus Lounge",
    address: "2525 N Elston Ave",
    city: "Chicago",
    state: "Illinois",
    stateAbbr: "IL",
    zip: "60647",
    phone: "(773) 799-8235",
    website: "https://www.angrycactuslounge.com",
    googleRating: 4.6,
    reviewCount: 891,
    priceRange: "$$",
    categories: ["Rage Room", "Axe Throwing", "Entertainment"],
    services: ["Rage rooms", "Axe throwing", "Craft bar", "Corporate events"],
    groupPackages: true,
    minAge: 12,
    bringYourOwn: false,
    description:
      "Chicago's multi-experience venue featuring 4 fully stocked rage rooms and 11 axe-throwing lanes, plus a craft bar with signature cocktails. Angry Cactus Lounge is a go-to for team building, date nights, and weekend stress relief on the North Side.",
  },
  {
    id: 5,
    name: "Smash RX",
    address: "11220 W Olympic Blvd",
    city: "Los Angeles",
    state: "California",
    stateAbbr: "CA",
    zip: "90064",
    phone: "(805) 864-5468",
    website: "https://smashrx.com",
    googleRating: 4.9,
    reviewCount: 623,
    priceRange: "$$$",
    categories: ["Rage Room", "Therapy", "Stress Relief"],
    services: ["Therapeutic smashing", "Couples therapy smash", "Corporate wellness", "VIP suites"],
    groupPackages: true,
    minAge: 13,
    bringYourOwn: false,
    description:
      "LA's therapy-based rage room takes a unique approach, combining licensed therapeutic techniques with controlled destruction. Smash RX is popular with stressed-out entertainment industry professionals and makes for unforgettable date nights.",
  },
  {
    id: 6,
    name: "Rage Room Philadelphia",
    address: "8043 Craig St",
    city: "Philadelphia",
    state: "Pennsylvania",
    stateAbbr: "PA",
    zip: "19136",
    phone: "(202) 816-8111",
    website: "https://rageroomphiladelphia.com",
    googleRating: 4.4,
    reviewCount: 198,
    priceRange: "$",
    categories: ["Rage Room", "Entertainment", "Budget-Friendly"],
    services: ["Basic smash", "BYO electronics", "Group sessions", "Gift certificates"],
    groupPackages: true,
    minAge: 12,
    bringYourOwn: true,
    description:
      "Philly's most affordable rage room experience. Bring your own items to smash or choose from their inventory of dishes, electronics, and furniture. Located in the Mayfair neighborhood with easy parking.",
  },
  {
    id: 7,
    name: "Letz Rage",
    address: "20 Putnam St",
    city: "Fitchburg",
    state: "Massachusetts",
    stateAbbr: "MA",
    zip: "01420",
    phone: "(978) 868-0999",
    website: "https://letzrage.com",
    googleRating: 4.7,
    reviewCount: 167,
    priceRange: "$$",
    categories: ["Rage Room", "Axe Throwing", "Paint Splatter"],
    services: ["Rage room", "Axe throwing", "Paint splatter room", "Combo packages"],
    groupPackages: true,
    minAge: 10,
    bringYourOwn: true,
    description:
      "Multi-experience venue offering rage rooms, axe throwing, and paint splatter rooms all under one roof. Letz Rage is central New England's go-to spot for stress relief and group entertainment.",
  },
  {
    id: 8,
    name: "Smash 'N Dash Rage Room",
    address: "5585 Resaca Rd",
    city: "Resaca",
    state: "Georgia",
    stateAbbr: "GA",
    zip: "30735",
    phone: "(706) 659-7940",
    website: "https://smashndashrageroom.com",
    googleRating: 4.8,
    reviewCount: 134,
    priceRange: "$",
    categories: ["Rage Room", "Smash Room", "Rural"],
    services: ["Solo smash", "Couples sessions", "Car smash experience", "Outdoor destruction"],
    groupPackages: true,
    minAge: 8,
    bringYourOwn: true,
    description:
      "North Georgia's unique rage room featuring both indoor rooms and an outdoor car smash experience. Serves guests from across North Georgia, Alabama, Tennessee, and the Carolinas. Their car smash package is a regional favorite.",
  },
  {
    id: 9,
    name: "The Mad Smash",
    address: "250 Mill St",
    city: "Taylors",
    state: "South Carolina",
    stateAbbr: "SC",
    zip: "29687",
    phone: "(864) 569-5810",
    website: "https://themadsmash.com",
    googleRating: 4.6,
    reviewCount: 221,
    priceRange: "$$",
    categories: ["Rage Room", "Smash Room", "Event Venue"],
    services: ["Rage rooms", "Neon splatter", "Private events", "Corporate outings"],
    groupPackages: true,
    minAge: 10,
    bringYourOwn: false,
    description:
      "Located in the historic Taylors Mill complex in Greenville County, The Mad Smash offers a curated destruction experience with themed rooms and neon splatter sessions. A popular destination for Upstate South Carolina entertainment.",
  },
  {
    id: 10,
    name: "Smash-It Rage Rooms",
    address: "3100 Washington Blvd",
    city: "Ogden",
    state: "Utah",
    stateAbbr: "UT",
    zip: "84401",
    phone: "(385) 494-5600",
    website: "https://smash-itragerooms.com",
    googleRating: 4.5,
    reviewCount: 289,
    priceRange: "$$",
    categories: ["Rage Room", "Smash Room", "Family-Friendly"],
    services: ["Rage room", "Couples date night", "Kids sessions", "Birthday parties"],
    groupPackages: true,
    minAge: 8,
    bringYourOwn: true,
    description:
      "Utah's original rage room chain with locations in Ogden, Salt Lake City, and Orem. Known for their family-friendly approach with sessions available for kids 8+. Perfect for birthday parties and family outings in the Wasatch Front.",
  },
  {
    id: 11,
    name: "Break Life Houston",
    address: "5805 Centralcrest St",
    city: "Houston",
    state: "Texas",
    stateAbbr: "TX",
    zip: "77092",
    phone: "(800) 823-0453",
    website: "https://breaklifehouston.com",
    googleRating: 4.5,
    reviewCount: 1024,
    priceRange: "$$",
    categories: ["Rage Room", "Smash Room", "Paint Therapy"],
    services: ["Rage sessions", "Paint therapy", "Car smash", "Combo experiences"],
    groupPackages: true,
    minAge: 8,
    bringYourOwn: false,
    description:
      "Home to the world's largest indoor rage room, Break Life Houston offers rage sessions, paint therapy, and combo experiences for all ages. With over 1,000 Google reviews, it's Houston's top-rated destruction venue.",
  },
  {
    id: 12,
    name: "Smash N Bash",
    address: "5177 River Oaks Blvd Suite B",
    city: "Fort Worth",
    state: "Texas",
    stateAbbr: "TX",
    zip: "76114",
    phone: "(682) 239-4499",
    website: "https://smashnbash.com",
    googleRating: 4.4,
    reviewCount: 543,
    priceRange: "$$",
    categories: ["Rage Room", "Smash Room", "Stress Relief"],
    services: ["Rage room sessions", "Group smash", "Date night packages", "Parties"],
    groupPackages: true,
    minAge: 12,
    bringYourOwn: false,
    description:
      "The oldest rage room in the Dallas-Fort Worth metroplex, Smash N Bash has been helping Texans blow off steam since its founding. Located in the River Oaks area just west of downtown Fort Worth, with sessions available Wednesday through Sunday.",
  },
  {
    id: 13,
    name: "Rage Ground",
    address: "530 Molino St",
    city: "Los Angeles",
    state: "California",
    stateAbbr: "CA",
    zip: "90013",
    phone: "(213) 801-3993",
    website: "https://rageground.com",
    googleRating: 4.7,
    reviewCount: 412,
    priceRange: "$$$",
    categories: ["Rage Room", "Smash Room", "Date Night"],
    services: ["Destruction room", "Arcade smash", "Neon room", "Photo packages"],
    groupPackages: true,
    minAge: 12,
    bringYourOwn: false,
    description:
      "Downtown LA's Instagram-worthy rage room experience. Rage Ground combines destruction therapy with aesthetics â their neon rooms and professional photo packages make it the most social-media-friendly smash room in California.",
  },
  {
    id: 14,
    name: "Total Rage ATL",
    address: "3980 Austell Powder Springs Rd SW",
    city: "Powder Springs",
    state: "Georgia",
    stateAbbr: "GA",
    zip: "30127",
    phone: "(562) 285-7243",
    website: "https://totalrageatl.com",
    googleRating: 4.6,
    reviewCount: 334,
    priceRange: "$$",
    categories: ["Rage Room", "Stress Relief", "Entertainment"],
    services: ["Rage room sessions", "Group events", "Date nights", "Parties"],
    groupPackages: true,
    minAge: 12,
    bringYourOwn: false,
    description:
      "Metro Atlanta's go-to rage room facility in the Powder Springs area. Total Rage ATL offers stress-relief sessions seven days a week with extended weekend hours. A popular destination for group events, date nights, and anyone in the greater Atlanta area looking to smash away stress.",
  },
  {
    id: 15,
    name: "Smash PDX Rage Room",
    address: "9510 NE Sandy Blvd",
    city: "Portland",
    state: "Oregon",
    stateAbbr: "OR",
    zip: "97220",
    phone: "(503) 208-2001",
    website: "https://www.smashpdx.com",
    googleRating: 4.5,
    reviewCount: 198,
    priceRange: "$$",
    categories: ["Rage Room", "Car Smash", "Paint Splatter"],
    services: ["Themed rage rooms", "Car smashing", "Blacklight splatter painting", "Party room"],
    groupPackages: true,
    minAge: 10,
    bringYourOwn: true,
    description:
      "Portland's premier rage room on NE Sandy Blvd offering themed destruction rooms, outdoor car smashing, and blacklight splatter painting. Smash PDX has something for everyone, from solo stress relief to birthday parties and corporate team events.",
  },
];

// ââ UNIQUE VALUES EXTRACTED âââââââââââââââââââââââââââââââââââââââââââââââââ
const ALL_STATES = [...new Set(LISTINGS.map((l) => l.state))].sort();
const ALL_CITIES = [...new Set(LISTINGS.map((l) => `${l.city}, ${l.stateAbbr}`))].sort();
const ALL_CATEGORIES = [...new Set(LISTINGS.flatMap((l) => l.categories))].sort();

// ââ ICONS (inline SVGs) âââââââââââââââââââââââââââââââââââââââââââââââââââââ
const Icons = {
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// ââ JSON-LD SCHEMA ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function ListingSchema({ listing }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.stateAbbr,
      postalCode: listing.zip,
    },
    telephone: listing.phone,
    url: listing.website,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: listing.googleRating,
      reviewCount: listing.reviewCount,
    },
    description: listing.description,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ââ COMPONENTS ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function Header({ onNavigate, currentView }) {
  return (
    <header className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 hover:opacity-90 transition">
          <Icons.Zap />
          <span className="text-xl font-bold tracking-tight">RageRoomFinder</span>
        </button>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <button onClick={() => onNavigate("home")} className={`hover:underline underline-offset-4 ${currentView === "home" ? "underline" : ""}`}>
            Home
          </button>
          <button onClick={() => onNavigate("browse")} className={`hover:underline underline-offset-4 ${currentView === "browse" ? "underline" : ""}`}>
            Browse All
          </button>
          <button onClick={() => onNavigate("cities")} className={`hover:underline underline-offset-4 ${currentView === "cities" ? "underline" : ""}`}>
            Cities
          </button>
        </nav>
      </div>
    </header>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <Icons.Search />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search rage rooms by name, city, or state..."}
        className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-red-500 focus:outline-none text-gray-800 bg-white shadow-sm text-base"
      />
      {value && (
        <button onClick={() => onChange("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
          <Icons.X />
        </button>
      )}
    </div>
  );
}

function ListingCard({ listing, onClick }) {
  return (
    <button
      onClick={() => onClick(listing)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden text-left w-full border border-gray-100 hover:border-red-200 hover:-translate-y-1"
    >
      <div className="h-3 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{listing.name}</h3>
          <span className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
            {listing.priceRange}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <Icons.MapPin />
          <span>
            {listing.city}, {listing.stateAbbr}
          </span>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <Icons.Star />
          <span className="text-sm font-semibold text-gray-800">{listing.googleRating}</span>
          <span className="text-sm text-gray-400">({listing.reviewCount} reviews)</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{listing.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {listing.categories.slice(0, 3).map((cat) => (
            <span key={cat} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">
              {cat}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function ListingDetail({ listing, onBack }) {
  return (
    <div className="max-w-3xl mx-auto">
      <ListingSchema listing={listing} />
      <button onClick={onBack} className="flex items-center gap-1 text-red-600 hover:text-red-800 mb-4 font-medium text-sm">
        <Icons.ChevronLeft />
        Back to results
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-4 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400" />
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.name}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <Icons.MapPin />
                <span>
                  {listing.address}, {listing.city}, {listing.stateAbbr} {listing.zip}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
              <Icons.Star />
              <span className="text-xl font-bold text-gray-900">{listing.googleRating}</span>
              <span className="text-sm text-gray-500">({listing.reviewCount})</span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">{listing.description}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h2 className="font-bold text-gray-900 text-lg">Contact</h2>
              <a href={`tel:${listing.phone}`} className="flex items-center gap-2 text-red-600 hover:text-red-800">
                <Icons.Phone />
                <span>{listing.phone}</span>
              </a>
              <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-red-600 hover:text-red-800">
                <Icons.Globe />
                <span>Visit Website</span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address + " " + listing.city + " " + listing.stateAbbr)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-600 hover:text-red-800"
              >
                <Icons.MapPin />
                <span>Get Directions</span>
              </a>
            </div>

            <div className="space-y-3">
              <h2 className="font-bold text-gray-900 text-lg">Details</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium text-gray-800">Price Range:</span> {listing.priceRange}</p>
                <p><span className="font-medium text-gray-800">Min Age:</span> {listing.minAge}+</p>
                <p><span className="font-medium text-gray-800">Bring Your Own Items:</span> {listing.bringYourOwn ? "Yes" : "No"}</p>
                <p>
                  <span className="font-medium text-gray-800">Group Packages:</span>{" "}
                  {listing.groupPackages ? "Available" : "Not available"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-gray-900 text-lg mb-3">Services</h2>
            <div className="flex flex-wrap gap-2">
              {listing.services.map((s) => (
                <span key={s} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 text-lg mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {listing.categories.map((c) => (
                <span key={c} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ filters, setFilters, showFilters, setShowFilters }) {
  return (
    <div className="mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 mb-3"
      >
        <Icons.Filter />
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">State</label>
            <select
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="">All States</option>
              {ALL_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Price</label>
            <select
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="">Any Price</option>
              <option value="$">$ Budget</option>
              <option value="$$">$$ Mid-Range</option>
              <option value="$$$">$$$ Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Features</label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.byo}
                onChange={(e) => setFilters({ ...filters, byo: e.target.checked })}
                className="accent-red-500"
              />
              Bring Your Own Items
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage({ onNavigate, onSearch, searchQuery, setSearchQuery }) {
  const featuredCities = [
    { name: "New York", state: "NY", count: LISTINGS.filter((l) => l.state === "New York").length },
    { name: "Los Angeles", state: "CA", count: LISTINGS.filter((l) => l.state === "California").length },
    { name: "Chicago", state: "IL", count: LISTINGS.filter((l) => l.state === "Illinois").length },
    { name: "Atlanta", state: "GA", count: LISTINGS.filter((l) => l.state === "Georgia").length },
    { name: "Dallas", state: "TX", count: LISTINGS.filter((l) => l.state === "Texas").length },
    { name: "Philadelphia", state: "PA", count: LISTINGS.filter((l) => l.state === "Pennsylvania").length },
  ];

  const topRated = [...LISTINGS].sort((a, b) => b.googleRating - a.googleRating).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Find a Rage Room <span className="text-yellow-400">Near You</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            The most complete directory of smash rooms and rage rooms across the United States. Discover, compare, and book your stress-relief session.
          </p>
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              if (val.length > 1) onSearch(val);
            }}
            placeholder="Search by city, state, or rage room name..."
          />
          <p className="mt-4 text-sm text-gray-400">
            {LISTINGS.length} rage rooms across {ALL_STATES.length} states
          </p>
        </div>
      </section>

      {/* Featured Cities */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Cities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {featuredCities.map((city) => (
            <button
              key={city.name}
              onClick={() => {
                setSearchQuery(city.name);
                onNavigate("browse");
              }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md hover:border-red-200 transition"
            >
              <p className="font-bold text-gray-900">{city.name}</p>
              <p className="text-xs text-gray-500">{city.state}</p>
              <p className="text-xs text-red-600 font-semibold mt-1">{city.count} {city.count === 1 ? "room" : "rooms"}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Rated Rage Rooms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topRated.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onClick={(l) => onNavigate("detail", l)} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { step: "1", title: "Search", desc: "Find rage rooms in your city or browse by state" },
            { step: "2", title: "Compare", desc: "Read reviews, check prices, and compare services" },
            { step: "3", title: "Smash", desc: "Book your session and release your stress" },
          ].map((item) => (
            <div key={item.step} className="space-y-3">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                {item.step}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse All CTA */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 py-10 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to smash something?</h2>
        <button
          onClick={() => onNavigate("browse")}
          className="bg-white text-red-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg"
        >
          Browse All {LISTINGS.length} Rage Rooms
        </button>
      </section>
    </div>
  );
}

function BrowsePage({ onNavigate, searchQuery, setSearchQuery }) {
  const [filters, setFilters] = useState({ state: "", category: "", price: "", byo: false });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  const results = useMemo(() => {
    let filtered = LISTINGS.filter((l) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.stateAbbr.toLowerCase().includes(q) ||
        l.categories.some((c) => c.toLowerCase().includes(q));
      const matchesState = !filters.state || l.state === filters.state;
      const matchesCategory = !filters.category || l.categories.includes(filters.category);
      const matchesPrice = !filters.price || l.priceRange === filters.price;
      const matchesByo = !filters.byo || l.bringYourOwn;
      return matchesSearch && matchesState && matchesCategory && matchesPrice && matchesByo;
    });

    if (sortBy === "rating") filtered.sort((a, b) => b.googleRating - a.googleRating);
    else if (sortBy === "reviews") filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [searchQuery, filters, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Rage Rooms</h1>
      <p className="text-gray-500 mb-6">{results.length} rage rooms found</p>

      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <FilterPanel filters={filters} setFilters={setFilters} showFilters={showFilters} setShowFilters={setShowFilters} />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
        >
          <option value="rating">Top Rated</option>
          <option value="reviews">Most Reviews</option>
          <option value="name">A-Z</option>
        </select>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No rage rooms found matching your search.</p>
          <button onClick={() => { setSearchQuery(""); setFilters({ state: "", category: "", price: "", byo: false }); }} className="text-red-600 font-medium hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onClick={(l) => onNavigate("detail", l)} />
          ))}
        </div>
      )}
    </div>
  );
}

function CitiesPage({ onNavigate, setSearchQuery }) {
  const citiesByState = {};
  LISTINGS.forEach((l) => {
    if (!citiesByState[l.state]) citiesByState[l.state] = {};
    const key = `${l.city}, ${l.stateAbbr}`;
    if (!citiesByState[l.state][key]) citiesByState[l.state][key] = 0;
    citiesByState[l.state][key]++;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Rage Rooms by City</h1>
      <p className="text-gray-500 mb-8">
        Browse {ALL_CITIES.length} cities across {ALL_STATES.length} states
      </p>

      <div className="space-y-8">
        {Object.keys(citiesByState)
          .sort()
          .map((state) => (
            <div key={state}>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">{state}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(citiesByState[state])
                  .sort()
                  .map(([city, count]) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSearchQuery(city.split(",")[0]);
                        onNavigate("browse");
                      }}
                      className="text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm group transition"
                    >
                      <span className="text-gray-800 group-hover:text-red-600 font-medium">{city}</span>
                      <span className="text-gray-400 ml-1">({count})</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-4 mt-12">
      <div className="max-w-6xl mx-auto text-center">
        <p className="font-bold text-white text-lg mb-2">RageRoomFinder</p>
        <p className="text-sm mb-4">The most complete directory of rage rooms and smash rooms in the United States.</p>
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} RageRoomFinder. All rights reserved. Listings are for informational purposes. Always call ahead to confirm availability.
        </p>
      </div>
    </footer>
  );
}

// ââ MAIN APP ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

export default function RageRoomDirectory() {
  const [view, setView] = useState("home");
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = (target, data) => {
    if (target === "detail" && data) {
      setSelectedListing(data);
      setView("detail");
    } else {
      setView(target);
      if (target === "home") setSearchQuery("");
    }
    // scroll to top
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onNavigate={navigate} currentView={view} />

      <main className="flex-1">
        {view === "home" && (
          <HomePage onNavigate={navigate} onSearch={() => navigate("browse")} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        {view === "browse" && <BrowsePage onNavigate={navigate} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {view === "cities" && <CitiesPage onNavigate={navigate} setSearchQuery={setSearchQuery} />}
        {view === "detail" && selectedListing && <ListingDetail listing={selectedListing} onBack={() => navigate("browse")} />}
      </main>

      <Footer />
    </div>
  );
}
