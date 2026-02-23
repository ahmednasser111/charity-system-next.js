import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Charity System",
  description: "Charity System",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Charity System",
    description: "Charity System",
  },
  twitter: {
    title: "Charity System",
    description: "Charity System",
  },
};

import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { getInitialLocale } from '@/i18n/server';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getInitialLocale();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <I18nProvider initialLocale={locale}>
            {children}
            <Toaster position="top-right" />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
