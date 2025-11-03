import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./lib/AuthContext";

export const metadata: Metadata = {
  title: "Xatlar Boshqaruv Tizimi",
  description: "Tashkiliy yozishmalarni boshqarish va kuzatish",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'Cabin', sans-serif" }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
