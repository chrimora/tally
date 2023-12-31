import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ServiceWorkerRegister from "./sw_register";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tally",
  manifest: "/tally/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-bg-light dark:bg-bg-dark text-bg-dark dark:text-bg-light`}
      >
        <ServiceWorkerRegister />
        <div>{children}</div>
      </body>
    </html>
  );
}
