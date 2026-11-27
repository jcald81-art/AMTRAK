import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "AMTRAK",
  version: packageJson.version,
  copyright: `© ${currentYear}, AMTRAK.`,
  meta: {
    title: "AMTRAK — Autonomous Penetration Testing Platform",
    description: "AI-driven autonomous penetration testing system with a Go engine, MITM traffic proxy, human-in-the-loop approvals, and native Grok, Claude, and OpenAI support.",
  },
};
