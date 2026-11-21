import type { Metadata, Viewport } from "next";
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
    default: "Sayli — AI/ML Engineer Portfolio",
    template: "%s · Sayli",
  },
  description:
    "Portfolio of Sayli — AI/ML engineer and developer. Projects, about, and contact.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b2f20",
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
            __html: `(function(){
  document.documentElement.classList.add("js");
  try { history.scrollRestoration = "manual"; } catch (e) {}
  var h = location.hash;
  var section = h === "#about" || h === "#experience" || h === "#projects" || h === "#contact";
  document.documentElement.classList.add(section ? "land-section" : "land-home");
})();`,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var root = document.documentElement;
  if (!root.classList.contains("land-section")) return;
  var id = (location.hash || "").replace("#", "");
  var el = id && document.getElementById(id);
  if (el) el.scrollIntoView({ block: "start" });
  root.classList.add("land-placed");
})();`,
          }}
        />
      </body>
    </html>
  );
}
