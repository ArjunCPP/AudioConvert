import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'RegTune Privacy Policy - We do not collect, store, or upload your files. All audio processing happens locally in your browser. Your privacy is protected by design.',
    openGraph: {
        title: 'Privacy Policy | RegTune',
        description: 'We do not collect, store, or upload your files. All audio processing happens locally in your browser.',
    },
};

export default function Privacy() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <div className="container mx-auto px-6 py-16 max-w-3xl animate-fade-in">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
                    <a href="/" className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-full text-sm font-semibold border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200">
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </a>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-10 text-slate-600 animate-slide-up">
                    <div className="flex items-center gap-3 pb-8 border-b border-slate-100">
                        <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Privacy</span>
                        <p className="text-sm text-slate-400 font-medium">
                            Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                        <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <span className="text-xl">🛡️</span> Short Version
                        </h2>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            <strong className="text-slate-900">We do not see, store, or upload your files.</strong> Everything happens locally in your browser. Your privacy is protected by design.
                        </p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">1</span>
                            Data Collection
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            We do not collect any personal data. We do not require registration. We do not track your usage behavior. We believe in complete anonymity for our users.
                        </p>
                    </section>

                    <hr className="border-slate-50" />

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">2</span>
                            File Processing
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            Unlike other online converters, <strong className="text-slate-900">RegTune</strong> does not upload your files to a cloud server. All audio extraction, trimming, and effect processing is performed locally on your device using WebAssembly technology. Your files never leave your computer network.
                        </p>
                    </section>

                    <hr className="border-slate-50" />

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">3</span>
                            Cookies
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            We use local storage only to save your preferences (like theme settings) to improve your experience. We do not use cookies for tracking or advertising purposes.
                        </p>
                    </section>

                    <hr className="border-slate-50" />

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">4</span>
                            Third-Party Services
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            We may use standard analytics tools (like simple page view counters) that do not track personally identifiable information. Our hosting provider may log basic access usage (IP address, user agent) for security and maintenance purposes.
                        </p>
                    </section>

                    <hr className="border-slate-50" />

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">5</span>
                            Changes to This Policy
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                        </p>
                    </section>
                </div>

                <div className="mt-12 text-center text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} RegTune. All rights reserved.
                </div>
            </div>
        </div>
    );
}
