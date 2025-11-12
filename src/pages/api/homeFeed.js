// pages/api/rss.js


import { Feed } from 'feed';
import home from '../../../lib/api/home';
import blog from '../../../lib/api/blog';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import course from '../../../lib/api/course';
import product from '../../../lib/api/product';
import registration from '../../../lib/api/registration';
import service from '../../../lib/api/service';

export default async function handler(req, res) {
    const siteUrl = 'https://bzindia.in';

    const { lat, lon } = await location.getLocationFromIP(req);    

    // Fetch dynamic content
    const homeContentRes = await home.getHomeContent();
    const homeContent = homeContentRes.data;    

    const courseDetailPagesRes = await course.getDetails("all");
    const courseDetailPages = courseDetailPagesRes.data?.results;

    const serviceDetailPagesRes = await service.getDetails("all");
    const serviceDetailPages = serviceDetailPagesRes.data?.results;

    const registrationDetailPagesRes = await registration.getDetails("all");
    const registrationDetailPages = registrationDetailPagesRes.data?.results;

    const productDetailPagesRes = await product.getProductDetails("all");
    const productDetailPages = productDetailPagesRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results;

    const companiesRes = await company.getCompanies();
    const companies = companiesRes.data; 

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);

  const feed = new Feed({
    title: `${homeContent?.[0]?.meta_title || "BZIndia"} - RSS Feed`,
    description: homeContent?.[0]?.meta_description || 'RSS feed with latest content from BZIndia',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/images/logo.svg`,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(homeContent?.[0]?.updated || Date.now()),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/rss`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });

  // Add companies
  companies.forEach((company) => {
    feed.addItem({
      title: company.name,
      id: `${siteUrl}/${company.slug}`,
      link: `${siteUrl}/${company.slug}`,
      description: company.meta_description,
      date: new Date(company.updated),
    });
  });    

  // Add services
  serviceDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.service?.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description || "",
      date: new Date(detail.modified || Date.now()),
    });
  });

  // Add courses
  courseDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.course?.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description || "",
      date: new Date(detail.modified || Date.now()),
    });
  });

  // Add registrations
  registrationDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.registration?.title,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description || "",
      date: new Date(detail.modified || Date.now()),
    });
  });

  // Add products
  productDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.product.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description || "",
      date: new Date(detail.updated || Date.now()),
    });
  });

  // Add blog posts
  blogs.forEach((post) => {
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
