import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
    className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className }) => {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const banner = bannerRef.current;
        if (!banner) return;

        const atOptions = {
            'key': 'b2fe9f40a9aedb7715c0dd624a23a337',
            'format': 'iframe',
            'height': 250,
            'width': 300,
            'params': {}
        };

        const iframe = document.createElement('iframe');
        iframe.style.width = '300px';
        iframe.style.height = '250px';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.title = "Advertisement";

        // Clear previous content
        banner.innerHTML = '';
        banner.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(`
        <html>
        <body style="margin:0;padding:0;">
          <script type="text/javascript">
            atOptions = ${JSON.stringify(atOptions)};
          </script>
          <script type="text/javascript" src="//www.highperformanceformat.com/b2fe9f40a9aedb7715c0dd624a23a337/invoke.js"></script>
        </body>
        </html>
      `);
            iframeDoc.close();
        }
    }, []);

    return (
        <div ref={bannerRef} className={`flex justify-center items-center my-8 ${className}`}></div>
    );
};
