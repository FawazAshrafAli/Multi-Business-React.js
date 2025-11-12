import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import course from '../../../../lib/api/course';
import location from '../../../../lib/api/location';
import ListCourseDetails from '../../../../components/course/ListCourseDetails';
import blog from '../../../../lib/api/blog';

export default function ListSpecializationPage({
  details, isListCourseDetailsPage,
  structuredData, specialization, blogs,
  locationData, address
}) {  
  return (
    <>
      {isListCourseDetailsPage &&
        <>
        <SeoHead
        meta_description={`Get online courses in ${address} with expert consultants and quick approvals.`}
        meta_title={`Filing ${locationData?.name}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug}/filings/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}`}
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
        
        <ListCourseDetails
         
        details={details}
        locationData={locationData}
        specialization={specialization}
        />
      </>
      }

    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const {slug, specializationSlug} = context.params;
    let isListCourseDetailsPage = false;
    
    let urlLocationRes;
    
    urlLocationRes = await location.getUrlLocation("state", specializationSlug);

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("district", specializationSlug);
    }

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("place", specializationSlug);
    }

    const urlLocation = urlLocationRes.data;

    const locationData = urlLocation?.data;

    const passingSpecializationSlug = specializationSlug?.replace(`-${locationData?.slug}`, "");

    let specialization, specializationRes;

    specializationRes = await course.getSpecializations("all", undefined, `location_slug=${passingSpecializationSlug}`);
    specialization = specializationRes.data?.results?.[0];
  
    if (!specialization) {
      specializationRes = await course.getSpecialization("all", passingSpecializationSlug);
      specialization = specializationRes.data;

    }

    if (specialization && (locationData?.district_slug == slug || locationData?.state_slug == slug || locationData?.slug == slug)) {
      isListCourseDetailsPage = true;
    }    

    if (!isListCourseDetailsPage) throw new Error("Not a course detail listing page");

    const detailRes = await course.getSpecializations("all");
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

    const structuredData = [
      JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [

          /* A) Listing page */
          {
            "@type": ["WebPage","CollectionPage"],
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/filings/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}#page`,
            "name": `Courses in ${address}`,
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/filings/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}`,
            "description": `Get online courses in ${address} with expert consultants and quick approvals.`,
            "image": "https://bzindia.in/images/logo.svg",
            "isPartOf": {
              "@type": "WebSite", 
              "url": "https://bzindia.in", 
              "name": "BZIndia" 
            },
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
              "name": `Course Sub Types in ${locationData?.name || ""}`,
              "itemListOrder": "http://schema.org/ItemListOrderAscending",
              "itemListElement": details?.map((detail, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Service",
                    "@id": `${detail.url}#government-service`,
                    "name": detail?.meta_title || detail?.name || "",
                    "description": detail?.meta_description || "",
                    "image": detail?.image_url || "",
                    "url": `${detail.url}`
                  }
              }))
            }
          },

          /* B) Breadcrumbs */
          {
            "@type": "BreadcrumbList",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/filings/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}#breadcrumbs`,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bzindia.in/" },
              { "@type": "ListItem", "position": 2, "name": locationData?.district_name || locationData?.state_name || locationData?.name, "item": `https://bzindia.in/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}` },
              { "@type": "ListItem", "position": 3, "name": "Filings", "item": `https://${locationData?.district_slug || locationData?.state_slug}/filings` },
              { "@type": "ListItem", "position": 4, "name": `${specialization?.full_title} ${locationData?.name}`, "item": `https://${locationData?.district_slug || locationData?.state_slug}/filings/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}` },
            ]
          },

          /* C) FAQ */
          {
            "@type": "FAQPage",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/filings/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}#faq`,
            "mainEntity": specialization?.faqs?.map(faq => ({
                "@type": "Question",
                "name": faq.question || "",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer || ""
                }
              }))
                        
          },

          /* D) Provider with ratings */
          details?.map((detail, index) => ({
            "@type": "ProfessionalService",
            "@id": `${detail.url}#government-service`,
            "name": `${detail.company_name || index + 1} - ${detail.name}`, 
            "image": detail.company_logo_url || "",
            "url": `${detail.url}`,
            "telephone": detail?.company_contact? `+91-${detail?.company_contact}`: "",
            "priceRange": detail?.price? `₹${detail?.price}` : "",
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
            "aggregateRating": (detail?.testimonials?.length > 0) && {
              "@type": "AggregateRating",
              "ratingValue": Number(detail.rating),
              "reviewCount": Number(detail?.testimonials?.length),
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": detail?.testimonials?.map(testimonial => ({
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
    ]

    return {
      props: {
        structuredData,
        details: details || [],
        isListCourseDetailsPage: isListCourseDetailsPage || false,
        locationData: locationData || {},
        specialization: specialization || null,
        blogs: blogs || [],
        address: address || [],
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        details: [],
        structuredData: [],
        isListCourseDetailsPage: false,
        locationData: {},
        specialization: null,
        blogs: [],
        address: null,
      }      
    }
  }

}
