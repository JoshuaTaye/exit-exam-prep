import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppChrome } from "@/components/nav/app-chrome";
import { getCurrentUser } from "@/lib/user";
import { getStudyStreak } from "@/lib/streak";

export const metadata: Metadata = {
  title: "ExitPrep — SE & Computing Technology",
  description:
    "A focused, blueprint-driven operating system for passing the MoE BSc Software Engineering & Computing Technology national exit examination.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaff" },
    { media: "(prefers-color-scheme: dark)", color: "#101013" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const { current: streak } = await getStudyStreak(user.id);

  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppChrome streak={streak}>{children}</AppChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
