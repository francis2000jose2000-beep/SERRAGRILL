import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Serra & Grill | O Melhor Grelhado da Covilhã",
  description: "Faça já a sua reserva no Serra & Grill. Saboreie as melhores carnes e pratos tradicionais com a qualidade de sempre. Reserve online em segundos.",
  openGraph: {
    title: "Serra & Grill | Restaurante & Takeaway",
    description: "Reserve a sua mesa online de forma rápida e simples. O melhor sabor ao seu dispor.",
    url: "https://serragrill.vercel.app",
    siteName: "Serra & Grill",
    locale: "pt_PT",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#141210]">{children}</body>
    </html>
  );
}