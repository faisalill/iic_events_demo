const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    reactStrictMode: true,
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
});
