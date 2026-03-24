import Contact from "@/components/pages/Contact/Contact";

export const metadata = {
  title: "Contact Us | HotelZenith - Luxury Hotel in New York",
  description:
    "Get in touch with HotelZenith for reservations, inquiries, and special events. Our dedicated concierge team is available 24/7 to assist you with any questions about our luxury accommodations, dining, and services.",
  keywords:
    "hotel contact, luxury hotel nyc, hotel reservations, concierge services, event planning, hotel inquiry, HotelZenith contact, book hotel room, hotel customer service",
  alternates: {
    canonical: "https://hotelzenith.vercel.app/contact",
  },
  openGraph: {
    title: "Contact HotelZenith | Luxury Hotel New York",
    description:
      "Connect with our dedicated team for reservations, events, and personalized service. Experience unparalleled luxury at HotelZenith.",
    url: "https://hotelzenith.vercel.app/contact",
    siteName: "HotelZenith",
    images: [
      {
        url: "/images/contact-og.jpg",
        width: 1200,
        height: 630,
        alt: "HotelZenith Contact - Luxury Hotel in New York",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact HotelZenith | Luxury Hotel New York",
    description:
      "Connect with our dedicated team for reservations and personalized service.",
    images: ["/images/contact-twitter.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function ContactPage() {
  return <Contact />;
}
