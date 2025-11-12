// pages/api/rss.js

import { Feed } from 'feed';
import home from '../../../lib/api/home';
import blog from '../../../lib/api/blog';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import { useParams } from 'next/navigation';

export default async function handler(req, res) {
    const {blogSlug} = req.query;
    const {slug} = req.query;

    const siteUrl = 'https://bzindia.in';

    const { lat, lon } = await location.getLocationFromIP(req);
    
    // Fetch dynamic content
    const homeContentRes = await home.getHomeContent();
    const homeContent = homeContentRes.data;    

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results;

    const getImageMimeType = (url) => {
            if (url.endsWith('.png')) return 'image/png';
            if (url.endsWith('.webp')) return 'image/webp';
            if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
            return 'image/*';
        };

    const seen = new Set();
    let categories;

    if (blogs) {
        const category_list = blogs.map(blog => ({
            name: blog?.category || "",
            slug: blog?.category_slug || "#",
            count: blog?.category_count || 0,
        })).filter(cat => {
            if (seen.has(cat.name)) return false;
            seen.add(cat.name);
            return true;
        });
        categories = category_list;
    }

    const currentBlogRes = await blog.getBlogs(`/blog_api/blogs/${blogSlug}`);
    const currentBlog = currentBlogRes.data;

    const companiesRes = await company.getCompanies();
    const companies = companiesRes.data; 

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);

  const feed = new Feed({
    title: `${currentBlog.title} - ${homeContent?.[0]?.meta_title || "BZ India"} - RSS Feed`,
    description: currentBlog.meta_description || currentBlog.summary || "Latest blog",
    id: `${siteUrl}/learn/${currentBlog.slug}`,
    link: `${siteUrl}/learn/${currentBlog.slug}`,
    language: 'en',
    image: `${siteUrl}/images/logo.svg`,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(currentBlog.published_date || Date.now()),
    generator: 'Feed for Next.js',
    feedLinks: {
        rss2: `${siteUrl}/learn/${currentBlog.slug}/rss`
    },
    author: {
        name: 'BZ India',
        link: siteUrl
    }
    });

    feed.addItem({
        title: currentBlog.title,
        id: `${siteUrl}/learn/${currentBlog.slug}`,
        link: `${siteUrl}/learn/${currentBlog.slug}`,
        description: currentBlog.meta_description || currentBlog.summary,
        content: currentBlog.content,
        author: [
            {
            name: 'BZ India',
            link: siteUrl
            }
        ],
        date: new Date(currentBlog.published_date || Date.now()),

        enclosure: currentBlog.image_url ? {
            url: `${currentBlog.image_url}`,  
            type: getImageMimeType(currentBlog.image_url)
        } : undefined
    });


    // Add Tags
    currentBlog?.meta_tags?.slice(0, 12).forEach((tag) => {
        feed.addItem({
        title: tag.name,
        id: `${siteUrl}/tag/${tag.slug}`,
        link: `${siteUrl}/tag/${tag.slug}`,
        description: tag.description || `Learn more about ${tag.name}`,
        date: new Date(tag.updated || Date.now()),
        });
    });

    // Add Categories
    categories?.slice(0, 12).forEach((cat) => {
        feed.addItem({
        title: cat.name,
        id: `${siteUrl}/learn/?category=${encodeURIComponent(cat.name)}`,
        link: `${siteUrl}/learn/?category=${encodeURIComponent(cat.name)}`,
        description: cat.description || `Learn more about ${encodeURIComponent(cat.name)}`,
        date: new Date(cat.updated || Date.now()),
        });
    });

    // Add blog posts
    blogs?.slice(0, 5)?.forEach((post) => {
        feed.addItem({
        title: post.title,
        id: `${siteUrl}/learn/${post.slug}`,
        link: `${siteUrl}/learn/${post.slug}`,
        description: post.summary?.slice(0,300),
        date: new Date(post.published_on),
        });
    });

    if (!slug) {
        // Add companies
        companies?.forEach((company) => {
            feed.addItem({
            title: company.name,
            id: `${siteUrl}/${company.slug}`,
            link: `${siteUrl}/${company.slug}`,
            description: company.meta_description,
            date: new Date(company.updated),
            });
        });
    }

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
