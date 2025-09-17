import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "@/minikit.config";
import { RootProvider } from "./rootProvider";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${minikitConfig.frame.name} - ${minikitConfig.frame.subtitle}`,
    description: minikitConfig.frame.description,
    keywords: ["decision making", "flowers", "lotus", "choices", "farcaster", "miniapp"],
    authors: [{ name: "LotusGuess Team" }],
    creator: "LotusGuess",
    publisher: "LotusGuess",
    applicationName: minikitConfig.frame.name,
    category: "utility",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/lotus-icon.svg", sizes: "256x256", type: "image/svg+xml" }
      ],
      shortcut: "/favicon.svg",
      apple: "/lotus-icon.svg",
    },
    openGraph: {
      title: minikitConfig.frame.ogTitle,
      description: minikitConfig.frame.ogDescription,
      url: minikitConfig.frame.homeUrl,
      siteName: minikitConfig.frame.name,
      images: [
        {
          url: minikitConfig.frame.ogImageUrl,
          width: 800,
          height: 400,
          alt: `${minikitConfig.frame.name} - Make decisions with flowers`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: minikitConfig.frame.ogTitle,
      description: minikitConfig.frame.ogDescription,
      images: [minikitConfig.frame.ogImageUrl],
      creator: "@LotusGuess",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "fc:frame": JSON.stringify({
        version: minikitConfig.frame.version,
        imageUrl: minikitConfig.frame.heroImageUrl,
        button: {
          title: `Launch ${minikitConfig.frame.name}`,
          action: {
            name: `Launch ${minikitConfig.frame.name}`,
            type: "launch_frame",
          },
        },
      }),
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootProvider>
      <html lang="en">
        <body className={`${inter.variable} ${sourceCodePro.variable}`}>
          <SafeArea>{children}</SafeArea>
        </body>
      </html>
    </RootProvider>
  );
}
