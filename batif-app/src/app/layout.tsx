import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "BATIF STORE — Contemporary Menswear",
  description: "Contemporary men's fashion. Premium essentials. Designed in Casablanca, Morocco.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter-tight antialiased bg-white text-black">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
