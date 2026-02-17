import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://audiocutter.site'; // Update this to your actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
