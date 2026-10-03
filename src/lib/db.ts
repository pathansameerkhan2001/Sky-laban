import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PRODUCTS_DATA, type ProductItem, PRODUCT_CATEGORIES } from "@/data/brandData";
export type { ProductItem } from "@/data/brandData";

// Data interfaces
export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface FounderItem {
  id: string;
  name: string;
  title: string;
  image: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface OutletItem {
  id: string;
  name: string;
  city: string;
  state: "Telangana" | "Andhra Pradesh" | "Tamil Nadu" | "Goa" | "Karnataka" | "Kerala";
  address: string;
  status: "existing" | "upcoming";
  mapsUrl?: string;
  order?: number;
}

export interface ReelItem {
  id: string;
  number: string;
  title?: string;
  url: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface HeroSlideItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  image_url?: string;
  tag?: string;
  desktopImage?: string;
  mobileImage?: string;
  alt?: string;
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
  order: number;
  isActive: boolean;
}

export interface WebsiteContent {
  marqueeText: string;
  instagramProfileUrl: string;
  contactPhone: string;
  contactEmail: string;
  announcementText1: string;
  announcementText2: string;
  announcementText3: string;
  franchiseHeadline: string;
  franchiseSubheadline: string;
  reelsHeading: string;
  reelsSubtext: string;
  ourStoryLead: string;
  ourStoryJourney: string;
  firstStoreInfo: string;
  outletsCountInfo: string;
  sectionVisibility: {
    hero: boolean;
    marquee: boolean;
    reels: boolean;
    products: boolean;
    story: boolean;
    franchise: boolean;
    outlets: boolean;
  };
}

export interface EnquiryItem {
  id: string;
  type: "franchise" | "contact" | "general";
  name: string;
  email: string;
  phone: string;
  city: string;
  investmentBudget?: string;
  preferredLocation?: string;
  message: string;
  status: "new" | "in_review" | "contacted" | "closed";
  notes?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  outletName?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price?: string;
  }[];
  notes?: string;
  status: "pending" | "processing" | "ready" | "completed" | "cancelled";
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string; // SHA-256 or bcrypt
  name: string;
  role: "Super Admin" | "Admin" | "Manager" | "Editor" | "admin" | string;
  createdAt: string;
}

export interface SystemSettings {
  brandName: string;
  tagline: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  metaTitle: string;
  metaDescription: string;
  enableOrdering: boolean;
  maintenanceMode: boolean;
  contactPhone?: string;
  contactEmail?: string;
  openingHours?: string;
}

export interface AppDatabase {
  products: ProductItem[];
  categories: CategoryItem[];
  outlets: OutletItem[];
  reels: ReelItem[];
  heroSlides: HeroSlideItem[];
  founders: FounderItem[];
  content: WebsiteContent;
  enquiries: EnquiryItem[];
  orders: OrderItem[];
  users: AdminUser[];
  settings: SystemSettings;
  lastUpdated: string;
}

const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "dbStore.json");

// Helper to hash password
export function hashPassword(plainText: string): string {
  return crypto.createHash("sha256").update(plainText.trim()).digest("hex");
}

