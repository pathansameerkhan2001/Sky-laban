export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Leaf' | 'Sparkles' | 'Heart' | 'Award' | 'Flame' | 'Milk';
}

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  badge?: string;
  image: string;
  sceneImage?: string;
  description: string;
  tastingNotes: string[];
  servingSuggestion?: string;
  pairingNotes?: string;
}

export interface StoreLocation {
  id: string;
  city: string;
  country: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  status: 'Open Now' | 'Flagship Boutique';
}

export const TOP_BAR_DATA = {
  leftBadges: [
    { text: 'Quality Products', icon: 'Leaf' },
    { text: 'Premium Ingredients', icon: 'Sparkles' },
    { text: 'Loved by Families', icon: 'Heart' },
  ],
  storeLocator: {
    text: 'Find Store',
    href: '#find-store',
  },
  phone: {
    number: '+1 234 567 890',
    href: 'tel:+1234567890',
  },
  socials: [
    { name: 'Instagram', href: 'https://www.instagram.com/sky_laban/?hl=en', icon: 'Instagram' },
    { name: 'Facebook', href: 'https://facebook.com/skylaban', icon: 'Facebook' },
    { name: 'YouTube', href: 'https://youtube.com/@skylaban', icon: 'Youtube' },
  ],
};

export const NAVIGATION_DATA = {
  links: [
    { label: 'Home', href: '#home', active: true },
    { label: 'Our Story', href: '#our-story' },
    {
      label: 'Products',
      href: '#products',
      hasDropdown: true,
      subItems: [
        { label: 'Salankatia (Flagship Duo)', href: '#products' },
        { label: 'Pistachio Royale', href: '#products' },
        { label: 'Velvet Chocolate Fudge', href: '#products' },
        { label: 'Royal Saffron & Almond', href: '#products' },
        { label: 'Honey Blossom & Cashew', href: '#products' },
      ],
    },
  ],
  cta: {
    franchise: {
      label: 'Franchise',
      href: '#franchise',
    },
    letConnect: {
      label: 'Let Connect',
      href: '#contact',
    },
  },
};

export const HERO_DATA = {
  eyebrow: 'PREMIUM DESSERTS',
  headlineLine1: 'Creamy Happiness',
  headlineLine2: 'in Every Scoop',
  description:
    'Indulge in the rich and creamy goodness of Sky Laban — crafted with premium ingredients for an unforgettable taste.',
  primaryCta: {
    label: 'Explore Our Products',
    href: '#products',
  },
  secondaryCta: {
    label: 'Discover Our Story',
    href: '#our-story',
  },
  badge: 'Signature Creation • Salankatia Duo',
  productName: 'Sky Laban Salankatia',
  ingredients: [
    'Bronte Pistachio Puree',
    'Belgian Dark Cocoa Fudge',
    'Crushed Green Pistachios',
    'Roasted Almond Flakes',
    'Toasted Hazelnuts',
    'Fresh Farm Dairy Cream',
  ],
};

export const BENEFITS_STRIP_DATA: BenefitItem[] = [
  {
    id: 'quality',
    title: 'Quality Products',
    description: 'Masterfully prepared desserts upholding international dairy purity and velvet texture standards.',
    iconName: 'Leaf',
  },
  {
    id: 'ingredients',
    title: 'Premium Ingredients',
    description: 'Slow-roasted nuts, authentic Bronte pistachio paste, and fine cocoa folded into rich farm cream.',
    iconName: 'Sparkles',
  },
  {
    id: 'creamy',
    title: 'Rich & Creamy',
    description: 'Silky, slow-churned consistency that melts effortlessly on the tongue with every indulgent spoonful.',
    iconName: 'Milk',
  },
  {
    id: 'families',
    title: 'Loved by Families',
    description: 'A shared celebration of sweetness and warmth, bringing generations together at every table.',
    iconName: 'Heart',
  },
];

