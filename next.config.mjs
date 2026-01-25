/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
        port: "",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
