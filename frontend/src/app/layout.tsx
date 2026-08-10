import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Shree Subha Laxmi Jewellery",
    default: "Shree Subha Laxmi Jewellery | Authentic & Pure",
  },
  description: "Exquisite 24K and 22K Gold, Silver, and Diamond jewellery in Biratnagar, Nepal. Discover our heritage of purity, trust, and craftsmanship.",
  metadataBase: new URL('https://subhalaxmijewellery.com.np'),
  openGraph: {
    title: "Shree Subha Laxmi Jewellery",
    description: "Exquisite 24K and 22K Gold, Silver, and Diamond jewellery in Biratnagar.",
    url: 'https://subhalaxmijewellery.com.np',
    siteName: 'Shree Subha Laxmi Jewellery',
    locale: 'en_NP',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "678679165692-us7fbcb6e8v5hh3aofnntt2gunmfc7pp.apps.googleusercontent.com"}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
