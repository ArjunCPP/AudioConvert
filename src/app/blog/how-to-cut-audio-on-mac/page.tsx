import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "How to Cut Audio on Mac for Free — No GarageBand Needed",
    description:
        "Cut and trim audio on Mac for free using your browser. No GarageBand, no Audacity — just open AudioCutter.site in Safari or Chrome.",
    alternates: {
        canonical: "https://audiocutter.site/blog/how-to-cut-audio-on-mac",
    },
};

const relatedPosts = [
    { slug: "how-to-cut-audio-online-free", title: "How to Cut Audio Online Free" },
    { slug: "how-to-trim-mp3-online", title: "How to Trim MP3 Online — Fast & Free" },
    { slug: "how-to-convert-audio-formats", title: "How to Convert Audio Formats Free Online" },
];

export default function Post() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "How to Cut Audio on Mac for Free — No GarageBand Needed",
        description:
            "Cut and trim audio on Mac for free using your browser. No GarageBand, no Audacity — just open AudioCutter.site in Safari or Chrome.",
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
            "@id": "https://audiocutter.site/blog/how-to-cut-audio-on-mac",
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
                            How to Cut Audio on Mac for Free — No GarageBand Needed
                        </h1>
                        <p className="text-red-100 text-lg">
                            The fastest way to cut audio on Mac — no software installation, no learning curve.
                        </p>
                        <div className="mt-4 text-red-200 text-sm">Published: February 18, 2026</div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                    <article className="flex-1 prose prose-lg max-w-none">
                        <p>
                            Need to <strong>cut audio on Mac for free</strong>? While GarageBand and Audacity are popular options, they require installation and have steep learning curves. <Link href="/" className="text-red-600 font-semibold hover:underline">AudioCutter.site</Link> lets you cut any audio file on your Mac in seconds — right in Safari or Chrome, with zero setup.
                        </p>

                        <h2>Methods to Cut Audio on Mac</h2>

                        <h3>Method 1: AudioCutter.site (Recommended — Free & Instant)</h3>
                        <p>The fastest and easiest way to cut audio on Mac. No installation required.</p>

                        <h3>Method 2: GarageBand (Free, Pre-installed)</h3>
                        <p>GarageBand comes pre-installed on all Macs and can cut audio, but it's complex for simple trimming tasks.</p>

                        <h3>Method 3: QuickTime Player (Basic Trimming)</h3>
                        <p>QuickTime Player on Mac can trim audio files using Edit → Trim, but it only supports M4A and MOV formats.</p>

                        <h2>How to Cut Audio on Mac Using AudioCutter.site</h2>

                        <h3>Step 1: Open Safari or Chrome on Your Mac</h3>
                        <p>Launch your preferred browser on your Mac.</p>

                        <h3>Step 2: Go to AudioCutter.site</h3>
                        <p>
                            Navigate to <Link href="/" className="text-red-600 hover:underline">audiocutter.site</Link> — no sign-up or installation needed.
                        </p>

                        <h3>Step 3: Upload Your Audio File</h3>
                        <p>
                            Click <strong>"Upload Audio"</strong> and select your file from Finder. You can also drag and drop the file directly onto the upload area. Supports MP3, WAV, FLAC, OGG, AAC, M4A, and more.
                        </p>

                        <h3>Step 4: Trim Your Audio</h3>
                        <p>
                            Use the waveform editor to drag the start and end handles to your desired cut points. Use your mouse scroll wheel to zoom in for precision. Press Space to play/pause the preview.
                        </p>

                        <h3>Step 5: Download Your Cut Audio</h3>
                        <p>
                            Click <strong>"Download"</strong> to save the trimmed file to your Mac's Downloads folder. Choose your preferred output format (MP3, WAV, etc.).
                        </p>

                        <h2>Cutting Audio on Mac with QuickTime Player</h2>
                        <p>For quick M4A trimming using QuickTime:</p>
                        <ol>
                            <li>Open your audio file in <strong>QuickTime Player</strong></li>
                            <li>Go to <strong>Edit → Trim</strong> (or press ⌘T)</li>
                            <li>Drag the yellow handles to select the section to keep</li>
                            <li>Click <strong>Trim</strong> to apply</li>
                            <li>Go to <strong>File → Export As</strong> to save</li>
                        </ol>
                        <p><em>Note: QuickTime only supports M4A/MOV. For MP3 and other formats, use AudioCutter.site.</em></p>

                        <h2>Tips for Cutting Audio on Mac</h2>
                        <ul>
                            <li>Use <strong>keyboard shortcut ⌘+Scroll</strong> to zoom in on the waveform in AudioCutter.site.</li>
                            <li>Use headphones for accurate preview of your cuts.</li>
                            <li>For batch cutting multiple files, process them one at a time in AudioCutter.site.</li>
                            <li>Save your output to a dedicated folder to keep things organized.</li>
                        </ul>

                        <h2>Frequently Asked Questions</h2>

                        <h3>Can I cut MP3 on Mac without GarageBand?</h3>
                        <p>Yes! AudioCutter.site supports MP3 cutting directly in your browser — no GarageBand needed.</p>

                        <h3>Is there a free audio cutter for Mac?</h3>
                        <p>AudioCutter.site is 100% free and works on Mac. No download, no subscription.</p>

                        <h3>Can I cut FLAC files on Mac?</h3>
                        <p>Yes, AudioCutter.site supports FLAC, WAV, MP3, OGG, AAC, and more on Mac.</p>

                        <div className="not-prose mt-10 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cut Audio on Mac — Free!</h3>
                            <p className="text-gray-600 mb-6">Open in Safari or Chrome. No installation. No sign-up.</p>
                            <Link
                                href="/"
                                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
                            >
                                🎵 Cut Audio on Mac →
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
                                <p className="font-bold mb-3">Free Mac Audio Cutter</p>
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
