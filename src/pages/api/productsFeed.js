// pages/api/rss.js


import { Feed } from 'feed';
import home from '../../../lib/api/home';
import blog from '../../../lib/api/blog';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import product from '../../../lib/api/product';

export default async function handler(req, res) {
    const siteUrl = 'https://bzindia.in';

    const { lat, lon } = await location.getLocationFromIP(req);

    // Fetch dynamic content
    const homeContentRes = await home.getHomeContent();
    const homeContent = homeContentRes.data;    

    const nearestPlaceRes = await location.getNearestPlace(lat, lon);
    const nearestPlace = nearestPlaceRes.data;

    const stateSlug = nearestPlace.state?.slug;    

    const productDetailPagesRes = await product.getProductDetails("all");
    const productDetailPages = productDetailPagesRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results;

    const companiesRes = await company.getCompanies();
    const companies = companiesRes.data; 

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);

  const feed = new Feed({
    title: `Products - ${homeContent?.[0]?.meta_title || ""} - RSS Feed`,
    description: "List of nearby available products",
    id: `${siteUrl}/products`,
    link: `${siteUrl}/products`,
    language: 'en',
    image: `${siteUrl}/images/logo.svg`,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/products/rss`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });    

  // Add products
  productDetailPages?.forEach((detail) => {
    feed.addItem({
      title: detail.modified_title,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description || detail.title,
      date: new Date(detail.modified || Date.now()),
    });
  });

  // Add blog posts
  blogs?.slice(0, 12)?.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/learn/${post.slug}`,
      link: `${siteUrl}/learn/${post.slug}`,
      description: post.summary?.slice(0,300),
      date: new Date(post.published_on),
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
