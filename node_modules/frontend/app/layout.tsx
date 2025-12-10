import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Price Comparator",
  description: "Compare prices across multiple retailers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
