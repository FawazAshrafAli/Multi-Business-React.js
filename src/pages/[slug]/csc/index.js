import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import location from '../../../../lib/api/location';
import ListCsc from '../../../../components/csc/ListCsc';
import blog from '../../../../lib/api/blog';

export default function ListFaqPage({
  locationData, isCscListingPage, childPlace,
  parentPlace, slug, faqs
}) {

  return (
    <>
      <>
        <SeoHead
        meta_description=""
        meta_title={`CSCs`}


        url = {`https://bzindia.in/${slug}/csc/`}
        />      
          
        {isCscListingPage && 
        <ListCsc 
        locationData={locationData}
        childPlace={childPlace}
        parentPlace={parentPlace}
        faqs={faqs}
        />
        }
        
        </>
      
    </>
  );
}

export async function getServerSideProps(context) {
  try {        
    const {slug} = context.params;

    let isCscListingPage = false;
    let locationData;


    try {
      const districtRes = await location.getMinimalDistrict(slug);
      const district = districtRes.data;

      const districtCenterRes = await location.getDistrictCenter(slug);
      const districtCenter = districtCenterRes.data;

      locationData = {
        ...district, 
        "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
      }

      isCscListingPage = true;
    
    } catch (err) {
      
      const stateRes = await location.getMinimalState(slug);
      const state = stateRes.data;          
      
      const stateCenterRes = await location.getStateCenter(slug);
      const stateCenter = stateCenterRes.data;

      locationData = {
        ...state, 
        "latitude": stateCenter?.latitude, "longitude": stateCenter?.longitude
      }

      isCscListingPage = true;
    
    }    

    const [
      nearbyCentersRes,
      blogsRes
    ] = await Promise.all([
      location.getNearbyCscCenters(locationData?.latitude, locationData?.longitude),
      blog.getBlogs(`/blog_api/blogs`)
    ]);

    const nearbyCenters = nearbyCentersRes?.data;

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

    let structuredData = [];
    const faqs = [
      {        
        "question": `What services are available at CSCs in ${locationData?.name}?`,          
        "answer": "CSCs offer services such as Aadhaar updates, PAN card applications, utility bill payments, and access to various government schemes."        
      },
      {        
        "question": `Who can use the CSC services in ${locationData?.name}?`,          
        "answer": "All residents, including students, professionals, and senior citizens, can access services at the CSCs."        
      },
      {        
        "question": `How can I locate the nearest CSC in ${locationData?.name}?`,          
        "answer": "You can visit the Digital Seva Portal or inquire locally for the nearest center."        
      },
      {        
        "question": "Are there any fees for CSC services?",          
        "answer": "Yes, minimal charges apply for specific services like certificate issuance and document printing."        
      },
      {        
        "question": `Can I apply for an Aadhaar card at a CSC in ${locationData?.name}?`,          
        "answer": "Yes, Aadhaar enrollment, updates, and biometric authentication services are available."        
      },
      {        
        "question": "What documents are required for availing services at a CSC?",          
        "answer": "Essential documents like identity proof, address proof, and passport-sized photographs are typically required."        
      },
      {        
        "question": `Are CSCs in ${locationData?.name} involved in educational programs?`,          
        "answer": "Yes, CSCs conduct digital literacy training, vocational courses, and PMGDISHA programs."        
      },
      {        
        "question": "How does a VLE assist citizens at the CSC?",          
        "answer": "The VLE helps with form submissions, document verification, and guiding citizens through digital processes."        
      },
    ]

    if (isCscListingPage) {

      structuredData = [
        JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [

            /* A) Listing page container */
            {
              "@type": ["WebPage","CollectionPage"],
              "@id": `https://bzindia.in/${slug}/csc#page`,
              "name": `CSC (Common Service Centres) in ${locationData?.name}, ${locationData?.district_name || locationData?.state_name}`,
              "url": `https://bzindia.in/${slug}/csc`,
              "description": `Nearby CSC (Common Service Centres) in ${locationData?.name}, ${locationData?.district_name || locationData?.state_name} for government e-services, citizen facilitation, and scheme applications.`,
              "image": "https://bzindia.in/images/csc_logo.jpg",
              "isPartOf": { "@type": "WebSite", "url": "https://bzindia.in", "name": "BZIndia" },
              "spatialCoverage": {
                "@type": "AdministrativeArea",
                "name": locationData?.name || "",
                "containedInPlace": {
                  "@type": "AdministrativeArea",
                  "name": locationData?.district_name || locationData?.state_name || "",
                  "containedInPlace": { "@type": "Country", "name": "IN" }
                },
                "geo": { "@type": "GeoCoordinates", "latitude": locationData?.latitude, "longitude": locationData?.longitude }
              }
            },

            /* B) Breadcrumbs */
            {
              "@type": "BreadcrumbList",
              "@id": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}/csc/csc-centres-in-${locationData?.slug}#breadcrumbs`,
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bzindia.in/" },
                { "@type": "ListItem", "position": 2, "name": locationData?.district_name || locationData?.state_name, "item": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}` },
                { "@type": "ListItem", "position": 3, "name": "CSC", "item": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}/csc` },
                { "@type": "ListItem", "position": 4, "name": `CSC Centres in ${locationData?.name}`, "item": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}/csc/csc-centres-in-${locationData?.slug}` }
              ]
            },

            /* C) FAQ (keep Q/A visible on the page) */
            {
              "@type": "FAQPage",
              "@id": "https://bzindia.in/kerala/csc/csc-centres-in-malappuram#faq",
              "mainEntity": faqs?.map(faq =>({
                  "@type": "Question",
                  "name": faq.question || "",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))  
            },

            /* D) ItemList of CSC centres */
            {
              "@type": "ItemList",
              "@id": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}/csc/csc-centres-in-${locationData?.slug}#list`,
              "name": "Nearby Common Service Centres (CSC) List",
              "itemListOrder": "http://schema.org/ItemListOrderAscending",
              "itemListElement": [

                /* 1) CSC Centre — Malappuram Town */
                nearbyCenters?.map((csc, index) => {
                  let cscPhoneNumber = csc?.contact_number || csc?.mobile_number || csc?.whatsapp_number || "";
      
                  if (!cscPhoneNumber.startsWith(+91)) {
                    cscPhoneNumber = `+91-${cscPhoneNumber}`;
                  }
                  
                  return({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "GovernmentOffice",
                    "@id": `https://bzindia.in/${csc.district?.slug}/csc/${csc?.slug}#govoffice`,
                    "name": csc.title || csc.name || "",
                    "image": "https://bzindia.in/media/csc_logo.jpg",
                    "telephone": cscPhoneNumber ? `+91-${cscPhoneNumber}`: "",
                    "url": `https://bzindia.in/${csc.district?.slug}/csc/${csc.slug}`,
                    "sameAs": [
                      `https://maps.google.com/?q=${csc.latitude},${csc.longitude}`
                    ],
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": csc.place_name || csc.street,
                      "addressLocality": csc.district_name || csc.district?.name || "",
                      "addressRegion": csc.state_name || csc.state?.name || "",
                      "postalCode": csc.pincode || "",
                      "addressCountry": "IN"
                    },
                    "geo": { "@type": "GeoCoordinates", "latitude": csc.latitude, "longitude": csc.longitude },
                    "department": {
                      "@type": "GovernmentOrganization",
                      "name": "Ministry of Electronics and Information Technology (MeitY)",
                      "url": "https://www.meity.gov.in"
                    },
                    "serviceArea": {
                      "@type": "GeoCircle",
                      "geoMidpoint": { "@type": "GeoCoordinates", "latitude": csc.latitude, "longitude": csc.longitude },
                      "geoRadius": "5000"
                    },
                    "openingHoursSpecification": [
                      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" },
                      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "16:00" }
                    ],
                    "amenityFeature": [
                      { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true },
                      { "@type": "LocationFeatureSpecification", "name": "Wheelchair Accessible", "value": true },
                      { "@type": "LocationFeatureSpecification", "name": "Waiting Area", "value": true },
                      { "@type": "LocationFeatureSpecification", "name": "Counter Assistance Available", "value": true },
                      { "@type": "LocationFeatureSpecification", "name": "Water Dispenser", "value": true }
                    ],
                    "aggregateRating": csc.review_count?.length > 0 ? {
                      "@type": "AggregateRating",
                      "ratingValue": "4.6",
                      "reviewCount": "24",
                      "bestRating": "5",
                      "worstRating": "1"
                    }: undefined,
                    "review": csc.review_count?.map(review => ({
                        "@type": "Review",
                        "author": { "@type": "Person", "name": "Arjun K." },
                        "datePublished": "2025-08-25",
                        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                        "reviewBody": "Quick PAN service and helpful staff."
                      })),
                     
                  }
                })}),
                
              ]
            }
          ]
        }, null, 2)
      ]

    }

    return {
      props: {        
        locationData: locationData || {},
        isCscListingPage: isCscListingPage || false,
        parentPlace: locationData || null,        
        localSlug: slug || null,
        slug: slug || null,
        faqs: faqs || [],
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {        
        locationData: {},
        isCscListingPage: false,
        parentPlace: null,        
        localSlug: null,
        slug: null,
        faqs: [],
      }
    }
  }

}
