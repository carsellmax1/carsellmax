import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarSellMax - Sell Your Car Fast & Easy",
  description: "Get the best price for your car with our professional service. List once, get multiple offers from verified buyers.",
  keywords: "sell car, car selling, car valuation, car quotes, car marketplace",
  authors: [{ name: "CarSellMax Team" }],
  openGraph: {
    title: "CarSellMax - Sell Your Car Fast & Easy",
    description: "Get the best price for your car with our professional service.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarSellMax - Sell Your Car Fast & Easy",
    description: "Get the best price for your car with our professional service.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="car-store"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
