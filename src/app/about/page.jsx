import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata = {
  title: 'Our Story | HotelZenith',
  description: 'A legacy of luxury and culinary excellence spanning 15 years.',
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-600px w-full">
             <Image 
               src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" 
               alt="Hotel Interior" 
               fill 
               className="object-cover rounded-sm shadow-zenith"
             />
          </div>
          <div className="space-y-6">
            <SectionHeader title="A Legacy of Luxury" subtitle="About Us" center={false} />
            <p className="text-secondary-600 leading-relaxed">
              Founded in 2008, Hotel Zenith has established itself as a beacon of hospitality and culinary excellence. What began as a boutique hotel has transformed into a landmark destination.
            </p>
            <p className="text-secondary-600 leading-relaxed">
              Our philosophy is simple: perfection in every detail. From the thread count of our linens to the sourcing of our ingredients, nothing is overlooked.
            </p>
            <div className="pt-6 border-t border-secondary-100">
               <h4 className="font-display font-bold text-xl mb-2">Chef Alexander Sterling</h4>
               <p className="text-sm text-secondary-500">Executive Chef & Founder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
