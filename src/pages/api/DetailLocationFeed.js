// pages/api/rss.js

import { Feed } from 'feed';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import home from '../../../lib/api/home';
import metaTag from '../../../lib/api/metaTag';
import blog from '../../../lib/api/blog';
import product from '../../../lib/api/product';
import registration from '../../../lib/api/registration';
import service from '../../../lib/api/service';
import course from '../../../lib/api/course';


export default async function handler(req, res) {
    const locationParams = req.query;

    let place;
    let nearbyPlaces = [];

    let stateSlug = "all";    
    let placeSlug = locationParams.placeSlug;

    const siteUrl = "https://bzindia.in";

    const { lat, lon } = await location.getLocationFromIP(req);

    // Fetch dynamic content  
    const homeContentRes = await home.getHomeContent();
    const homeContent = homeContentRes.data;    
    
    if (placeSlug) {
        const placeRes = await location.getPlace(placeSlug);
        place = placeRes.data;        

        if (place) {
            stateSlug = place?.district?.state?.slug;

            const lat = place?.coordinates?.[0]?.latitude;
            const lon = place?.coordinates?.[0]?.longitude;

            if (lat && lon) {
                const nearbyPlacesRes = await location.getNearbyPlaces(lat, lon);
                nearbyPlaces = nearbyPlacesRes.data; 

            }
        }
        
    }   

    const tagRes = await metaTag.getMetaTags();
    const metaTags = tagRes.data.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data?.results; 

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);

    const courseDetailPagesRes = await course.getDetails("all");
    const courseDetailPages = courseDetailPagesRes.data?.results;

    const serviceDetailPagesRes = await service.getDetails("all");
    const serviceDetailPages = serviceDetailPagesRes.data?.results;

    const registrationDetailPagesRes = await registration.getDetails("all");
    const registrationDetailPages = registrationDetailPagesRes.data?.results;

    const productDetailPagesRes = await product.getProductDetails("all");
    const productDetailPages = productDetailPagesRes.data?.results;    

  const feed = new Feed({
    title: `${place?.name} - Overview | Explore State-Wise, District-Wise & City Locations - ${homeContent&&homeContent[0]?.meta_title || "BZIndia - Find the Top Companies in India"}`,
    description: `${place?.name} is a notable town located in the ${place?.district?.name} district of ${place?.district?.state?.name}, India. Known for its cultural heritage, local traditions, and developing infrastructure, ${place?.name} serves as an important hub for residents and visitors alike. The area offers a blend of historical significance, natural beauty, and modern growth, making it a key part of the region's identity. Whether you're exploring its neighborhoods, learning about its history, or experiencing its local charm, {place?.name} represents a vibrant part of India's diverse landscape.`,
    id: `${siteUrl}/${place?.district?.state?.slug}/${place?.district?.slug}/${place?.slug}`,
    link: `${siteUrl}/${place?.district?.state?.slug}/${place?.district?.slug}/${place?.slug}`,
    language: 'en',
    image: `${siteUrl}/images/logo.svg`,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${place?.district?.state?.slug}/${place?.district?.slug}/${place?.slug}/rss`,
    },
    author: {
      name: "BzIndia",
      link: siteUrl,
    },
  });

    if (nearbyPlaces) {
        // Places
        nearbyPlaces?.forEach((place) => {
            feed.addItem({
            title: place.name,
            id: `${siteUrl}/place-list-in-india/${place?.district?.state?.slug}/${place?.district?.slug}/${place?.slug}`,
            link: `${siteUrl}/place-list-in-india/${place?.district?.state?.slug}/${place?.district?.slug}/${place?.slug}`,
            description: place.meta_description || "",
            date: new Date(place.updated || new Date),
            });
        });
    
    }


    // Meta Tags
    metaTags?.forEach((tag) => {
        feed.addItem({
        title: tag.name,
        id: `${siteUrl}/tag/${tag.slug}`,
        link: `${siteUrl}/tag/${tag.slug}`,
        description: tag.meta_description || "",
        date: new Date(tag.updated),
        });
    });

    // Add blog posts
    blogs?.forEach((post) => {
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

    // Add services
  serviceDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.modified_title,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description || detail.title,
      date: new Date(detail.modified.date || Date.now()),
    });
  });

  // Add courses
  courseDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.modified_title,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description || detail.title,
      date: new Date(detail.modified || Date.now()),
    });
  });

  // Add registrations
  registrationDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.modified_title,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description || detail.title,
      date: new Date(detail.modified || Date.now()),
    });
  });

  // Add products
  productDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.modified_title,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description || detail.title,
      date: new Date(detail.modified || Date.now()),
    });
  });

  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(feed.rss2());
  res.end();
}
