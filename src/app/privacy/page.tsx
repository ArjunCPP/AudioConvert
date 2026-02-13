
export default function Privacy() {
    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="space-y-6 text-slate-700">
                <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl mb-8">
                    <h2 className="text-lg font-bold text-blue-900 mb-2">Short Version</h2>
                    <p className="text-blue-800">
                        <strong>We do not see, store, or upload your files.</strong> Everything happens locally in your browser. Your privacy is protected by design.
                    </p>
                </div>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">1. Data Collection</h2>
                    <p>We do not collect any personal data. We do not require registration. We do not track your usage behavior.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">2. File Processing</h2>
                    <p>Unlike other online converters, Regtune does not upload your files to a cloud server. All audio extraction, trimming, and effect processing is performed locally on your device using WebAssembly technology. Your files never leave your computer network.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">3. Cookies</h2>
                    <p>We use local storage only to save your preferences (like theme settings) to improve your experience. We do not use cookies for tracking or advertising purposes.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">4. Third-Party Services</h2>
                    <p>We may use standard analytics tools (like simple page view counters) that do not track personally identifiable information. Our hosting provider may log basic access usage (IP address, user agent) for security and maintenance purposes.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">5. Changes to This Policy</h2>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                </section>
            </div>
        </div>
    );
}
