export interface Product {
  id: string;
  name: string;
  category: 'Brownies' | 'Pastries' | 'Puddings' | 'Cakes' | 'Cookies';
  price: string;
  description: string;
  ingredients: string[];
  pairing: string;
  rating: number;
  badge?: string;
  image: string;
  prepTime: string;
  calories: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  avatar: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders' | 'Ingredients' | 'Catering' | 'Delivery';
}

export interface BakeryLocation {
  id: string;
  city: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  mapCoordinates: { lat: number; lng: number };
  image: string;
}

export interface SeasonalItem {
  id: string;
  title: string;
  season: string;
  description: string;
  flavorNotes: string[];
  availableUntil: string;
  price: string;
  image: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  duration: string;
  description: string;
  detail: string;
}

/** Extract the numeric value from a price string (e.g. "৳ 260" → 260) */
export const parsePrice = (price: string): number =>
  Number(price.replace(/[^0-9.]/g, "")) || 0;

export const SIGNATURE_PRODUCTS: Product[] = [
  {
    id: "sig-1",
    name: "Belgian Dark Chocolate Fudgy Brownie",
    category: "Brownies",
    price: "৳ 260",
    description: "Ultra-fudgy core crafted with 70% Belgian dark chocolate, finished with a paper-thin crinkled crust and a dusting of cocoa.",
    ingredients: ["Belgian 70% Dark Chocolate", "Pure Grass-Fed Butter", "Brown Sugar", "Dutch Cocoa"],
    pairing: "Chilled Vanilla Cold Brew",
    rating: 4.99,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop",
    prepTime: "Baked Fresh Daily",
    calories: "320 kcal"
  },
  {
    id: "sig-2",
    name: "Basque Burnt Caramel Cheesecake",
    category: "Cakes",
    price: "৳ 420",
    description: "Famous crustless Spanish cheesecake with a deeply caramelized, toasted top and a melt-in-your-mouth creamy center.",
    ingredients: ["Philadelphia Cream Cheese", "Fresh Organic Cream", "Madagascar Vanilla Bean", "Caramelized Sugar"],
    pairing: "Hot Dark Roast Espresso",
    rating: 4.98,
    badge: "Must Try",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1200&auto=format&fit=crop",
    prepTime: "24h Chilled Rest",
    calories: "410 kcal"
  },
  {
    id: "sig-3",
    name: "Nutella Sea Salt Fudgy Brownie",
    category: "Brownies",
    price: "৳ 290",
    description: "Dense dark chocolate fudge brownie swirled with thick hazelnut Nutella spread and sprinkled with Maldon sea salt flakes.",
    ingredients: ["Nutella Hazelnut Spread", "Belgian Dark Cacao", "Maldon Sea Salt Flakes"],
    pairing: "Warm Whole Milk",
    rating: 4.97,
    badge: "Chef Special",
    image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?q=80&w=1200&auto=format&fit=crop",
    prepTime: "Fresh Batch Daily",
    calories: "380 kcal"
  },
  {
    id: "sig-4",
    name: "Classic Silk Caramel Custard Pudding",
    category: "Puddings",
    price: "৳ 220",
    description: "Silky smooth, melt-in-your-mouth custard pudding drenched in a rich golden amber caramel sauce.",
    ingredients: ["Farm Fresh Yolks", "Whole Condensed Milk", "Amber Caramel", "Vanilla Bean"],
    pairing: "Chilled Iced Latte",
    rating: 4.95,
    badge: "Customer Favorite",
    image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?q=80&w=1200&auto=format&fit=crop",
    prepTime: "Steamed & Chilled",
    calories: "240 kcal"
  }
];

