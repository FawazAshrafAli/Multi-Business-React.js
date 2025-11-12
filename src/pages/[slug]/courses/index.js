import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import ListCourseSpecializations from '../../../../components/education/ListCourseSpecializations';
import location from '../../../../lib/api/location';
import blog from '../../../../lib/api/blog';
import course from '../../../../lib/api/course';

export default function ListSpecializationPage({
  isSpecializationListingPage, blogs,
  structuredData, address,
  locationData
}) {
  return (
    <>
      {isSpecializationListingPage &&
        <>
        <SeoHead
        meta_description={`Get online courses in ${address} with expert consultants and quick approvals.`}
        meta_title={`Filing ${locationData?.name}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug}/filings`}
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

      <ListCourseSpecializations
       
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
    let isSpecializationListingPage = false;
    let locationData = {};
               
    try {

      const districtRes = await location.getMinimalDistrict(slug);
      const district = districtRes.data;

      isSpecializationListingPage = true;

      const districtCenterRes = await location.getDistrictCenter(slug);
      const districtCenter = districtCenterRes.data;

      locationData = {
          ...district, 
          "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
      }
    } catch (err) {
      const stateRes = await location.getMinimalState(slug);
      const state = stateRes.data;          
      
      isSpecializationListingPage = true;
      
      const stateCenterRes = await location.getStateCenter(slug);
      const stateCenter = stateCenterRes.data;

      locationData = {
          ...state, 
          "latitude": stateCenter?.latitude, "longitude": stateCenter?.longitude
      }
    }            

    if (!isSpecializationListingPage) throw new Error("Not a course specialization listing page");

    const subTypeRes = await course.getSpecializations("/course_api/companies/all/specializations/");    
    const subTypes = subTypeRes.data?.results;

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
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/filings#page`,
            "name": `Course Sub Types in ${address}`,
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/filings`,
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
              "itemListElement": subTypes?.map((subType, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Service",
                    "@id": `https://${locationData?.district_slug || locationData?.state_slug}/filings/${subType.location_slug}-${locationData?.slug}#government-service`,
                    "name": subType?.full_title || "",
                    "description": subType?.description || "",
                    "image": subType?.image_url || "",
                    "url": `https://${locationData?.district_slug || locationData?.state_slug}/filings/${subType.location_slug}-${locationData?.slug}`
                  }
              }))
            }
          },

          /* B) Breadcrumbs */
          {
            "@type": "BreadcrumbList",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/filings#breadcrumbs`,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bzindia.in/" },
              { "@type": "ListItem", "position": 2, "name": locationData?.district_name || locationData?.state_name || locationData?.name, "item": `https://bzindia.in/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}` },
              { "@type": "ListItem", "position": 3, "name": "Filings", "item": `https://${locationData?.district_slug || locationData?.state_slug}/filings` },
            ]
          },

          /* C) FAQ */
          // {
          //   "@type": "FAQPage",
          //   "@id": "https://bzindia.in/kerala/services/CompanySpecialization/subcatogry-services-in-malappuram#faq",
          //   "mainEntity": [
          //     {
          //       "@type": "Question",
          //       "name": `How long does GST course take in ${locationData?.name}?`,
          //       "acceptedAnswer": {
          //         "@type": "Answer",
          //         "text": "With complete documents, GST course approval typically takes 3–7 working days."
          //       }
          //     },
          //     {
          //       "@type": "Question",
          //       "name": "Which FSSAI license should I choose: Basic, State, or Central?",
          //       "acceptedAnswer": {
          //         "@type": "Answer",
          //         "text": "Choose based on your annual turnover and business scale: up to ₹12 lakh (Basic), ₹12 lakh–₹20 crore (State), and above ₹20 crore or multi-state operations (Central)."
          //       }
          //     }
          //   ]
          // },

          /* D) Provider with ratings */
          subTypes?.map((subType, index) => ({
            "@type": "ProfessionalService",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/filings/${subType.location_slug || subType.slug}-${locationData?.slug}#government-service`,
            "name": `${subType.company_name || index + 1} - ${subType.name}`, 
            "image": subType.company_logo_url || "",
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/filings/${subType.location_slug || subType.slug}-${locationData?.slug}`,
            "telephone": subType?.company_contact? `+91-${subType?.company_contact}`: "",
            "priceRange": subType?.price? `₹${subType?.price}` : "",
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
            "aggregateRating": (subType?.testimonials?.length > 0) && {
              "@type": "AggregateRating",
              "ratingValue": Number(subType.rating),
              "reviewCount": Number(subType?.testimonials?.length),
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": subType?.testimonials?.map(testimonial => ({
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
        subTypes: subTypes || [],
        isSpecializationListingPage: isSpecializationListingPage || false,
        locationData: locationData || {},
        blogs: blogs || [],
        address: address || null
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        subTypes: [],
        structuredData: [],
        isSpecializationListingPage: false,
        locationData: {},
        blogs: [],
        address: null
      }
    }
  }

}
