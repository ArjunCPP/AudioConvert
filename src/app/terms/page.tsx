import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - RegTune',
    description: 'Read our Terms of Service. RegTune offers free online audio editing and conversion tools with privacy-first local processing.',
    openGraph: {
        title: 'Terms of Service | RegTune',
        description: 'Read our Terms of Service for using RegTune audio editing tools.',
    },
};

export default function Terms() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <div className="container mx-auto px-6 py-16 max-w-3xl animate-fade-in">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Terms & Conditions</h1>
                    <a href="/" className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-full text-sm font-semibold border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200">
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </a>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-10 text-slate-600 animate-slide-up">
                    <div className="flex items-center gap-3 pb-8 border-b border-slate-100">
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Legal</span>
                        <p className="text-sm text-slate-400 font-medium">
                            Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">1</span>
                            Agreement to Terms
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            By accessing and using  <strong className="text-slate-900">RegTune</strong>, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the Service.
                        </p>
                    </section>

                    <hr className="border-slate-50" />

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">2</span>
                            Description of Service
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            <strong className="text-slate-900">RegTune</strong> provides web-based audio editing and conversion tools. The service is provided "as is" and is free to use. We strive to provide the best experience but do not guarantee that the service will be uninterrupted, secure, or error-free.
                        </p>
                    </section>

                    <hr className="border-slate-50" />

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">3</span>
                            User Responsibilities
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            You are solely responsible for the files you process using our service. Using our service, you acknowledge that:
                        </p>
                        <ul className="list-disc leading-relaxed text-lg text-slate-600 pl-16 space-y-2">
                            <li>All processing happens locally on your device (client-side).</li>
                            <li>We do not monitor, view, store, or upload your audio or video files to any server.</li>
                            <li>You agree not to use the service for any illegal purposes or to infringe on the intellectual property rights of others.</li>
                        </ul>
                    </section>

                    <hr className="border-slate-50" />

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">4</span>
                            Intellectual Property
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            The  <strong className="text-slate-900">RegTune</strong> application, including its innovative local processing technology, interface design, graphics, and code, is protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the service.
                        </p>
                    </section>

                    <hr className="border-slate-50" />

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-sm font-bold">5</span>
                            Limitation of Liability
                        </h2>
                        <p className="leading-relaxed text-lg text-slate-600 pl-11">
                            In no event shall  <strong className="text-slate-900">RegTune</strong> be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
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
