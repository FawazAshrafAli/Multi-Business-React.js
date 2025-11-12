import Head from 'next/head';
import SeoHead from '../../../components/SeoHead';
import company from '../../../lib/api/company';
import course from '../../../lib/api/course';
import ListEducation from '../../../components/education/ListEducation';

export default function ListCoursePage({
  detailPages, currentCompany, partners,
  testimonials
}) {
  return (
    <>
        {currentCompany &&
        <>
        <SeoHead
        meta_description={`List of courses offered by ${currentCompany?.sub_type}`}
        meta_title={`Courses - ${currentCompany?.meta_title ||""}`}
        metaTags={currentCompany?.meta_tags || []}      
        blogs={currentCompany?.blogs || []}

        url = {`https://bzindia.in/${currentCompany?.slug}/courses`}
        />

        <Head>
            <script type="application/ld+json">
                    {JSON.stringify(
                        {
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": currentCompany?.meta_title || currentCompany?.sub_type || "",
                            "description": currentCompany?.meta_description || "",
                            "logo": currentCompany?.logo_url || "",
                            "url": `https://bzindia.in/${currentCompany?.slug}`,
                            "memberOf": partners?.map((partner) => (
                                {
                                    "@type": "Organization",
                                    "name": partner?.name
                                }
                            )) || [],
                            "hasOfferCatalog": {
                                "@type": "OfferCatalog",
                                "name": "Clients",
                                "itemListElement": partners?.map((partner, index) => (
                                    {
                                        "@type": "ListItem",
                                        "position": index+1,
                                        "item": {
                                            "@type": "Organization",
                                            "name": partner?.name || "",
                                            "url": "",
                                            "logo": partner?.image_url || ""
                                        }
                                    }
                                )) || [],
                            },
                        },
                        null, 2
                    )}
                </script>

                <script type="application/ld+json">
                    {JSON.stringify(
                        {
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": "Training Courses",
                            "description": "A list of available training courses",
                            "itemListElement":
                                detailPages?.map((detail) => ({
                                    "@type": "Course",
                                    "name": detail?.meta_title || "",
                                    "description": detail?.meta_description || "",
                                    "provider": {
                                        "@type": "Organization",
                                        "name": detail?.course?.company_name || ""
                                    },
                                    "image": detail?.course?.image_url || "",
                                    "hasCourseInstance": {
                                        "@type": "CourseInstance",
                                        "courseMode": [detail?.course?.mode || "Online"],
                                        "endDate": detail?.course?.ending_date ? detail?.course?.ending_date.split('T')[0] : "",
                                        "startDate": detail?.course?.starting_date ? detail?.course?.starting_date.split('T')[0] : "",
                                        "courseWorkload": detail?.course?.duration?"P"+detail?.course?.duration+"D": ""
                                    },
                                    "offers": {
                                        "@type": "Offer",
                                        "price": detail?.course?.price || "",
                                        "priceCurrency": "INR",
                                        "availability": "http://schema.org/InStock",
                                        "category": detail?.course?.program_name || ""
                                    },
                                    "aggregateRating": detail?.course?.rating_count > 0 ? {
                                    "@type": "AggregateRating",
                                    "ratingValue": Number(detail?.course?.rating),
                                    "bestRating": 5,
                                    "ratingCount": Number(detail?.course?.rating_count)
                                    } : undefined,                      
                                })) || []
                            
                        },                    
                    )}
                    </script>
                
                <script type="application/ld+json">
                    {JSON.stringify([
                        {
                        "@context": "http://schema.org",
                        "@type": "ItemList",
                        "name": "Client Testimonials",
                        "itemListElement": testimonials?.map((testimonial, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                            "@type": "Review",
                            "itemReviewed": {
                                "@type": "Organization",
                                "name": testimonial?.partner_company || "",
                                "location": {
                                "@type": "Place",
                                "name": testimonial?.place_name || ""
                                }
                            },
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": testimonial?.rating || 0
                            },
                            "author": {
                                "@type": "Person",
                                "name": testimonial?.name || ""
                            },
                            "reviewBody": testimonial?.text || "",
                            "image": testimonial?.image_url || ""
                            }
                        })) || [],
                        "numberOfItems": testimonials?.length || 0
                        },
                        {
                        "@context": "http://schema.org",
                        "@type": "AggregateRating",
                        "ratingValue": company?.rating || 0
                        }
                    ], null, 2)}
                </script>

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "LocalBusiness",
                        "name": currentCompany?.meta_title || currentCompany?.sub_type || "",
                        "url": `https://bzindia.in/${currentCompany?.slug}`,
                        "logo": currentCompany?.logo_url || "",
                        "telephone": currentCompany?.phone1 ? "+91" + currentCompany.phone1 : "",
                        "sameAs": [
                        "https://www.facebook.com/BZindia/",
                        "https://x.com/Bzindia_in",
                        "https://www.linkedin.com/company/bzindia",
                        "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
                    ],
                        "contactPoint": [
                        currentCompany?.phone1 ? {
                            "@type": "ContactPoint",
                            "telephone": "+91" + currentCompany.phone1,
                            "contactType": "Contact Number 1",
                            "contactOption": "Toll",
                            "areaServed": "IN"
                        } : null,
                        currentCompany?.phone2 ? {
                            "@type": "ContactPoint",
                            "telephone": "+91" + currentCompany.phone2,
                            "contactType": "Contact Number 2",
                            "contactOption": "Toll",
                            "areaServed": "IN"
                        } : null,
                        currentCompany?.whatsapp ? {
                            "@type": "ContactPoint",
                            "telephone": "+91" + currentCompany.whatsapp,
                            "contactType": "Whatsapp Number",
                            "contactOption": "Toll",
                            "areaServed": "IN"
                        } : null,
                        ].filter(Boolean)
                    }, null, 2)}
                </script>

                <script type="application/ld+json">
                    {JSON.stringify(
                        {
                        "@context": "http://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": `https://bzindia.in/`
                            },
                            {
                            "@type": "ListItem",
                            "position": 2,
                            "name": currentCompany?.sub_type,
                            "item": `https://bzindia.in/${currentCompany?.slug}/`
                            },
                            {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "Courses",
                            "item": `https://bzindia.in/${currentCompany?.slug}/courses`
                            },            
                        ]
                        },
                        null, 2
                    )}
                </script>
        </Head>
    </>
    }

      <ListEducation
       
      blogs={currentCompany?.blogs}
      currentCompany={currentCompany}
      initialDetailPages={detailPages}
      testimonials={testimonials}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const {slug} = context.query;

    const companyRes = await company.getInnerPageCompany(slug);
    const currentCompany = companyRes.data;    
    
    let detailPages = [];
    let partners = [];
    let testimonials = [];

    const detailPagesRes = await course.getDetailList(slug);
    detailPages = detailPagesRes.data?.results;  
    
    const partnersRes = await course.getPartners(slug);
    partners = partnersRes.data;
    
    const testimonialsRes = await course.getTestimonials(slug);
    testimonials = testimonialsRes.data;


    return {
      props: {
        detailPages: detailPages?.slice(0,12) || {},
        currentCompany: currentCompany || {},
        partners: partners || {},
        testimonials: testimonials || {},
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        detailPages: [],
        currentCompany: [],
        partners: [],
        testimonials: [],
      }
    }
  }

}
