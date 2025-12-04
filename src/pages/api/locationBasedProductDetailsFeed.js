


import { Feed } from 'feed';
import blog from '../../../lib/api/blog';
import location from '../../../lib/api/location';
import product from '../../../lib/api/product';

export default async function handler(req, res) {    
    const {slug, subCategorySlug} = req.query;

    const siteUrl = 'https://bzindia.in';
    
    let isListProductDetailsPage = false;

    const getImageMimeType = (url) => {
        if (url.endsWith('.png')) return 'image/png';
        if (url.endsWith('.webp')) return 'image/webp';
        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
        return 'image/*';
    };
    
    let urlLocationRes = await location.getUrlLocation("state", subCategorySlug);

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("district", subCategorySlug);
    }

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("place", subCategorySlug);
    }

    const urlLocation = urlLocationRes.data;

    const locationData = urlLocation?.data;

    const passingSubCategorySlug = subCategorySlug?.replace(`-${locationData?.slug}`, "");

    const subCategoryRes = await product.getSubCategories("all", undefined, `location_slug=${passingSubCategorySlug}`);
    const subCategory = subCategoryRes.data?.results?.[0];
    
    if (!subCategory) {
        subCategoryRes = await product.getSubCategory("all", passingSubCategorySlug);
        subCategory = subCategoryRes.data;
    }

    if (subCategory && (locationData?.district_slug == slug || locationData?.state_slug == slug || locationData?.slug == slug)) {
      isListProductDetailsPage = true;
    }

  let feed;

  if (isListProductDetailsPage) {
    const detailRes = await product.getProductDetailList("all");
    const details = detailRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = blogsRes.data.results;      

    feed = new Feed({
    title: `${subCategory?.full_title} ${locationData?.name || ""} - RSS Feed`,
    description: subCategory?.meta_description?.replace("place_name", locationData?.name) || "",
    id: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug}/more-products/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}`,
    link: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug}/more-products/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}`,    
    language: 'en',
    image: subCategory?.company_logo_url,
    favicon: `${siteUrl}/images/Favicon.png`,
    updated: new Date(subCategory?.updated || new Date()),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${locationData?.district_slug || locationData?.state_slug}/more-products/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}/feed`,
    },
    author: {
      name: 'BZ India',
      link: siteUrl,
    },
  });    

  // Add products
  details?.forEach((detail) => {
    feed.addItem({
      title: detail.product?.name,
      id: `${siteUrl}/${detail.url}`,
      link: `${siteUrl}/${detail.url}`,
      description: detail.meta_description?.slice(0,300) || "",
      date: new Date(detail.updated || Date.now()),      
      enclosure: detail.product?.image_url ? {
          url: `${detail.product?.image_url}`,  
          type: getImageMimeType(detail.product?.image_url)
      } : undefined
    });
  });

  subCategory?.faqs?.forEach((faq, index) => {
    feed.addItem({
    title: faq.question,
    id: index+1,
    description: faq.question,
    content: `
        <p><strong>Q:</strong> ${faq.question}</p>
        <p><strong>A:</strong> ${faq.answer}</p>
    `,
    date: new Date(subCategory?.updated || new Date()),
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
