import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ED Command Center",
  description: "ED Command Center wrapped in Next.js for deployment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
