// pages/api/rss.js
import { Feed } from 'feed';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';

export default async function handler(req, res) {
    const {slug} = req.query;

    if (!slug) return null;

    const siteUrl = "https://bzindia.in";

    const { lat, lon } = await location.getLocationFromIP(req);

    // Fetch dynamic content
    const companyRes = await company.getCompany(slug);
    const currentCompany = companyRes.data;

    const contactUsRes = await company.getContactUs(slug);
    const contactUs = contactUsRes.data;

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);

  const feed = new Feed({
    title: `Contact Us - ${currentCompany?.meta_title || `${currentCompany?.name}`} - RSS Feed`,
    description: `Contact details of ${currentCompany?.meta_title || currentCompany?.sub_type}`,
    id: `${siteUrl}/${slug}/contact-us`,
    link: `${siteUrl}/${slug}/contact-us`,
    language: 'en',
    image: currentCompany?.logo_url || `${siteUrl}/images/logo.svg`,
    favicon: currentCompany?.favicon_url || `${siteUrl}/images/Favicon.png`,
    updated: new Date(contactUs?.updated || new Date()),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${slug}/contact-us/rss`,
    },
    author: {
      name: currentCompany?.name,
      link: `${siteUrl}/${slug}`,
    },
  });

    // Add blog posts
    currentCompany?.blogs?.forEach((post) => {
        feed.addItem({
        title: post.title,
        id: `${siteUrl}/learn/${post.slug}`,
        link: `${siteUrl}/learn/${post.slug}`,
        description: post.summary?.slice(0, 300),
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
