
import { Feed } from 'feed';
import blog from '../../../lib/api/blog';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import product from '../../../lib/api/product';

export default async function handler(req, res) {
    const {slug} = req.query;

    const siteUrl = 'https://bzindia.in';

    const { lat, lon } = await location.getLocationFromIP(req);    

    // Fetch dynamic content        
    const companyRes = await company.getCompany(slug);
    const currentCompany = companyRes.data;

    const detailPagesRes = await product.getProductDetails(slug);
    const detailPages = detailPagesRes.data?.results;    

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);

    const getImageMimeType = (url) => {
        if (url.endsWith('.png')) return 'image/png';
        if (url.endsWith('.webp')) return 'image/webp';
        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
        return 'image/*';
    };

  const feed = new Feed({
    title: `Products - ${currentCompany?.meta_title || currentCompany?.name || ""} - RSS Feed`,
    description: `List of products offered by ${currentCompany?.name}`,
    id: `${siteUrl}/${currentCompany?.slug}/products`,
    link: `${siteUrl}/${currentCompany?.slug}/products`,
    language: 'en',
    image: currentCompany?.logo_url || `${siteUrl}/images/logo.svg`,
    favicon: currentCompany?.favicon_url || `${siteUrl}/images/Favicon.png`,
    updated: new Date(),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${currentCompany?.slug}/products/rss`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });    

  // Add products
  detailPages?.forEach((detail) => {
    feed.addItem({
      title: detail.meta_title || detail.product?.name,
      id: `${siteUrl}/${slug}/${detail?.product?.category_slug}/${detail?.product?.sub_category_slug}/${detail?.slug}`,
      link: `${siteUrl}/${slug}/${detail?.product?.category_slug}/${detail?.product?.sub_category_slug}/${detail?.slug}`,
      description: detail.meta_description || detail.product?.meta_description || "",
      date: new Date(detail.updated || Date.now()),

        enclosure: detail.product?.image_url ? {
            url: `${detail.product.image_url}`,  
            type: getImageMimeType(detail.product.image_url)
        } : undefined
    });
  });

  // Add blog posts
  currentCompany?.blogs?.slice(0, 12)?.forEach((post) => {
    let blogUrl = `${siteUrl}/learn/${post.slug}`;

    if (blog.company_slug) {
        blogUrl = `${siteUrl}/${blog.company_slug}/learn/${post.slug}`;
    }

    feed.addItem({
      title: post.title,
      id: blogUrl,
      link: blogUrl,
      description: post.summary?.slice(0,300),
      date: new Date(post.published_on),

        enclosure: post.image_url ? {
            url: `${post.image_url}`,  
            type: getImageMimeType(post.image_url)
        } : undefined
    });
  });

  // Add destinations
  destinations.slice(0, 12).forEach((dest) => {
    feed.addItem({
      title: dest.name,
      id: `${siteUrl}/destination/${dest.slug}`,
      link: `${siteUrl}/destination/${dest.slug}`,
      description: dest.meta_description?.slice(0,300) || `Learn more about ${dest.name}`,
      date: new Date(dest.updated || Date.now()),
    });
  });  

  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(feed.rss2());
  res.end();
}