export const ALL_PRODUCTS: Product[] = [
  ...SIGNATURE_PRODUCTS,
  {
    id: "prod-5",
    name: "NYC Chunky Double Choco Chip Cookie",
    category: "Cookies",
    price: "৳ 190",
    description: "Giant thick New York style cookie loaded with semi-sweet chocolate chunks and milk chocolate chips with a gooey center.",
    ingredients: ["Valrhona Chocolate Chunks", "Brown Butter", "Sea Salt", "Pastry Flour"],
    pairing: "Cold Milk",
    rating: 4.96,
    badge: "NYC Classic",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop",
    prepTime: "Baked Fresh Daily",
    calories: "290 kcal"
  },
  {
    id: "prod-6",
    name: "Valrhona Dark Chocolate Ganache Cake Slice",
    category: "Cakes",
    price: "৳ 450",
    description: "Moist dark chocolate sponge cake layered with silky 64% Valrhona dark chocolate ganache and chocolate curls.",
    ingredients: ["Valrhona 64% Cacao", "Rich Espresso Powder", "Heavy Cream", "Dutch Cocoa"],
    pairing: "Hot Americano",
    rating: 4.97,
    badge: "Chocolate Lovers",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
    prepTime: "Hand Crafted Daily",
    calories: "450 kcal"
  },
  {
    id: "prod-7",
    name: "Fresh Berry Almond Cream Tartlet",
    category: "Pastries",
    price: "৳ 380",
    description: "Crisp buttery sable crust filled with smooth almond frangipane cream and topped with fresh sun-ripened berries.",
    ingredients: ["Fresh Raspberries & Strawberries", "Almond Sable Crust", "Pastry Cream"],
    pairing: "Earl Grey Tea",
    rating: 4.93,
    badge: "Fresh Fruit",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1200&auto=format&fit=crop",
    prepTime: "Fresh Daily",
    calories: "310 kcal"
  },
  {
    id: "prod-8",
    name: "Lotus Biscoff Fudge Brownie",
    category: "Brownies",
    price: "৳ 300",
    description: "Rich fudgy brownie topped with melted Lotus Biscoff speculoos spread and crunchy caramelized Biscoff biscuit crumble.",
    ingredients: ["Lotus Biscoff Spread & Biscuits", "Dark Cocoa", "Grass-Fed Butter"],
    pairing: "Cappuccino",
    rating: 4.94,
    badge: "Biscoff Craze",
    image: "https://images.unsplash.com/photo-1589218436045-ee320057f443?q=80&w=1200&auto=format&fit=crop",
    prepTime: "Fresh Batch",
    calories: "360 kcal"
  },
  {
    id: "prod-9",
    name: "Red Velvet Stuffed Cream Cheese Cookie",
    category: "Cookies",
    price: "৳ 220",
    description: "Soft cocoa red velvet cookie filled with a sweet vanilla cream cheese center that melts when warmed.",
    ingredients: ["Cream Cheese Filling", "Dutch Cocoa", "Pure Vanilla Bean"],
    pairing: "Hot Chocolate",
    rating: 4.92,
    badge: "Stuffed Core",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop",
    prepTime: "Baked Fresh Daily",
    calories: "330 kcal"
  },
  {
    id: "prod-10",
    name: "Dark Chocolate Silk Mousse Jar",
    category: "Puddings",
    price: "৳ 290",
    description: "Light-as-air yet intensely rich dark chocolate silk mousse served in a glass jar with whipped cream & dark chocolate shavings.",
    ingredients: ["70% Dark Chocolate", "Heavy Whipping Cream", "Cocoa Nibs"],
    pairing: "Cold Brew Coffee",
    rating: 4.95,
    badge: "Silk Dessert",
    image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1200&auto=format&fit=crop",
    prepTime: "Chilled Daily",
    calories: "280 kcal"
  }
];

export const ARTISAN_PROCESS: ProcessStep[] = [
  {
    step: "01",
    title: "Sourcing Premium Cocoa & Butter",
    duration: "Step 1 • Quality First",
    description: "We use only pure Belgian & Valrhona dark chocolate, real grass-fed butter, and organic Tahitian vanilla beans. Zero artificial flavors.",
    detail: "High-grade cacao butter creates that authentic silky texture in every brownie and cake."
  },
  {
    step: "02",
    title: "Slow Mixing & Temperature Control",
    duration: "Step 2 • Handcrafted Precision",
    description: "Our batters and doughs are mixed slowly by hand in small batches to preserve moistness, softness, and rich fudgy density.",
    detail: "Precise temperature baking ensures a shiny crinkle crust on brownies and soft gooey cores in cookies."
  },
  {
    step: "03",
    title: "Fresh Daily Oven Batches",
    duration: "Step 3 • Baked Every Morning",
    description: "No frozen stock or preservatives. Every brownie, cake slice, and pudding is prepared fresh every single morning for maximum freshness.",
    detail: "Warm baking scents fill our kitchen before dawn."
  },
  {
    step: "04",
    title: "Hygienic Eco-Packaging",
    duration: "Step 4 • Safe Fast Delivery",
    description: "Sealed in food-grade eco-friendly luxury box packaging to preserve heat, freshness, and crust texture straight to your home.",
    detail: "Delivered in temperature-controlled boxes across the city."
  }
];

