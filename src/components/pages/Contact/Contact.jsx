"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Star,
  Users,
  Coffee,
  Wifi,
  Car,
  Utensils,
  MessageSquare,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import toast from "react-hot-toast";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  preferredContact: z.enum(["email", "phone", "whatsapp"]).optional(),
});

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      preferredContact: "email",
    },
  });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Replace with your actual API endpoint
      console.log(data);
      //   const response = await fetch("/api/contact", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(data),
      //   });

      //   if (response.ok) {
      //     setSubmitSuccess(true);
      //     reset();
      //     toast.success("Message sent successfully! We'll get back to you soon.");
      //     setTimeout(() => setSubmitSuccess(false), 5000);
      //   } else {
      //     throw new Error("Failed to send message");
      //   }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Luxury Avenue", "New York, NY 10001", "United States"],
      color: "primary",
      delay: 0.1,
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543", "24/7 Guest Support"],
      color: "primary",
      delay: 0.2,
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "concierge@hotelzenith.com",
        "events@hotelzenith.com",
        "reservations@hotelzenith.com",
      ],
      color: "primary",
      delay: 0.3,
    },
    {
      icon: Clock,
      title: "Opening Hours",
      details: [
        "Monday - Sunday: 7:00 AM - 11:00 PM",
        "Room Service: 24/7",
        "Concierge: 24/7",
      ],
      color: "primary",
      delay: 0.4,
    },
  ];

  const amenities = [
    {
      icon: Wifi,
      name: "Free Wi-Fi",
      description: "High-speed internet throughout the property",
    },
    {
      icon: Coffee,
      name: "Breakfast Service",
      description: "Complimentary breakfast from 7-10 AM",
    },
    {
      icon: Car,
      name: "Valet Parking",
      description: "24/7 valet service available",
    },
    {
      icon: Utensils,
      name: "Fine Dining",
      description: "Award-winning restaurant",
    },
    {
      icon: Users,
      name: "Event Spaces",
      description: "Meeting & banquet halls",
    },
    {
      icon: Star,
      name: "Luxury Spa",
      description: "Full-service wellness center",
    },
  ];

  const faqs = [
    {
      q: "What are the check-in and check-out times?",
      a: "Check-in is from 3:00 PM and check-out is until 11:00 AM. Early check-in and late check-out can be arranged subject to availability.",
    },
    {
      q: "Do you offer airport transportation?",
      a: "Yes, we offer luxury airport transfer services. Please contact our concierge at least 24 hours in advance to arrange.",
    },
    {
      q: "Is there a cancellation policy?",
      a: "Free cancellation up to 48 hours before arrival. Cancellations within 48 hours may incur a one-night charge.",
    },
    {
      q: "Are pets allowed?",
      a: "Yes, we are a pet-friendly hotel! Small pets are welcome with a nominal cleaning fee.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-secondary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-linear-to-r from-primary-900 to-primary-600">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src="/images/contact-hero.jpg"
            alt="Hotel Zenith Contact"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="container relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">We're Here to Help</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              Let's Create Something
              <span className="block text-primary-200">
                Extraordinary Together
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Whether you're planning a special event, need assistance with
              reservations, or simply want to know more about our services, our
              dedicated team is ready to assist you.
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <ChevronRight className="w-6 h-6 rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 relative -mt-16 z-30">
        <div className="container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center group hover:shadow-2xl transition-all duration-300"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: index * 0.1,
                  }}
                  className="w-16 h-16 bg-linear-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:rotate-6 transition-transform duration-300"
                >
                  <info.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold font-display text-secondary-900 mb-3">
                  {info.title}
                </h3>
                <div className="space-y-1 text-secondary-600">
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-white" ref={ref}>
        <div className="container">
          <SectionHeader
            title="Send Us a Message"
            subtitle="Get in Touch"
            center={true}
            className="mb-12"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              animate={controls}
              className="bg-linear-to-br from-secondary-50 to-white rounded-2xl shadow-xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-bold font-display text-secondary-900 mb-6">
                We'd Love to Hear From You
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Subject *
                    </label>
                    <input
                      {...register("subject")}
                      type="text"
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="How can we help?"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    {...register("message")}
                    rows="5"
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-4">
                    {["email", "phone", "whatsapp"].map((method) => (
                      <label key={method} className="flex items-center gap-2">
                        <input
                          {...register("preferredContact")}
                          type="radio"
                          value={method}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-secondary-600 capitalize">
                          {method}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <AnimatePresence>
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">
                        Message sent successfully!
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Map Section */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              animate={controls}
              className="relative rounded-2xl overflow-hidden shadow-xl h-125 group"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500 z-10 pointer-events-none"></div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184126160417!2d-73.9856556!3d40.7484405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg z-20"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="font-semibold text-secondary-900">
                      Hotel Zenith
                    </p>
                    <p className="text-xs text-secondary-600">
                      123 Luxury Ave, New York, NY 10001
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-linear-to-br from-secondary-50 to-white">
        <div className="container">
          <SectionHeader
            title="Exceptional Amenities"
            subtitle="Experience Luxury"
            center={true}
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          >
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.name}
                variants={scaleIn}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4"
                >
                  <amenity.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold font-display text-secondary-900 mb-2">
                  {amenity.name}
                </h3>
                <p className="text-secondary-600 text-sm">
                  {amenity.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Quick Answers"
            center={true}
          />
          <div className="max-w-3xl mx-auto mt-12">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-linear-to-r from-primary-900 to-primary-700">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Stay Updated with Hotel Zenith
            </h2>
            <p className="text-white/80 mb-8">
              Subscribe to our newsletter for exclusive offers, events, and
              luxury travel inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Social Connect Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold font-display text-secondary-900 mb-6">
              Connect With Us
            </h3>
            <div className="flex justify-center gap-4">
              {[
                { icon: Facebook, color: "#1877f2", label: "Facebook" },
                { icon: Twitter, color: "#1da1f2", label: "Twitter" },
                { icon: Instagram, color: "#e4405f", label: "Instagram" },
                { icon: Youtube, color: "#ff0000", label: "YouTube" },
                { icon: Linkedin, color: "#0077b5", label: "LinkedIn" },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <social.icon
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color: social.color }}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Accordion Component for FAQ
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="border border-secondary-200 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-secondary-50 transition-colors duration-200"
          >
            <span className="font-semibold text-secondary-900">{item.q}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-5 h-5 text-secondary-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-5 pb-5 bg-secondary-50"
              >
                <p className="text-secondary-600">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default Contact;
