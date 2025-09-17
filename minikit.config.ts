const ROOT_URL = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  frame: {
    version: "1",
    name: "LotusGuess",
    subtitle: "Make Decisions with Flowers",
    description: "When you're struggling to make a choice, let flowers guide you! Ask your question, pick your flower, make your decision.",
    screenshotUrls: [`${ROOT_URL}/screenshot-demo.svg`],
    iconUrl: `${ROOT_URL}/lotus-icon.svg`,
    splashImageUrl: `${ROOT_URL}/splash-flowers.svg`,
    splashBackgroundColor: "#FFB6C1",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["decision", "fun", "flowers", "choice"],
    heroImageUrl: `${ROOT_URL}/flowers-hero.svg`,
    tagline: "Enjoy making decisions with flowers",
    ogTitle: "LotusGuess - Make Decisions with Flowers",
    ogDescription: "When you are struggling to make a choice, let flowers guide you!",
    ogImageUrl: `${ROOT_URL}/flowers-hero.svg`,
  },
} as const;
