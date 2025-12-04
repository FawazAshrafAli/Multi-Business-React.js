


import { Feed } from 'feed';
import blog from '../../../lib/api/blog';
import location from '../../../lib/api/location';
import course from '../../../lib/api/course';

export default async function handler(req, res) {    
    const {slug, specializationSlug} = req.query;

    const siteUrl = 'https://bzindia.in';
    
    let isListCourseDetailsPage = false;

    const getImageMimeType = (url) => {
        if (url.endsWith('.png')) return 'image/png';
        if (url.endsWith('.webp')) return 'image/webp';
        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
        return 'image/*';
    };
    
    let urlLocationRes = await location.getUrlLocation("state", specializationSlug);

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("district", specializationSlug);
    }

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("place", specializationSlug);
    }

    const urlLocation = urlLocationRes.data;

    const locationData = urlLocation?.data;

    const passingSpecializationSlug = specializationSlug?.replace(`-${locationData?.slug}`, "");

    const specializationRes = await course.getSpecializations(`/course_api/companies/all/specializations/?location_slug=${passingSpecializationSlug}`);
    const specialization = specializationRes.data?.results?.[0];
    
    if (!specialization) {
        specializationRes = await course.getSpecialization("all", passingSpecializationSlug);
        specialization = specializationRes.data;
    }

    if (specialization && (locationData?.district_slug == slug || locationData?.state_slug == slug || locationData?.slug == slug)) {
      isListCourseDetailsPage = true;
    }

  let feed;

  if (isListCourseDetailsPage) {
    const detailRes = await course.getDetailList("all");
    const details = detailRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results;      

    feed = new Feed({
    title: `${specialization?.full_title} ${locationData?.name || ""} - RSS Feed`,
    description: specialization?.meta_description?.replace("place_name", locationData?.name) || "",
    id: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug}/more-courses/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}`,
    link: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug}/more-courses/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}`,    
    language: 'en',
    image: specialization?.company_logo_url,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(specialization.updated || Date.now()),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug}/more-courses/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}/feed`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });    

  // Add courses
  details?.forEach((detail) => {
    feed.addItem({
      title: detail.course?.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description?.slice(0,300) || "",
      date: new Date(detail.updated || Date.now()),      
      enclosure: detail.course?.image_url ? {
          url: `${detail.course?.image_url}`,  
          type: getImageMimeType(detail.course?.image_url)
      } : undefined
    });
  });

  specialization?.faqs?.forEach((faq, index) => {
    feed.addItem({
    title: faq.question,
    id: index+1,
    description: faq.question,
    content: `
        <p><strong>Q:</strong> ${faq.question}</p>
        <p><strong>A:</strong> ${faq.answer}</p>
    `,
    date: new Date(specialization.updated || new Date()),
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
