import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 py-8 bg-gradient-to-b from-white to-slate-50 mt-auto">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0 animate-fade-in">
                        <span className="font-bold text-slate-900 text-lg">Audio Cutter</span>
                        <p className="text-slate-500 text-sm mt-1">Professional Audio Tools. Free Ringtone Maker & Video Converter.</p>
                    </div>
                    <div className="flex space-x-6 text-sm text-slate-500 animate-fade-in stagger-1">
                        <Link
                            href="/terms"
                            className="hover:text-slate-900 transition-all hover:scale-105"
                        >
                            Terms
                        </Link>
                        <Link
                            href="/privacy"
                            className="hover:text-slate-900 transition-all hover:scale-105"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/contact"
                            className="hover:text-slate-900 transition-all hover:scale-105"
                        >
                            Contact
                        </Link>
                        <span className="text-slate-400">&copy; {new Date().getFullYear()} Audio Cutter.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
