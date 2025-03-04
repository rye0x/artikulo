import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import type { Metadata } from 'next'
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'Blog Site',
  description: 'A modern blog site built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans">
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <main className="container py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
