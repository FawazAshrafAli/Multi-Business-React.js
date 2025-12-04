


import { Feed } from 'feed';
import blog from '../../../lib/api/blog';
import location from '../../../lib/api/location';
import registration from '../../../lib/api/registration';

export default async function handler(req, res) {    
    const {slug, subTypeSlug} = req.query;

    const siteUrl = 'https://bzindia.in';
    
    let isListRegistrationDetailsPage = false;

    const getImageMimeType = (url) => {
        if (url.endsWith('.png')) return 'image/png';
        if (url.endsWith('.webp')) return 'image/webp';
        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
        return 'image/*';
    };
    
    let urlLocationRes = await location.getUrlLocation("state", subTypeSlug);

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("district", subTypeSlug);
    }

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("place", subTypeSlug);
    }

    const urlLocation = urlLocationRes.data;

    const locationData = urlLocation?.data;

    const passingSubTypeSlug = subTypeSlug?.replace(`-${locationData?.slug}`, "");

    const subTypeRes = await registration.getSubTypes("all", undefined, `location_slug=${passingSubTypeSlug}`);
    const subType = subTypeRes.data?.results?.[0];
    
    if (!subType) {
        subTypeRes = await registration.getSubType("all", passingSubTypeSlug);
        subType = subTypeRes.data;

    }

    if (subType && (locationData?.district_slug == slug || locationData?.state_slug == slug || locationData?.slug == slug)) {
      isListRegistrationDetailsPage = true;
    }

  let feed;

  if (isListRegistrationDetailsPage) {
    const detailRes = await registration.getSubTypes("all");
    const details = detailRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results;      

    feed = new Feed({
    title: `${subType?.full_title} ${locationData?.name || ""} - RSS Feed`,
    description: subType?.meta_description?.replace("place_name", locationData?.name) || "",
    id: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug}/startup-services/${subType?.locationSlug || subType?.slug}-${locationData?.slug}`,
    link: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug}/startup-services/${subType?.locationSlug || subType?.slug}-${locationData?.slug}`,    
    language: 'en',
    image: subType?.company_logo_url,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(subType?.updated || new Date()),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug}/startup-services/${subType?.locationSlug || subType?.slug}-${locationData?.slug}/feed`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });    

  // Add registrations
  details?.forEach((detail) => {
    feed.addItem({
      title: detail.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description?.slice(0,300) || "",
      date: new Date(detail.updated || Date.now()),      
      enclosure: detail.image_url ? {
          url: `${detail.image_url}`,  
          type: getImageMimeType(detail.image_url)
      } : undefined
    });
  });

  subType?.faqs?.forEach((faq, index) => {
    feed.addItem({
    title: faq.question,
    id: index+1,
    description: faq.question,
    content: `
        <p><strong>Q:</strong> ${faq.question}</p>
        <p><strong>A:</strong> ${faq.answer}</p>
    `,
    date: new Date(subType?.updated || new Date()),
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
      enclosure: post.image_url ? {
          url: `${post.image_url}`,  
          type: getImageMimeType(post.image_url)
      } : undefined
    });
  });  
  }  

  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(feed.rss2());
  res.end();
}
