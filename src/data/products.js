// src/data/products.js

export const initialProducts = [
  // ==================== ABSU, UTURU (1-10) ====================
  {
    id: 1,
    productTitle: "Vintage Leather Jacket",
    shopName: "ThriftByFaith",
    price: "₦11,500",
    category: "Fashion",
    campus: "Absu, Uturu",
    condition: "Like New",
    description: "Premium grade-A vintage leather jacket. Perfect condition with zero tears or blemishes. Soft inner lining.",
    whatsappNumber: "2348012345678",
    availableSizes: ["M", "L", "XL"],
    variants: ["Onyx Black", "Tan Brown"],
    images: [
      { id: "v1-img1", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", variantName: "Onyx Black", isCover: true },
      { id: "v1-img2", imageUrl: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5ded1?w=500&q=80", variantName: "Onyx Black", isCover: false },
      { id: "v1-img3", imageUrl: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80", variantName: "Tan Brown", isCover: false },
      { id: "v1-img4", imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80", variantName: "Tan Brown", isCover: false }
    ],
    colorVariants: [
      { colorName: "Onyx Black", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", isMain: true },
      { colorName: "Tan Brown", imageUrl: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 2,
    productTitle: "Crunchy Double Cheeseburger",
    shopName: "ChuksCampusEats",
    price: "₦4,500",
    category: "Food & Snacks",
    campus: "Absu, Uturu",
    condition: "",
    description: "Juicy double beef patty with melted cheddar cheese, gourmet sauce, and side fries.",
    whatsappNumber: "2347012345678",
    availableSizes: ["Regular", "Large"],
    variants: ["Grilled Beef", "Crispy Chicken"],
    images: [
      { id: "v2-img1", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", variantName: "Grilled Beef", isCover: true },
      { id: "v2-img2", imageUrl: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=500&q=80", variantName: "Crispy Chicken", isCover: false }
    ],
    colorVariants: [
      { colorName: "Grilled Beef", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", isMain: true },
      { colorName: "Crispy Chicken", imageUrl: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 3,
    productTitle: "Heavy Utility Cotton Joggers",
    shopName: "StreetDrip_Absu",
    price: "₦8,500",
    category: "Fashion",
    campus: "Absu, Uturu",
    condition: "Like New",
    description: "Heavyweight utility cotton cargo pants with 6 reinforced tactical pockets. Adjustable waist bands.",
    whatsappNumber: "2348165432109",
    availableSizes: ["30", "32", "34", "36"],
    variants: ["Desert Camo", "Stealth Gray"],
    images: [
      { id: "v3-img1", imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80", variantName: "Desert Camo", isCover: true },
      { id: "v3-img2", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80", variantName: "Stealth Gray", isCover: false }
    ],
    colorVariants: [
      { colorName: "Desert Camo", imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80", isMain: true },
      { colorName: "Stealth Gray", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 4,
    productTitle: "Fresh Chicken Shawarma",
    shopName: "ChuksCampusEats",
    price: "₦2,500",
    category: "Food & Snacks",
    campus: "Absu, Uturu",
    condition: "",
    description: "Spicy double-sausage shredded chicken shawarma wrap with delicious garlic mayo dressing.",
    whatsappNumber: "2347012345678",
    availableSizes: ["Single", "Double Sausage"],
    variants: ["Creamy Garlic", "Sweet Chili Spiced"],
    images: [
      { id: "v4-img1", imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=500&q=80", variantName: "Creamy Garlic", isCover: true },
      { id: "v4-img2", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80", variantName: "Sweet Chili Spiced", isCover: false }
    ],
    colorVariants: [
      { colorName: "Creamy Garlic", imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=500&q=80", isMain: true },
      { colorName: "Sweet Chili Spiced", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 5,
    productTitle: "Baggy Leg Light Denim Jeans",
    shopName: "ThriftByFaith",
    price: "₦14,500",
    category: "Fashion",
    campus: "Absu, Uturu",
    condition: "Like New",
    description: "Classic relaxed fit streetwear baggy denim jeans with premium light-wash faded texture.",
    whatsappNumber: "2348012345678",
    availableSizes: ["30", "32", "34"],
    variants: ["Light Blue", "Acid Indigo"],
    images: [
      { id: "v5-img1", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80", variantName: "Light Blue", isCover: true },
      { id: "v5-img2", imageUrl: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&q=80", variantName: "Acid Indigo", isCover: false }
    ],
    colorVariants: [
      { colorName: "Light Blue", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80", isMain: true },
      { colorName: "Acid Indigo", imageUrl: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 6,
    productTitle: "Oversized Knit Sweater",
    shopName: "StreetDrip_Absu",
    price: "₦9,000",
    category: "Fashion",
    campus: "Absu, Uturu",
    condition: "Like New",
    description: "Heavy knitted drop-shoulder sweater, perfect aesthetic winter piece for cozy hostel wear.",
    whatsappNumber: "2348165432109",
    availableSizes: ["L", "XL"],
    variants: ["Cream White", "Olive Forest"],
    images: [
      { id: "v6-img1", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", variantName: "Cream White", isCover: true },
      { id: "v6-img2", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80", variantName: "Olive Forest", isCover: false }
    ],
    colorVariants: [
      { colorName: "Cream White", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", isMain: true },
      { colorName: "Olive Forest", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 7,
    productTitle: "Oraimo 20000mAh Powerbank",
    shopName: "GadgetVault",
    price: "₦16,500",
    category: "Gadgets",
    campus: "Absu, Uturu",
    condition: "Brand New",
    description: "High-speed 22.5W fast charging output cell block with dual integrated type-C connection lines.",
    whatsappNumber: "2347065432101",
    availableSizes: ["One Size"],
    variants: ["Matte Black", "Ice White"],
    images: [
      { id: "v7-img1", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", variantName: "Matte Black", isCover: true },
      { id: "v7-img2", imageUrl: "https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?w=500&q=80", variantName: "Ice White", isCover: false }
    ],
    colorVariants: [
      { colorName: "Matte Black", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", isMain: true },
      { colorName: "Ice White", imageUrl: "https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 8,
    productTitle: "Warm Homemade Meat Pies",
    shopName: "HostelBites_Absu",
    price: "₦1,200",
    category: "Food & Snacks",
    campus: "Absu, Uturu",
    condition: "",
    description: "Flaky, buttery pastry shells filled to the brim with seasoned minced beef and diced veggies.",
    whatsappNumber: "2348145678901",
    availableSizes: ["Single Pie", "Box of 4"],
    variants: ["Classic Beef", "Peppered Chicken"],
    images: [
      { id: "v8-img1", imageUrl: "https://images.unsplash.com/photo-1628102405814-8d440014a682?w=500&q=80", variantName: "Classic Beef", isCover: true },
      { id: "v8-img2", imageUrl: "https://images.unsplash.com/photo-1601561911634-11910609b736?w=500&q=80", variantName: "Peppered Chicken", isCover: false }
    ],
    colorVariants: [
      { colorName: "Classic Beef", imageUrl: "https://images.unsplash.com/photo-1628102405814-8d440014a682?w=500&q=80", isMain: true },
      { colorName: "Peppered Chicken", imageUrl: "https://images.unsplash.com/photo-1601561911634-11910609b736?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 9,
    productTitle: "Aesthetic Room Desk Lamp",
    shopName: "HomeHub_Store",
    price: "₦6,000",
    category: "Home & Kitchen",
    campus: "Absu, Uturu",
    condition: "Brand New",
    description: "Flexible folding bright white night assignment bulb tool with 3 warm-to-cool toggle level controls.",
    whatsappNumber: "2348112233445",
    availableSizes: ["Standard"],
    variants: ["Minimal White", "Midnight Grey"],
    images: [
      { id: "v9-img1", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80", variantName: "Minimal White", isCover: true },
      { id: "v9-img2", imageUrl: "https://images.unsplash.com/photo-1531492746076-161ac9bcad58?w=500&q=80", variantName: "Midnight Grey", isCover: false }
    ],
    colorVariants: [
      { colorName: "Minimal White", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80", isMain: true },
      { colorName: "Midnight Grey", imageUrl: "https://images.unsplash.com/photo-1531492746076-161ac9bcad58?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 10,
    productTitle: "Aesthetic Study Planner Log",
    shopName: "BookHaven_Absu",
    price: "₦3,500",
    category: "Other",
    campus: "Absu, Uturu",
    condition: "Brand New",
    description: "Hardcover undated daily assignment schedule pad planner. Boost productivity in lectures.",
    whatsappNumber: "2349088776655",
    availableSizes: ["A5 Size"],
    variants: ["Pastel Green", "Blush Pink"],
    images: [
      { id: "v10-img1", imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80", variantName: "Pastel Green", isCover: true },
      { id: "v10-img2", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80", variantName: "Blush Pink", isCover: false }
    ],
    colorVariants: [
      { colorName: "Pastel Green", imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80", isMain: true },
      { colorName: "Blush Pink", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80", isMain: false }
    ]
  },

  // ==================== IMSU, OWERRI (11-20) ====================
  {
    id: 11,
    productTitle: "Silver Cuban Link Chain",
    shopName: "IceByElvis",
    price: "₦6,000",
    category: "Accessories",
    campus: "Imsu, Owerri",
    condition: "Brand New",
    description: "Solid stainless steel Cuban link chain neckpiece. Sweatproof, non-tarnish design.",
    whatsappNumber: "2347055554444",
    availableSizes: ["18 inch", "20 inch", "22 inch"],
    variants: ["Pristine Silver", "Luxurious Gold"],
    images: [
      { id: "v11-img1", imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80", variantName: "Pristine Silver", isCover: true },
      { id: "v11-img2", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", variantName: "Luxurious Gold", isCover: false }
    ],
    colorVariants: [
      { colorName: "Pristine Silver", imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80", isMain: true },
      { colorName: "Luxurious Gold", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 12,
    productTitle: "Puma RS-X3 Sneakers",
    shopName: "KicksPlug_Imsu",
    price: "₦16,500",
    category: "Footwears",
    campus: "Imsu, Owerri",
    condition: "Like New",
    description: "Sporty, cushion-padded athletic performance footwear blocks. Perfect layout comfort tracking.",
    whatsappNumber: "2348123456789",
    availableSizes: ["41", "42", "43", "44"],
    variants: ["Onyx Black", "Classic White"],
    images: [
      { id: "v12-img1", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", variantName: "Onyx Black", isCover: true },
      { id: "v12-img2", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", variantName: "Classic White", isCover: false }
    ],
    colorVariants: [
      { colorName: "Onyx Black", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: true },
      { colorName: "Classic White", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 13,
    productTitle: "Stainless Steel Rings Pack",
    shopName: "IceByElvis",
    price: "₦2,500",
    category: "Accessories",
    campus: "Imsu, Owerri",
    condition: "Brand New",
    description: "Set of 3 anti-rust minimalist geometric rings. Perfect styling statement pieces for modern campus fits.",
    whatsappNumber: "2347055554444",
    availableSizes: ["8", "9", "10"],
    variants: ["Polished Silver", "Space Grey Metallic"],
    images: [
      { id: "v13-img1", imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80", variantName: "Polished Silver", isCover: true },
      { id: "v13-img2", imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&q=80", variantName: "Space Grey Metallic", isCover: false }
    ],
    colorVariants: [
      { colorName: "Polished Silver", imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80", isMain: true },
      { colorName: "Space Grey Metallic", imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 14,
    productTitle: "Yeezy Foam Runner Bone",
    shopName: "SneakerVault_Imsu",
    price: "₦15,500",
    category: "Footwears",
    campus: "Imsu, Owerri",
    condition: "Brand New",
    description: "Molded EVA foam comfort slippers. Light, flexible silhouette layout ideal for lounge slides.",
    whatsappNumber: "2349077665544",
    availableSizes: ["42", "44"],
    variants: ["Desert Sand", "Carbon Slate"],
    images: [
      { id: "v14-img1", imageUrl: "https://images.unsplash.com/photo-1619521440807-ba72bf64bb70?w=500&q=80", variantName: "Desert Sand", isCover: true },
      { id: "v14-img2", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", variantName: "Carbon Slate", isCover: false }
    ],
    colorVariants: [
      { colorName: "Desert Sand", imageUrl: "https://images.unsplash.com/photo-1619521440807-ba72bf64bb70?w=500&q=80", isMain: true },
      { colorName: "Carbon Slate", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 15,
    productTitle: "Gold Plated Ring Chain Combo",
    shopName: "IceByElvis",
    price: "₦6,500",
    category: "Accessories",
    campus: "Imsu, Owerri",
    condition: "Brand New",
    description: "Elegant minimal neck accessory, 18k gold double-vacuum plating over stainless jewelry base line.",
    whatsappNumber: "2347055554444",
    availableSizes: ["20 inch"],
    variants: ["Polished Gold", "Vibrant Rose Gold"],
    images: [
      { id: "v15-img1", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", variantName: "Polished Gold", isCover: true },
      { id: "v15-img2", imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80", variantName: "Vibrant Rose Gold", isCover: false }
    ],
    colorVariants: [
      { colorName: "Polished Gold", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", isMain: true },
      { colorName: "Vibrant Rose Gold", imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 16,
    productTitle: "Full Size Acoustic Guitar V2",
    shopName: "Strings Plug",
    price: "₦42,000",
    category: "Other",
    campus: "Imsu, Owerri",
    condition: "Like New",
    description: "Polished natural wood body classical folk guitar. High tension steel string setup, clear resonance chords.",
    whatsappNumber: "2348011229988",
    availableSizes: ["41 Inch"],
    variants: ["Natural Spruce", "Solid Ebony Black"],
    images: [
      { id: "v16-img1", imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80", variantName: "Natural Spruce", isCover: true },
      { id: "v16-img2", imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80", variantName: "Solid Ebony Black", isCover: false }
    ],
    colorVariants: [
      { colorName: "Natural Spruce", imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80", isMain: true },
      { colorName: "Solid Ebony Black", imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 17,
    productTitle: "Unisex Oversized Graphic Tee",
    shopName: "DripStore_Imsu",
    price: "₦6,000",
    category: "Fashion",
    campus: "Imsu, Owerri",
    condition: "Brand New",
    description: "Heavy cotton dropshoulder graphic shirt featuring aesthetic retro typography print designs.",
    whatsappNumber: "2349022114433",
    availableSizes: ["M", "L", "XL"],
    variants: ["Vintage Black", "Desert Sand Warm"],
    images: [
      { id: "v17-img1", imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80", variantName: "Vintage Black", isCover: true },
      { id: "v17-img2", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", variantName: "Desert Sand Warm", isCover: false }
    ],
    colorVariants: [
      { colorName: "Vintage Black", imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80", isMain: true },
      { colorName: "Desert Sand Warm", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 18,
    productTitle: "Classic Suede Chelsea Boots",
    shopName: "KicksPlug_Imsu",
    price: "₦22,000",
    category: "Footwears",
    campus: "Imsu, Owerri",
    condition: "Like New",
    description: "Premium brown suede leather ankle boots fitted with flexible secure elastic side panels.",
    whatsappNumber: "2348123456789",
    availableSizes: ["42", "43"],
    variants: ["Suede Tan Brown", "Suede Onyx Black"],
    images: [
      { id: "v18-img1", imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f6893b4?w=500&q=80", variantName: "Suede Tan Brown", isCover: true },
      { id: "v18-img2", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", variantName: "Suede Onyx Black", isCover: false }
    ],
    colorVariants: [
      { colorName: "Suede Tan Brown", imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f6893b4?w=500&q=80", isMain: true },
      { colorName: "Suede Onyx Black", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 19,
    productTitle: "Retro Square Frame Sunglasses",
    shopName: "ShadesHub_Imsu",
    price: "₦4,500",
    category: "Accessories",
    campus: "Imsu, Owerri",
    condition: "Brand New",
    description: "Thick acetate square block frame shades. High UV protection parameters wrapped in premium drip aesthetics.",
    whatsappNumber: "2348155566677",
    availableSizes: ["One Size"],
    variants: ["Glossy Tortoise", "Stealth Midnight"],
    images: [
      { id: "v19-img1", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80", variantName: "Glossy Tortoise", isCover: true },
      { id: "v19-img2", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", variantName: "Stealth Midnight", isCover: false }
    ],
    colorVariants: [
      { colorName: "Glossy Tortoise", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80", isMain: true },
      { colorName: "Stealth Midnight", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 20,
    productTitle: "Adjustable Stainless Steel Chain",
    shopName: "IceByElvis",
    price: "₦3,800",
    category: "Accessories",
    campus: "Imsu, Owerri",
    condition: "Brand New",
    description: "Minimal rope profile sleek silver metal neckpiece. Anti-allergic coating built for regular use.",
    whatsappNumber: "2347055554444",
    availableSizes: ["22 inch"],
    variants: ["Sleek Silver", "Liquid Gold Finish"],
    images: [
      { id: "v20-img1", imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80", variantName: "Sleek Silver", isCover: true },
      { id: "v20-img2", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", variantName: "Liquid Gold Finish", isCover: false }
    ],
    colorVariants: [
      { colorName: "Sleek Silver", imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80", isMain: true },
      { colorName: "Liquid Gold Finish", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", isMain: false }
    ]
  },

  // ==================== FUTO, OWERRI (21-30) ====================
  {
    id: 21,
    productTitle: "Wireless ANC Headphones",
    shopName: "GadgetHub_Futo",
    price: "₦15,000",
    category: "Gadgets",
    campus: "Futo, Owerri",
    condition: "Brand New",
    description: "Active Noise Cancelling over-ear headphones. Deep bass with up to 30 hours battery life.",
    whatsappNumber: "2349034567890",
    availableSizes: ["Neutral"],
    variants: ["Midnight Black", "Alabaster White"],
    images: [
      { id: "v21-img1", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", variantName: "Midnight Black", isCover: true },
      { id: "v21-img2", imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80", variantName: "Alabaster White", isCover: false }
    ],
    colorVariants: [
      { colorName: "Midnight Black", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", isMain: true },
      { colorName: "Alabaster White", imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 22,
    productTitle: "Minimalist Leather Strap Watch",
    shopName: "Timekeepers_Futo",
    price: "₦12,500",
    category: "Accessories",
    campus: "Futo, Owerri",
    condition: "Like New",
    description: "Classic elegant look. Ultra-thin casing matched with a genuine premium stitched brown leather strap.",
    whatsappNumber: "2348044445555",
    availableSizes: ["One Size"],
    variants: ["Stitched Tan Brown", "Onyx Black Leather"],
    images: [
      { id: "v22-img1", imageUrl: "https://images.unsplash.com/photo-1522312346375-23c9450c58cd?w=500&q=80", variantName: "Stitched Tan Brown", isCover: true },
      { id: "v22-img2", imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&q=80", variantName: "Onyx Black Leather", isCover: false }
    ],
    colorVariants: [
      { colorName: "Stitched Tan Brown", imageUrl: "https://images.unsplash.com/photo-1522312346375-23c9450c58cd?w=500&q=80", isMain: true },
      { colorName: "Onyx Black Leather", imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 23,
    productTitle: "MacBook Air M1 2020",
    shopName: "GadgetHub_Futo",
    price: "₦450,000",
    category: "Gadgets",
    campus: "Futo, Owerri",
    condition: "Like New",
    description: "Apple M1 chip, 8GB RAM, 256GB SSD. Battery health at 91%, zero visible body scratches.",
    whatsappNumber: "2349034567890",
    availableSizes: ["Standard"],
    variants: ["Space Gray Sleek", "Classic Silver Glow"],
    images: [
      { id: "v23-img1", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", variantName: "Space Gray Sleek", isCover: true },
      { id: "v23-img2", imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80", variantName: "Classic Silver Glow", isCover: false }
    ],
    colorVariants: [
      { colorName: "Space Gray Sleek", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", isMain: true },
      { colorName: "Classic Silver Glow", imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 24,
    productTitle: "Asus ROG Strix G15 Machine",
    shopName: "TechCentral_Futo",
    price: "₦680,000",
    category: "Gadgets",
    campus: "Futo, Owerri",
    condition: "Like New",
    description: "AMD Ryzen 7, RTX 3060 GPU, 16GB RAM, 512GB SSD. Perfect laptop monster machine for coding and gaming.",
    whatsappNumber: "2348033221144",
    availableSizes: ["15.6 inch"],
    variants: ["Eclipse Grey Matte", "Stealth RGB Edition"],
    images: [
      { id: "v24-img1", imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80", variantName: "Eclipse Grey Matte", isCover: true },
      { id: "v24-img2", imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80", variantName: "Stealth RGB Edition", isCover: false }
    ],
    colorVariants: [
      { colorName: "Eclipse Grey Matte", imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80", isMain: true },
      { colorName: "Stealth RGB Edition", imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 25,
    productTitle: "JBL Flip 6 Wireless Speaker",
    shopName: "TechCentral_Futo",
    price: "₦48,000",
    category: "Gadgets",
    campus: "Futo, Owerri",
    condition: "Brand New",
    description: "Waterproof portable speaker body container, delivering heavy deep bass acoustic sound notes.",
    whatsappNumber: "2348033221144",
    availableSizes: ["Standard"],
    variants: ["Squad Red", "Carbon Deep Black"],
    images: [
      { id: "v25-img1", imageUrl: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&q=80", variantName: "Squad Red", isCover: true },
      { id: "v25-img2", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", variantName: "Carbon Deep Black", isCover: false }
    ],
    colorVariants: [
      { colorName: "Squad Red", imageUrl: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&q=80", isMain: true },
      { colorName: "Carbon Deep Black", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 26,
    productTitle: "Extended Desktop Mouse Pad XXL",
    shopName: "TechCentral_Futo",
    price: "₦5,500",
    category: "Other",
    campus: "Futo, Owerri",
    condition: "Brand New",
    description: "Large 900x400mm waterproof rubberized desk surface pad sheet. Prevents mouse friction.",
    whatsappNumber: "2348033221144",
    availableSizes: ["90x40cm XXL"],
    variants: ["Solid Carbon Black", "Aesthetic Topo Lines"],
    images: [
      { id: "v26-img1", imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&q=80", variantName: "Solid Carbon Black", isCover: true },
      { id: "v26-img2", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", variantName: "Aesthetic Topo Lines", isCover: false }
    ],
    colorVariants: [
      { colorName: "Solid Carbon Black", imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&q=80", isMain: true },
      { colorName: "Aesthetic Topo Lines", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 27,
    productTitle: "Logitech G305 Wireless Mouse",
    shopName: "GadgetHub_Futo",
    price: "₦25,000",
    category: "Gadgets",
    campus: "Futo, Owerri",
    condition: "Like New",
    description: "LIGHTSPEED wireless gaming mouse featuring ultra-precise HERO sensor tracking accuracy layout.",
    whatsappNumber: "2349034567890",
    availableSizes: ["Universal"],
    variants: ["Matte Black", "Pristine Ice White"],
    images: [
      { id: "v27-img1", imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80", variantName: "Matte Black", isCover: true },
      { id: "v27-img2", imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", variantName: "Pristine Ice White", isCover: false }
    ],
    colorVariants: [
      { colorName: "Matte Black", imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80", isMain: true },
      { colorName: "Pristine Ice White", imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 28,
    productTitle: "Premium Mechanical RGB Keyboard",
    shopName: "TechCentral_Futo",
    price: "₦34,000",
    category: "Gadgets",
    campus: "Futo, Owerri",
    condition: "Brand New",
    description: "Tactile clicky blue-switches mechanical deck panel built with highly customizable bright RGB LED.",
    whatsappNumber: "2348033221144",
    availableSizes: ["Tenkeyless Layout"],
    variants: ["Carbon Black Base", "Neon Ice White Base"],
    images: [
      { id: "v28-img1", imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80", variantName: "Carbon Black Base", isCover: true },
      { id: "v28-img2", imageUrl: "https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?w=500&q=80", variantName: "Neon Ice White Base", isCover: false }
    ],
    colorVariants: [
      { colorName: "Carbon Black Base", imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80", isMain: true },
      { colorName: "Neon Ice White Base", imageUrl: "https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 29,
    productTitle: "Aluminium Laptop Elevator Stand",
    shopName: "GadgetHub_Futo",
    price: "₦8,500",
    category: "Accessories",
    campus: "Futo, Owerri",
    condition: "Brand New",
    description: "Ergonomic foldable structural height adjuster frame. Keeps device cool during heavy software operations compilation.",
    whatsappNumber: "2349034567890",
    availableSizes: ["Universal Fits"],
    variants: ["Metallic Silver", "Matte Carbon Slate"],
    images: [
      { id: "v29-img1", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", variantName: "Metallic Silver", isCover: true },
      { id: "v29-img2", imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&q=80", variantName: "Matte Carbon Slate", isCover: false }
    ],
    colorVariants: [
      { colorName: "Metallic Silver", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", isMain: true },
      { colorName: "Matte Carbon Slate", imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 30,
    productTitle: "External 1TB Portable HDD",
    shopName: "TechCentral_Futo",
    price: "₦38,000",
    category: "Gadgets",
    campus: "Futo, Owerri",
    condition: "Brand New",
    description: "High capacity storage backing bank panel setup. Shockproof housing built to preserve documents cleanly.",
    whatsappNumber: "2348033221144",
    availableSizes: ["1TB Capacity"],
    variants: ["Rugged Armour Orange", "Sleek Matte Black"],
    images: [
      { id: "v30-img1", imageUrl: "https://images.unsplash.com/photo-1531492746076-161ac9bcad58?w=500&q=80", variantName: "Rugged Armour Orange", isCover: true },
      { id: "v30-img2", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", variantName: "Sleek Matte Black", isCover: false }
    ],
    colorVariants: [
      { colorName: "Rugged Armour Orange", imageUrl: "https://images.unsplash.com/photo-1531492746076-161ac9bcad58?w=500&q=80", isMain: true },
      { colorName: "Sleek Matte Black", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: false }
    ]
  },

  // ==================== UNIUYO, UYO (31-40) ====================
  {
    id: 31,
    productTitle: "Nike Air Force 1 '07",
    shopName: "KicksPlug_Hub",
    price: "₦21,000",
    category: "Footwears",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Classic triple white crisp Air Force 1. Original box included, deadstock condition.",
    whatsappNumber: "2348123456789",
    availableSizes: ["42", "43", "44"],
    variants: ["Pure White", "Vintage Forest Green"],
    images: [
      { id: "v31-img1", imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80", variantName: "Pure White", isCover: true },
      { id: "v31-img2", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80", variantName: "Vintage Forest Green", isCover: false }
    ],
    colorVariants: [
      { colorName: "Pure White", imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80", isMain: true },
      { colorName: "Vintage Forest Green", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 32,
    productTitle: "Hydrating Vitamin C Serum",
    shopName: "GlowEssence_Hub",
    price: "₦5,500",
    category: "Beauty",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Brightening antioxidant facial serum. Formulated for all skin types, non-greasy finish.",
    whatsappNumber: "2348098765432",
    availableSizes: ["30ml", "50ml"],
    variants: ["Standard Glow", "Hydrating Aloe Infusion"],
    images: [
      { id: "v32-img1", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", variantName: "Standard Glow", isCover: true },
      { id: "v32-img2", imageUrl: "https://images.unsplash.com/photo-1598440947619-2ce2169c14bb?w=500&q=80", variantName: "Hydrating Aloe Infusion", isCover: false }
    ],
    colorVariants: [
      { colorName: "Standard Glow", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", isMain: true },
      { colorName: "Hydrating Aloe Infusion", imageUrl: "https://images.unsplash.com/photo-1598440947619-2ce2169c14bb?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 33,
    productTitle: "Chunky Platform Loafers",
    shopName: "KicksPlug_Hub",
    price: "₦24,000",
    category: "Footwears",
    campus: "UniUyo, Uyo",
    condition: "Like New",
    description: "High shine patent leather platform loafers with distinct metal buckle hardware accent lines.",
    whatsappNumber: "2348123456789",
    availableSizes: ["41", "42", "43"],
    variants: ["Glossy Black", "Rich Mahogany"],
    images: [
      { id: "v33-img1", imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&q=80", variantName: "Glossy Black", isCover: true },
      { id: "v33-img2", imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f6893b4?w=500&q=80", variantName: "Rich Mahogany", isCover: false }
    ],
    colorVariants: [
      { colorName: "Glossy Black", imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&q=80", isMain: true },
      { colorName: "Rich Mahogany", imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f6893b4?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 34,
    productTitle: "Victoria Secret Bare Vanilla",
    shopName: "GlowEssence_Hub",
    price: "₦12,500",
    category: "Beauty",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Original fragrance mist body splash spray. Deep warm vanilla crumb aromatics layout.",
    whatsappNumber: "2348098765432",
    availableSizes: ["250ml"],
    variants: ["Bare Vanilla Glow", "Velvet Petal Scent"],
    images: [
      { id: "v34-img1", imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80", variantName: "Bare Vanilla Glow", isCover: true },
      { id: "v34-img2", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", variantName: "Velvet Petal Scent", isCover: false }
    ],
    colorVariants: [
      { colorName: "Bare Vanilla Glow", imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80", isMain: true },
      { colorName: "Velvet Petal Scent", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 35,
    productTitle: "New Balance 550 Retro",
    shopName: "KicksPlug_Hub",
    price: "₦32,000",
    category: "Footwears",
    campus: "UniUyo, Uyo",
    condition: "Like New",
    description: "Vintage court style athletic sneakers. Premium white leather blocks matched with green trims.",
    whatsappNumber: "2348123456789",
    availableSizes: ["42", "43", "45"],
    variants: ["White Forest Green", "Classic Slate Grey"],
    images: [
      { id: "v35-img1", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80", variantName: "White Forest Green", isCover: true },
      { id: "v35-img2", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", variantName: "Classic Slate Grey", isCover: false }
    ],
    colorVariants: [
      { colorName: "White Forest Green", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80", isMain: true },
      { colorName: "Classic Slate Grey", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 36,
    productTitle: "Waterproof Laptop Backpack Tech",
    shopName: "Urban_Essentials",
    price: "₦9,500",
    category: "Fashion",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Sleek tech bag container with dedicated padded 15.6-inch laptop compartment pouch and external USB socket line.",
    whatsappNumber: "2347022334499",
    availableSizes: ["20L Volume"],
    variants: ["Carbon Charcoal Gray", "Stealth Onyx Black"],
    images: [
      { id: "v36-img1", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", variantName: "Carbon Charcoal Gray", isCover: true },
      { id: "v36-img2", imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80", variantName: "Stealth Onyx Black", isCover: false }
    ],
    colorVariants: [
      { colorName: "Carbon Charcoal Gray", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", isMain: true },
      { colorName: "Stealth Onyx Black", imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 37,
    productTitle: "Crocs Classic Clogs Platform",
    shopName: "KicksPlug_Hub",
    price: "₦11,000",
    category: "Footwears",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Lightweight breathable lounge footwear sandals with cushioned platform sole base layers.",
    whatsappNumber: "2348123456789",
    availableSizes: ["41", "42", "43", "44"],
    variants: ["Aesthetic Bone White", "Stealth Blackout"],
    images: [
      { id: "v37-img1", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80", variantName: "Aesthetic Bone White", isCover: true },
      { id: "v37-img2", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", variantName: "Stealth Blackout", isCover: false }
    ],
    colorVariants: [
      { colorName: "Aesthetic Bone White", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80", isMain: true },
      { colorName: "Stealth Blackout", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 38,
    productTitle: "Leather Messenger Bag Box",
    shopName: "Classy Collections",
    price: "₦18,500",
    category: "Accessories",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Polished faux leather briefcase case container bag fitted with adjustable cross-body straps lines.",
    whatsappNumber: "2349033445566",
    availableSizes: ["Standard fit"],
    variants: ["Vintage Chestnut Brown", "Sleek Executive Black"],
    images: [
      { id: "v38-img1", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", variantName: "Vintage Chestnut Brown", isCover: true },
      { id: "v38-img2", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", variantName: "Sleek Executive Black", isCover: false }
    ],
    colorVariants: [
      { colorName: "Vintage Chestnut Brown", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", isMain: true },
      { colorName: "Sleek Executive Black", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 39,
    productTitle: "Unisex Fleece Drip Hoodie",
    shopName: "StreetWear_Uyo",
    price: "₦12,000",
    category: "Fashion",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Heavy core drop-shoulder aesthetic hoodie garment designed with warm brushed inner cotton wool layers.",
    whatsappNumber: "2348123456789",
    availableSizes: ["L", "XL"],
    variants: ["Oatmeal Warm Beige", "Rich Forest Green"],
    images: [
      { id: "v39-img1", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80", variantName: "Oatmeal Warm Beige", isCover: true },
      { id: "v39-img2", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", variantName: "Rich Forest Green", isCover: false }
    ],
    colorVariants: [
      { colorName: "Oatmeal Warm Beige", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80", isMain: true },
      { colorName: "Rich Forest Green", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 40,
    productTitle: "Minimalist Suede Caps Pack",
    shopName: "Urban_Essentials",
    price: "₦3,500",
    category: "Accessories",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Adjustable classic baseball structural curvature crown hat tool. Completes street outfits fluidly.",
    whatsappNumber: "2347022334499",
    availableSizes: ["Free Size"],
    variants: ["Earthy Olive Green", "Retro Mustard Gold"],
    images: [
      { id: "v40-img1", imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80", variantName: "Earthy Olive Green", isCover: true },
      { id: "v40-img2", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80", variantName: "Retro Mustard Gold", isCover: false }
    ],
    colorVariants: [
      { colorName: "Earthy Olive Green", imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80", isMain: true },
      { colorName: "Retro Mustard Gold", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80", isMain: false }
    ]
  },

  // ==================== UNIPORT, HARCOURT (41-50) ====================
  {
    id: 41,
    productTitle: "Matte Liquid Lipstick Set",
    shopName: "AzzaGlow_Beauty",
    price: "₦3,000",
    category: "Beauty",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Long-lasting waterproof liquid matte lipstick bundle. Pack of 4 seasonal shades.",
    whatsappNumber: "2348098765432",
    availableSizes: ["One Size"],
    variants: ["Warm Nude Pack", "Sultry Red Collection"],
    images: [
      { id: "v41-img1", imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80", variantName: "Warm Nude Pack", isCover: true },
      { id: "v41-img2", imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80", variantName: "Sultry Red Collection", isCover: false }
    ],
    colorVariants: [
      { colorName: "Warm Nude Pack", imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80", isMain: true },
      { colorName: "Sultry Red Collection", imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 42,
    productTitle: "Organic Shea Body Butter Cream",
    shopName: "AzzaGlow_Beauty",
    price: "₦4,000",
    category: "Beauty",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Whipped organic raw shea butter infused with vanilla extract for maximum hydration skin treatment.",
    whatsappNumber: "2348098765432",
    availableSizes: ["250g"],
    variants: ["Sweet Vanilla Bean", "Soothing Lavender Oil"],
    images: [
      { id: "v42-img1", imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&q=80", variantName: "Sweet Vanilla Bean", isCover: true },
      { id: "v42-img2", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", variantName: "Soothing Lavender Oil", isCover: false }
    ],
    colorVariants: [
      { colorName: "Sweet Vanilla Bean", imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&q=80", isMain: true },
      { colorName: "Soothing Lavender Oil", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 43,
    productTitle: "Non-Stick Frying Pan Twin Set",
    shopName: "BeddingDepot",
    price: "₦12,000",
    category: "Home & Kitchen",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Heavy-gauge granite-coated aluminum frying pans with insulated ergonomic stay-cool handles block.",
    whatsappNumber: "2348022334455",
    availableSizes: ["2-Piece Pack"],
    variants: ["Granite Charcoal Gray", "Volcanic Copper Hue"],
    images: [
      { id: "v43-img1", imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80", variantName: "Granite Charcoal Gray", isCover: true },
      { id: "v43-img2", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80", variantName: "Volcanic Copper Hue", isCover: false }
    ],
    colorVariants: [
      { colorName: "Granite Charcoal Gray", imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80", isMain: true },
      { colorName: "Volcanic Copper Hue", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 44,
    productTitle: "Rechargeable Hostel Desk Fan Core",
    shopName: "StudentMart_Port",
    price: "₦14,000",
    category: "Home & Kitchen",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Portable 8-inch table cooling system built for power outages. Lasts up to 6 hours.",
    whatsappNumber: "2348055667788",
    availableSizes: ["8 Inch"],
    variants: ["Breeze Ice Blue", "Stealth Midnight Gray"],
    images: [
      { id: "v44-img1", imageUrl: "https://images.unsplash.com/photo-1618945533008-091002421551?w=500&q=80", variantName: "Breeze Ice Blue", isCover: true },
      { id: "v44-img2", imageUrl: "https://images.unsplash.com/photo-1531492746076-161ac9bcad58?w=500&q=80", variantName: "Stealth Midnight Gray", isCover: false }
    ],
    colorVariants: [
      { colorName: "Breeze Ice Blue", imageUrl: "https://images.unsplash.com/photo-1618945533008-091002421551?w=500&q=80", isMain: true },
      { colorName: "Stealth Midnight Gray", imageUrl: "https://images.unsplash.com/photo-1531492746076-161ac9bcad58?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 45,
    productTitle: "Scented Vanilla Pillar Wax",
    shopName: "Melts & Bites",
    price: "₦3,000",
    category: "Home & Kitchen",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Aromatherapy organic soy wax pillar candle bars. Infuses hostel spaces with calming fragrance.",
    whatsappNumber: "2347043210987",
    availableSizes: ["2-Piece Pack"],
    variants: ["Pure French Vanilla", "Relaxing Lavender Mist"],
    images: [
      { id: "v45-img1", imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80", variantName: "Pure French Vanilla", isCover: true },
      { id: "v45-img2", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", variantName: "Relaxing Lavender Mist", isCover: false }
    ],
    colorVariants: [
      { colorName: "Pure French Vanilla", imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80", isMain: true },
      { colorName: "Relaxing Lavender Mist", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 46,
    productTitle: "Tea Tree Acne Wash Cleanser",
    shopName: "MiraScent & Glow",
    price: "₦4,800",
    category: "Beauty",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Acne control foaming wash cleanser gel formulated with natural tea tree modules to clarify complexions.",
    whatsappNumber: "2348074635291",
    availableSizes: ["150ml"],
    variants: ["Standard Tea Tree Cleanser", "Hydrating Aloe Vera Blend"],
    images: [
      { id: "v46-img1", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80", variantName: "Standard Tea Tree Cleanser", isCover: true },
      { id: "v46-img2", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", variantName: "Hydrating Aloe Vera Blend", isCover: false }
    ],
    colorVariants: [
      { colorName: "Standard Tea Tree Cleanser", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80", isMain: true },
      { colorName: "Hydrating Aloe Vera Blend", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 47,
    productTitle: "Dual USB Fast Wall Charger Block",
    shopName: "GadgetVault",
    price: "₦4,500",
    category: "Gadgets",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Dual port power adapter plug container with intelligent current distribution safety regulators.",
    whatsappNumber: "2347065432101",
    availableSizes: ["Dual Slot"],
    variants: ["Glossy White", "Onyx Black Case"],
    images: [
      { id: "v47-img1", imageUrl: "https://images.unsplash.com/photo-1543442142-d6f831fbe635?w=500&q=80", variantName: "Glossy White", isCover: true },
      { id: "v47-img2", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", variantName: "Onyx Black Case", isCover: false }
    ],
    colorVariants: [
      { colorName: "Glossy White", imageUrl: "https://images.unsplash.com/photo-1543442142-d6f831fbe635?w=500&q=80", isMain: true },
      { colorName: "Onyx Black Case", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 48,
    productTitle: "Golden Egg Rolls Combo",
    shopName: "Melts & Bites",
    price: "₦2,000",
    category: "Food & Snacks",
    campus: "UniPort, Harcourt",
    condition: "",
    description: "Warm, sweet dough golden-fried with whole hard-boiled eggs inside. Flawless on-the-go snack.",
    whatsappNumber: "2347043210987",
    availableSizes: ["Pack of 4"],
    variants: ["Vanilla Sweet Dough", "Lightly Peppered Dough"],
    images: [
      { id: "v48-img1", imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&q=80", variantName: "Vanilla Sweet Dough", isCover: true },
      { id: "v48-img2", imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&q=80", variantName: "Lightly Peppered Dough", isCover: false }
    ],
    colorVariants: [
      { colorName: "Vanilla Sweet Dough", imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&q=80", isMain: true },
      { colorName: "Lightly Peppered Dough", imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 49,
    productTitle: "Aesthetic Flannel Overshirt Drip",
    shopName: "ThriftByFaith",
    price: "₦7,500",
    category: "Fashion",
    campus: "UniPort, Harcourt",
    condition: "Like New",
    description: "Vintage box-fit plaid checkered button flannel overshirt. Perfect layer piece.",
    whatsappNumber: "2348012345678",
    availableSizes: ["M", "L"],
    variants: ["Crimson Red Plaid", "Retro Vintage Brown Plaid"],
    images: [
      { id: "v49-img1", imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80", variantName: "Crimson Red Plaid", isCover: true },
      { id: "v49-img2", imageUrl: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80", variantName: "Retro Vintage Brown Plaid", isCover: false }
    ],
    colorVariants: [
      { colorName: "Crimson Red Plaid", imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80", isMain: true },
      { colorName: "Retro Vintage Brown Plaid", imageUrl: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 50,
    productTitle: "Pro Barber Hair Clipper Kit",
    shopName: "GadgetVault",
    price: "₦19,000",
    category: "Gadgets",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Wireless barber-grade grooming kit machine with sharp self-sharpening carbon steel t-blades setup.",
    whatsappNumber: "2347065432101",
    availableSizes: ["Full Set"],
    variants: ["Luxurious Gold Edition", "Matte Carbon Black"],
    images: [
      { id: "v50-img1", imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&q=80", variantName: "Luxurious Gold Edition", isCover: true },
      { id: "v50-img2", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", variantName: "Matte Carbon Black", isCover: false }
    ],
    colorVariants: [
      { colorName: "Luxurious Gold Edition", imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&q=80", isMain: true },
      { colorName: "Matte Carbon Black", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: false }
    ]
  },

  // ==================== NEW EXPANDED INVENTORY (51-70) ====================
  {
    id: 51,
    productTitle: "Vintage Polaroid Camera 600",
    shopName: "RetroLens_Absu",
    price: "₦45,000",
    category: "Gadgets",
    campus: "Absu, Uturu",
    condition: "Fair",
    description: "Classic retro instant film camera block. Tested and working perfectly for aesthetic photography shoots.",
    whatsappNumber: "2348111222333",
    availableSizes: ["Standard"],
    variants: ["Classic Slate Grey", "Carbon Black Shell"],
    images: [
      { id: "v51-img1", imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80", variantName: "Classic Slate Grey", isCover: true },
      { id: "v51-img2", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", variantName: "Carbon Black Shell", isCover: false }
    ],
    colorVariants: [
      { colorName: "Classic Slate Grey", imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80", isMain: true },
      { colorName: "Carbon Black Shell", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 52,
    productTitle: "Hostel Movie Sweet Popcorn",
    shopName: "K-Mart_Snacks",
    price: "₦1,500",
    category: "Food & Snacks",
    campus: "UniUyo, Uyo",
    condition: "",
    description: "Extra crispy, light, caramelized butter popcorn popped on request. Perfect companion for hostel movie chill sessions.",
    whatsappNumber: "2349055443322",
    availableSizes: ["Standard Pack", "Mega Tub"],
    variants: ["Sweet Butter Caramel", "Salted Butter Crunch"],
    images: [
      { id: "v52-img1", imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500&q=80", variantName: "Sweet Butter Caramel", isCover: true },
      { id: "v52-img2", imageUrl: "https://images.unsplash.com/photo-1505682631700-ec7be0562287?w=500&q=80", variantName: "Salted Butter Crunch", isCover: false }
    ],
    colorVariants: [
      { colorName: "Sweet Butter Caramel", imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500&q=80", isMain: true },
      { colorName: "Salted Butter Crunch", imageUrl: "https://images.unsplash.com/photo-1505682631700-ec7be0562287?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 53,
    productTitle: "Knitted Throw Blanket Throw",
    shopName: "HomeHub_Store",
    price: "₦15,000",
    category: "Home & Kitchen",
    campus: "Futo, Owerri",
    condition: "Brand New",
    description: "Soft chunky knit blanket wrap. Enhances your bed space aesthetic perfectly during chilly nights.",
    whatsappNumber: "2348088776655",
    availableSizes: ["Large 50x60"],
    variants: ["Dusty Rose Pink", "Alabaster White Glow"],
    images: [
      { id: "v53-img1", imageUrl: "https://images.unsplash.com/photo-1580828369651-69e6b4d3d92f?w=500&q=80", variantName: "Dusty Rose Pink", isCover: true },
      { id: "v53-img2", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", variantName: "Alabaster White Glow", isCover: false }
    ],
    colorVariants: [
      { colorName: "Dusty Rose Pink", imageUrl: "https://images.unsplash.com/photo-1580828369651-69e6b4d3d92f?w=500&q=80", isMain: true },
      { colorName: "Alabaster White Glow", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 54,
    productTitle: "Fresh Crispy Fish Rolls",
    shopName: "SweetTooth_Imsu",
    price: "₦900",
    category: "Food & Snacks",
    campus: "Imsu, Owerri",
    condition: "",
    description: "Deeply seasoned mackerel flakes rolled inside a thin, crunchy fried pastry wrapper.",
    whatsappNumber: "2347011223344",
    availableSizes: ["Single Roll", "Pack of 3"],
    variants: ["Classic Deep Fried", "Extra Spicy Chili Crust"],
    images: [
      { id: "v54-img1", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80", variantName: "Classic Deep Fried", isCover: true },
      { id: "v54-img2", imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80", variantName: "Extra Spicy Chili Crust", isCover: false }
    ],
    colorVariants: [
      { colorName: "Classic Deep Fried", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80", isMain: true },
      { colorName: "Extra Spicy Chili Crust", imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 55,
    productTitle: "Matte Black Tumbler Flask",
    shopName: "Urban_Essentials",
    price: "₦7,500",
    category: "Accessories",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours.",
    whatsappNumber: "2348199887766",
    availableSizes: ["750ml"],
    variants: ["Stealth Blackout", "Metallic Silver Matte"],
    images: [
      { id: "v55-img1", imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80", variantName: "Stealth Blackout", isCover: true },
      { id: "v55-img2", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", variantName: "Metallic Silver Matte", isCover: false }
    ],
    colorVariants: [
      { colorName: "Stealth Blackout", imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80", isMain: true },
      { colorName: "Metallic Silver Matte", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 56,
    productTitle: "Rose Gold Makeup Brush Set",
    shopName: "GlowEssence_Hub",
    price: "₦10,500",
    category: "Beauty",
    campus: "Absu, Uturu",
    condition: "Brand New",
    description: "Professional 12-piece synthetic bristle brush set wrapped in a sleek portable leather pouch container.",
    whatsappNumber: "2349077665544",
    availableSizes: ["12 Piece Kit"],
    variants: ["Luxe Rose Gold", "Stealth Matte Black Edition"],
    images: [
      { id: "v56-img1", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", variantName: "Luxe Rose Gold", isCover: true },
      { id: "v56-img2", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", variantName: "Stealth Matte Black Edition", isCover: false }
    ],
    colorVariants: [
      { colorName: "Luxe Rose Gold", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", isMain: true },
      { colorName: "Stealth Matte Black Edition", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 57,
    productTitle: "AirPods Pro Gen 2 Replica",
    shopName: "GadgetHub_Futo",
    price: "₦22,000",
    category: "Gadgets",
    campus: "Futo, Owerri",
    condition: "Brand New",
    description: "High-grade 1:1 master copy TWS earbuds featuring spatial audio layout and deep active noise cancellation.",
    whatsappNumber: "2348044556677",
    availableSizes: ["Standard"],
    variants: ["Gloss White Case", "Stealth Onyx Black Case"],
    images: [
      { id: "v57-img1", imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", variantName: "Gloss White Case", isCover: true },
      { id: "v57-img2", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", variantName: "Stealth Onyx Black Case", isCover: false }
    ],
    colorVariants: [
      { colorName: "Gloss White Case", imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", isMain: true },
      { colorName: "Stealth Onyx Black Case", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 58,
    productTitle: "Electric Protein Shaker Bottle",
    shopName: "FitGear_Port",
    price: "₦11,000",
    category: "Accessories",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "Motorized vortex mixing cup block. Perfect for smooth lump-free protein supplement shakes.",
    whatsappNumber: "2347033445566",
    availableSizes: ["600ml"],
    variants: ["Vibrant Neon Blue", "Stealth Blackout Base"],
    images: [
      { id: "v58-img1", imageUrl: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=500&q=80", variantName: "Vibrant Neon Blue", isCover: true },
      { id: "v58-img2", imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80", variantName: "Stealth Blackout Base", isCover: false }
    ],
    colorVariants: [
      { colorName: "Vibrant Neon Blue", imageUrl: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=500&q=80", isMain: true },
      { colorName: "Stealth Blackout Base", imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 59,
    productTitle: "Biker Distressed Leather Pants",
    shopName: "DripStore_Imsu",
    price: "₦18,000",
    category: "Fashion",
    campus: "Imsu, Owerri",
    condition: "Like New",
    description: "Edgy slim-fit faux leather motorcycle trousers designed with ribbed knee panel blocks.",
    whatsappNumber: "2348122334455",
    availableSizes: ["32", "34"],
    variants: ["Matte Charcoal Black", "Vintage Distressed Tan"],
    images: [
      { id: "v59-img1", imageUrl: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=500&q=80", variantName: "Matte Charcoal Black", isCover: true },
      { id: "v59-img2", imageUrl: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80", variantName: "Vintage Distressed Tan", isCover: false }
    ],
    colorVariants: [
      { colorName: "Matte Charcoal Black", imageUrl: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=500&q=80", isMain: true },
      { colorName: "Vintage Distressed Tan", imageUrl: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 60,
    productTitle: "Ceramic Coffee Mug Set",
    shopName: "HomeHub_Store",
    price: "₦6,000",
    category: "Home & Kitchen",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Pair of aesthetic speckled ceramic mugs. Microwave safe, perfect for morning lecture brews.",
    whatsappNumber: "2349066778899",
    availableSizes: ["2 Piece Set"],
    variants: ["Earthy Speckled White", "Warm Terracotta Speckled"],
    images: [
      { id: "v60-img1", imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80", variantName: "Earthy Speckled White", isCover: true },
      { id: "v60-img2", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80", variantName: "Warm Terracotta Speckled", isCover: false }
    ],
    colorVariants: [
      { colorName: "Earthy Speckled White", imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80", isMain: true },
      { colorName: "Warm Terracotta Speckled", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 61,
    productTitle: "High-Top Canvas Sneakers",
    shopName: "SneakerVault_Imsu",
    price: "₦13,500",
    category: "Footwears",
    campus: "Imsu, Owerri",
    condition: "Brand New",
    description: "Classic black and white canvas lace-up ankle boots. Timeless campus wardrobe staple.",
    whatsappNumber: "2348055443322",
    availableSizes: ["41", "42", "43", "44"],
    variants: ["Retro Monochrome Black", "Pristine Minimal White"],
    images: [
      { id: "v61-img1", imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80", variantName: "Retro Monochrome Black", isCover: true },
      { id: "v61-img2", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", variantName: "Pristine Minimal White", isCover: false }
    ],
    colorVariants: [
      { colorName: "Retro Monochrome Black", imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80", isMain: true },
      { colorName: "Pristine Minimal White", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 62,
    productTitle: "Hydrating Aloe Vera Gel",
    shopName: "MiraScent & Glow",
    price: "₦3,500",
    category: "Beauty",
    campus: "UniPort, Harcourt",
    condition: "Brand New",
    description: "99% pure organic soothing aloe vera moisturizer pack. Perfect for after-sun skin recovery.",
    whatsappNumber: "2347088990011",
    availableSizes: ["300ml"],
    variants: ["Pure Cool Gel Extract", "Soothing Mint-Infused Aloe"],
    images: [
      { id: "v62-img1", imageUrl: "https://images.unsplash.com/photo-1598440947619-2ce2169c14bb?w=500&q=80", variantName: "Pure Cool Gel Extract", isCover: true },
      { id: "v62-img2", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", variantName: "Soothing Mint-Infused Aloe", isCover: false }
    ],
    colorVariants: [
      { colorName: "Pure Cool Gel Extract", imageUrl: "https://images.unsplash.com/photo-1598440947619-2ce2169c14bb?w=500&q=80", isMain: true },
      { colorName: "Soothing Mint-Infused Aloe", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 63,
    productTitle: "Mini Ring Light Tripod",
    shopName: "GadgetVault",
    price: "₦9,500",
    category: "Gadgets",
    campus: "Absu, Uturu",
    condition: "Brand New",
    description: "Compact 10-inch LED selfie ring light paired with an adjustable desk tripod stand block.",
    whatsappNumber: "2348133445566",
    availableSizes: ["10 Inch Ring"],
    variants: ["Stealth Matte Black Stand", "Luxe Rose Gold Rim Stand"],
    images: [
      { id: "v63-img1", imageUrl: "https://images.unsplash.com/photo-1616423641402-867140e1189c?w=500&q=80", variantName: "Stealth Matte Black Stand", isCover: true },
      { id: "v63-img2", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", variantName: "Luxe Rose Gold Rim Stand", isCover: false }
    ],
    colorVariants: [
      { colorName: "Stealth Matte Black Stand", imageUrl: "https://images.unsplash.com/photo-1616423641402-867140e1189c?w=500&q=80", isMain: true },
      { colorName: "Luxe Rose Gold Rim Stand", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 64,
    productTitle: "Loaded Pepperoni Pizza Box",
    shopName: "ChuksCampusEats",
    price: "₦7,500",
    category: "Food & Snacks",
    campus: "Futo, Owerri",
    condition: "",
    description: "Large 14-inch thin crust pizza loaded with extra mozzarella cheese and spicy pepperoni slices.",
    whatsappNumber: "2349011223344",
    availableSizes: ["Large 14 Inch"],
    variants: ["Double Pepperoni Crust", "Classic Cheese & Herb"],
    images: [
      { id: "v64-img1", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80", variantName: "Double Pepperoni Crust", isCover: true },
      { id: "v64-img2", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80", variantName: "Classic Cheese & Herb", isCover: false }
    ],
    colorVariants: [
      { colorName: "Double Pepperoni Crust", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80", isMain: true },
      { colorName: "Classic Cheese & Herb", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 65,
    productTitle: "Velvet Throw Pillows Set",
    shopName: "BeddingDepot",
    price: "₦8,000",
    category: "Home & Kitchen",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Pair of plush velvet cushion covers featuring premium hidden zipper inserts lines.",
    whatsappNumber: "2348077665544",
    availableSizes: ["18x18 Inch"],
    variants: ["Vintage Mustard Gold", "Deep Forest Sage Green"],
    images: [
      { id: "v65-img1", imageUrl: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=500&q=80", variantName: "Vintage Mustard Gold", isCover: true },
      { id: "v65-img2", imageUrl: "https://images.unsplash.com/photo-1580828369651-69e6b4d3d92f?w=500&q=80", variantName: "Deep Forest Sage Green", isCover: false }
    ],
    colorVariants: [
      { colorName: "Vintage Mustard Gold", imageUrl: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=500&q=80", isMain: true },
      { colorName: "Deep Forest Sage Green", imageUrl: "https://images.unsplash.com/photo-1580828369651-69e6b4d3d92f?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 66,
    productTitle: "Silk Durag & Wave Brush Kit",
    shopName: "Urban_Essentials",
    price: "₦4,500",
    category: "Accessories",
    campus: "Imsu, Owerri",
    condition: "Brand New",
    description: "Premium breathable silky durag wrap paired with a curved medium-hard bristle wave maintenance brush.",
    whatsappNumber: "2347044556677",
    availableSizes: ["Universal"],
    variants: ["Royal Blue Silk", "Premium Velvet Black"],
    images: [
      { id: "v66-img1", imageUrl: "https://images.unsplash.com/photo-1616056345690-3430ee8e60f7?w=500&q=80", variantName: "Royal Blue Silk", isCover: true },
      { id: "v66-img2", imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80", variantName: "Premium Velvet Black", isCover: false }
    ],
    colorVariants: [
      { colorName: "Royal Blue Silk", imageUrl: "https://images.unsplash.com/photo-1616056345690-3430ee8e60f7?w=500&q=80", isMain: true },
      { colorName: "Premium Velvet Black", imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 67,
    productTitle: "Scientific Calculator FX-991",
    shopName: "BookHaven_Absu",
    price: "₦12,500",
    category: "Other",
    campus: "Absu, Uturu",
    condition: "Like New",
    description: "Advanced non-programmable engineering calculator. Crucial tool for complex math modules.",
    whatsappNumber: "2348155667788",
    availableSizes: ["Standard"],
    variants: ["Matte Silver Face", "Classic Dark Blue Shell"],
    images: [
      { id: "v67-img1", imageUrl: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=500&q=80", variantName: "Matte Silver Face", isCover: true },
      { id: "v67-img2", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", variantName: "Classic Dark Blue Shell", isCover: false }
    ],
    colorVariants: [
      { colorName: "Matte Silver Face", imageUrl: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=500&q=80", isMain: true },
      { colorName: "Classic Dark Blue Shell", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 68,
    productTitle: "Ribbed Knit Crop Top",
    shopName: "ThriftByFaith",
    price: "₦4,000",
    category: "Fashion",
    campus: "UniPort, Harcourt",
    condition: "Like New",
    description: "Stretchy form-fitting sleeveless ribbed top block. Perfect casual summer wear essential.",
    whatsappNumber: "2349022334455",
    availableSizes: ["S", "M"],
    variants: ["Earthy Sage Green", "Classic Off-White"],
    images: [
      { id: "v68-img1", imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80", variantName: "Earthy Sage Green", isCover: true },
      { id: "v68-img2", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", variantName: "Classic Off-White", isCover: false }
    ],
    colorVariants: [
      { colorName: "Earthy Sage Green", imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80", isMain: true },
      { colorName: "Classic Off-White", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 69,
    productTitle: "Suede Block Heel Sandals",
    shopName: "KicksPlug_Hub",
    price: "₦15,000",
    category: "Footwears",
    campus: "UniUyo, Uyo",
    condition: "Brand New",
    description: "Elegant strappy suede sandals with a comfortable 3-inch chunky block heel lift.",
    whatsappNumber: "2348088990011",
    availableSizes: ["38", "39", "40"],
    variants: ["Soft Blush Pink", "Sleek Midnight Black"],
    images: [
      { id: "v69-img1", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80", variantName: "Soft Blush Pink", isCover: true },
      { id: "v69-img2", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", variantName: "Sleek Midnight Black", isCover: false }
    ],
    colorVariants: [
      { colorName: "Soft Blush Pink", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80", isMain: true },
      { colorName: "Sleek Midnight Black", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: false }
    ]
  },
  {
    id: 70,
    productTitle: "Glowing LED Gaming Mouse",
    shopName: "TechCentral_Futo",
    price: "₦7,500",
    category: "Gadgets",
    campus: "Futo, Owerri",
    condition: "Brand New",
    description: "Ergonomic wired optical mouse built with dynamic breathing RGB light sequences and programmable macro buttons.",
    whatsappNumber: "2347011335577",
    availableSizes: ["Standard"],
    variants: ["Neon Cyber Black", "Ice White Glow Base"],
    images: [
      { id: "v70-img1", imageUrl: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=500&q=80", variantName: "Neon Cyber Black", isCover: true },
      { id: "v70-img2", imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", variantName: "Ice White Glow Base", isCover: false }
    ],
    colorVariants: [
      { colorName: "Neon Cyber Black", imageUrl: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=500&q=80", isMain: true },
      { colorName: "Ice White Glow Base", imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", isMain: false }
    ]
  }
];