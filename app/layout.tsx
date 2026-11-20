import type { Metadata } from "next";
import { Anton, Caveat_Brush, Inter_Tight } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

const caveatBrush = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat-brush",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: {
    default: "Sayali — AI/ML Engineer Portfolio",
    template: "%s · Sayali",
  },
  description:
    "Portfolio of Sayali — AI/ML engineer and developer. Projects, about, and contact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${caveatBrush.variable} ${anton.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