export const OUR_STORY_DATA = {
  eyebrow: 'OUR STORY',
  headline: 'Crafted for Moments of Pure Delight',
  lead: 'At Sky Laban, dessert is not just a treat — it is a cloud of velvety indulgence made to elevate life’s sweetest moments.',
  paragraphs: [
    'Born from a deep love for rich culinary heritage and delicate dairy craftsmanship, Sky Laban reimagines dessert traditions into modern, luxurious experiences.',
    'We select only the purest milk, slow-churned to achieve a cloud-like lightness paired with profound richness. We source real pistachios, aromatic cocoa, and golden honey to create harmonious dualities — like our celebrated Salankatia.',
    'Every cup is an invitation to pause, share a smile with loved ones, and experience creamy happiness in every single scoop.',
  ],
  pillars: [
    { title: '100% Farm Fresh Cream', desc: 'Sourced from trusted dairy pastures with zero artificial additives.' },
    { title: 'Artisanal Layering', desc: 'Dual-flavor compositions balanced for multi-sensory satisfaction.' },
    { title: 'Roasted Nut Toppings', desc: 'Hand-crushed pistachios, cashews, and hazelnuts in every batch.' },
  ],
  quote: {
    text: 'A dessert should feel like floating on a creamy cloud — rich, gentle, and utterly unforgettable.',
    author: 'Sky Laban Artisan Kitchen',
  },
};

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'salankatia',
    name: 'Salankatia Signature Duo',
    tagline: 'Dual-Layer Pistachio Mousse & Belgian Fudge',
    category: 'Signature Flagship',
    badge: 'Iconic Flagship',
    image: '/images/sky_laban_salankatia_tub.png',
    sceneImage: '/images/salankatia_scene_wide.jpg',
    description:
      'The crown jewel of Sky Laban. Half luscious Bronte pistachio velvet cream and half decadent Belgian chocolate fudge, generously crowned with chopped emerald pistachios and toasted diced hazelnuts.',
    tastingNotes: ['Bronte Pistachio Velvet', '70% Belgian Cocoa Ganache', 'Crunchy Hazelnut Bits', 'Cloud Milk Cream'],
    servingSuggestion: 'Chilled at 4°C - 6°C. Use a silver dessert spoon to scoop both layers together for the perfect duo.',
    pairingNotes: 'Pairs exquisitely with Arabic cardamom coffee, Turkish tea, or warm espresso.',
  },
  {
    id: 'pistachio-royale',
    name: 'Pistachio Royale',
    tagline: 'Pure Mediterranean Pistachio Cream',
    category: 'Nut Creams',
    badge: 'Most Popular',
    image: '/images/sky_laban_salankatia_tub.png',
    sceneImage: '/images/salankatia_scene_wide.jpg',
    description:
      'A masterclass in green gold. Ultra-smooth sweet laban cream whipped with 100% pure stone-ground Mediterranean pistachios and finished with a bountiful layer of emerald crunch.',
    tastingNotes: ['Aromatic Green Pistachio', 'Sweet Dairy Undertones', 'Crisp Pistachio Crumble'],
    servingSuggestion: 'Serve cold. Excellent as an elegant post-dinner centerpiece.',
    pairingNotes: 'Fresh mint tea or Moroccan mint infusion.',
  },
  {
    id: 'velvet-chocolate',
    name: 'Velvet Chocolate Fudge',
    tagline: 'Decadent Dark Cocoa Ganache Cream',
    category: 'Chocolate Delights',
    badge: 'Chocoholic Favorite',
    image: '/images/sky_laban_salankatia_tub.png',
    sceneImage: '/images/salankatia_scene_wide.jpg',
    description:
      'Intense dark cocoa harmonized with slow-churned sweet dairy cream, layered with rich fudge ribbon and garnished with shaved milk chocolate and toasted almonds.',
    tastingNotes: ['Dark Belgian Chocolate', 'Silky Fudge Ribbon', 'Almond Crunch'],
    servingSuggestion: 'Enjoy slowly at room temperature for 3 minutes before tasting to let the cocoa aromas open up.',
    pairingNotes: 'Specialty pour-over coffee or cold brew.',
  },
  {
    id: 'royal-saffron-almond',
    name: 'Royal Saffron & Almond',
    tagline: 'Persian Saffron Cream with Roasted Almonds',
    category: 'Royal Series',
    badge: 'Artisan Reserve',
    image: '/images/sky_laban_salankatia_tub.png',
    sceneImage: '/images/salankatia_scene_wide.jpg',
    description:
      'Infused with premium Persian Sargol saffron strands, golden cardamom, and pure clover honey, topped with delicately toasted California almond slivers.',
    tastingNotes: ['Golden Saffron Aroma', 'Cardamom Bloom', 'California Sliced Almonds'],
    servingSuggestion: 'Serve chilled in crystal dessert cups for festive family gatherings.',
    pairingNotes: 'Saffron Karak tea or rose-water iced tonic.',
  },
  {
    id: 'honey-cashew',
    name: 'Honey Blossom & Roasted Cashew',
    tagline: 'Raw Wildflower Honey & Buttery Cashews',
    category: 'Signature Cream',
    badge: 'Heritage Recipe',
    image: '/images/sky_laban_salankatia_tub.png',
    sceneImage: '/images/salankatia_scene_wide.jpg',
    description:
      'Golden wildflower honey spun with delicate clotted dairy cream, accented by buttery ghee-toasted cashews and golden raisins.',
    tastingNotes: ['Wildflower Honey', 'Buttery Roasted Cashew', 'Sun-Kissed Raisin Accent'],
    servingSuggestion: 'Pair with warm toasted brioche or enjoy straight from the tub.',
    pairingNotes: 'Light white tea or chamomile blossom infusion.',
  },
  {
    id: 'classic-cream-laban',
    name: 'Classic Cream Laban',
    tagline: 'Pure Cultured Dairy Velvet',
    category: 'Pure Classics',
    badge: 'The Purest Scoop',
    image: '/images/sky_laban_salankatia_tub.png',
    sceneImage: '/images/salankatia_scene_wide.jpg',
    description:
      'The pure foundation of everything we craft. Pristine whole milk cream cultured gently to achieve a delicate tang and rich, velvety finish with no heavy sweetness.',
    tastingNotes: ['Fresh Whole Milk', 'Delicate Sweet Cream', 'Silky Cloud Texture'],
    servingSuggestion: 'Top with fresh pomegranate seeds, berries, or pure mountain honey.',
    pairingNotes: 'Iced jasmine tea or fresh fruit nectar.',
  },
];

