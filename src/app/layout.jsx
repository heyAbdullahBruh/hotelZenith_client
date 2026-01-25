import { Inter, Playfair_Display } from "next/font/google";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/layout/Navber";
import CartDrawer from "@/components/layout/CartDrawer";

// Font Configuration
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "HotelZenith | Luxury Dining & Events",
  description:
    "Experience world-class dining at HotelZenith. Book tables, plan events, and order online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body antialiased bg-secondary-50 text-secondary-900 selection:bg-primary-500 selection:text-white">
        {/* Navbar sits on top of content */}
        <Navbar />

        <main className="min-h-screen">{children}</main>

        <Footer />
        <CartDrawer />
        {/* Global Toast Notification System */}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
