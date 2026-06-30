// src/data/products.js

export const initialProducts = [
  {
    id: 1,
    productTitle: "Vintage Leather Jacket",
    shopName: "ThriftByFaith",
    price: "₦18,500",
    category: "Fashion",
    campus: "Absu, Uturu",
    description: "Premium grade-A vintage leather jacket. Perfect condition with zero tears or blemishes. Soft inner lining.",
    whatsappNumber: "2348012345678",
    availableSizes: ["M", "L", "XL"],
    colorVariants: [
      {
        colorName: "Black",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
        isMain: true
      },
      {
        colorName: "Dark Brown",
        imageUrl: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&q=80",
        isMain: false
      }
    ]
  },
  {
    id: 2,
    productTitle: "Nike Air Force 1 '07",
    shopName: "KicksPlug_Imsu",
    price: "₦28,000",
    category: "Footwears",
    campus: "Imsu, Owerri",
    description: "Classic triple white crisp Air Force 1. Original box included, deadstock condition.",
    whatsappNumber: "2348123456789",
    availableSizes: ["42", "43", "44"],
    colorVariants: [
      {
        colorName: "White",
        imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80",
        isMain: true
      }
    ]
  },
  {
    id: 3,
    productTitle: "Wireless ANC Headphones",
    shopName: "GadgetHub_Futo",
    price: "₦15,000",
    category: "Gadgets",
    campus: "Futo, Owerri",
    description: "Active Noise Cancelling over-ear headphones. Deep bass with up to 30 hours battery life.",
    whatsappNumber: "2349034567890",
    availableSizes: ["Neutral"],
    colorVariants: [
      {
        colorName: "Black",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        isMain: true
      },
      {
        colorName: "Silver",
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80",
        isMain: false
      }
    ]
  },
  {
    id: 4,
    productTitle: "Crunchy Double Cheeseburger",
    shopName: "ChuksCampusEats",
    price: "₦4,500",
    category: "Food & Snacks",
    campus: "Absu, Uturu",
    description: "Juicy double beef patty with melted cheddar cheese, gourmet sauce, and side fries.",
    whatsappNumber: "2347012345678",
    availableSizes: ["Regular", "Large"],
    colorVariants: [
      {
        colorName: "Standard",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
        isMain: true
      }
    ]
  },
  {
    id: 5,
    productTitle: "Matte Liquid Lipstick Set",
    shopName: "AzzaGlow_Beauty",
    price: "₦7,500",
    category: "Beauty",
    campus: "UniAbj, Gwagwalada",
    description: "Long-lasting waterproof liquid matte lipstick bundle. Pack of 4 seasonal shades.",
    whatsappNumber: "2348098765432",
    availableSizes: ["One Size"],
    colorVariants: [
      {
        colorName: "Nude Pack",
        imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80",
        isMain: true
      },
      {
        colorName: "Red Pack",
        imageUrl: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=500&q=80",
        isMain: false
      }
    ]
  },
  {
    id: 6,
    productTitle: "Unisex Camo Cargo Pants",
    shopName: "StreetDrip_Absu",
    price: "₦12,500",
    category: "Fashion",
    campus: "Absu, Uturu",
    description: "Heavyweight utility cotton cargo pants with 6 reinforced tactical pockets. Adjustable waist bands.",
    whatsappNumber: "2348165432109",
    availableSizes: ["30", "32", "34", "36"],
    colorVariants: [
      {
        colorName: "Green Camo",
        imageUrl: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=500&q=80",
        isMain: true
      },
      {
        colorName: "Desert Camo",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80",
        isMain: false
      }
    ]
  },
  {
    id: 7,
    productTitle: "Silver Cuban Link Chain",
    shopName: "IceByElvis",
    price: "₦6,000",
    category: "Accessories",
    campus: "Imsu, Owerri",
    description: "Solid stainless steel Cuban link chain neckpiece. Sweatproof, non-tarnish design.",
    whatsappNumber: "2347055554444",
    availableSizes: ["18 inch", "20 inch", "22 inch"],
    colorVariants: [
      {
        colorName: "Silver",
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80",
        isMain: true
      },
      {
        colorName: "Gold",
        imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
        isMain: false
      }
    ]
  },
  {
    id: 8,
    productTitle: "Smart Fitness Watch V2",
    shopName: "TechCampus_UniAbuja",
    price: "₦19,000",
    category: "Gadgets",
    campus: "UniAbj, Gwagwalada",
    description: "Full touchscreen fitness smartwatch featuring heart rate tracker, step monitor, and custom dials.",
    whatsappNumber: "2349022223333",
    availableSizes: ["Neutral"],
    colorVariants: [
      {
        colorName: "Black",
        imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&q=80",
        isMain: true
      },
      {
        colorName: "Navy Blue",
        imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=500&q=80",
        isMain: false
      }
    ]
  },
  {
    id: 9,
    productTitle: "Fresh Chicken Shawarma",
    shopName: "ChuksCampusEats",
    price: "₦2,500",
    category: "Food & Snacks",
    campus: "Absu, Uturu",
    description: "Spicy double-sausage shredded chicken shawarma wrap with delicious garlic mayo dressing.",
    whatsappNumber: "2347012345678",
    availableSizes: ["Single", "Double Sausage"],
    colorVariants: [
      {
        colorName: "Standard",
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=500&q=80",
        isMain: true
      }
    ]
  },
  {
    id: 10,
    productTitle: "Minimalist Leather Watch",
    shopName: "Timekeepers_Futo",
    price: "₦14,000",
    category: "Accessories",
    campus: "Futo, Owerri",
    description: "Classic elegant look. Ultra-thin casing matched with a genuine premium stitched brown leather strap.",
    whatsappNumber: "2348044445555",
    availableSizes: ["One Size"],
    colorVariants: [
      {
        colorName: "Brown Leather",
        imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&q=80",
        isMain: true
      }
    ]
  },
  {
    id: 11,
    productTitle: "Hydrating Vitamin C Serum",
    shopName: "AzzaGlow_Beauty",
    price: "₦9,000",
    category: "Beauty",
    campus: "UniAbj, Gwagwalada",
    description: "Brightening antioxidant facial serum. Formulated for all skin types, non-greasy finish.",
    whatsappNumber: "2348098765432",
    availableSizes: ["30ml", "50ml"],
    colorVariants: [
      {
        colorName: "Standard Glow",
        imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&q=80",
        isMain: true
      }
    ]
  },
  {
    id: 12,
    productTitle: "Yeezy Slide Onyx",
    shopName: "KicksPlug_Imsu",
    price: "₦16,500",
    category: "Footwears",
    campus: "Imsu, Owerri",
    description: "Ultra lightweight comfortable slip-on slide slippers. Perfect lounge footwear for hostels.",
    whatsappNumber: "2348123456789",
    availableSizes: ["41", "42", "43", "44"],
    colorVariants: [
      {
        colorName: "Onyx Black",
        imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80",
        isMain: true
      },
      {
        colorName: "Pure Bone",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
        isMain: false
      }
    ]
  }
];