export const FRANCHISE_DATA = {
  headline: 'Grow With Sky Laban',
  subheadline:
    'Join our fast-growing dessert brand and bring world-class creamy experiences, iconic packaging, and loyal customers to your territory.',
  pillars: [
    {
      title: 'Proven Culinary Appeal',
      description: 'Signature creations like Salankatia that drive immense organic social buzz and repeat family footfall.',
    },
    {
      title: 'Turnkey Store Formats',
      description: 'Adaptable footprint options from luxury mall kiosks to flagship standalone dessert cafes.',
    },
    {
      title: 'Cold-Chain Excellence',
      description: 'Reliable supply chain support, consistent ingredient quality, and comprehensive staff training.',
    },
    {
      title: 'Global Brand Momentum',
      description: 'High-impact packaging, digital marketing toolkits, and strong brand equity crafted for modern consumers.',
    },
  ],
  stats: [
    { value: '100%', label: 'Franchise Partner Support' },
    { value: 'Global', label: 'Expansion Opportunities' },
    { value: 'Premium', label: 'Dessert Positioning' },
    { value: 'A+', label: 'Packaging & Product Visuals' },
  ],
};

export interface FranchiseLocation {
  id: string;
  name: string;
  branch: string;
  state: 'Telangana' | 'Andhra Pradesh';
  mapsUrl: string;
  image: string;
}

export const FRANCHISE_LOCATIONS_DATA: FranchiseLocation[] = [
  {
    id: 'kondapur',
    name: 'Kondapur',
    branch: 'Sky Laban (Kondapur Branch)',
    state: 'Telangana',
    mapsUrl: 'https://maps.app.goo.gl/85jeEQsNrGLm9HQF6?g_st=ic',
    image: '/images/store_kondapur.jpg',
  },
  {
    id: 'shaikpet',
    name: 'Shaikpet',
    branch: 'Sky Laban (Shaikpet Branch)',
    state: 'Telangana',
    mapsUrl: 'https://maps.app.goo.gl/WrbnJdxuH2L8dWk39?g_st=ic',
    image: '/images/store_shaikpet.jpg',
  },
  {
    id: 'ongole',
    name: 'Ongole',
    branch: 'Sky Laban (Ongole Branch)',
    state: 'Andhra Pradesh',
    mapsUrl: 'https://maps.app.goo.gl/a3xPigdU7u8j1xZq8?g_st=ic',
    image: '/images/store_ongole.jpg',
  },
  {
    id: 'ragavendra-colony',
    name: 'Ragavendra Colony',
    branch: 'Sky Laban (Ragavendra Colony Branch)',
    state: 'Telangana',
    mapsUrl: 'https://maps.app.goo.gl/KE4uTSoGsLKtk9y59?g_st=ic',
    image: '/images/store_ragavendra.jpg',
  },
  {
    id: 'proddatur',
    name: 'Proddatur',
    branch: 'Sky Laban (Proddatur Branch)',
    state: 'Andhra Pradesh',
    mapsUrl: 'https://maps.app.goo.gl/fKSo3cWBmCPqtsHa8?g_st=ic',
    image: '/images/store_proddatur.jpg',
  },
];

export const FOOTER_DATA = {
  brandBio:
    'Sky Laban is an international dessert brand celebrating creamy indulgence, pure dairy craftsmanship, and unforgettable moments shared with family and friends.',
  quickLinks: [
    { label: 'Home', href: '#home' },
    { label: 'Our Story', href: '#our-story' },
    { label: 'Products', href: '#products' },
    { label: 'Franchise', href: '#franchise' },
    { label: 'Find Store', href: '#find-store' },
  ],
  supportLinks: [
    { label: 'Quality Standards', href: '#quality' },
    { label: 'Nutritional Information', href: '#products' },
    { label: 'Ingredients Sourcing', href: '#our-story' },
    { label: 'Corporate Inquiries', href: '#contact' },
  ],
  contact: {
    phone: '+1 234 567 890',
    email: 'hello@skylaban.com',
    hq: 'Sky Laban International Ltd., Global Dairy Boulevard',
  },
  socials: [
    { name: 'Instagram', href: 'https://www.instagram.com/sky_laban/?hl=en', icon: 'Instagram' },
    { name: 'Facebook', href: 'https://facebook.com/skylaban', icon: 'Facebook' },
    { name: 'YouTube', href: 'https://youtube.com/@skylaban', icon: 'Youtube' },
  ],
  copyright: `© ${new Date().getFullYear()} Sky Laban. All rights reserved.`,
};
