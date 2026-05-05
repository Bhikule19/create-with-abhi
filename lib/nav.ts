import { MAIL_HREF } from "./socials";

export type NavLabel = {
  id: "brand" | "theme" | "menu" | "talk";
  primary: string;
  alt: string;
  href?: string;
  action?: "toggle-theme" | "toggle-menu";
};

export const navLabels: NavLabel[] = [
  { id: "brand", primary: "CREATE WITH ABHI", alt: "BHIKULE.DEV", href: "/" },
  { id: "theme", primary: "DARK MODE", alt: "LIGHT MODE", action: "toggle-theme" },
  { id: "menu", primary: "MENU", alt: "OPEN", action: "toggle-menu" },
  { id: "talk", primary: "LET'S TALK", alt: "SAY HELLO", href: MAIL_HREF },
];
