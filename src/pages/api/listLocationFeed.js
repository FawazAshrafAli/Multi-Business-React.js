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
    
    let state, district, place
    let title, description, url

    let stateSlug = locationParams.stateSlug || "all";
    let districtSlug = locationParams.districtSlug;
    let placeSlug = locationParams.placeSlug;

    const siteUrl = "https://bzindia.in";

    const { lat, lon } = await location.getLocationFromIP(req);  

    // Fetch dynamic content  
    const homeContentRes = await home.getHomeContent();
    const homeContent = homeContentRes.data;    
    
    if (placeSlug) {

    } else if (districtSlug) {
        const districtRes = await location.getDistrict(districtSlug);
        district = districtRes.data;

        title = `${district?.name}- Overview | Explore State-Wise, District-Wise & City Locations - ${homeContent?.[0]?.meta_title || "BZIndia - Find the Top Companies in India"}`;
        description = `Discover ${district?.name}, one of the most beautiful districts in ${district?.state?.name} state of India, along with a complete list of places, towns, and key locations.`;
        url = `${siteUrl}/state-list-in-india/${stateSlug}/${districtSlug}`;

    } else if (stateSlug != "all") {
        const stateRes = await location.getState(stateSlug);
        state = stateRes.data;

        title = `${state?.name}- Overview | Explore State-Wise, District-Wise & City Locations - ${homeContent?.[0]?.meta_title || "BZIndia - Find the Top Companies in India"}`;
        description = `Discover ${state?.name}, one of the most beautiful states in India, along with a complete list of districts, towns, and key locations.`
        url = `${siteUrl}/state-list-in-india/${stateSlug}`;

    } else  {
        title = `India State List- Overview | Explore State-Wise, District-Wise & City Locations - ${homeContent?.[0]?.meta_title || "BZIndia - Find the Top Companies in India"}`;
        description = "Explore the complete list of Indian states with an interactive location map and search option to find state-wise, district-wise, and city-level details across India.";
        url = `${siteUrl}/state-list-in-india`;
    }
    
    const statesRes = await location.getStates();
    const states = statesRes.data;     

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
    title: title,
    description: description,
    id: url,
    link: url,
    language: 'en',
    image: `${siteUrl}/images/logo.svg`,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${url}/rss`,
    },
    author: {
      name: "BzIndia",
      link: siteUrl,
    },
  });

    if (district) {
        // Places
        district?.places?.forEach((place) => {
            feed.addItem({
            title: place.name,
            id: `${siteUrl}/place-list-in-india/${district.slug}/${place.slug}`,
            link: `${siteUrl}/place-list-in-india/${district.slug}/${place.slug}`,
            description: place.meta_description?.slice(0, 300) || "",
            date: new Date(place.updated || new Date),
            });
        });
    
    } else if (state) {
    // Districts
    state?.districts?.forEach((district) => {
        feed.addItem({
        title: district.name,
        id: `${siteUrl}/district-list-in-india/${district.slug}`,
        link: `${siteUrl}/district-list-in-india/${district.slug}`,
        description: district.meta_description?.slice(0, 300) || "",
        date: new Date(district.updated || new Date),
        });
    });

  } else {
        // States
        states?.forEach((state) => {
            feed.addItem({
            title: state.name,
            id: `${siteUrl}/state-list-in-india/${state.slug}`,
            link: `${siteUrl}/state-list-in-india/${state.slug}`,
            description: state.meta_description?.slice(0, 300) || "",
            date: new Date(state.updated || new Date),
            });
        });
  }


    // Add companies
    metaTags?.forEach((tag) => {
        feed.addItem({
        title: tag.name,
        id: `${siteUrl}/tag/${tag.slug}`,
        link: `${siteUrl}/tag/${tag.slug}`,
        description: tag.meta_description?.slice(0, 300) || "",
        date: new Date(tag.updated),
        });
    });

    // Add services
  serviceDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.service?.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description?.slice(0, 300) || "",
      date: new Date(detail.modified || Date.now()),
    });
  });

  // Add courses
  courseDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.course?.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description?.slice(0, 300) || "",
      date: new Date(detail.modified || Date.now()),
    });
  });

  // Add registrations
  registrationDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.registration?.sub_type?.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description?.slice(0, 300) || "",
      date: new Date(detail.modified || Date.now()),
    });
  });

  // Add products
  productDetailPages.slice(0, 12).forEach((detail) => {
    feed.addItem({
      title: detail.product.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description?.slice(0, 300) || "",
      date: new Date(detail.updated || Date.now()),
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

  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(feed.rss2());
  res.end();
}
