import { Feed } from 'feed';
import blog from '../../../lib/api/blog';
import location from '../../../lib/api/location';
import course from '../../../lib/api/course';

export default async function handler(req, res) {
    const {slug} = req.query;
    const siteUrl = 'https://bzindia.in';           

    let isSpecializationListingPage = false;
    let state, district;
    let locationData = {};


    const getImageMimeType = (url) => {
        if (url.endsWith('.png')) return 'image/png';
        if (url.endsWith('.webp')) return 'image/webp';
        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
        return 'image/*';
    };

    try {
      const stateRes = await location.getMinimalState(slug);
      state = stateRes.data;

      const stateCenterRes = await location.getMinimalState(slug);
      const stateCenter = stateCenterRes.data;

      locationData = {
          ...state, 
          "latitude": stateCenter?.latitude, "longitude": stateCenter?.longitude
      }

      isSpecializationListingPage = true;
  } catch (err) {

      const districtRes = await location.getMinimalDistrict(slug);
      district = districtRes.data;

      const districtCenterRes = await location.getDistrictCenter(slug);
      const districtCenter = districtCenterRes.data;

      locationData = {
          ...district, 
          "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
      }

      isSpecializationListingPage = true;
  }

  let feed;

  if (isSpecializationListingPage) {
    const specializationsRes = await course.getSpecializations("/course_api/companies/all/specializations/");
    const specializations = specializationsRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results; 

    const address_list = [];

    if (locationData?.name) address_list.push(locationData?.name);
    if (locationData?.district_name) address_list.push(locationData?.district_name);
    if (locationData?.state_name) address_list.push(locationData?.state_name);

    const address = address_list.join(", ");

    feed = new Feed({
    title: `Courses in ${locationData?.name} - RSS Feed`,
    description: `Explore industry-oriented professional and skill development courses in ${address} with certification and placement support.`,
    id: `${siteUrl}/${slug}/more-courses`,
    link: `${siteUrl}/${slug}/more-courses`,
    language: 'en',
    image: `${siteUrl}/images/logo.svg`,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/more-courses/feed`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });    

  // Add courses
  specializations?.forEach((specializations) => {
    feed.addItem({
      title: specializations.name,
      id: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/more-courses/${specializations.location_slug || specializations.slug}-${locationData?.slug}`,
      link: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/more-courses/${specializations.location_slug || specializations.slug}-${locationData?.slug}`,
      description: specializations.meta_description || "",
      date: new Date(specializations.updated || Date.now()),
      enclosure: specializations.image_url ? {
          url: `${specializations.image_url}`,  
          type: getImageMimeType(specializations.image_url)
      } : undefined
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
