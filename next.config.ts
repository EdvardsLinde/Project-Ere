import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Stop `next dev` from writing a generic AGENTS.md into the repo when it detects an AI coding agent.
  agentRules: false,
};

export default nextConfig;
