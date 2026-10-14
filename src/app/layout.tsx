import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  initialScale: 1,
};

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://analyticsdev.xyz'),
  title: {
    default: 'Analytics Dev | Web Development & AI Studio Mumbai',
    template: '%s | Analytics Dev',
  },
  description: 'Analytics Dev is one engineer in Mumbai. Websites at a fixed ₹35,000 to ₹45,000, web applications at ₹700 to ₹800 an hour, AI and data systems at $10 an hour. The code is yours from day one.',
  keywords: [
    'Web Development Mumbai',
    'Affordable Website Development for Small Business',
    'Next.js Development India',
    'AI Systems',
    'Small Business Websites',
    'Website Development'
  ],
  authors: [{ name: 'Gulzar Ahmed', url: 'https://linkedin.com/in/gul-ahm' }],
  creator: 'Gulzar Ahmed',
  alternates: {
    canonical: 'https://analyticsdev.xyz',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://analyticsdev.xyz',
    title: 'Analytics Dev | Web Development & AI Studio Mumbai',
    description: 'One engineer in Mumbai. Websites at a fixed ₹35,000 to ₹45,000, web applications and AI systems billed by the hour.',
    siteName: 'Analytics Dev',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Analytics Dev - Web Development and AI Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Analytics Dev | Web Development & AI Studio Mumbai',
    description: 'One engineer in Mumbai building websites, AI automation and data systems.',
    creator: '@analyticsdev',
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://analyticsdev.xyz/#organization",
      "name": "Analytics Dev",
      "alternateName": "AnalyticsDev",
      "url": "https://analyticsdev.xyz",
      "email": "hello@analyticsdev.xyz",
      "description": "Founder-led web development and AI systems studio building websites and data systems for small businesses in India and the GCC.",
      "founder": {
        "@type": "Person",
        "name": "Gulzar Ahmed",
        "jobTitle": "Founder & Engineer",
        "sameAs": [
          "https://linkedin.com/in/gul-ahm",
          "https://github.com/gul-ahm"
        ]
      },
      "areaServed": [
        { "@type": "Country", "name": "India" },
        { "@type": "Country", "name": "Oman" },
        { "@type": "Country", "name": "United Arab Emirates" }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mumbai",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "priceRange": "₹₹",
      "knowsAbout": [
        "Web Development",
        "Next.js",
        "React",
        "Data Engineering",
        "Machine Learning",
        "Technical SEO"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Engineering & Development Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Small Business Website Development",
              "url": "https://analyticsdev.xyz/small-business-websites"
            },
            "minPrice": "35000",
            "maxPrice": "45000",
            "priceCurrency": "INR"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Web Application Development",
              "url": "https://analyticsdev.xyz/pricing"
            },
            "price": "700",
            "maxPrice": "800",
            "priceCurrency": "INR",
            "unitCode": "HUR"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI and Data Work",
              "url": "https://analyticsdev.xyz/pricing"
            },
            "price": "10",
            "priceCurrency": "USD",
            "unitCode": "HUR"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Autonomous AI & Decision Systems",
              "url": "https://analyticsdev.xyz/services"
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://analyticsdev.xyz/#website",
      "url": "https://analyticsdev.xyz",
      "name": "Analytics Dev",
      "description": "Founder-led web development and AI systems studio in Mumbai, India.",
      "publisher": { "@id": "https://analyticsdev.xyz/#organization" },
      "inLanguage": "en-US"
    }
  ]
};

import MagneticParticles from '@/components/ui/MagneticParticles';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${inter.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 relative">
        <MagneticParticles
          className="fixed top-0 left-0 w-full h-full z-[-1]"
          quantity={100}
          staticity={30}
          ease={50}
          color="#94a3b8"
        />
        {children}
      </body>
    </html>
  );
}
