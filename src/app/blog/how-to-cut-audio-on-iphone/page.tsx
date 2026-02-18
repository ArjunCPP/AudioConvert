import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "How to Cut Audio on iPhone — Free, No App Needed",
    description:
        "Learn how to cut audio on iPhone for free using your browser. No app download required — works on Safari and Chrome on iOS.",
    alternates: {
        canonical: "https://audiocutter.site/blog/how-to-cut-audio-on-iphone",
    },
};

const relatedPosts = [
    { slug: "how-to-trim-audio-on-android", title: "How to Trim Audio on Android" },
    { slug: "how-to-trim-mp3-online", title: "How to Trim MP3 Online — Fast & Free" },
    { slug: "how-to-cut-audio-online-free", title: "How to Cut Audio Online Free" },
];

export default function Post() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "How to Cut Audio on iPhone — Free, No App Needed",
        description:
            "Learn how to cut audio on iPhone for free using your browser. No app download required — works on Safari and Chrome on iOS.",
        author: { "@type": "Organization", name: "AudioCutter.site" },
        publisher: {
            "@type": "Organization",
            name: "AudioCutter.site",
            logo: { "@type": "ImageObject", url: "https://audiocutter.site/icon.png" },
        },
        datePublished: "2026-02-18",
        dateModified: "2026-02-18",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://audiocutter.site/blog/how-to-cut-audio-on-iphone",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <div className="min-h-screen bg-white">
                <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-14 px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-4">
                            <Link href="/blog" className="text-red-200 hover:text-white text-sm">← Back to Blog</Link>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            How to Cut Audio on iPhone — Free, No App Needed
                        </h1>
                        <p className="text-red-100 text-lg">
                            Trim audio on your iPhone using just your browser — no App Store download required.
                        </p>
                        <div className="mt-4 text-red-200 text-sm">Published: February 18, 2026</div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                    <article className="flex-1 prose prose-lg max-w-none">
                        <p>
                            Want to <strong>cut audio on iPhone</strong> without downloading an app? You can do it for free using <Link href="/" className="text-red-600 font-semibold hover:underline">AudioCutter.site</Link> — a browser-based audio editor that works perfectly on iOS Safari and Chrome.
                        </p>

                        <h2>Why Use a Browser-Based Tool on iPhone?</h2>
                        <ul>
                            <li>📱 No App Store download required</li>
                            <li>🆓 Completely free — no in-app purchases</li>
                            <li>🔒 Your audio stays on your device — never uploaded</li>
                            <li>⚡ Works instantly — no installation time</li>
                        </ul>

                        <h2>How to Cut Audio on iPhone — Step by Step</h2>

                        <h3>Step 1: Open Safari or Chrome on Your iPhone</h3>
                        <p>
                            Open your preferred browser on your iPhone. Safari and Chrome both work great with AudioCutter.site.
                        </p>

                        <h3>Step 2: Go to AudioCutter.site</h3>
                        <p>
                            Type <Link href="/" className="text-red-600 hover:underline">audiocutter.site</Link> in the address bar and tap Go.
                        </p>

                        <h3>Step 3: Upload Your Audio File</h3>
                        <p>
                            Tap <strong>"Upload Audio"</strong> and select your audio file from your iPhone's Files app, iCloud Drive, or directly from your Voice Memos. MP3, M4A, WAV, and AAC files are all supported.
                        </p>

                        <h3>Step 4: Use the Waveform to Select Your Clip</h3>
                        <p>
                            The waveform will appear on screen. Use your fingers to drag the start and end handles to select the portion of audio you want to keep. Pinch to zoom in for more precision.
                        </p>

                        <h3>Step 5: Cut and Download</h3>
                        <p>
                            Tap <strong>"Cut"</strong> to trim your audio, then tap <strong>"Download"</strong> to save the file to your iPhone. It will be saved to your Downloads folder or Files app.
                        </p>

                        <h2>Cutting Audio from Voice Memos on iPhone</h2>
                        <p>
                            If you recorded audio using the iPhone's built-in Voice Memos app, you can export the recording and then cut it:
                        </p>
                        <ol>
                            <li>Open <strong>Voice Memos</strong> on your iPhone</li>
                            <li>Tap the recording you want to edit</li>
                            <li>Tap the <strong>three dots (…)</strong> menu</li>
                            <li>Select <strong>"Share"</strong> and save it to Files</li>
                            <li>Upload it to AudioCutter.site and trim it</li>
                        </ol>

                        <h2>Tips for Cutting Audio on iPhone</h2>
                        <ul>
                            <li>Use <strong>landscape mode</strong> for a wider waveform view and more precise editing.</li>
                            <li>Wear headphones to preview your cut accurately.</li>
                            <li>For ringtones, keep clips under <strong>30 seconds</strong> (iPhone ringtone limit).</li>
                            <li>Save the cut file to iCloud Drive for easy access across devices.</li>
                        </ul>

                        <h2>Frequently Asked Questions</h2>

                        <h3>Does AudioCutter.site work on iPhone?</h3>
                        <p>Yes! AudioCutter.site is fully optimized for mobile browsers including Safari and Chrome on iPhone.</p>

                        <h3>Can I cut M4A files on iPhone?</h3>
                        <p>Yes, M4A (the format used by Voice Memos and Apple Music) is fully supported.</p>

                        <h3>How do I make a ringtone on iPhone?</h3>
                        <p>Cut your audio to under 30 seconds, download it as M4R format, and import it into iTunes or Finder to set it as a ringtone.</p>

                        <div className="not-prose mt-10 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cut Audio on iPhone — Free!</h3>
                            <p className="text-gray-600 mb-6">Open in Safari or Chrome. No app download needed.</p>
                            <Link
                                href="/"
                                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
                            >
                                🎵 Cut Audio on iPhone →
                            </Link>
                        </div>
                    </article>

                    <aside className="lg:w-64 shrink-0">
                        <div className="sticky top-6 space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-4">Related Posts</h3>
                                <ul className="space-y-3">
                                    {relatedPosts.map((p) => (
                                        <li key={p.slug}>
                                            <Link href={`/blog/${p.slug}`} className="text-sm text-red-600 hover:underline leading-snug block">
                                                {p.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-red-600 rounded-2xl p-6 text-white text-center">
                                <p className="font-bold mb-3">Free Audio Cutter</p>
                                <Link href="/" className="inline-block bg-white text-red-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors">
                                    Try It Free →
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
