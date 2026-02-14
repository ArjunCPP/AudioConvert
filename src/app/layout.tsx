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
    default: 'Audio Editor & Video to Audio Converter - RegTune',
    template: '%s | RegTune',
  },
  description: 'Free online Audio Editor and Video to Audio Converter. Edit audio, cut mp3, and convert video to audio instantly. 100% private, secure, and works offline in your browser.',
  keywords: [
    'audio editor',
    'video to audio',
    'audio convert',
    'audio cutter',
    'sound editor',
    'mp3 cutter',
    'video to mp3',
    'extract audio from video',
    'online audio trimmer',
    'free audio converter',
    'cut audio online',
    'volume booster',
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
    title: 'Audio Editor & Video to Audio Converter - RegTune',
    description: 'Free online Audio Editor and Video to Audio Converter. Edit audio, cut mp3, and convert video to audio instantly.',
    siteName: 'RegTune',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'RegTune - Audio Editor & Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Editor & Video to Audio Converter - RegTune',
    description: 'Free online Audio Editor and Video to Audio Converter. Edit audio, cut mp3, and convert video to audio instantly.',
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
