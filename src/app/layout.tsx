import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Audio Cutter & Video to Audio Converter - Free Online Tool',
    template: '%s | RegTune',
  },
  description: 'Professional audio cutter and video to audio converter. Trim, cut, and edit audio files with precision. Extract audio from videos, adjust volume, speed, and apply equalizer. 100% free, secure, and works offline in your browser.',
  keywords: [
    'audio cutter',
    'video to audio converter',
    'audio trimmer',
    'mp3 cutter',
    'audio editor',
    'video to mp3',
    'audio extractor',
    'online audio editor',
    'free audio converter',
    'trim audio online',
    'cut audio',
    'audio volume booster',
    'audio speed changer',
    'equalizer online',
    'wav editor',
    'mp4 to mp3',
  ],
  authors: [{ name: 'RegTune' }],
  creator: 'RegTune',
  publisher: 'RegTune',
  metadataBase: new URL('https://regtune.com'), // Update this to your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://regtune.com',
    title: 'Audio Cutter & Video to Audio Converter - Free Online Tool',
    description: 'Professional audio cutter and video to audio converter. Trim, cut, and edit audio files with precision. Extract audio from videos. 100% free and secure.',
    siteName: 'RegTune',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'RegTune - Audio Cutter & Video to Audio Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Cutter & Video to Audio Converter - Free Online Tool',
    description: 'Professional audio cutter and video to audio converter. Trim, cut, and edit audio files with precision. 100% free and secure.',
    images: ['/opengraph-image.png'],
    creator: '@regtune', // Update this to your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you get them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-slate-900`}
      >
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
