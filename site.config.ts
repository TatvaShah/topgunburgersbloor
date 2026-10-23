import type { SiteConfig } from "@/lib/types";

// Top Gun Burgers (Bloor St West). Facts from leads/premium-2026-10-23.json: Uber Eats menu and prices,
// pinned IG hours reel (Sep 13, 2026), Google listing phone, and the business's own IG posts.
// Items marked unconfirmed in the lead are left out on purpose (other delivery apps, sister account photo).

const UBER = "https://www.ubereats.com/ca/store/top-gun-burgers-bloor-st/6wTfrfetXTKoZgqNA7CczQ";
const IG = "https://www.instagram.com/topgunburgersbloor";

export const site: SiteConfig = {
  name: "Top Gun Burgers",
  shortName: "Top Gun Bloor",
  tagline: "Fresh, never frozen burgers on Bloor Street West. Open late every day.",
  category: "Burger restaurant",
  schemaType: "Restaurant",
  area: "Toronto, ON",
  siteUrl: "https://topgunburgersbloor.vercel.app",

  theme: {
    preset: "restaurant-luxe-dark",
    colors: {
      bg: "#0b0b0b",
      surface: "#141414",
      soft: "#1c1c1c",
      line: "#2a2a2a",
      ink: "#ffffff",
      text: "#e4e4e4",
      muted: "#a3a3a3",
      accent: "#e8a317",
      accentInk: "#000000",
    },
    headingCase: "upper",
    pattern: "checker",
  },
  motion: { enabled: true, smoothScroll: true, intensity: "subtle", pin: true },
  logo: "/images/logo.png",
  showNameWithLogo: true,

  hero: {
    variant: "editorial",
    depth: true,
    eyebrow: "490 Bloor St West, Toronto",
    headline: "Fresh, never frozen.",
    subhead:
      "Burgers, steak sandwiches, chicken and homemade fries, cooked on the flat top in an open kitchen. Open until 2 AM most nights and 3 AM on Fridays and Saturdays.",
    images: [
      { src: "/images/stacked-burger.jpg", alt: "Tall stacked burger with lettuce and sauce on a black and white checkered liner", width: 720, height: 1280 },
      { src: "/images/mushroom-burger.jpg", alt: "Top Gun mushroom burger with sauteed mushrooms and melted cheddar", width: 1200, height: 1200 },
      { src: "/images/f35-burger.jpg", alt: "F-35 double burger with melted cheese", width: 1133, height: 1133 },
    ],
    primaryCta: { label: "Order on Uber Eats", href: UBER },
    secondaryCta: { label: "See the menu", href: "#menu" },
  },

  highlights: ["Fresh, never frozen", "Open late every day", "490 Bloor St West", "Open kitchen", "Order on Uber Eats"],

  about: {
    title: "Real burgers, real cooking",
    statement: "Real burgers. Real cooking. Real flavour. Made fresh, right in front of you.",
    body: [
      "Top Gun Burgers on Bloor Street West cooks fresh, never frozen beef on the flat top in an open kitchen, so you can watch your order come together at the counter.",
      "The menu runs from the Mushroom Burger and the Avenger to steak sandwiches on Italian bread, chicken strips, onion rings and homemade fries. The kitchen stays open late every day of the week.",
    ],
    image: { src: "/images/open-kitchen.jpg", alt: "Cook working the grill in the open kitchen at Top Gun Burgers on Bloor", width: 720, height: 1280 },
  },

  menu: {
    title: "The menu",
    intro: "Prices are from the Uber Eats store page and may be different at the counter. Deals marked below run on Uber Eats for a limited time.",
    variant: "list",
    layout: "stacked",
    groups: [
      {
        title: "Burgers",
        items: [
          { name: "Hellcat", price: "$13.99", tag: "BOGO, limited time" },
          {
            name: "Mushroom Burger",
            description: "Beef patty, sauteed mushrooms, Canadian cheddar, fresh onions and crisp pickles.",
            price: "$18.90",
            tag: "BOGO deal",
            href: `${IG}/p/Dd93j5jD38R/`,
          },
          { name: "Bearcat Burger", price: "$17.90" },
          { name: "Flying Zone Burger", price: "$19.90" },
          { name: "Avenger Burger", price: "$21.90" },
          { name: "Maverick Burger", price: "$21.90" },
          { name: "Invader Burger", price: "$31.90" },
          { name: "Veggie Falcon Burger", price: "$15.90" },
        ],
      },
      {
        title: "Chicken",
        items: [
          { name: "Chicken Tornado Burger", price: "$13.90" },
          { name: "Chicken Sandwich", price: "$18.90", tag: "BOGO deal" },
          { name: "Mighty Chicken", description: "4 chicken strips and large fries.", price: "$16.90" },
        ],
      },
      {
        title: "Steak sandwiches",
        items: [
          { name: "B52 Steak Sandwich", price: "$21.90" },
          {
            name: "Eagle Steak Sandwich",
            description: "Thinly sliced ribeye grilled with onions, topped with lettuce, tomato and Top Gun aioli, on daily baked Italian bread.",
            price: "$27.90",
            tag: "BOGO deal",
          },
        ],
      },
      {
        title: "Combos",
        items: [
          { name: "Hellcat Combo", price: "$18.90" },
          { name: "Wildcat Combo", price: "$21.90" },
          { name: "Avenger Combo", price: "$28.90" },
        ],
      },
      {
        title: "Fries and sides",
        items: [
          { name: "Homemade Fries", price: "$6.90" },
          { name: "Sweet Potato Fries", price: "$11.50" },
          { name: "Onion Rings", price: "$11.50" },
          { name: "Sloppy Beef Fries", price: "$14.90" },
        ],
      },
    ],
    footnote: "Menu and prices from Uber Eats, October 2026. Ask at the counter for in store prices.",
  },

  gallery: {
    title: "Straight off the flat top",
    intro: "Photos from @topgunburgersbloor.",
    layout: "strip",
    items: [
      { src: "/images/cheese-pour.jpg", alt: "Cheese sauce poured over a burger and loaded fries", caption: "The moment", href: `${IG}/reel/DdPX_VUvOE0/`, width: 720, height: 1280 },
      { src: "/images/mushrooms-griddle.jpg", alt: "Sliced mushrooms sauteing on the griddle", caption: "Mushrooms for the Mushroom Burger", href: `${IG}/p/Dd93j5jD38R/`, width: 720, height: 960 },
      { src: "/images/burger-flat-top.jpg", alt: "Cheeseburger resting on the flat top next to a sauce bottle", caption: "Fresh, never frozen", href: `${IG}/reel/DdZZNvvoJXU/`, width: 720, height: 1280 },
      { src: "/images/counter.jpg", alt: "Counter and register inside Top Gun Burgers on Bloor with framed menu art on the wall", caption: "The counter on Bloor", href: `${IG}/reel/DdPol9SOXQa/`, width: 720, height: 1280 },
      { src: "/images/f35-burger.jpg", alt: "F-35 double burger with melted cheese", caption: "F-35", href: `${IG}/p/DboE0wwOZkA/`, width: 1133, height: 1133 },
      { src: "/images/stacked-burger.jpg", alt: "Stacked burger on a checkered liner", caption: "Open late, every day", href: `${IG}/reel/Dc1XnP8IGZ_/`, width: 720, height: 1280 },
    ],
  },

  instagram: { handle: "topgunburgersbloor" },

  order: {
    title: "Order your way",
    intro: "Order on Uber Eats for delivery or pickup, call the shop, or walk up to the counter at 490 Bloor St West.",
    preferLinks: true,
    headerCtaLabel: "Order now",
    steps: [
      "Tap Order on Uber Eats for delivery or pickup.",
      "Or call the shop at (647) 344-4480.",
      "Questions? Copy the starter message and send it as a DM on Instagram.",
    ],
    dmMessage: "Hi Top Gun Burgers! I have a question about an order.\nPickup or delivery:\nTime:\nOrder:",
    links: [
      { label: "Order on Uber Eats", href: UBER },
      { label: "Call (647) 344-4480", href: "tel:+16473444480" },
    ],
  },

  reviews: { items: [] },

  faq: [
    { q: "How late are you open?", a: "Monday to Thursday 11:30 AM to 2 AM, Friday 11:30 AM to 3 AM, Saturday 5 PM to 3 AM and Sunday 5 PM to 2 AM." },
    { q: "Do you deliver?", a: "Yes, through Uber Eats. You can also order there for pickup." },
    { q: "Are the prices the same in store?", a: "The prices on this page come from Uber Eats and may be different at the counter." },
    { q: "Is there a vegetarian burger?", a: "Yes, the Veggie Falcon Burger is on the menu." },
  ],

  contact: {
    title: "Find us",
    area: "Bloor St West, Toronto",
    address: "490 Bloor Street West, Toronto, ON M5S 1X8",
    phone: "(647) 344-4480",
    hours: [
      { days: "Monday to Thursday", time: "11:30 AM to 2 AM" },
      { days: "Friday", time: "11:30 AM to 3 AM" },
      { days: "Saturday", time: "5 PM to 3 AM" },
      { days: "Sunday", time: "5 PM to 2 AM" },
    ],
  },

  seo: {
    title: "Top Gun Burgers Bloor | Fresh burgers on Bloor St West, Toronto",
    description:
      "Fresh, never frozen burgers, steak sandwiches, chicken and homemade fries at 490 Bloor St West, Toronto. Open late every day. Order on Uber Eats.",
    keywords: ["burgers Bloor Street West", "late night burgers Toronto", "Top Gun Burgers Bloor", "burgers Annex Toronto", "Koreatown burgers"],
    ogPhoto: "/images/stacked-burger.jpg",
  },
};
