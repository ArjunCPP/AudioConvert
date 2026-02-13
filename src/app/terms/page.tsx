
export default function Terms() {
    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

            <div className="space-y-6 text-slate-700">
                <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">1. Agreement to Terms</h2>
                    <p>By accessing running Regtune, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">2. Description of Service</h2>
                    <p>Regtune provides web-based audio editing and conversion tools. The service is provided "as is" and is free to use.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">3. User Responsibilities</h2>
                    <p>You are responsible for the files you process using our service. Since all processing happens locally on your device, we do not monitor, view, or store your content. You agree not to use the service for any illegal purposes.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">4. Intellectual Property</h2>
                    <p>The Regtune application, including its innovative local processing technology and interface design, is protected by copyright and other intellectual property laws.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">5. Limitation of Liability</h2>
                    <p>In no event shall Regtune be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
                </section>
            </div>
        </div>
    );
}
