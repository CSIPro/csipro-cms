import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  logging: {
    incomingRequests: true,
    outgoingResponses: true,
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
