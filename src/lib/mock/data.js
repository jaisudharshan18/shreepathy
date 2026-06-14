export const categories = [
  { id: "cat-1", name: "Bakery Raw Material", slug: "bakery-raw-material", sortOrder: 1 },
  { id: "cat-2", name: "Bakery Items", slug: "bakery-items", sortOrder: 2 },
  { id: "cat-3", name: "Mojito Syrups & Crush", slug: "mojito-syrups-and-crush", sortOrder: 3 },
  { id: "cat-4", name: "Fast Food Ingredients", slug: "fast-food-ingredients", sortOrder: 4 },
  { id: "cat-5", name: "Hotel Ingredients", slug: "hotel-ingredients", sortOrder: 5 },
  { id: "cat-6", name: "Milk Products", slug: "milk-products", sortOrder: 6 },
  { id: "cat-7", name: "Ice Cream Flavours", slug: "ice-cream-flavours", sortOrder: 7 },
  { id: "cat-8", name: "Frozen Veg & Non-Veg", slug: "frozen-veg-and-non-veg", sortOrder: 8 }
];
export const brands = [
  { id: "br-1", name: "Pillsbury", slug: "pillsbury", description: "Global leader in bakery premixes and flour products." },
  { id: "br-2", name: "Rich's", slug: "richs", description: "Premium whipping creams and bakery fillings." },
  { id: "br-3", name: "IFF", slug: "iff", description: "International Flavors & Fragrances — food ingredient solutions." },
  { id: "br-4", name: "3F", slug: "3f", description: "Frozen food and fast food ingredient specialist." },
  { id: "br-5", name: "Morde", slug: "morde", description: "India's trusted chocolate compound and coating brand." },
  { id: "br-6", name: "Monin", slug: "monin", description: "French premium syrups for cocktails and mocktails." },
  { id: "br-7", name: "Mapro", slug: "mapro", description: "Indian fruit crush, syrups and preserves." },
  { id: "br-8", name: "Amul", slug: "amul", description: "India's largest dairy cooperative — butter, cheese and more." },
  { id: "br-9", name: "Milky Mist", slug: "milky-mist", description: "Fresh dairy products including paneer and curd." },
  { id: "br-10", name: "Veeba", slug: "veeba", description: "Sauces, dressings and condiments for foodservice." },
  { id: "br-11", name: "Delmonte", slug: "delmonte", description: "Canned fruits, vegetables and condiments." },
  { id: "br-12", name: "Mccian", slug: "mccian", description: "Frozen potato and snack products for QSR chains." },
  { id: "br-13", name: "Angel", slug: "angel", description: "Baking yeasts and dough conditioners." },
  { id: "br-14", name: "Skei", slug: "skei", description: "Ice cream flavour bases and mixes for parlours." },
  { id: "br-15", name: "Generic", slug: "generic", description: "Unbranded commodity ingredients sourced directly." }
];
export const products = [
  // cat-1  Bakery Raw Material
  {
    id: "prod-1",
    name: "Pillsbury Cake Premix",
    slug: "pillsbury-cake-premix",
    brandId: "br-1",
    categoryId: "cat-1",
    description: "Ready-to-use vanilla cake premix for consistent results in commercial bakeries. Just add eggs, oil and water.",
    variants: [{ size: "1 kg", price: 220 }, { size: "5 kg", price: 1050 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: true
  },
  {
    id: "prod-2",
    name: "Rich's Whip Topping Cream",
    slug: "richs-whip-topping-cream",
    brandId: "br-2",
    categoryId: "cat-1",
    description: "Rich's non-dairy whipping cream that delivers excellent volume and stability for cake decoration.",
    variants: [{ size: "500 g", price: 185 }, { size: "1 kg", price: 360 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: true
  },
  {
    id: "prod-3",
    name: "Morde Dark Chocolate Compound",
    slug: "morde-dark-chocolate-compound",
    brandId: "br-5",
    categoryId: "cat-1",
    description: "Professional dark chocolate compound ideal for moulding, coating and ganache preparation.",
    variants: [{ size: "400 g", price: 175 }, { size: "1 kg", price: 420 }, { size: "5 kg", price: 2e3 }],
    images: ["/images/placeholder.png"],
    modelGlb: "/models/sample.glb",
    stockStatus: "in_stock",
    isFeatured: true
  },
  {
    id: "prod-4",
    name: "Cocoa Powder",
    slug: "cocoa-powder",
    brandId: "br-15",
    categoryId: "cat-1",
    description: "High-fat dutch-process cocoa powder for brownies, cakes and hot chocolate mixes.",
    variants: [{ size: "1 kg", price: 380 }, { size: "5 kg", price: 1800 }],
    images: ["/images/placeholder.png"],
    stockStatus: "low",
    isFeatured: false
  },
  // cat-2  Bakery Items
  {
    id: "prod-5",
    name: "Angel Instant Yeast",
    slug: "angel-instant-yeast",
    brandId: "br-13",
    categoryId: "cat-2",
    description: "High-activity instant dry yeast for breads, buns and pizza doughs. No pre-activation needed.",
    variants: [{ size: "500 g", price: 130 }, { size: "1 kg", price: 250 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  {
    id: "prod-6",
    name: "IFF Bread Improver",
    slug: "iff-bread-improver",
    brandId: "br-3",
    categoryId: "cat-2",
    description: "Enzyme-based bread improver that enhances volume, crumb structure and shelf life of baked goods.",
    variants: [{ size: "1 kg", price: 310 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  // cat-3  Mojito Syrups & Crush
  {
    id: "prod-7",
    name: "Monin Mojito Syrup",
    slug: "monin-mojito-syrup",
    brandId: "br-6",
    categoryId: "cat-3",
    description: "Premium French mojito syrup with authentic lime and mint flavour for cocktails and mocktails.",
    variants: [{ size: "700 ml", price: 850 }, { size: "1 L", price: 1150 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: true
  },
  {
    id: "prod-8",
    name: "Mapro Crush",
    slug: "mapro-crush",
    brandId: "br-7",
    categoryId: "cat-3",
    description: "Natural fruit crush available in rose, strawberry and mango — ideal for coolers and shakes.",
    variants: [{ size: "750 ml", price: 195 }, { size: "5 L", price: 1150 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  // cat-4  Fast Food Ingredients
  {
    id: "prod-9",
    name: "Veeba Mayonnaise",
    slug: "veeba-mayonnaise",
    brandId: "br-10",
    categoryId: "cat-4",
    description: "Eggless mayonnaise with a creamy texture, perfect for burgers, wraps and sandwich bars.",
    variants: [{ size: "1 kg", price: 195 }, { size: "2 kg", price: 375 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  {
    id: "prod-10",
    name: "Delmonte Mayonnaise",
    slug: "delmonte-mayonnaise",
    brandId: "br-11",
    categoryId: "cat-4",
    description: "Del Monte's rich egg-based mayonnaise for premium quick-service restaurants and cloud kitchens.",
    variants: [{ size: "900 g", price: 210 }, { size: "3 kg", price: 595 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  // cat-5  Hotel Ingredients
  {
    id: "prod-11",
    name: "Cherry Tin",
    slug: "cherry-tin",
    brandId: "br-15",
    categoryId: "cat-5",
    description: "Glazed maraschino cherries in light syrup — a classic garnish for desserts, cocktails and sundaes.",
    variants: [{ size: "850 g", price: 320 }, { size: "2.95 kg", price: 950 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  {
    id: "prod-12",
    name: "Mapro Strawberry Crush (Hotel Pack)",
    slug: "mapro-strawberry-crush-hotel",
    brandId: "br-7",
    categoryId: "cat-5",
    description: "Large-format strawberry crush for hotel banquets and bulk beverage preparation.",
    variants: [{ size: "5 L", price: 1100 }],
    images: ["/images/placeholder.png"],
    stockStatus: "low",
    isFeatured: false
  },
  // cat-6  Milk Products
  {
    id: "prod-13",
    name: "Amul Butter",
    slug: "amul-butter",
    brandId: "br-8",
    categoryId: "cat-6",
    description: "Pasteurised table butter from Amul — the gold standard in Indian dairy, used in bakeries and kitchens.",
    variants: [{ size: "500 g", price: 245 }, { size: "1 kg", price: 480 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  {
    id: "prod-14",
    name: "Milky Mist Paneer",
    slug: "milky-mist-paneer",
    brandId: "br-9",
    categoryId: "cat-6",
    description: "Milky Mist's fresh cottage cheese in vacuum-packed blocks for restaurant and caterer use.",
    variants: [{ size: "1 kg", price: 340 }, { size: "5 kg", price: 1650 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  // cat-7  Ice Cream Flavours
  {
    id: "prod-15",
    name: "Skei Vanilla Ice Cream Base",
    slug: "skei-vanilla-ice-cream-base",
    brandId: "br-14",
    categoryId: "cat-7",
    description: "Ready-to-churn vanilla flavour base for soft-serve and hard-scoop ice cream parlours.",
    variants: [{ size: "1 kg", price: 295 }, { size: "5 kg", price: 1400 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  {
    id: "prod-16",
    name: "Skei Mango Ice Cream Base",
    slug: "skei-mango-ice-cream-base",
    brandId: "br-14",
    categoryId: "cat-7",
    description: "Alphonso mango flavour base for premium ice cream and kulfi preparation.",
    variants: [{ size: "1 kg", price: 310 }, { size: "5 kg", price: 1480 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  // cat-8  Frozen Veg & Non-Veg
  {
    id: "prod-17",
    name: "Frozen Veg Spring Roll",
    slug: "frozen-veg-spring-roll",
    brandId: "br-4",
    categoryId: "cat-8",
    description: "Pre-fried frozen vegetable spring rolls — just deep-fry or air-fry for a crispy snack or starter.",
    variants: [{ size: "1 kg", price: 285 }, { size: "2 kg", price: 560 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  },
  {
    id: "prod-18",
    name: "Mccian French Fries",
    slug: "mccian-french-fries",
    brandId: "br-12",
    categoryId: "cat-8",
    description: "Crispy straight-cut frozen french fries from Mccian — the QSR standard for consistent fry quality.",
    variants: [{ size: "1 kg", price: 175 }, { size: "2.5 kg", price: 420 }],
    images: ["/images/placeholder.png"],
    stockStatus: "in_stock",
    isFeatured: false
  }
];
export const customers = [
  {
    id: "cust-1",
    businessName: "Sweet Layers Bakery",
    contactName: "Ramesh Kumar",
    phone: "9876543210",
    email: "ramesh@sweetlayers.in",
    tier: "Gold",
    pointsBalance: 1250,
    referralCode: "SL-RK-001",
    registeredAt: "2023-06-15"
  },
  {
    id: "cust-2",
    businessName: "The Pizza Corner",
    contactName: "Priya Nair",
    phone: "9123456780",
    email: "priya@pizzacorner.in",
    tier: "Silver",
    pointsBalance: 340,
    referralCode: "TPC-PN-002",
    registeredAt: "2024-01-10"
  },
  {
    id: "cust-3",
    businessName: "Grand Taj Caterers",
    contactName: "Suresh Iyer",
    phone: "9988776655",
    email: "suresh@grandtaj.in",
    tier: "Platinum",
    pointsBalance: 4800,
    referralCode: "GTC-SI-003",
    registeredAt: "2022-11-20"
  }
];
export const orders = [
  {
    id: "ord-1",
    customerId: "cust-1",
    items: [
      { productId: "prod-1", name: "Pillsbury Cake Premix", size: "5 kg", qty: 4, unitValue: 1050 },
      { productId: "prod-2", name: "Rich's Whip Topping Cream", size: "1 kg", qty: 6, unitValue: 360 }
    ],
    totalValue: 4200 + 2160,
    status: "Delivered",
    createdAt: "2024-03-12"
  },
  {
    id: "ord-2",
    customerId: "cust-2",
    items: [
      { productId: "prod-9", name: "Veeba Mayonnaise", size: "2 kg", qty: 10, unitValue: 375 },
      { productId: "prod-18", name: "Mccian French Fries", size: "2.5 kg", qty: 5, unitValue: 420 }
    ],
    totalValue: 3750 + 2100,
    status: "Processing",
    createdAt: "2024-05-20"
  },
  {
    id: "ord-3",
    customerId: "cust-3",
    items: [
      { productId: "prod-11", name: "Cherry Tin", size: "2.95 kg", qty: 12, unitValue: 950 },
      { productId: "prod-13", name: "Amul Butter", size: "1 kg", qty: 20, unitValue: 480 },
      { productId: "prod-7", name: "Monin Mojito Syrup", size: "1 L", qty: 8, unitValue: 1150 }
    ],
    totalValue: 11400 + 9600 + 9200,
    status: "Delivered",
    createdAt: "2024-06-01"
  },
  {
    id: "ord-4",
    customerId: "cust-1",
    items: [
      { productId: "prod-3", name: "Morde Dark Chocolate Compound", size: "5 kg", qty: 3, unitValue: 2e3 }
    ],
    totalValue: 6e3,
    status: "Confirmed",
    createdAt: "2024-06-10"
  }
];
export const leads = [
  { id: "lead-1", source: "WhatsApp", status: "New", name: "Anita Sharma", phone: "9000111222", businessName: "Anita Cakes", createdAt: "2024-06-11" },
  { id: "lead-2", source: "Instagram", status: "Contacted", name: "Kiran Reddy", phone: "9500222333", businessName: "Kiran Fast Food", notes: "Interested in bulk mayo order", createdAt: "2024-06-05" },
  { id: "lead-3", source: "Walk-in", status: "Converted", name: "Deepak Mehta", phone: "9700333444", businessName: "Hotel Sunrise", notes: "Converted to Grand Taj Caterers account", createdAt: "2024-05-28" },
  { id: "lead-4", source: "Referral", status: "Lost", name: "Meera Pillai", phone: "9300444555", notes: "Price mismatch — went with competitor", createdAt: "2024-05-15" }
];
export const enquiries = [
  {
    id: "enq-1",
    name: "Rajesh Bakeries",
    phone: "9111222333",
    business: "Rajesh Bakeries",
    products: "Pillsbury Cake Premix, Morde Chocolate",
    quantity: "50 kg/month",
    location: "Bangalore",
    message: "Need monthly supply for 3 outlets",
    handled: false,
    createdAt: "2024-06-12"
  },
  {
    id: "enq-2",
    name: "Faisal Ahmed",
    phone: "9222333444",
    products: "Monin Syrups, Mapro Crush",
    quantity: "24 bottles",
    location: "Mysore",
    handled: true,
    createdAt: "2024-06-08"
  },
  {
    id: "enq-3",
    name: "Savitha Caterers",
    phone: "9333444555",
    business: "Savitha Caterers",
    products: "Amul Butter, Cherry Tin, Milky Mist Paneer",
    quantity: "Bulk",
    location: "Hubli",
    message: "Catering event on 20 June — urgent",
    handled: false,
    createdAt: "2024-06-13"
  }
];
export const faqs = [
  {
    id: "faq-1",
    question: "What is the minimum order quantity?",
    answer: "For most products the minimum order is 1 carton or 5 kg. Certain premium items like Monin syrups can be ordered single bottle. Contact us on WhatsApp for exact MOQs per SKU."
  },
  {
    id: "faq-2",
    question: "Which are you deliver to?",
    answer: "We currently deliver across Bangalore, Mysore, Mangalore, Hubli-Dharwad and surrounding districts in Tamil Nadu. Pan-India dispatch is available for orders above ₹10,000 via courier."
  },
  {
    id: "faq-3",
    question: "What are the payment terms?",
    answer: "New customers are on 100% advance payment. Established accounts with a good track record are eligible for 7–14 day credit terms. UPI, NEFT, RTGS and cheque are all accepted."
  },
  {
    id: "faq-4",
    question: "Are all listed brands always available?",
    answer: "We maintain stock of our top-selling SKUs. Seasonal or imported items may have a 3–5 day lead time. WhatsApp us for real-time availability before placing a large order."
  },
  {
    id: "faq-5",
    question: "Do you offer samples before bulk orders?",
    answer: "Yes — for orders above ₹50,000 we can provide sample units for quality evaluation. Samples are chargeable but adjusted against the final order invoice."
  }
];
