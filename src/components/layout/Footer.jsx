import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white pt-20 pb-10 border-t border-secondary-800">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-6">
          <h3 className="font-display text-2xl font-bold text-primary-500">
            HOTELZENITH
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Experience the epitome of luxury dining and hospitality. Where
            culinary art meets exceptional service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-lg mb-6">Explore</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>
              <Link
                href="/menu"
                className="hover:text-primary-500 transition-colors"
              >
                Dining Menu
              </Link>
            </li>
            <li>
              <Link
                href="/bookings/table"
                className="hover:text-primary-500 transition-colors"
              >
                Table Reservations
              </Link>
            </li>
            <li>
              <Link
                href="/bookings/event"
                className="hover:text-primary-500 transition-colors"
              >
                Private Events
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-primary-500 transition-colors"
              >
                Our Story
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-lg mb-6">Contact</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>123 Luxury Ave, New York, NY</li>
            <li>+1 (555) 123-4567</li>
            <li>reservations@hotelzenith.com</li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-display text-lg mb-6">Hours</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex justify-between">
              <span>Mon-Thu</span> <span>11am - 10pm</span>
            </li>
            <li className="flex justify-between">
              <span>Fri-Sat</span> <span>11am - 11pm</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday</span> <span>10am - 9pm</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container pt-8 border-t border-secondary-800 text-center text-gray-500 text-xs">
        <p>
          &copy; {new Date().getFullYear()} HotelZenith. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
