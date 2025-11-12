// pages/api/rss.js
import { Feed } from 'feed';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import customPage from '../../../lib/api/customPage';

export default async function handler(req, res) {
    const {slug, faqSlug} = req.query;

    if (!slug) return null;

    const siteUrl = "https://bzindia.in";

    const { lat, lon } = await location.getLocationFromIP(req);

    // Fetch dynamic content
    const companyRes = await company.getCompany(slug);
    const currentCompany = companyRes.data;

    const faqRes = await customPage.getFaq(faqSlug);
    const faq = faqRes.data;

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);

  const feed = new Feed({
    title: `${faq?.question} - ${currentCompany?.meta_title || `${currentCompany?.name}`} - RSS Feed`,
    description: faq?.short_answer,
    id: `${siteUrl}/${slug}/faqs/${faqSlug}`,
    link: `${siteUrl}/${slug}/faqs/${faqSlug}`,
    language: 'en',
    image: currentCompany?.logo_url || `${siteUrl}/images/logo.svg`,
    favicon: currentCompany?.favicon_url || `${siteUrl}/images/Favicon.png`,
    updated: new Date(faq?.updated || new Date()),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${slug}/faqs/${faqSlug}/rss`,
    },
    author: {
      name: currentCompany?.name,
      link: `${siteUrl}/${slug}`,
    },
    content: `
        <p><strong>Q:</strong> ${faq?.question}</p>
        <p><strong>A:</strong> ${faq?.answer}</p>
    `,
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