// Initial default seed
function getInitialData(): AppDatabase {
  const initialCategories: CategoryItem[] = [
    { id: "gulstha", name: "Gulstha", image: "/images/categories/gulstha-cloud@2x.png", description: "Velvety sweet dairy cream marbled with rich spreads.", order: 1, isActive: true },
    { id: "salankatia", name: "Salankatia", image: "/images/categories/salankatia-cloud@2x.png", description: "Our iconic flagship dessert with pure pistachio & chocolate ribbons.", order: 2, isActive: true },
    { id: "koushiri", name: "Koushiri", image: "/images/categories/koushiri-cloud@2x.png", description: "Authentic Egyptian layers of creamy dairy, crunch, and drizzle.", order: 3, isActive: true },
    { id: "ruh-hayati", name: "Ruh Hayati", image: "/images/categories/ruh-hayati-cloud@2x.png", description: "Soul-soothing artisanal cream beverages and dessert bottles.", order: 4, isActive: true },
    { id: "lou-a", name: "Lou'a", image: "/images/categories/lou-a-cloud@2x.png", description: "Delicate and velvety dessert cups crafted with Bronte pistachio.", order: 5, isActive: true },
    { id: "hiba-cake", name: "Hiba Cake", image: "/images/categories/hiba-cake-cloud@2x.png", description: "Cloud-soft sponge cake soaked in milk cream and caramel.", order: 6, isActive: true },
    { id: "cakes", name: "Cakes", image: "/images/categories/cakes-cloud@2x.png", description: "Fazea Chocola and handcrafted artisanal celebration cakes.", order: 7, isActive: true },
    { id: "kunafa-pastry", name: "Kunafa & Pastry", image: "/images/categories/kunafa-pastry-cloud@2x.png", description: "Crisp golden phyllo strands layered with warm cheese and sweet syrup.", order: 8, isActive: true },
    { id: "kabsa", name: "Kabsa", image: "/images/categories/kabsa-cloud@2x.png", description: "Royal sweet dessert tray with saffron & nuts.", order: 9, isActive: true },
    { id: "traditional-desserts", name: "Traditional Desserts", image: "/images/categories/traditional-desserts-cloud@2x.png", description: "Time-honored Middle Eastern puddings, Muhallabia, and dairy pots.", order: 10, isActive: true },
    { id: "special", name: "Special", image: "/images/categories/special-cloud@2x.png", description: "Signature chocolate spheres, celebratory gift sets, and limited batches.", order: 11, isActive: true },
  ];

  const initialOutlets: OutletItem[] = [
    {
      id: "shaikpet",
      name: "Shaikpet Branch (First Store)",
      city: "Shaikpet",
      state: "Telangana",
      address: "Tolichowki - Gachibowli Main Rd, Shaikpet, Hyderabad, Telangana (Opened April 2026)",
      status: "existing",
      mapsUrl: "https://maps.app.goo.gl/WrbnJdxuH2L8dWk39?g_st=ic",
      order: 1,
    },
    {
      id: "kondapur",
      name: "Kondapur Branch",
      city: "Kondapur",
      state: "Telangana",
      address: "Kothaguda X Road, Kondapur, Hyderabad, Telangana",
      status: "existing",
      mapsUrl: "https://maps.app.goo.gl/85jeEQsNrGLm9HQF6?g_st=ic",
      order: 2,
    },
    {
      id: "raghavendra-colony",
      name: "Raghavendra Colony Branch",
      city: "Raghavendra Colony",
      state: "Telangana",
      address: "Raghavendra Colony, Main Commercial Hub, Telangana",
      status: "existing",
      mapsUrl: "https://maps.app.goo.gl/KE4uTSoGsLKtk9y59?g_st=ic",
      order: 3,
    },
    {
      id: "santosh-nagar",
      name: "Santosh Nagar Branch",
      city: "Santosh Nagar",
      state: "Telangana",
      address: "Santosh Nagar Main Road, Hyderabad, Telangana",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Santosh+Nagar",
      order: 4,
    },
    {
      id: "kompally",
      name: "Kompally (Bahadurpally)",
      city: "Kompally",
      state: "Telangana",
      address: "Medchal Highway, Kompally / Bahadurpally, Hyderabad, Telangana",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Kompally",
      order: 5,
    },
    {
      id: "sangareddy",
      name: "Sangareddy Branch",
      city: "Sangareddy",
      state: "Telangana",
      address: "Main Commercial Center, Sangareddy, Telangana",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Sangareddy",
      order: 6,
    },
    {
      id: "ongole",
      name: "Ongole Branch",
      city: "Ongole",
      state: "Andhra Pradesh",
      address: "Kurnool Road, Near Collectorate, Ongole, Andhra Pradesh",
      status: "existing",
      mapsUrl: "https://maps.app.goo.gl/a3xPigdU7u8j1xZq8?g_st=ic",
      order: 7,
    },
    {
      id: "nandyal",
      name: "Nandyal Branch",
      city: "Nandyal",
      state: "Andhra Pradesh",
      address: "Sanjeeva Nagar Main Road, Nandyal, Andhra Pradesh",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Nandyal",
      order: 8,
    },
    {
      id: "kadapa",
      name: "Kadapa Branch",
      city: "Kadapa",
      state: "Andhra Pradesh",
      address: "Main Road, Proddatur / Kadapa, Andhra Pradesh",
      status: "existing",
      mapsUrl: "https://maps.app.goo.gl/fKSo3cWBmCPqtsHa8?g_st=ic",
      order: 9,
    },
    {
      id: "vellore",
      name: "Vellore Branch",
      city: "Vellore",
      state: "Tamil Nadu",
      address: "Katpadi Main Road, Vellore, Tamil Nadu",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Vellore",
      order: 10,
    },
    {
      id: "goa",
      name: "Goa Outlet",
      city: "Goa",
      state: "Goa",
      address: "Panaji City Center, Goa",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Goa",
      order: 11,
    },
    {
      id: "hyderabad-flagship",
      name: "Hyderabad Flagship",
      city: "Hyderabad",
      state: "Telangana",
      address: "Jubilee Hills / Banjara Hills Hub, Hyderabad, Telangana",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Hyderabad",
      order: 12,
    },
    {
      id: "warangal",
      name: "Warangal Branch",
      city: "Warangal",
      state: "Telangana",
      address: "Main Commercial Hub, Warangal, Telangana",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Warangal",
      order: 13,
    },
    {
      id: "visakhapatnam",
      name: "Visakhapatnam Outlet",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      address: "Beach Road Hub, Visakhapatnam, Andhra Pradesh",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Visakhapatnam",
      order: 14,
    },
    {
      id: "vijayawada",
      name: "Vijayawada Center",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      address: "MG Road Commercial Center, Vijayawada, Andhra Pradesh",
      status: "existing",
      mapsUrl: "https://maps.google.com/?q=Sky+Laban+Vijayawada",
      order: 15,
    },
  ];

  const initialReels: ReelItem[] = [
    {
      id: "reel-01",
      number: "01",
      title: "Founder Message — Now Open in Kondapur",
      url: "https://www.instagram.com/p/DXXQr6XEhQx/?hl=en",
      image: "/images/reel_1.jpg",
      order: 1,
      isActive: true,
    },
    {
      id: "reel-02",
      number: "02",
      title: "Hear it from the Owners — Franchise Story",
      url: "https://www.instagram.com/reel/DZ_5R_3ynJv/?hl=en",
      image: "/images/reel_2.jpg",
      order: 2,
      isActive: true,
    },
    {
      id: "reel-03",
      number: "03",
      title: "Sky Laban is Now in Shaikpet!",
      url: "https://www.instagram.com/reel/DZKrKpTycXc/?hl=en",
      image: "/images/reel_3.jpg",
      order: 3,
      isActive: true,
    },
    {
      id: "reel-04",
      number: "04",
      title: "Fallen in Love with Salankatia — Raghavendra Colony",
      url: "https://www.instagram.com/reel/DdYbdllTrwK/?hl=en",
      image: "/images/reel_4.jpg",
      order: 4,
      isActive: true,
    },
    {
      id: "reel-05",
      number: "05",
      title: "Crafting Happiness Daily — Salankatia Scoop",
      url: "https://www.instagram.com/reel/DdV6_-hvJuZ/?hl=en",
      image: "/images/reel_5.jpg",
      order: 5,
      isActive: true,
    },
    {
      id: "reel-06",
      number: "06",
      title: "Kadapa Sky Laban Review & Opening",
      url: "https://www.instagram.com/reel/DdVTC9kR043/?hl=en",
      image: "/images/reel_6.jpg",
      order: 6,
      isActive: true,
    },
    {
      id: "reel-07",
      number: "07",
      title: "Owner Launch Message — Raghavendra Colony",
      url: "https://www.instagram.com/reel/DdELqzTyiHW/?hl=en",
      image: "/images/reel_7.jpg",
      order: 7,
      isActive: true,
    },
    {
      id: "reel-08",
      number: "08",
      title: "Sky Laban Ongole Grand Experience",
      url: "https://www.instagram.com/reel/DbIjYlIocid/?hl=en",
      image: "/images/reel_8.jpg",
      order: 8,
      isActive: true,
    },
  ];

  const initialHeroSlides: HeroSlideItem[] = [
    {
      id: "table-feast",
      title: "Pure Artisanal Dessert Feast",
      subtitle: "Experience authentic Egyptian desserts crafted with velvety farm dairy, roasted Bronte pistachios, and rich chocolate.",
      image: "/hero/hero-table-feast-desktop-hd.jpg",
      tag: "Signature Selection",
      desktopImage: "/hero/hero-table-feast-desktop-hd.jpg",
      mobileImage: "/hero/hero-table-feast-mobile-hd.jpg",
      alt: "Sky Laban Signature Egyptian Desserts Feast - Aseera, Salankatiya, Koushri, Fazea Chocola",
      desktopObjectPosition: "object-center",
      mobileObjectPosition: "object-center",
      order: 1,
      isActive: true,
    },
    {
      id: "cafe-experience",
      title: "A Taste Worth Coming Back For",
      subtitle: "Welcoming dessert lounges serving handcrafted Salankatia, Egyptian Koushiri, and creamy dessert jars across South India.",
      image: "/hero/hero-cafe-experience-desktop-hd.jpg",
      tag: "Flagship Experience",
      desktopImage: "/hero/hero-cafe-experience-desktop-hd.jpg",
      mobileImage: "/hero/hero-cafe-experience-mobile-hd.jpg",
      alt: "Sky Laban Authentic Egyptian Desserts - A Taste Worth Coming Back For",
      desktopObjectPosition: "object-center",
      mobileObjectPosition: "object-center",
      order: 2,
      isActive: true,
    },
    {
      id: "gift-presentation",
      title: "Signature Celebration Gifts",
      subtitle: "Thoughtfully packaged dessert gift boxes and chocolate spheres for weddings, celebrations, and festive moments.",
      image: "/hero/hero-gift-presentation-desktop.jpg",
      tag: "Artisanal Gifting",
      desktopImage: "/hero/hero-gift-presentation-desktop.jpg",
      mobileImage: "/hero/hero-gift-presentation-mobile.jpg",
      alt: "Sky Laban Signature Dessert Bowls & Ribboned Blue Gift Box Presentation",
      desktopObjectPosition: "object-center",
      mobileObjectPosition: "object-center",
      order: 3,
      isActive: true,
    },
    {
      id: "dessert-collection",
      title: "Handcrafted Dairy Perfection",
      subtitle: "From slow-cooked traditional Middle Eastern dairy puddings to contemporary dessert cups layered with velvet cream.",
      image: "/hero/hero-dessert-collection-desktop.jpg",
      tag: "Artisanal Collection",
      desktopImage: "/hero/hero-dessert-collection-desktop.jpg",
      mobileImage: "/hero/hero-dessert-collection-mobile.jpg",
      alt: "Sky Laban Complete Artisanal Dessert Collection, Bowls, and Packaging",
      desktopObjectPosition: "object-center",
      mobileObjectPosition: "object-center",
      order: 4,
      isActive: true,
    },
  ];

  const initialFounders: FounderItem[] = [
    {
      id: "founder-akram",
      name: "B. Akram Ali Khan",
      title: "Founder & Chief Visionary",
      image: "/images/founders/akram-ali-khan-hd.jpg",
      description:
        "B. Akram Ali Khan is the Founder and Chief Visionary of Sky Laban, helping shape the brand’s vision and its journey in bringing distinctive dessert experiences to more communities. With a deep passion for premium desserts and quality craftsmanship, he guides Sky Laban’s growth from our first outlet in Shaikpet to 15 outlets across Hyderabad and beyond.",
      order: 1,
      isActive: true,
    },
    {
      id: "founder-aslam",
      name: "B. Aslam Ali Khan",
      title: "Co-Founder & Operations Leader",
      image: "/images/Founder2(1).png",
      description:
        "B. Aslam Ali Khan is the Co-Founder and Operations Leader of Sky Laban, contributing to the brand’s operations, consistency, and customer experience as it continues to grow. His dedication, hands-on approach, and strong focus on people and processes ensure excellence at every outlet.",
      order: 2,
      isActive: true,
    },
  ];

  const initialContent: WebsiteContent = {
    marqueeText: "SKY LABAN · PREMIUM · CREAMY · DREAMY",
    instagramProfileUrl: "https://www.instagram.com/sky_laban/?hl=en",
    contactPhone: "+1 234 567 890",
    contactEmail: "hello@skylaban.com",
    announcementText1: "Quality Products",
    announcementText2: "Premium Ingredients",
    announcementText3: "Loved by Families",
    franchiseHeadline: "Grow With Sky Laban",
    franchiseSubheadline:
      "Join our fast-growing dessert brand and bring world-class creamy experiences, iconic packaging, and loyal customers to your territory.",
    reelsHeading: "Moments of Pure Delight",
    reelsSubtext:
      "Discover our latest creations, behind-the-scenes moments and the sweet experiences of Sky Laban.",
    ourStoryLead: "Crafted for Moments of Pure Delight",
    ourStoryJourney:
      "Alhamdulillah, from our first store in Shaikpet in April 2026, Sky Laban has grown into a family of 15 outlets. Every location reflects our commitment to quality, consistency, and sharing moments of pure delight with our customers.",
    firstStoreInfo: "April 2026 – First Store in Shaikpet",
    outletsCountInfo: "15 Outlets Across Hyderabad & Beyond",
    sectionVisibility: {
      hero: true,
      marquee: true,
      reels: true,
      products: true,
      story: true,
      franchise: true,
      outlets: true,
    },
  };

  const initialUsers: AdminUser[] = [
    {
      id: "4300f42c-c168-4ce-9254-5fad4c4539a5",
      email: "brandnix.in@gmail.com",
      passwordHash: "",
      name: "Brandnix Admin",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-admin-1",
      email: "admin@skylaban.com",
      passwordHash: hashPassword("SkyLaban@2025"),
      name: "Sky Laban Admin",
      role: "Super Admin",
      createdAt: new Date().toISOString(),
    },
  ];

  const initialEnquiries: EnquiryItem[] = [
    {
      id: "enq-001",
      type: "franchise",
      name: "Kiran Kumar",
      email: "kiran.invest@gmail.com",
      phone: "+91 98480 12345",
      city: "Hyderabad",
      investmentBudget: "25-50 Lakhs",
      preferredLocation: "Gachibowli Financial District",
      message: "Interested in opening a flagship Sky Laban dessert lounge in Gachibowli high-street location.",
      status: "in_review",
      notes: "Followed up via call. Requested property dimensions.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "enq-002",
      type: "contact",
      name: "Fatima Begum",
      email: "fatima.b@yahoo.com",
      phone: "+91 91234 56789",
      city: "Vijayawada",
      message: "Can we order a bulk De Paris Gift Box for a family wedding reception?",
      status: "new",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const initialOrders: OrderItem[] = [
    {
      id: "ord-1001",
      orderNumber: "SKL-94021",
      customerName: "Arjun Reddy",
      customerPhone: "+91 97000 88219",
      customerEmail: "arjun.reddy@example.com",
      outletName: "Kondapur Branch",
      items: [
        { productId: "pistachio-lotus-salankatia", productName: "Pistachio Lotus Salankatia", quantity: 2 },
        { productId: "dubai-kunafa-chocolate", productName: "Dubai Kunafa Chocolate", quantity: 1 },
      ],
      status: "completed",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: "ord-1002",
      orderNumber: "SKL-94022",
      customerName: "Sneha Patel",
      customerPhone: "+91 98220 54321",
      outletName: "Shaikpet Branch",
      items: [
        { productId: "lotus-koushiri", productName: "Lotus Koushiri", quantity: 2 },
        { productId: "aseera-pistachio", productName: "Aseera Pistachio", quantity: 3 },
      ],
      status: "processing",
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ];

  const initialSettings: SystemSettings = {
    brandName: "Sky Laban",
    tagline: "Creamy Happiness in Every Scoop",
    facebookUrl: "https://facebook.com/skylaban",
    instagramUrl: "https://www.instagram.com/sky_laban/?hl=en",
    youtubeUrl: "https://youtube.com/@skylaban",
    metaTitle: "Sky Laban — Artisanal Desserts, Salankatia & Egyptian Delights",
    metaDescription: "Indulge in authentic Salankatia, Koushiri, Hiba Cakes and artisanal dairy desserts crafted with Bronte pistachios and Belgian chocolate.",
    enableOrdering: true,
    maintenanceMode: false,
    contactPhone: "+91 98765 43210",
    contactEmail: "info@skylaban.com",
    openingHours: "Mon - Sun: 11:00 AM - 12:00 AM",
  };

  return {
    products: PRODUCTS_DATA,
    categories: initialCategories,
    outlets: initialOutlets,
    reels: initialReels,
    heroSlides: initialHeroSlides,
    founders: initialFounders,
    content: initialContent,
    enquiries: initialEnquiries,
    orders: initialOrders,
    users: initialUsers,
    settings: initialSettings,
    lastUpdated: new Date().toISOString(),
  };
}

// In-memory cache for fast reads
let inMemoryDb: AppDatabase | null = null;

export function readDb(): AppDatabase {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      inMemoryDb = JSON.parse(content);
      return inMemoryDb!;
    }
  } catch (err) {
    console.warn("Could not read dbStore.json, falling back to seed", err);
  }

  inMemoryDb = getInitialData();
  writeDb(inMemoryDb);
  return inMemoryDb;
}

export function writeDb(db: AppDatabase): void {
  try {
    db.lastUpdated = new Date().toISOString();
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
    inMemoryDb = db;
  } catch (err) {
    console.error("Failed writing dbStore.json", err);
  }
}

// ---------------- PRODUCTS ----------------
export function getDbProducts(): ProductItem[] {
  const db = readDb();
  return db.products.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getDbProductById(id: string): ProductItem | undefined {
  const db = readDb();
  return db.products.find((p) => p.id === id);
}

export function saveDbProduct(product: ProductItem): ProductItem {
  const db = readDb();
  const existingIdx = db.products.findIndex((p) => p.id === product.id);

  if (existingIdx >= 0) {
    db.products[existingIdx] = { ...db.products[existingIdx], ...product };
  } else {
    if (!product.id) {
      product.id = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
    }
    db.products.push(product);
  }

  writeDb(db);
  return product;
}

export function deleteDbProduct(id: string): boolean {
  const db = readDb();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLen) {
    writeDb(db);
    return true;
  }
  return false;
}

// ---------------- CATEGORIES ----------------
export function getDbCategories(): CategoryItem[] {
  const db = readDb();
  if (!db.categories || db.categories.length === 0) {
    db.categories = [
      { id: "gulstha", name: "Gulstha", image: "/images/categories/gulstha-cloud@2x.png", description: "Velvety sweet dairy cream marbled with rich spreads.", order: 1, isActive: true },
      { id: "salankatia", name: "Salankatia", image: "/images/categories/salankatia-cloud@2x.png", description: "Our iconic flagship dessert with pure pistachio & chocolate ribbons.", order: 2, isActive: true },
      { id: "koushiri", name: "Koushiri", image: "/images/categories/koushiri-cloud@2x.png", description: "Authentic Egyptian layers of creamy dairy, crunch, and drizzle.", order: 3, isActive: true },
      { id: "ruh-hayati", name: "Ruh Hayati", image: "/images/categories/ruh-hayati-cloud@2x.png", description: "Soul-soothing artisanal cream beverages and dessert bottles.", order: 4, isActive: true },
      { id: "lou-a", name: "Lou'a", image: "/images/categories/lou-a-cloud@2x.png", description: "Delicate and velvety dessert cups crafted with Bronte pistachio.", order: 5, isActive: true },
      { id: "hiba-cake", name: "Hiba Cake", image: "/images/categories/hiba-cake-cloud@2x.png", description: "Cloud-soft sponge cake soaked in milk cream and caramel.", order: 6, isActive: true },
      { id: "cakes", name: "Cakes", image: "/images/categories/cakes-cloud@2x.png", description: "Fazea Chocola and handcrafted artisanal celebration cakes.", order: 7, isActive: true },
      { id: "kunafa-pastry", name: "Kunafa & Pastry", image: "/images/categories/kunafa-pastry-cloud@2x.png", description: "Crisp golden phyllo strands layered with warm cheese and sweet syrup.", order: 8, isActive: true },
      { id: "kabsa", name: "Kabsa", image: "/images/categories/kabsa-cloud@2x.png", description: "Royal sweet dessert tray with saffron & nuts.", order: 9, isActive: true },
      { id: "traditional-desserts", name: "Traditional Desserts", image: "/images/categories/traditional-desserts-cloud@2x.png", description: "Time-honored Middle Eastern puddings, Muhallabia, and dairy pots.", order: 10, isActive: true },
      { id: "special", name: "Special", image: "/images/categories/special-cloud@2x.png", description: "Signature chocolate spheres, celebratory gift sets, and limited batches.", order: 11, isActive: true },
    ];
    writeDb(db);
  }
  return db.categories.sort((a, b) => a.order - b.order);
}

export function saveDbCategory(category: CategoryItem): CategoryItem {
  const db = readDb();
  const existingIdx = db.categories.findIndex((c) => c.id === category.id);
  if (existingIdx >= 0) {
    db.categories[existingIdx] = { ...db.categories[existingIdx], ...category };
  } else {
    if (!category.id) {
      category.id = category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    db.categories.push(category);
  }
  writeDb(db);
  return category;
}

export function deleteDbCategory(id: string): boolean {
  const db = readDb();
  db.categories = db.categories.filter((c) => c.id !== id);
  writeDb(db);
  return true;
}

// ---------------- OUTLETS ----------------
export function getDbOutlets(): OutletItem[] {
  const db = readDb();
  return db.outlets.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function saveDbOutlet(outlet: OutletItem): OutletItem {
  const db = readDb();
  const existingIdx = db.outlets.findIndex((o) => o.id === outlet.id);
  if (existingIdx >= 0) {
    db.outlets[existingIdx] = { ...db.outlets[existingIdx], ...outlet };
  } else {
    if (!outlet.id) {
      outlet.id = outlet.city.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
    }
    db.outlets.push(outlet);
  }
  writeDb(db);
  return outlet;
}

export function deleteDbOutlet(id: string): boolean {
  const db = readDb();
  db.outlets = db.outlets.filter((o) => o.id !== id);
  writeDb(db);
  return true;
}

// ---------------- REELS ----------------
export function getDbReels(): ReelItem[] {
  const db = readDb();
  return db.reels.sort((a, b) => a.order - b.order);
}

export function saveDbReel(reel: ReelItem): ReelItem {
  const db = readDb();
  const existingIdx = db.reels.findIndex((r) => r.id === reel.id);
  if (existingIdx >= 0) {
    db.reels[existingIdx] = { ...db.reels[existingIdx], ...reel };
  } else {
    if (!reel.id) {
      reel.id = "reel-" + Date.now().toString(36);
    }
    db.reels.push(reel);
  }
  writeDb(db);
  return reel;
}

export function deleteDbReel(id: string): boolean {
  const db = readDb();
  db.reels = db.reels.filter((r) => r.id !== id);
  writeDb(db);
  return true;
}

// ---------------- HERO SLIDES ----------------
export function getDbHeroSlides(): HeroSlideItem[] {
  const db = readDb();
  return db.heroSlides.sort((a, b) => a.order - b.order);
}

export function saveDbHeroSlide(slide: HeroSlideItem): HeroSlideItem {
  const db = readDb();
  const existingIdx = db.heroSlides.findIndex((s) => s.id === slide.id);
  if (existingIdx >= 0) {
    db.heroSlides[existingIdx] = { ...db.heroSlides[existingIdx], ...slide };
  } else {
    if (!slide.id) {
      slide.id = "slide-" + Date.now().toString(36);
    }
    db.heroSlides.push(slide);
  }
  writeDb(db);
  return slide;
}

export function deleteDbHeroSlide(id: string): boolean {
  const db = readDb();
  db.heroSlides = db.heroSlides.filter((s) => s.id !== id);
  writeDb(db);
  return true;
}

// ---------------- FOUNDERS ----------------
export function getDbFounders(): FounderItem[] {
  const db = readDb();
  if (!db.founders || db.founders.length === 0) {
    db.founders = [
      {
        id: "founder-akram",
        name: "B. Akram Ali Khan",
        title: "Founder & Chief Visionary",
        image: "/images/Founder1(1).png",
        description:
          "B. Akram Ali Khan is the Founder and Chief Visionary of Sky Laban. With a passion for premium desserts and a vision to build a trusted brand, he has helped shape Sky Laban’s identity, customer experience, and continued growth.",
        order: 1,
        isActive: true,
      },
      {
        id: "founder-aslam",
        name: "B. Aslam Ali Khan",
        title: "Founder & Operations Leader",
        image: "/images/Founder2(1).png",
        description:
          "B. Aslam Ali Khan is the Founder and Operations Leader of Sky Laban. He focuses on operational consistency, quality, team coordination, and delivering a welcoming experience across Sky Laban outlets.",
        order: 2,
        isActive: true,
      },
    ];
    writeDb(db);
  }
  return db.founders.sort((a, b) => a.order - b.order);
}

export function saveDbFounder(founder: FounderItem): FounderItem {
  const db = readDb();
  if (!db.founders) db.founders = [];
  const existingIdx = db.founders.findIndex((f) => f.id === founder.id);
  if (existingIdx >= 0) {
    db.founders[existingIdx] = { ...db.founders[existingIdx], ...founder };
  } else {
    if (!founder.id) {
      founder.id = "founder-" + Date.now().toString(36);
    }
    db.founders.push(founder);
  }
  writeDb(db);
  return founder;
}

export function deleteDbFounder(id: string): boolean {
  const db = readDb();
  if (!db.founders) return false;
  const initialLen = db.founders.length;
  db.founders = db.founders.filter((f) => f.id !== id);
  if (db.founders.length !== initialLen) {
    writeDb(db);
    return true;
  }
  return false;
}

// ---------------- WEBSITE CONTENT ----------------
export function getDbContent(): WebsiteContent {
  const db = readDb();
  return db.content;
}

export function saveDbContent(content: Partial<WebsiteContent>): WebsiteContent {
  const db = readDb();
  db.content = {
    ...db.content,
    ...content,
    sectionVisibility: {
      ...db.content.sectionVisibility,
      ...(content.sectionVisibility || {}),
    },
  };
  writeDb(db);
  return db.content;
}

// ---------------- ENQUIRIES ----------------
export function getDbEnquiries(): EnquiryItem[] {
  const db = readDb();
  return db.enquiries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addDbEnquiry(enquiry: Omit<EnquiryItem, "id" | "createdAt" | "status">): EnquiryItem {
  const db = readDb();
  const newEnquiry: EnquiryItem = {
    ...enquiry,
    id: "enq-" + Date.now().toString(36),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  db.enquiries.unshift(newEnquiry);
  writeDb(db);
  return newEnquiry;
}

export function updateDbEnquiryStatus(id: string, status: EnquiryItem["status"], notes?: string): EnquiryItem | null {
  const db = readDb();
  const enquiry = db.enquiries.find((e) => e.id === id);
  if (!enquiry) return null;
  enquiry.status = status;
  if (notes !== undefined) enquiry.notes = notes;
  writeDb(db);
  return enquiry;
}

export function deleteDbEnquiry(id: string): boolean {
  const db = readDb();
  db.enquiries = db.enquiries.filter((e) => e.id !== id);
  writeDb(db);
  return true;
}

// ---------------- ORDERS ----------------
export function getDbOrders(): OrderItem[] {
  const db = readDb();
  return db.orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function saveDbOrder(order: OrderItem): OrderItem {
  const db = readDb();
  const existingIdx = db.orders.findIndex((o) => o.id === order.id);
  if (existingIdx >= 0) {
    db.orders[existingIdx] = { ...db.orders[existingIdx], ...order };
  } else {
    if (!order.id) {
      order.id = "ord-" + Date.now().toString(36);
    }
    if (!order.createdAt) {
      order.createdAt = new Date().toISOString();
    }
    db.orders.unshift(order);
  }
  writeDb(db);
  return order;
}

export function updateDbOrderStatus(id: string, status: OrderItem["status"]): OrderItem | null {
  const db = readDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  writeDb(db);
  return order;
}

// ---------------- USERS ----------------
export function getDbUsers(): Omit<AdminUser, "passwordHash">[] {
  const db = readDb();
  return db.users.map(({ passwordHash, ...user }) => user);
}

export function verifyAdminCredentials(email: string, password: string): AdminUser | null {
  const db = readDb();
  const normalizedEmail = email.trim().toLowerCase();
  const hash = hashPassword(password);
  const user = db.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.passwordHash === hash
  );
  return user || null;
}

export function saveDbUser(user: { id?: string; email: string; password?: string; name: string; role: AdminUser["role"] }): AdminUser {
  const db = readDb();
  const existingIdx = user.id ? db.users.findIndex((u) => u.id === user.id) : -1;

  if (existingIdx >= 0) {
    const existing = db.users[existingIdx];
    existing.email = user.email;
    existing.name = user.name;
    existing.role = user.role;
    if (user.password && user.password.trim()) {
      existing.passwordHash = hashPassword(user.password);
    }
    writeDb(db);
    return existing;
  } else {
    const newUser: AdminUser = {
      id: "user-" + Date.now().toString(36),
      email: user.email,
      name: user.name,
      role: user.role,
      passwordHash: hashPassword(user.password || "SkyLaban@2025"),
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  }
}

export function deleteDbUser(id: string): boolean {
  const db = readDb();
  if (db.users.length <= 1) {
    // Prevent deleting last admin
    return false;
  }
  db.users = db.users.filter((u) => u.id !== id);
  writeDb(db);
  return true;
}

// ---------------- SETTINGS ----------------
export function getDbSettings(): SystemSettings {
  const db = readDb();
  return db.settings;
}

export function saveDbSettings(settings: Partial<SystemSettings>): SystemSettings {
  const db = readDb();
  db.settings = { ...db.settings, ...settings };
  writeDb(db);
  return db.settings;
}

// ---------------- DASHBOARD STATS ----------------
export function getDashboardStats() {
  const db = readDb();
  const existingOutletsCount = db.outlets.filter((o) => o.status === "existing").length;
  const upcomingOutletsCount = db.outlets.filter((o) => o.status === "upcoming").length;
  const newEnquiriesCount = db.enquiries.filter((e) => e.status === "new").length;
  const publishedProductsCount = db.products.filter((p) => p.isAvailable !== false).length;
  const heroSlidesCount = (db.heroSlides || []).length;
  const activeHeroSlidesCount = (db.heroSlides || []).filter((h) => h.isActive !== false).length;
  const foundersCount = (db.founders || []).length;

  return {
    totalProducts: db.products.length,
    publishedProducts: publishedProductsCount,
    totalCategories: db.categories.length,
    totalOutlets: db.outlets.length,
    existingOutlets: existingOutletsCount,
    upcomingOutlets: upcomingOutletsCount,
    activeOutlets: existingOutletsCount,
    totalReels: db.reels.length,
    heroSlides: heroSlidesCount,
    activeHeroSlides: activeHeroSlidesCount,
    totalFounders: foundersCount,
    totalEnquiries: db.enquiries.length,
    newEnquiries: newEnquiriesCount,
    totalOrders: db.orders.length,
    pendingOrders: 0,
    recentOrders: db.orders.slice(0, 5),
    recentEnquiries: db.enquiries.slice(0, 5),
    recentlyUpdatedProducts: db.products.slice(0, 5),
    lastUpdated: db.lastUpdated,
  };
}
