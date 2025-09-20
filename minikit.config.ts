const ROOT_URL = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || "http://localhost:3000";
const FARCASTER_HEADER = process.env.FARCASTER_HEADER || "";
const FARCASTER_PAYLOAD = process.env.FARCASTER_PAYLOAD || "";
const FARCASTER_SIGNATURE = process.env.FARCASTER_SIGNATURE || "";
/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: FARCASTER_HEADER,
    payload: FARCASTER_PAYLOAD,
    signature: FARCASTER_SIGNATURE,
  },
  frame: {
    version: "1",
    name: "LotusGuess",
    subtitle: "Make Decisions with Flowers",
    description: "When you're struggling to make a choice, let flowers guide you! Ask your question, pick your flower, make your decision.",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/lotus-icon.png`,
    splashImageUrl: `${ROOT_URL}/splash-flowers.png`,
    splashBackgroundColor: "#FFB6C1",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["decision", "fun", "flowers", "choice"],
    heroImageUrl: `${ROOT_URL}/flowers-hero.png`,
    tagline: "Enjoy making decisions with flowers",
    ogTitle: "LotusGuess - Make Decisions with Flowers",
    ogDescription: "When you are struggling to make a choice, let flowers guide you!",
    ogImageUrl: `${ROOT_URL}/flowers-hero.png`,
  },
} as const;
