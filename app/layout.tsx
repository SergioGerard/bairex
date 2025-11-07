import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { Metadata } from "next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bairex - Inmobiliaria de Confianza | Desarrollos Premium",
  description: "Descubrí los mejores desarrollos inmobiliarios con Bairex. Más de 20 años de experiencia, +40.000 m² construidos y 12 proyectos en construcción. Tu próximo hogar empieza acá.",
  keywords: ["inmobiliaria", "desarrollos inmobiliarios", "departamentos", "lofts", "dúplex", "propiedades", "inversión inmobiliaria", "Bairex", "construcción", "viviendas"],
  authors: [{ name: "Bairex Inmobiliaria" }],
  creator: "Bairex",
  publisher: "Bairex Inmobiliaria",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://bairex.com.ar",
    title: "Bairex - Inmobiliaria de Confianza | Desarrollos Premium",
    description: "Descubrí los mejores desarrollos inmobiliarios con Bairex. Más de 20 años de experiencia, +40.000 m² construidos y 12 proyectos en construcción.",
    siteName: "Bairex Inmobiliaria",
    images: [
      {
        url: "/hero-section-images/slider1.webp",
        width: 1200,
        height: 630,
        alt: "Bairex - Desarrollos Inmobiliarios Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bairex - Inmobiliaria de Confianza | Desarrollos Premium",
    description: "Descubrí los mejores desarrollos inmobiliarios con Bairex. Tu próximo hogar empieza acá.",
    creator: "@bairex",
    images: ["/hero-section-images/slider1.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  metadataBase: new URL("https://bairex.com.ar"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Analytics />
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-center" />
        </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
