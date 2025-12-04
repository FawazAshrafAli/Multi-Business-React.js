import { Feed } from 'feed';
import blog from '../../../lib/api/blog';
import location from '../../../lib/api/location';
import service from '../../../lib/api/service';

export default async function handler(req, res) {
    const {slug} = req.query;
    const siteUrl = 'https://bzindia.in';           

    let isSubCategoryListingPage = false;
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

      isSubCategoryListingPage = true;
  } catch (err) {

      const districtRes = await location.getMinimalDistrict(slug);
      district = districtRes.data;

      const districtCenterRes = await location.getDistrictCenter(slug);
      const districtCenter = districtCenterRes.data;

      locationData = {
          ...district, 
          "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
      }

      isSubCategoryListingPage = true;
  }

  let feed;

  if (isSubCategoryListingPage) {
    const subCategoryRes = await service.getSubCategories("all");
    const subCategories = subCategoryRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results; 

    const address_list = [];

    if (locationData?.name) address_list.push(locationData?.name);
    if (locationData?.district_name) address_list.push(locationData?.district_name);
    if (locationData?.state_name) address_list.push(locationData?.state_name);

    const address = address_list.join(", ");

    feed = new Feed({
    title: `Services in ${locationData?.name} - RSS Feed`,
    description: `Get online services in ${address} with expert consultants and quick approvals.`,
    id: `${siteUrl}/${slug}/more-services`,
    link: `${siteUrl}/${slug}/more-services`,
    language: 'en',
    image: `${siteUrl}/images/logo.svg`,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/more-services/feed`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });    

  // Add services
  subCategories?.forEach((subCategory) => {
    feed.addItem({
      title: subCategory.name,
      id: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/more-services/${subCategory.location_slug || subCategory.slug}-${locationData?.slug}`,
      link: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/more-services/${subCategory.location_slug || subCategory.slug}-${locationData?.slug}`,
      description: subCategory.meta_description || "",
      date: new Date(subCategory.updated || Date.now()),
      enclosure: subCategory.image_url ? {
          url: `${subCategory.image_url}`,  
          type: getImageMimeType(subCategory.image_url)
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
