import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata = { title: "CineVault by Luvo", description: "Find where to watch" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0f1a] text-white antialiased flex flex-col">
        <Navbar />
<div className="h-12 md:h-14 shrink-0" />  {/* spacer matches navbar height */}
<main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );

return (
    <html lang="en">
      <body>
        {children}
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );

}

