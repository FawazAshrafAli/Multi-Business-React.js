import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import product from '../../../../lib/api/product';
import location from '../../../../lib/api/location';
import blog from '../../../../lib/api/blog';
import ListProductSubCategories from '../../../../components/product/ListProductSubCategories';

export default function ListSubCategoriePage({
  isSubCategoryListingPage, blogs,
  structuredData, address,
  locationData
}) {
  return (
    <>
      {isSubCategoryListingPage &&
        <>
        <SeoHead
        meta_description={`Find Sub Categories wholesale suppliers in ${address}.`}
        meta_title={`Sub Categories Wholesale Supplier in ${address}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug}/products`}
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

      <ListProductSubCategories
       blogs={blogs}
       locationData={locationData}
       />
       </>
      }

    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const {slug} = context.params;
    let isSubCategoryListingPage = false;
    let locationData = {};

         
    try {

      const districtRes = await location.getMinimalDistrict(slug);
      const district = districtRes.data;

      isSubCategoryListingPage = true;

      const districtCenterRes = await location.getDistrictCenter(slug);
      const districtCenter = districtCenterRes.data;

      locationData = {
          ...district, 
          "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
      }
    } catch (err) {
      const stateRes = await location.getMinimalState(slug);
      const state = stateRes.data;          
      
      isSubCategoryListingPage = true;
      
      const stateCenterRes = await location.getStateCenter(slug);
      const stateCenter = stateCenterRes.data;

      locationData = {
          ...state, 
          "latitude": stateCenter?.latitude, "longitude": stateCenter?.longitude
      }
    }            

    if (!isSubCategoryListingPage) throw new Error("Not a product sub type listing page");    

    const subCategoryRes = await product.getSubCategories("all");
    const subCategories = subCategoryRes.data?.results;

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
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/products#page`,
            "name": `Sub Categories Wholesale Supplier in ${address}`,
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/products`,
            "description": `Find Sub Categories wholesale suppliers in ${address}.`,
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
            ]
          },

          /* C) FAQ (eligible rich result) */
          // {
          //   "@type": "FAQPage",
          //   "@id": "https://bzindia.in/kerala/products/CompanySubType/Sub-Categories-wholesale-supplier-in-malappuram#faq",
          //   "mainEntity": [
          //     {
          //       "@type": "Question",
          //       "name": "Do you deliver across Malappuram and nearby districts?",
          //       "acceptedAnswer": {
          //         "@type": "Answer",
          //         "text": "Yes, delivery is available across Malappuram and most Kerala districts. Timelines vary by pincode and order size."
          //       }
          //     },
          //     {
          //       "@type": "Question",
          //       "name": "What payment methods are accepted?",
          //       "acceptedAnswer": {
          //         "@type": "Answer",
          //         "text": "UPI, net banking, major cards, and bank transfer. COD is available on select items."
          //       }
          //     },
          //     {
          //       "@type": "Question",
          //       "name": "What is the return policy?",
          //       "acceptedAnswer": {
          //         "@type": "Answer",
          //         "text": "Most items can be returned within 7 days if unused and in original packaging. Check each product page for details."
          //       }
          //     }
          //   ]
          // },

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

          subCategories?.map(subCategory => ({
            "@type": "Product",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/products/${subCategory.location_slug || subCategory.slug}-${locationData?.slug}#product`,
            "name": `${subCategory.company_name || index + 1} - ${subCategory.name}`,
            "description": subCategory?.description || "",
            "image":[subCategory?.image_url || "https://bzindia.in/images/logo.svg"],
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/products/${subCategory.location_slug || subCategory.slug}-${locationData?.slug}`,
            "sku": subCategory.sku || "",
            "brand": { "@type": "Brand", "name": subCategory.brand || "" },
            "aggregateRating": (subCategory?.testimonials?.length > 0) ? {
              "@type": "AggregateRating",
              "ratingValue": Number(subCategory.rating),
              "reviewCount": Number(subCategory?.testimonials?.length),
              "bestRating": "5",
              "worstRating": "1"
            } : undefined,
            "review": subCategory?.testimonials.length > 0 ? subCategory?.testimonials?.map(testimonial => ({
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
              "price": subCategory?.price || "",
              "priceValidUntil": priceValidUntil,
              "availability": "https://schema.org/InStock",
              "url": `https://${locationData?.district_slug || locationData?.state_slug}/products/${subCategory.location_slug || subCategory.slug}-${locationData?.slug}`,
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
                "name": `${subCategory?.company_name} Warehouse — ${locationData?.name}`,
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
        subCategories: subCategories || [],
        isSubCategoryListingPage: isSubCategoryListingPage || false,
        locationData: locationData || {},
        blogs: blogs || [],
        address: address || null
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        subCategories: [],
        structuredData: [],
        isSubCategoryListingPage: false,
        locationData: {},
        blogs: [],
        address: null
      }
    }
  }

}
