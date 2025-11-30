// pages/api/rss.js


import { Feed } from 'feed';
import blog from '../../../lib/api/blog';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import registration from '../../../lib/api/registration';

export default async function handler(req, res) {
    const siteUrl = 'https://bzindia.in';

    const { lat, lon } = await location.getLocationFromIP(req);       

    const registrationDetailPagesRes = await registration.getDetails("all");
    const registrationDetailPages = registrationDetailPagesRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results;

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);

    let locationData = {};

    const {slug} = req.query;

    try {
      const districtRes = await location.getMinimalDistrict(slug);
      const district = districtRes.data;

      locationData = district;
    } catch (err) {
      const stateRes = await location.getMinimalState(slug);
      const state = stateRes.data;

      locationData = state;
    }

  const feed = new Feed({
    title: `Startup Services in ${locationData?.name} - RSS Feed`,
    description: "List of registrations",
    id: `${siteUrl}/registrations`,
    link: `${siteUrl}/registrations`,
    language: 'en',
    image: `${siteUrl}/images/logo.svg`,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/registrations/rss`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });    

  // Add registrations
  registrationDetailPages?.forEach((detail) => {
    feed.addItem({
      title: detail.registration?.sub_type?.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description?.slice(0,300) || "",
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
      date: new Date(post.published_on || DataTransfer.now()),
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
