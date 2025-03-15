import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'sonner';
import AuthProvider from '@/providers/AuthProvider';
import { DbProvider } from '@/providers/DbProvider';

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

export const metadata = {
  title: "SafeSpoon - Allergen Menu Management",
  description: "Create and manage allergen-aware menus for your food service establishment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-stone-100 antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <DbProvider>
            {children}
          </DbProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}