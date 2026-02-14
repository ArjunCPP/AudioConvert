import Link from 'next/link';
import { Music } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-sm animate-bounce-in will-animate">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-white shadow-md hover-rotate will-scale">
                        <Music className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold gradient-text bg-gradient-to-r from-slate-900 to-slate-700">
                        Regtune
                    </span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                    <Link
                        href="/terms"
                        className="relative hover:text-slate-900 transition-colors group"
                    >
                        Terms
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-200"></span>
                    </Link>
                    <Link
                        href="/privacy"
                        className="relative hover:text-slate-900 transition-colors group"
                    >
                        Privacy
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-200"></span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
