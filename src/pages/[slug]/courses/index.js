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
        meta_description={`Explore industry-oriented professional and skill development Specification Courses in ${address} with certification and placement support.`}
        meta_title={`Specification Courses in ${address}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses`}
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

    const specializationRes = await course.getSpecializations("/course_api/companies/all/specializations/");    
    const specializations = specializationRes.data?.results;

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

          /* A) Listing page container */
          {
            "@type": ["WebPage","CollectionPage"],
            "@id": `https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses#page`,
            "name": `Specification Courses in ${address}`,
            "url": `https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses`,
            "description": `Explore industry-oriented professional and skill development Specification Courses in ${address} with certification and placement support.`,
            "image": "https://bzindia.in/images/logo.svg",
            "isPartOf": { "@type": "WebSite", "url": "https://bzindia.in", "name": "BZIndia" },
            "spatialCoverage": {
              "@type": "AdministrativeArea",
              "name": locationData?.district_name_name || locationData?.name || "",
              "containedInPlace": {
                "@type": "AdministrativeArea",
                "name": locationData?.state_name || locationData?.name || "",
                "containedInPlace": { "@type": "Country", "name": "India" }
              },
              "geo": { "@type": "GeoCoordinates", "latitude": locationData?.latitude || "", "longitude": locationData?.longitude || "" }
            }
          },

          /* B) Breadcrumbs (eligible rich result) */
          {
            "@type": "BreadcrumbList",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses#breadcrumbs`,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bzindia.in/" },
              { "@type": "ListItem", "position": 2, "name": locationData?.district_name || locationData?.state_name || locationData?.name, "item": `https://bzindia.in/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}` },
              { "@type": "ListItem", "position": 3, "name": "Courses", "item": `https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses` },
            ]
          },

          /* C) FAQ (eligible rich result) */
          // {
          //   "@type": "FAQPage",
          //   "@id": "https://bzindia.in/kerala/courses/CompanySubType/specification-courses-in-malappuram#faq",
          //   "mainEntity": [
          //     {
          //       "@type": "Question",
          //       "name": "Do you offer both online and classroom Specification Courses in Malappuram?",
          //       "acceptedAnswer": { "@type": "Answer", "text": "Yes. Most programs are available in both online and in-person modes with flexible schedules." }
          //     },
          //     {
          //       "@type": "Question",
          //       "name": "Will I get a certificate after completion?",
          //       "acceptedAnswer": { "@type": "Answer", "text": "Yes, all programs include course completion certificates. Some include vendor/industry credentials." }
          //     },
          //     {
          //       "@type": "Question",
          //       "name": "Is placement assistance available?",
          //       "acceptedAnswer": { "@type": "Answer", "text": "We provide interview prep, resume support, and referrals through partner employers." }
          //     }
          //   ]
          // },

          /* D) Provider (with reviews & rating) */
          {
            "@type": "EducationalOrganization",
            "@id": "https://bzindia.in/academy/#org",
            "name": "BZIndia Academy",
            "url": "https://bzindia.in/academy/",
            "logo": "https://bzindia.in/static/logo.png",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": locationData?.district_name || locationData?.name || "",
              "addressRegion": locationData?.state_name || locationData?.name || "",
              "postalCode": locationData?.pincode || "",
              "addressCountry": "IN"            
            },
            "geo": { "@type": "GeoCoordinates", "latitude": locationData?.latitude || "", "longitude": locationData?.longitude || "" },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "reviewCount": "128",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Rakesh P." },
                "datePublished": "2025-08-28",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                "reviewBody": "Great faculty and helpful placement team."
              }
            ]
          },

          specializations?.map(specialization => ({
            "@type": "Course",
            "@id": `https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses/${specialization.location_slug || specialization.slug}-${locationData?.slug}#course`,
            "name": specialization?.name || "",
            "description": specialization?.description || `Specification courses of ${specialization?.name}`,
            "url": `https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses/${specialization.location_slug || specialization.slug}-${locationData?.slug}`,
            "image": specialization?.image_url || "",
            "provider": { "@id": `https://bzindia.in/${specialization?.company_slug}/#org` },
            "aggregateRating": (specialization?.testimonials?.length > 0) ? {
              "@type": "AggregateRating",
              "ratingValue": Number(specialization.rating),
              "reviewCount": Number(specialization?.testimonials?.length),
              "bestRating": "5",
              "worstRating": "1"
            } : undefined,
            "review": specialization?.testimonials?.length > 0 ? specialization?.testimonials?.map(testimonial => ({
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
            "hasCourseInstance": [
              {
                "@type": "CourseInstance",
                "name": `${locationData?.name} In-Person Batch`,
                "courseMode": "InPerson",
                "startDate": specialization?.starting_date ? specialization?.starting_date.split('T')[0] : "",
                "endDate": specialization?.ending_date ? specialization?.ending_date.split('T')[0] : "",
                "location": {
                  "@type": "Place",
                  "name": `${specialization.company_name} — ${locationData?.name}`,
                  "geo": { "@type": "GeoCoordinates", "latitude": 11.0730, "longitude": 76.0740 },
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": locationData?.name || "",
                    "addressLocality": locationData?.district_name || locationData?.name || "",
                    "addressRegion": locationData?.state_name || locationData?.name || "",
                    "postalCode": locationData?.pincode || "",
                    "addressCountry": "IN"
                  }
                },
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "INR",
                  "price": specialization?.price || "",
                  "availability": "https://schema.org/InStock",
                  "url": `https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses/${specialization.location_slug || specialization.slug}-${locationData?.slug}#apply`
                }
              },
              {
                "@type": "CourseInstance",
                "name": `${specialization?.mode} Weekday Batch`,
                "courseMode": specialization?.mode || "",
                "startDate": specialization?.starting_date ? specialization?.starting_date.split('T')[0] : "",
                "endDate": specialization?.ending_date ? specialization?.ending_date.split('T')[0] : "",
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "INR",
                  "price": specialization?.price || "",
                  "availability": "https://schema.org/InStock",
                  "url": `https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses/${specialization.location_slug || specialization.slug}-${locationData?.slug}#apply`
                }
              }
            ]
          }))

        ]
      })
    ]

    return {
      props: {
        structuredData,
        specializations: specializations || [],
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
        specializations: [],
        structuredData: [],
        isSpecializationListingPage: false,
        locationData: {},
        blogs: [],
        address: null
      }
    }
  }

}
