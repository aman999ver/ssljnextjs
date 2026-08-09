import { MetadataRoute } from 'next';

const DOMAIN = "https://subhalaxmijewellery.com.np";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all products to dynamically add them to the sitemap
  let products = [];
  try {
    const res = await fetch(`${BACKEND_URL}/api/products`);
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch products", error);
  }

  // Create dynamic product URLs
  const productUrls = products.map((product: any) => ({
    url: `${DOMAIN}/product/${product.slug || product._id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${DOMAIN}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${DOMAIN}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/rates`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...productUrls,
  ];
}
