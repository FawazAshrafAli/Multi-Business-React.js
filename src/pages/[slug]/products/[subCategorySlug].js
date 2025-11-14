import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import location from '../../../../lib/api/location';
import ListProductDetails from '../../../../components/product/ListProductDetails';
import blog from '../../../../lib/api/blog';
import product from '../../../../lib/api/product';

export default function ListSubCategoryPage({
  isListProductDetailsPage,
  structuredData, subCategory, blogs,
  locationData, address
}) {  
  return (
    <>
      {isListProductDetailsPage &&
        <>
        <SeoHead
        meta_description={`${subCategory.name}, bulk pricing, reliable shipping across ${locationData?.name}."`}
        meta_title={`Sub Categories Wholesale Supplier in ${address}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug}/products/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}`}
        />

        <Head>
          {structuredData.map((schema, i) => (
            <script
              key={i}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: schema }}
            />
          ))}    
        </Head>
        
        <ListProductDetails
         
        locationData={locationData}
        subCategory={subCategory}
        />
      </>
      }

    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const {slug, subCategorySlug} = context.params;
    let isListProductDetailsPage = false;

    let urlLocationRes;
    
    urlLocationRes = await location.getUrlLocation("state", subCategorySlug);
    
    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("district", subCategorySlug);
    }

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("place", subCategorySlug);
    }


    const urlLocation = urlLocationRes?.data;

    const locationData = urlLocation?.data;

    const passingSubCategorySlug = subCategorySlug?.replace(`-${locationData?.slug}`, "");

    let subCategory, subCategoryRes;

    subCategoryRes = await product.getSubCategories("all", undefined, `location_slug=${passingSubCategorySlug}`);
    subCategory = subCategoryRes.data?.results?.[0];
  
    if (!subCategory) {
      subCategoryRes = await product.getSubCategory("all", passingSubCategorySlug);
      subCategory = subCategoryRes.data;

    }

    if (subCategory && (locationData?.district_slug == slug || locationData?.state_slug == slug || locationData?.slug == slug)) {
      isListProductDetailsPage = true;
    }    

    if (!isListProductDetailsPage) throw new Error("Not a product sub type listing page");

    const detailRes = await product.getSubCategories("all");
    const details = detailRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogs = (blogsRes.data.results || [])
        .slice(0, 12)
        .map(b => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        summary: b.summary,
        image_url: b.image_url,
        published_date: b.published_date,
        updated: b.updated,
        get_absolute_url: b.get_absolute_url,
        content: b.content,
        meta_tags: b.meta_tags,
        })); 

    const address_list = [];

    if (locationData?.name) address_list.push(locationData?.name);
    if (locationData?.district_name) address_list.push(locationData?.district_name);
    if (locationData?.state_name) address_list.push(locationData?.state_name);

    const address = address_list.join(", ");

    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const priceValidUntil = sixMonthsLater.toISOString().split("T")[0];      

    const structuredData = [
      JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [

          /* A) Listing page container */
          {
            "@type": ["WebPage","CollectionPage"],
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/products/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}#page`,
            "name": `Sub Categories Wholesale Supplier in ${address}`,
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/products/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}`,
            "description": `${subCategory.name}, bulk pricing, reliable shipping across ${locationData?.name}."`,
            "image": "https://bzindia.in/images/logo.svg",
            "isPartOf": { "@type": "WebSite", "url": "https://bzindia.in", "name": "BZIndia" }
          },

          /* B) Breadcrumbs */
          {
            "@type": "BreadcrumbList",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/products#breadcrumbs`,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bzindia.in/" },
              { "@type": "ListItem", "position": 2, "name": locationData?.district_name || locationData?.state_name || locationData?.name, "item": `https://bzindia.in/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}` },
              { "@type": "ListItem", "position": 3, "name": "Products", "item": `https://${locationData?.district_slug || locationData?.state_slug}/products` },
              { "@type": "ListItem", "position": 4, "name": `${subCategory?.full_title} ${locationData?.name}`, "item": `https://${locationData?.district_slug || locationData?.state_slug}/products/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}` },
            ]
          },

          /* C) FAQ (eligible rich result) */
          {
            "@type": "FAQPage",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/products/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}#faq`,
            "mainEntity": subCategory?.faqs?.map(faq => ({
              "@type": "Question",
              "name": faq.question || "",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer || ""
              }
            }))            
          },

          /* D) Seller/Brand */
          {
            "@type": "Organization",
            "@id": "https://bzindia.in/#org",
            "name": "BZIndia Ventures",
            "url": "https://bzindia.in",
            "logo": "https://bzindia.in/images/logo.svg",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "telephone": "+919606377677",
              "areaServed": "IN"
            }
          },

          details?.map(detail => ({
            "@type": "Product",
            "@id": `${detail.url}#product`,
            "name": `${detail.company_name || index + 1} - ${detail.name}`,
            "description": detail?.description || "",
            "image":[detail?.image_url || "https://bzindia.in/images/logo.svg"],
            "url": `${detail.url}`,
            "sku": detail.sku || "",
            "brand": { "@type": "Brand", "name": detail.brand || "" },
            "aggregateRating": (detail?.testimonials?.length > 0) ? {
              "@type": "AggregateRating",
              "ratingValue": Number(detail.rating),
              "reviewCount": Number(detail?.testimonials?.length),
              "bestRating": "5",
              "worstRating": "1"
            } : undefined,
            "review": detail?.testimonials.length > 0 ? detail?.testimonials?.map(testimonial => ({
                "@type": "Review",
                "author": { "@type": "Person", "name": testimonial.name || testimonial.review_by || "" },
                "datePublished": testimonial.created || "",
                "reviewRating": {
                  "@type": "Rating", 
                  "ratingValue": Number(testimonial.rating), 
                  "bestRating": "5" 
                },
                "reviewBody": testimonial.text || ""
              })) : [],
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": detail?.price || "",
              "priceValidUntil": priceValidUntil,
              "availability": "https://schema.org/InStock",
              "url": `https://${locationData?.district_slug || locationData?.state_slug}/products/${detail.location_slug || detail.slug}-${locationData?.slug}`,
              "seller": { "@id": "https://bzindia.in/#org" },
              "shippingDetails": [{
                "@type": "OfferShippingDetails",
                "shippingDestination": {
                  "@type": "DefinedRegion",
                  "addressCountry": "IN",
                  "addressRegion": locationData?.state_name || locationData?.name || ""
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "d" },
                  "transitTime":   { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 7, "unitCode": "d" }
                }
              }],
              "availableAtOrFrom": {
                "@type": "Place",
                "name": `${detail?.company_name} Warehouse — ${locationData?.name}`,
                "geo": { "@type": "GeoCoordinates", "latitude": locationData?.latitude, "longitude": locationData?.longitude },
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": locationData?.district_name || locationData?.name || "",
                  "addressRegion": locationData?.state_name || locationData?.name || "",
                  "postalCode": locationData?.pincode || "",
                  "addressCountry": "IN"
                }
              }
            }
          }))

        ]
      })

    ];

    return {
      props: {
        structuredData,
        isListProductDetailsPage: isListProductDetailsPage || false,
        locationData: locationData || {},
        subCategory: subCategory || null,
        blogs: blogs || [],
        address: address || [],
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        structuredData: [],
        isListProductDetailsPage: false,
        locationData: {},
        subCategory: null,
        blogs: [],
        address: null,
      }      
    }
  }

}
