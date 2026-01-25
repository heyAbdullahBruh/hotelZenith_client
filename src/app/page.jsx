import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import SectionHeader from "@/components/ui/SectionHeader";
import FoodCard from "@/components/shared/FoodCard";
import Link from "next/link";

// Mock featured data
const FEATURED_ITEMS = [
  {
    id: 1,
    name: "Truffle Risotto",
    price: 34,
    description: "Arborio rice, black truffle, parmesan crisp.",
    category: "main",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
    isVegetarian: true,
  },
  {
    id: 2,
    name: "Wagyu Steak",
    price: 85,
    description: "A5 Japanese Wagyu, garlic mash, asparagus.",
    category: "main",
    image: "https://images.unsplash.com/photo-1546241072-48010ad2862c?w=800",
  },
  {
    id: 3,
    name: "Lobster Bisque",
    price: 28,
    description: "Creamy soup, chunks of maine lobster, cognac.",
    category: "starter",
    image: "https://images.unsplash.com/photo-1547592166-23acbe3b624b?w=800",
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />

      {/* Featured Menu Section */}
      <section className="py-24 bg-secondary-50">
        <div className="container">
          <SectionHeader title="Signature Dishes" subtitle="Chef's Selection" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {FEATURED_ITEMS.map((item) => (
              <FoodCard key={item.id} food={item} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/menu"
              className="inline-block border-b-2 border-primary-500 pb-1 text-primary-500 font-bold tracking-widest uppercase hover:text-primary-600 hover:border-primary-600 transition-colors"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-24 bg-secondary-900 text-white text-center">
        <div className="container max-w-2xl">
          <h2 className="font-display text-4xl font-bold mb-6">
            Plan Your Perfect Event
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            From intimate gatherings to grand celebrations, Hotel Zenith
            provides the perfect backdrop for your most memorable moments.
          </p>
          <Link
            href="/bookings/event"
            className="bg-white text-secondary-900 px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all"
          >
            Inquire Now
          </Link>
        </div>
      </section>
    </>
  );
}


