import Head from 'next/head';
import SeoHead from '../../../components/SeoHead';
import company from '../../../lib/api/company';
import registration from '../../../lib/api/registration';
import ListRegistration from '../../../components/registration/ListRegistration';

export default function ListRegistrationPage({
  detailPages, currentCompany,
  testimonials, structuredData
}) {
  return (
    <>
      {currentCompany &&
        <>
        <SeoHead
        meta_description={`List of registrations offered by ${currentCompany?.sub_type}`}
        meta_title={`Registrations - ${currentCompany?.meta_title}`}
        metaTags={currentCompany?.meta_tags || []}   
        blogs={currentCompany?.blogs || []}

        currentCompany={currentCompany}

        url = {`https://bzindia.in/${currentCompany?.slug}/registrations`}
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
      </>
      }

      <ListRegistration
       
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

    const detailPagesRes = await registration.getDetailList(slug);
    const detailPages = detailPagesRes.data?.results;       
    
    const testimonials = currentCompany?.testimonials;

    const structuredData = [
      
                JSON.stringify(
                    {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": currentCompany?.meta_title || currentCompany?.sub_type || "",
                        "description": currentCompany?.meta_description || "",
                        "logo": currentCompany?.logo_url || "",
                        "url": `https://bzindia.in/${currentCompany?.slug}`,
                        "memberOf": currentCompany?.clients?.map((client) => (
                            {
                                "@type": "Organization",
                                "name": client?.name
                            }
                        )) || [],
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Clients",
                            "itemListElement": currentCompany?.clients?.map((client, index) => (
                                {
                                    "@type": "ListItem",
                                    "position": index+1,
                                    "item": {
                                        "@type": "Organization",
                                        "name": client?.name || "",
                                        "url": "",
                                        "logo": client?.image_url || ""
                                    }
                                }
                            )) || [],
                        },
                    },
                    null, 2
                ),            

            
            JSON.stringify(
                {
                "@context": "http://schema.org",
                "@type": "ItemList",
                "itemListElement": detailPages?.map(detail => ({
                    "@type": "GovernmentService",
                        "name": detail.title || "",
                        "registrationType": detail.type_name || "",
                        "provider": {
                        "@type": "Organization",
                        "name": currentCompany?.meta_title || currentCompany?.sub_type || "",
                        "url": `https://bzindia.in/${currentCompany?.slug}`
                        },
                        "offers": {
                        "@type": "Offer",
                        "price": detail.price || "",
                        "priceCurrency": "INR",
                        "url": `https://bzindia.in/${detail?.url}`,
                        "category": detail.sub_type_name || "",
                        },
                        "description": detail.meta_description || "",
                        "image": detail.image_url   || "",
                        "areaServed": {
                        "@type": "Place",
                        "name": "India"
                        }
                })) || []
                },
                null, 2
            ),            
            
            
                JSON.stringify([
                    {
                    "@context": "http://schema.org",
                    "@type": "ItemList",
                    "name": "Client Testimonials",
                    "itemListElement": currentCompany?.testimonials?.map((testimonial, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                        "@type": "Review",
                        "itemReviewed": {
                            "@type": "Organization",
                            "name": testimonial?.client_company || "",
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
                    "ratingValue": currentCompany?.rating || 0
                    }
                ], null, 2),            

            
                JSON.stringify({
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
                }, null, 2),            

            
                JSON.stringify(
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
                        "name": "Registrations",
                        "item": `https://bzindia.in/${currentCompany?.slug}/registrations`
                        },            
                    ]
                    },
                    null, 2
                ),            
    ]

    return {
      props: {
        detailPages: detailPages?.slice(0,12) || {},
        currentCompany: currentCompany || {},
        testimonials: testimonials || {},
        structuredData,
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        detailPages: [],
        currentCompany: [],
        testimonials: [],
        structuredData: [],
      }
    }
  }

}
