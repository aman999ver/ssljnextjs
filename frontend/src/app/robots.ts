import { MetadataRoute } from 'next';

const DOMAIN = "https://subhalaxmijewellery.com.np";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/profile/'],
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
