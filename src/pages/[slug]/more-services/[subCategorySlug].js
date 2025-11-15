import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import location from '../../../../lib/api/location';
import ListServiceDetails from '../../../../components/service/ListServiceDetails';
import blog from '../../../../lib/api/blog';
import service from '../../../../lib/api/service';

export default function ListSubCategoryPage({
  isListServiceDetailsPage,
  structuredData, subCategory, blogs,
  locationData, address
}) {  
  return (
    <>
      {isListServiceDetailsPage &&
        <>
        <SeoHead
        meta_description={`${subCategory.name}, bulk pricing, reliable shipping across ${locationData?.name}."`}
        meta_title={`Sub Categories Wholesale Supplier in ${address}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}`}
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
        
        <ListServiceDetails
         
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
    let isListServiceDetailsPage = false;

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

    subCategoryRes = await service.getSubCategories("all", undefined, `location_slug=${passingSubCategorySlug}`);
    subCategory = subCategoryRes.data?.results?.[0];

    let title_list = [];

    if (subCategory) {
      [subCategory?.starting_title, subCategory?.name, subCategory?.ending_title].forEach(title => {
        if (title) {
          title_list.push(title);
        }
      });      
    }

    subCategory = {...subCategory, "full_title": title_list.join(" ")};
    
    if (!subCategory) {

      subCategoryRes = await service.getSubCategory("all", passingSubCategorySlug);
      subCategory = subCategoryRes.data;

    }

    if (subCategory && (locationData?.district_slug == slug || locationData?.state_slug == slug || locationData?.slug == slug)) {
      isListServiceDetailsPage = true;
    }    

    if (!isListServiceDetailsPage) throw new Error("Not a service sub type listing page");

    const detailRes = await service.getDetailList("all");
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

          /* A) Listing page */
          {
            "@type": ["WebPage","CollectionPage"],
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}#page`,
            "name": `Sub category Services in ${address}`,
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}/`,
            "description": `Get online services in ${address} with expert consultants and quick approvals.`,
            "image": "https://bzindia.in/images/logo.svg",
            "isPartOf": { "@type": "WebSite", "url": "https://bzindia.in", "name": "BZIndia" },
            "spatialCoverage": {
              "@type": "AdministrativeArea",
              "name": locationData?.name || "",
              "containedInPlace": {
                "@type": "AdministrativeArea",
                "name": locationData?.state_name || locationData?.district_name || "",
                "containedInPlace": {
                  "@type": "Country", "name": "IN"
                }
              },
              "geo": { "@type": "GeoCoordinates", "latitude": locationData?.latitude || "", "longitude": locationData?.longitude || "" }
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": `Services in ${locationData?.name || ""}`,
              "itemListOrder": "http://schema.org/ItemListOrderAscending",
              "itemListElement": details?.map((detail, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Service",
                    "@id": `https://${detail?.url}#service`,
                    "name": detail?.service?.name || "",
                    "description": detail?.description || detail?.service?.description || "",
                    "image": detail?.service?.image_url || "",
                    "url": `https://${detail?.url}`
                  }
              }))
            }
          },

          /* B) Breadcrumbs */
          {
            "@type": "BreadcrumbList",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}#breadcrumbs`,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bzindia.in/" },
              { "@type": "ListItem", "position": 2, "name": locationData?.district_name || locationData?.state_name || locationData?.name, "item": `https://bzindia.in/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}` },
              { "@type": "ListItem", "position": 3, "name": "Services", "item": `https://${locationData?.district_slug || locationData?.state_slug}/more-services` },
              { "@type": "ListItem", "position": 4, "name": `${subCategory?.full_title} ${locationData?.name}`, "item": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}` },
            ]
          },

          /* C) FAQ */
          {
            "@type": "FAQPage",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}#faq`,
            "mainEntity": subCategory?.faqs?.map(faq => ({
                "@type": "Question",
                "name": faq?.question || "",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq?.answer || ""
                }
              }))          
          },

          /* D) Provider with ratings */
          details?.map((detail, index) => ({
            "@type": "ProfessionalService",
            "@id": `https://${detail.url}#service`,
            "name": `${detail.company_name || index + 1} - ${detail.service?.name}`, 
            "image": detail.company_logo_url || "",
            "url": `https://${detail.url}`,
            "telephone": detail?.company_contact? `+91-${detail?.company_contact}`: "",
            "priceRange": detail?.service?.price? `₹${detail?.service?.price}` : "",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": locationData?.name || "",
              "addressRegion": locationData?.state_name || locationData?.district_name || "",
              "postalCode": locationData?.pincode || "",
              "addressCountry": "IN"
            },
            "geo": { "@type": "GeoCoordinates", "latitude": locationData?.latitude || "", "longitude": locationData?.longitude || "" },
            "areaServed": [ address, "IN" ],
            "openingHoursSpecification": [
              { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "09:30", "closes": "18:30" }
            ],
            "aggregateRating": (detail?.service?.testimonials?.length > 0) && {
              "@type": "AggregateRating",
              "ratingValue": Number(detail.service?.rating),
              "reviewCount": Number(detail?.service?.testimonials?.length),
              "bestRating": "5",
              "worstRating": "1"
            } || undefined,
            "review": detail?.service?.testimonials?.map(testimonial => ({
                "@type": "Review",
                "author": { "@type": "Person", "name": testimonial.name || "" },
                "datePublished": testimonial.created || "",
                "reviewRating": {
                  "@type": "Rating", 
                  "ratingValue": Number(testimonial.rating), 
                  "bestRating": "5" 
                },
                "reviewBody": testimonial.text || ""
              }))
          })),
        ]
      })
    ];

    return {
      props: {
        structuredData,
        isListServiceDetailsPage: isListServiceDetailsPage || false,
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
        isListServiceDetailsPage: false,
        locationData: {},
        subCategory: null,
        blogs: [],
        address: null,
      }      
    }
  }

}
