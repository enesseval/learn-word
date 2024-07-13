import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: ["img.clerk.com"],
   },
};

export default withNextIntl(nextConfig);
