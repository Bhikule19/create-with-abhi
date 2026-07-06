import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
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

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--ff-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--ff-serif",
  display: "swap",
  axes: ["opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--ff-mono",
  display: "swap",
});

const SITE_URL = "https://createwithabhi.in";
const TITLE = "Abhishek Bhikule — Create with Abhi";
const DESCRIPTION =
  "Independent web designer & developer in Mumbai. Cinematic websites, landing pages, WordPress and motion — designed and built end to end.";

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
    "web designer",
    "freelance web developer",
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
  themeColor: "#0A0A0B",
  colorScheme: "dark",
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
      className={`${instrumentSans.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-stage text-ink">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
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
