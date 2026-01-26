import MyBookingsPage from "@/components/pages/mybooking";

export const metadata = {
  title: "My Reservations - Table Bookings",
  description:
    "View and manage your table bookings. Cancel reservations if needed. Stay updated with your upcoming bookings. Keep track of your dining plans easily. Interact with your reservations seamlessly. Organize your dining schedule effectively. Plan your meals with confidence. Just a few clicks away from managing your bookings.",
  keywords: [
    "my reservations",
    "table bookings",
    "cancel reservation",
    "upcoming bookings",
    "dining plans",
    "manage bookings",
    "reservation status",
    "booking history",
    "restaurant reservations",
    "dining schedule",
    "meal planning",
    "reservation management",
    "customer bookings",
    "table reservation system",
    "booking updates",
  ],
};

const page = () => {
  return <MyBookingsPage />;
};

export default page;
