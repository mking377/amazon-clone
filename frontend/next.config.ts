import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import nextIntlConfig from "./next-intl.config";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);