export const SEASONAL_COLLECTION: SeasonalItem[] = [
  {
    id: "seas-1",
    title: "Strawberry Cloud Crepe Roll",
    season: "Summer Special Box",
    description: "Delicate handmade crepes rolled with fluffy vanilla bean mascarpone cream and fresh sun-ripened strawberries.",
    flavorNotes: ["Fresh Strawberry", "Vanilla Bean", "Sweet Cream"],
    availableUntil: "Limited Quantities Daily",
    price: "৳ 480",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "seas-2",
    title: "Triple Chocolate Brookie Slab",
    season: "Weekend Special",
    description: "The ultimate hybrid dessert — fudgy dark chocolate brownie baked directly over a thick chocolate chip cookie base.",
    flavorNotes: ["Fudgy Brownie", "Chewy Cookie", "Maldon Sea Salt"],
    availableUntil: "Every Weekend Batch",
    price: "৳ 350",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote: "The Belgian Fudgy Brownie from La Miette Bakes is hands down the best brownie I have ever tasted in Dhaka! The crinkled top and gooey chocolate core are unreal.",
    author: "Amina Rahman",
    role: "Food Critic & Blogger",
    location: "Gulshan, Dhaka",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "t2",
    quote: "Ordered the Basque Burnt Cheesecake for a family birthday. It melted in our mouth like butter. Super fast and clean packaging!",
    author: "Zayan Chowdhury",
    role: "Regular Customer",
    location: "Banani, Dhaka",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "t3",
    quote: "Their Nutella Sea Salt Brownie and Caramel Pudding are addiction status. Delivery was super fresh and prompt.",
    author: "Nusrat Jahan",
    role: "Dessert Enthusiast",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I place an online order for delivery?",
    answer: "Simply select your favorite brownies, cakes, or cookies from our menu, click 'Add to Basket', fill in your delivery details, and submit! You can also order directly via our Instagram / Facebook page.",
    category: "Orders"
  },
  {
    id: "faq-2",
    question: "Do you use real Belgian chocolate and pure butter?",
    answer: "Yes! 100% guaranteed. We never use compound chocolate, vegetable oil, or artificial flavorings. Only premium cocoa and real butter.",
    category: "Ingredients"
  },
  {
    id: "faq-3",
    question: "Can I order custom brownie boxes or cake boxes for events?",
    answer: "Absolutely! We cater custom dessert boxes for birthdays, corporate gifts, weddings, and private parties. Please place custom catering orders 48 hours in advance.",
    category: "Catering"
  },
  {
    id: "faq-4",
    question: "How long do the brownies and cookies stay fresh?",
    answer: "Our brownies and cookies stay fresh at room temperature for up to 5 days, or up to 2 weeks in an airtight container in the fridge. Warm them up for 10 seconds in a microwave for that fresh-out-of-the-oven gooiness!",
    category: "Delivery"
  }
];

export const BAKERY_LOCATIONS: BakeryLocation[] = [
  {
    id: "loc-1",
    city: "Dhaka North",
    name: "Gulshan Atelier & Boutique",
    address: "House 14, Road 53, Gulshan-2, Dhaka 1212",
    hours: "Everyday: 09:00 AM – 11:00 PM",
    phone: "+880 1711-902341",
    mapCoordinates: { lat: 23.7925, lng: 90.4078 },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "loc-2",
    city: "Dhaka South",
    name: "Dhanmondi Dessert Studio",
    address: "House 42, Road 7/A, Dhanmondi, Dhaka 1209",
    hours: "Everyday: 10:00 AM – 10:30 PM",
    phone: "+880 1844-551122",
    mapCoordinates: { lat: 23.7461, lng: 90.3742 },
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "loc-3",
    city: "Uttara Hub",
    name: "Uttara Sector-7 Express Hub",
    address: "Plot 18, Road 11, Sector-7, Uttara, Dhaka 1230",
    hours: "Everyday: 10:00 AM – 10:00 PM",
    phone: "+880 1912-334455",
    mapCoordinates: { lat: 23.8759, lng: 90.3795 },
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "loc-4",
    city: "Chattogram",
    name: "GEC Circle Pastry Lab",
    address: "Building 5, GEC Circle, Agrabad, Chattogram",
    hours: "Everyday: 10:00 AM – 10:00 PM",
    phone: "+880 1611-889900",
    mapCoordinates: { lat: 22.3569, lng: 91.8322 },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
  }
];

export const INSTAGRAM_POSTS = [
  { id: "ig-1", likes: "1,410", comments: "184", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop", caption: "That ultra fudgy Belgian chocolate crinkle crust." },
  { id: "ig-2", likes: "2,890", comments: "245", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop", caption: "Basque burnt cheesecake straight out of the fridge." },
  { id: "ig-3", likes: "1,940", comments: "112", image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?q=80&w=600&auto=format&fit=crop", caption: "Nutella swirl & Maldon sea salt flakes." },
  { id: "ig-4", likes: "3,120", comments: "310", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop", caption: "Valrhona chocolate cake slice with afternoon espresso." },
  { id: "ig-5", likes: "2,760", comments: "198", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600&auto=format&fit=crop", caption: "NYC style chunky choco chip cookies fresh out of the oven." },
  { id: "ig-6", likes: "4,300", comments: "420", image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?q=80&w=600&auto=format&fit=crop", caption: "Silky caramel custard pudding pot." }
];
