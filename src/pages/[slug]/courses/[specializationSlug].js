import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import course from '../../../../lib/api/course';
import location from '../../../../lib/api/location';
import blog from '../../../../lib/api/blog';
import ListCourseDetails from '../../../../components/education/ListCourseDetails';

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
        meta_description={`Explore industry-oriented professional and skill development Specification Courses in ${address} with certification and placement support.`}
        meta_title={`Specification Courses in ${address}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug}/courses/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}`}
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

    
    specializationRes = await course.getSpecializations(`/course_api/companies/all/specializations/?location_slug=${passingSpecializationSlug}`);        
    specialization = specializationRes.data?.results?.[0];
    
    let title_list = [];

    if (specialization) {
      [specialization?.starting_title, specialization?.name, specialization?.ending_title].forEach(title => {
        if (title) {
          title_list.push(title);
        }
      });      
    }

    specialization = {...specialization, "full_title": title_list.join(" ")};

  
    if (!specialization) {            
      specializationRes = await course.getSpecialization("all", passingSpecializationSlug);
      specialization = specializationRes.data;

    }

    if (specialization && (locationData?.district_slug == slug || locationData?.state_slug == slug || locationData?.slug == slug)) {
      isListCourseDetailsPage = true;
    }    

    if (!isListCourseDetailsPage) throw new Error("Not a course detail listing page");

    const detailRes = await course.getDetailList("all");
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

          /* A) Listing page container */
          {
            "@type": ["WebPage","CollectionPage"],
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/courses/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}/courses#page`,
            "name": `Specification Courses in ${address}`,
            "url": `https://${locationData?.district_slug || locationData?.state_slug}/courses/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}/courses`,
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
            "@id": `https://${locationData?.district_slug || locationData?.state_slug}/courses/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}/courses#breadcrumbs`,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bzindia.in/" },
              { "@type": "ListItem", "position": 2, "name": locationData?.district_name || locationData?.state_name || locationData?.name, "item": `https://bzindia.in/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}` },
              { "@type": "ListItem", "position": 3, "name": "Courses", "item": `https://${locationData?.district_slug || locationData?.state_slug}/courses` },
              { "@type": "ListItem", "position": 4, "name": `${specialization?.full_title} ${locationData?.name}`, "item": `https://${locationData?.district_slug || locationData?.state_slug}/courses/${specialization?.locationSlug || specialization?.slug}-${locationData?.slug}` },
            ]
          },

          /* C) FAQ (eligible rich result) */
          {
            "@type": "FAQPage",
            "@id": "https://bzindia.in/kerala/courses/CompanySubType/specification-courses-in-malappuram#faq",
            "mainEntity": specialization?.faqs?.map(faq => ({
                "@type": "Question",
                "name": faq.question || "",
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer || "" }
              }))            
          },

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

          details?.map(detail => ({
            "@type": "Course",
            "@id": `https://${detail.url}#course`,
            "name": detail?.course?.name || "",
            "description": detail?.description || ` ${detail?.course?.name}`,
            "url": `https://${detail.url}`,
            "image": detail?.course?.image_url || "",
            "provider": { "@id": `https://bzindia.in/${specialization?.company_slug}/#org` },
            "aggregateRating": (detail?.course?.testimonials?.length > 0) ? {
              "@type": "AggregateRating",
              "ratingValue": Number(detail.course?.rating),
              "reviewCount": Number(detail?.course?.testimonials?.length),
              "bestRating": "5",
              "worstRating": "1"
            } : undefined,
            "review": detail?.course?.testimonials?.length > 0 ? detail?.course?.testimonials?.map(testimonial => ({
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
                "startDate": detail?.course?.starting_date ? detail?.course?.starting_date.split('T')[0] : "",
                "endDate": detail?.course?.ending_date ? detail?.course?.ending_date.split('T')[0] : "",
                "location": {
                  "@type": "Place",
                  "name": `${detail.company_name} — ${locationData?.name}`,
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
                  "price": detail?.course?.price || "",
                  "availability": "https://schema.org/InStock",
                  "url": `https://${detail.url}#apply`
                }
              },
              {
                "@type": "CourseInstance",
                "name": `${detail?.course?.mode} Weekday Batch`,
                "courseMode": detail?.course?.mode || "",
                "startDate": detail?.course?.starting_date ? detail?.course?.starting_date.split('T')[0] : "",
                "endDate": detail?.course?.ending_date ? detail?.course?.ending_date.split('T')[0] : "",
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "INR",
                  "price": detail?.course?.price || "",
                  "availability": "https://schema.org/InStock",
                  "url": `https://${detail.url}#apply`
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
