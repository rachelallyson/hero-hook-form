import "@/styles/globals.css";

import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Navbar } from "@/components/navbar";
import { fontSans } from "@/config/fonts";

import { Providers } from "./providers";

export const metadata: Metadata = {
  description: "Hero Hook Form - Demo and testing application",
  icons: {
    icon: "/favicon.ico",
  },
  title: {
    default: "Hero Hook Form Demos",
    template: `%s - Hero Hook Form Demos`,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: "white", media: "(prefers-color-scheme: light)" },
    { color: "black", media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
