import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import service from '../../../../lib/api/service';
import location from '../../../../lib/api/location';
import blog from '../../../../lib/api/blog';
import ListServiceSubCategories from '../../../../components/service/ListServiceSubCategories';

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
        meta_description={`Get online services in ${address} with expert consultants and quick approvals.`}
        meta_title={`Sub category Services in ${address}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/more-services`}
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

      <ListServiceSubCategories
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

    if (!isSubCategoryListingPage) throw new Error("Not a service sub type listing page");    

    const subCategoryRes = await service.getSubCategories("all");
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

    const structuredData = [
      JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [

          /* A) Listing page */
          {
            "@type": ["WebPage","CollectionPage"],
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/more-services#page`,
            "name": `Sub category Services in ${address}`,
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/`,
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
              "itemListElement": subCategories?.map((subCategory, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Service",
                    "@id": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory.location_slug || subCategory.slug}-${locationData?.slug}#service`,
                    "name": subCategory?.full_title || "",
                    "description": subCategory?.meta_description || "",
                    "image": subCategory?.image_url || "",
                    "url": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory.location_slug || subCategory.slug}-${locationData?.slug}`
                  }
              }))
            }
          },

          /* B) Breadcrumbs */
          {
            "@type": "BreadcrumbList",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/more-services#breadcrumbs`,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bzindia.in/" },
              { "@type": "ListItem", "position": 2, "name": locationData?.district_name || locationData?.state_name || locationData?.name, "item": `https://bzindia.in/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}` },
              { "@type": "ListItem", "position": 3, "name": "Services", "item": `https://${locationData?.district_slug || locationData?.state_slug}/more-services` },
            ]
          },

          /* C) FAQ */
          // {
          //   "@type": "FAQPage",
          //   "@id": "https://bzindia.in/kerala/services/CompanySubType/subcatogry-services-in-malappuram#faq",
          //   "mainEntity": [
          //     {
          //       "@type": "Question",
          //       "name": "How long does GST registration take in Malappuram?",
          //       "acceptedAnswer": {
          //         "@type": "Answer",
          //         "text": "With complete documents, GST registration approval typically takes 3–7 working days."
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
          subCategories?.map((subCategory, index) => ({
            "@type": "ProfessionalService",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory.location_slug || subCategory.slug}-${locationData?.slug}#service`,
            "name": `${subCategory.company_name || index + 1} - ${subCategory.name}`, 
            "image": subCategory.company_logo_url || "",
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory.location_slug || subCategory.slug}-${locationData?.slug}`,
            "telephone": subCategory?.company_contact? `+91-${subCategory?.company_contact}`: "",
            "priceRange": subCategory?.price? `₹${subCategory?.price}` : "",
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
            "aggregateRating": (subCategory?.testimonials?.length > 0) && {
              "@type": "AggregateRating",
              "ratingValue": Number(subCategory.rating),
              "reviewCount": Number(subCategory?.testimonials?.length),
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": subCategory?.testimonials?.map(testimonial => ({
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
