import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#0645B8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skylaban.com"),
  title: "Sky Laban | Premium Desserts",
  description:
    "Discover Sky Laban's creamy, delicious desserts crafted with premium ingredients and unforgettable flavors.",
  keywords: [
    "Sky Laban",
    "Salankatia",
    "Dessert",
    "Dairy Dessert",
    "Pistachio Mousse",
    "Chocolate Fudge",
    "Premium Desserts",
    "Laban Cream",
  ],
  authors: [{ name: "Sky Laban" }],
  creator: "Sky Laban",
  publisher: "Sky Laban",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skylaban.com",
    title: "Sky Laban | Premium Desserts",
    description:
      "Discover Sky Laban's creamy, delicious desserts crafted with premium ingredients and unforgettable flavors.",
    siteName: "Sky Laban",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Sky Laban - Premium Desserts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sky Laban | Premium Desserts",
    description:
      "Discover Sky Laban's creamy, delicious desserts crafted with premium ingredients and unforgettable flavors.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-800 antialiased selection:bg-[#43B8F2] selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
