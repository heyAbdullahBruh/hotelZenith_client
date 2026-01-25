import SectionHeader from "@/components/ui/SectionHeader";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | HotelZenith",
  description: "Get in touch with HotelZenith for reservations and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 bg-secondary-50 min-h-screen">
      <div className="container">
        <SectionHeader
          title="Get in Touch"
          subtitle="Contact Us"
          center={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 shadow-sm rounded-sm text-center space-y-4">
              <MapPin className="mx-auto text-primary-500" size={32} />
              <h3 className="font-bold font-display text-lg">Location</h3>
              <p className="text-secondary-500 text-sm">
                123 Luxury Ave,
                <br />
                New York, NY 10001
              </p>
            </div>
            <div className="bg-white p-8 shadow-sm rounded-sm text-center space-y-4">
              <Phone className="mx-auto text-primary-500" size={32} />
              <h3 className="font-bold font-display text-lg">Phone</h3>
              <p className="text-secondary-500 text-sm">
                +1 (555) 123-4567
                <br />
                +1 (555) 987-6543
              </p>
            </div>
            <div className="bg-white p-8 shadow-sm rounded-sm text-center space-y-4">
              <Mail className="mx-auto text-primary-500" size={32} />
              <h3 className="font-bold font-display text-lg">Email</h3>
              <p className="text-secondary-500 text-sm">
                concierge@hotelzenith.com
                <br />
                events@hotelzenith.com
              </p>
            </div>
            <div className="bg-white p-8 shadow-sm rounded-sm text-center space-y-4">
              <Clock className="mx-auto text-primary-500" size={32} />
              <h3 className="font-bold font-display text-lg">Hours</h3>
              <p className="text-secondary-500 text-sm">
                Mon-Sun: 7am - 11pm
                <br />
                Room Service: 24/7
              </p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="h-500px bg-secondary-200 rounded-sm relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184126160417!2d-73.9856556!3d40.7484405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
