import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@kortix/ui';
import { roobert } from './fonts/roobert';
import { roobertMono } from './fonts/roobert-mono';
import './globals.css';

export const metadata: Metadata = {
  title: '@kortix/ui Gallery',
  description: 'Showcase of @kortix/ui components',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roobert.variable} ${roobertMono.variable}`} suppressHydrationWarning>
      <body className="notranslate antialiased font-sans bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
