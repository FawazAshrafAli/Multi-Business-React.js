// pages/api/rss.js


import { Feed } from 'feed';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import service from '../../../lib/api/service';
import course from '../../../lib/api/course';
import registration from '../../../lib/api/registration';
import product from '../../../lib/api/product';


export default async function handler(req, res) {
    const {slug} = req.query;

    if (!slug) return null;

    const siteUrl = "https://bzindia.in";

    const { lat, lon } = await location.getLocationFromIP(req);

    const nearbyPlacesRes = await location.getNearbyPlaces(lat, lon);
    const nearbyPlaces = nearbyPlacesRes.data;

    // Fetch dynamic content
    const companyRes = await company.getCompany(slug);
    const currentCompany = companyRes.data;        

    const nearestPlaceRes = await location.getNearestPlace(lat, lon);
    const nearestPlace = nearestPlaceRes.data;

    const stateSlug = nearestPlace.state?.slug;

    const serviceDetailsRes = await service.getDetails(slug);
    const serviceDetails = serviceDetailsRes.data?.results;

    const courseDetailsRes = await course.getDetails(slug);
    const courseDetails = courseDetailsRes.data?.results;

    const registrationDetailsRes = await registration.getDetails(slug);
    const registrationDetails = registrationDetailsRes.data?.results;

    const productDetailsRes = await product.getProductDetails(slug);
    const productDetails = productDetailsRes.data?.results;

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);

  const feed = new Feed({
    title: `${currentCompany?.meta_title || `${currentCompany?.name}`} - Home RSS Feed`,
    description: currentCompany?.meta_description || '',
    id: `${siteUrl}/${slug}`,
    link: `${siteUrl}/${slug}`,
    language: 'en',
    image: currentCompany?.logo_url || `${siteUrl}/images/logo.svg`,
    favicon: currentCompany?.favicon_url || `${siteUrl}/images/Favicon.png`,
    updated: new Date(currentCompany?.updated || new Date()),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${slug}/rss`,
    },
    author: {
      name: currentCompany?.name,
      link: `${siteUrl}/${slug}`,
    },
  });

    // Add companies
    currentCompany?.meta_tags?.forEach((tag) => {
        feed.addItem({
        title: tag.name,
        id: `${siteUrl}/tag/${tag.slug}`,
        link: `${siteUrl}/tag/${tag.slug}`,
        description: tag.meta_description,
        date: new Date(tag.updated),
        });
    });

    // Add blog posts
    currentCompany?.blogs?.forEach((post) => {
        feed.addItem({
        title: post.title,
        id: `${siteUrl}/learn/${post.slug}`,
        link: `${siteUrl}/learn/${post.slug}`,
        description: post.summary?.slice(0, 300),
        date: new Date(post.published_on),
        });
    });

    // Add faq faqs
    currentCompany?.faqs?.forEach((faq) => {
        feed.addItem({
        title: faq.title,
        id: `${siteUrl}/faqs/${faq.slug}`,
        link: `${siteUrl}/faqs/${faq.slug}`,
        description: faq.question,
        content: `
            <p><strong>Q:</strong> ${faq.question}</p>
            <p><strong>A:</strong> ${faq.answer}</p>
        `,
        date: new Date(faq.updated) || new Date(),
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

    if (currentCompany?.company_type === "Service") {
        // Add services
        serviceDetails.slice(0, 12).forEach((detailPage) => {
            feed.addItem({
                title: detailPage.service?.name,
                id: `${siteUrl}/${detailPage.service?.category_slug}/${detailPage.service?.sub_category_slug}/${detailPage.slug}`,
                link: `${siteUrl}/${detailPage.service?.category_slug}/${detailPage.service?.sub_category_slug}/${detailPage.slug}`,
                description: detailPage.meta_description || "",
                date: new Date(detailPage.updated|| Date.now()),
            });
        });
  
    } else if (currentCompany?.company_type === "Education") {
        // Add courses
        courseDetails.slice(0, 12).forEach((detailPage) => {
            feed.addItem({
                title: detailPage.course?.name,
                id: `${siteUrl}/${detailPage.course?.program_slug}/${detailPage.course?.specialization_slug}/${detailPage.slug}`,
                link: `${siteUrl}/${detailPage.course?.program_slug}/${detailPage.course?.specialization_slug}/${detailPage.slug}`,
                description: detailPage.meta_description || "",
                date: new Date(detailPage.updated || Date.now()),
            });
        });
    } else if (currentCompany?.company_type === "Registration") {
        // Add registrations
        registrationDetails.slice(0, 12).forEach((detailPage) => {
            feed.addItem({
                title: detailPage.registration?.title,
                id: `${siteUrl}/${detailPage.registration?.sub_type?.type_slug}/${detailPage.registration?.sub_type?.slug}/${detailPage.slug}`,
                link: `${siteUrl}/${detailPage.registration?.sub_type?.type_slug}/${detailPage.registration?.sub_type?.slug}/${detailPage.slug}`,
                description: detailPage.meta_description?.slice(0,300) || detailPage.summary?.slice(0,300) || "",
                date: new Date(detailPage.updated || Date.now()),
            });
        });
    } else if (currentCompany?.company_type === "Product") {
        // Add products
        productDetails.slice(0, 12).forEach((detailPage) => {
            feed.addItem({
                title: detailPage.product?.name,
                id: `${siteUrl}/${detailPage.product?.category_slug}/${detailPage.product?.sub_category_slug}/${detailPage.slug}`,
                link: `${siteUrl}/${detailPage.product?.category_slug}/${detailPage.product?.sub_category_slug}/${detailPage.slug}`,
                description: detailPage.meta_description || "",
                date: new Date(detailPage.updated || Date.now()),
            });
        });
    }

  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(feed.rss2());
  res.end();
}
