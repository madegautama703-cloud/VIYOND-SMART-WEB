import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#02050a',
};

export const metadata: Metadata = {
  title: 'VIYOND — Smart Web Scooter Booking Engine (Bali)',
  description:
    'Rent a scooter in Bali with instant online KYC verification, live fleet inventory sync, automatic zone delivery calculator, and free hotel delivery.',
  openGraph: {
    title: 'VIYOND — Smart Web Scooter Booking Engine (Bali)',
    description:
      'Rent a scooter in Bali with instant online KYC verification, live fleet inventory sync, automatic zone delivery calculator, and free hotel delivery.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIYOND — Smart Web Scooter Booking Engine (Bali)',
    description:
      'Rent a scooter in Bali with instant online KYC verification, live fleet inventory sync, automatic zone delivery calculator, and free hotel delivery.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body
        suppressHydrationWarning
        className="bg-[#02050a] text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
