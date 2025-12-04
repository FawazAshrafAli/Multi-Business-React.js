import { Feed } from 'feed';
import blog from '../../../lib/api/blog';
import location from '../../../lib/api/location';
import registration from '../../../lib/api/registration';

export default async function handler(req, res) {    
    const {slug} = req.query;

    const siteUrl = 'https://bzindia.in';
    
    let isSubTypeListingPage = false;
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

      isSubTypeListingPage = true;
  } catch (err) {

      const districtRes = await location.getMinimalDistrict(slug);
      district = districtRes.data;

      const districtCenterRes = await location.getDistrictCenter(slug);
      const districtCenter = districtCenterRes.data;

      locationData = {
          ...district, 
          "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
      }

      isSubTypeListingPage = true;
  }

  let feed;

  if (isSubTypeListingPage) {
    const subTypeRes = await registration.getSubTypes("all");
    const subTypes = subTypeRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results;  
    
    const address_list = [];

    if (locationData?.name) address_list.push(locationData?.name);
    if (locationData?.district_name) address_list.push(locationData?.district_name);
    if (locationData?.state_name) address_list.push(locationData?.state_name);

    const address = address_list.join(", ");

    feed = new Feed({
    title: `Startup Services in ${locationData?.name} - RSS Feed`,
    description: `Get online registrations in ${address} with expert consultants and quick approvals.`,
    id: `${siteUrl}/${slug}/startup-services`,
    link: `${siteUrl}/${slug}/startup-services`,
    language: 'en',
    image: `${siteUrl}/images/logo.svg`,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${slug}/startup-services/feed`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });    

  // Add registrations
  subTypes?.forEach((subType) => {
    feed.addItem({
      title: subType.name,
      id: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/startup-services/${subType.location_slug || subType.slug}-${locationData?.slug}`,
      link: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/startup-services/${subType.location_slug || subType.slug}-${locationData?.slug}`,
      description: subType.meta_description?.slice(0,300) || "",
      date: new Date(subType.updated || Date.now()),      
      enclosure: subType.image_url ? {
          url: `${subType.image_url}`,  
          type: getImageMimeType(subType.image_url)
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
