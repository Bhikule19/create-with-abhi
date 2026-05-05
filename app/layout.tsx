import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TopBar } from "@/components/chrome/TopBar";
import { MenuProvider } from "@/components/chrome/MenuProvider";
import { MenuOverlay } from "@/components/chrome/MenuOverlay";
import { Cursor } from "@/components/chrome/Cursor";
import { Preloader } from "@/components/chrome/Preloader";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--ff-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--ff-body",
  display: "swap",
});

const SITE_URL = "https://createwithabhi.in";
const TITLE = "Abhishek Bhikule — Create with Abhi";
const DESCRIPTION =
  "Full-stack developer based in Mumbai. I build for the web — products, plugins, and the occasional weekend experiment.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Create with Abhi",
  },
  description: DESCRIPTION,
  applicationName: "Create with Abhi",
  authors: [{ name: "Abhishek Bhikule", url: SITE_URL }],
  creator: "Abhishek Bhikule",
  keywords: [
    "Abhishek Bhikule",
    "full-stack developer",
    "Next.js",
    "Laravel",
    "WordPress",
    "Mumbai",
    "portfolio",
    "Brainstorm Force",
    "SureFeedback",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Create with Abhi",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${manrope.variable}`}
    >
      <body className="bg-bg text-ink">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <MenuProvider>
            <SmoothScroll>
              <Preloader />
              <ScrollProgress />
              <Cursor />
              <TopBar />
              <MenuOverlay />
              {children}
            </SmoothScroll>
          </MenuProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
