
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import SectionHeader from "@/components/ui/SectionHeader";
import FoodCard from "@/components/shared/FoodCard";
import Link from "next/link";
import { menuService } from "@/lib/services/menuService";
import Testimonials from "@/components/sections/Testimonials/Testimonials";
// import Food3DCarousel from "@/components/sections/Food3DCarousel";

export default async function Home() {

  let featuredFoods = [];

  try {
    const response = await menuService.getFeatured();
    featuredFoods = response.data || [];
    // console.log(response);
  } catch (error) {
    console.error("Failed to fetch featured foods:", error);
  }

  return (
    <>
    {/* <Food3DCarousel /> */}
      <Hero />
      <Stats />

      {/* Featured Menu Section */}
      <section className="py-24 bg-secondary-50">
        <div className="container">
          <SectionHeader title="Signature Dishes" subtitle="Chef's Selection" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredFoods.length > 0 ? (
              featuredFoods.map((item) => (
                <FoodCard key={item._id} food={item} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-secondary-400 mb-4">
                  Unable to load signature dishes at the moment.
                </p>
                {/* Optional: Add a retry button or link to full menu */}
                <Link href="/menu" className="text-primary-600 underline">
                  Browse Full Menu
                </Link>
              </div>
            )}
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

          <Testimonials />  
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
