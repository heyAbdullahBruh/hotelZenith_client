import MenuInterface from "@/components/menu/MenuInterface";
import SectionHeader from "@/components/ui/SectionHeader";

// Server Component
export default function MenuPage() {
  return (
    <div className="bg-secondary-50 min-h-screen pt-24 pb-20">
      <div className="container">
        <SectionHeader
          title="Culinary Excellence"
          subtitle="Our Menu"
          center={true}
          className="mb-16"
        />
        {/* Pass initial data here if we were fetching server-side */}
        <MenuInterface />
      </div>
    </div>
  );
}
