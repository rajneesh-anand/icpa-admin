const withImages = require("next-images");

const isProd = process.env.NODE_ENV === "production";

const apiUrl = isProd
  ? "https://nodappserver.herokuapp.com/api"
  : "http://localhost:8080/api";

const publicUrl = isProd
  ? "https://sdalegal.herokuapp.com"
  : "http://localhost:3000";

module.exports = withImages({
  env: {
    PUBLIC_URL: publicUrl,
    API_URL: apiUrl,
  },
  images: {
    domains: ["res.cloudinary.com", "icpamedia.s3.amazonaws.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
});
