import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CartProvider } from "@/context/CartContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mikaandco.com"),
  title: "Mika & Co. • Luxury Dessert Boutique & Cake Studio | Dhaka",
  description:
    "Handcrafted Belgian chocolate brownies, molten cheesecakes, and chunky cookies baked fresh daily in Dhaka.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mika & Co. • Luxury Dessert Boutique",
    description:
      "Handcrafted Belgian dark chocolate brownies, burnt caramel cheesecakes, and artisanal cookies baked fresh daily.",
    siteName: "Mika & Co.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mika & Co. • Luxury Dessert Boutique",
    description:
      "Handcrafted Belgian dark chocolate brownies and artisanal desserts in Dhaka.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Mika & Co.",
  image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200",
  description: "Artisanal luxury dessert boutique specializing in Belgian dark chocolate brownies, Basque burnt cheesecakes, and NYC-style cookies.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "House 14, Road 53, Gulshan-2",
    addressLocality: "Dhaka",
    postalCode: "1212",
    addressCountry: "BD",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.7925,
    longitude: 90.4078,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "23:00",
    },
  ],
  priceRange: "৳৳",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`ssr-loading ${fraunces.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#F7F1E5] text-[#221B12] antialiased font-sans">
        <CartProvider>
          <SmoothScroll>
            <Cursor />
            <ScrollProgress />
            {children}
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
