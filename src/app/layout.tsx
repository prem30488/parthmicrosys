"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPdms = pathname.startsWith("/pdms");

  return (
    <html suppressHydrationWarning lang="en">
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        {isPdms ? (
          <>
            {children}
          </>
        ) : (
          <Providers>
            <Header />
            {children}
            <Toaster position="top-right" reverseOrder={false} />
            <Footer />
            <ScrollToTop />
          </Providers>
        )}
      </body>
    </html>
  );
}
