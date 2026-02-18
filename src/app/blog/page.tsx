import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Blog - Audio Editing Guides & Tips | AudioCutter.site",
    description:
        "Free guides on how to cut, trim, convert, and edit audio online. Learn how to use AudioCutter.site to edit MP3, WAV, and more — no software needed.",
    alternates: { canonical: "https://audiocutter.site/blog" },
};

const posts = [
    {
        slug: "how-to-cut-audio-online-free",
        title: "How to Cut Audio Online Free (No Software Needed)",
        description:
            "Learn how to cut audio online for free in seconds. No downloads, no sign-up — just upload and trim.",
        date: "2026-02-18",
        keyword: "cut audio online free",
    },
    {
        slug: "how-to-trim-mp3-online",
        title: "How to Trim MP3 Online — Fast & Free",
        description:
            "Trim any MP3 file online without losing quality. Works in your browser on any device.",
        date: "2026-02-18",
        keyword: "trim mp3 online",
    },
    {
        slug: "how-to-remove-silence-from-audio",
        title: "How to Remove Silence from Audio Files",
        description:
            "Remove awkward pauses and silence from your audio recordings quickly and easily.",
        date: "2026-02-18",
        keyword: "remove silence from audio",
    },
    {
        slug: "how-to-cut-audio-on-iphone",
        title: "How to Cut Audio on iPhone (Free Methods)",
        description:
            "No app needed! Learn how to cut audio on iPhone using your browser for free.",
        date: "2026-02-18",
        keyword: "cut audio on iphone",
    },
    {
        slug: "how-to-trim-audio-on-android",
        title: "How to Trim Audio on Android — Free & Easy",
        description:
            "Trim audio on Android without installing any app. Use our free online audio cutter.",
        date: "2026-02-18",
        keyword: "trim audio android",
    },
    {
        slug: "how-to-cut-audio-on-mac",
        title: "How to Cut Audio on Mac for Free",
        description:
            "Cut and trim audio on Mac without GarageBand. Use our free browser-based audio cutter.",
        date: "2026-02-18",
        keyword: "cut audio on mac free",
    },
    {
        slug: "how-to-convert-audio-formats",
        title: "How to Convert Audio Formats Free Online",
        description:
            "Convert MP3, WAV, OGG, FLAC and more — all free, all in your browser.",
        date: "2026-02-18",
        keyword: "convert audio formats free",
    },
    {
        slug: "how-to-extract-audio-from-video",
        title: "How to Extract Audio from Video Free Online",
        description:
            "Extract MP3 audio from any video file online for free. No software, no watermark.",
        date: "2026-02-18",
        keyword: "extract audio from video free",
    },
];

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Audio Editing Blog
                    </h1>
                    <p className="text-xl text-red-100">
                        Free guides, tips, and tutorials for cutting, trimming, and
                        converting audio online.
                    </p>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid gap-8 md:grid-cols-2">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-red-300 transition-all duration-200"
                        >
                            <div className="mb-3">
                                <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                                    {post.keyword}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                                {post.title}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {post.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <time className="text-xs text-gray-400">{post.date}</time>
                                <span className="text-red-500 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                                    Read more →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
