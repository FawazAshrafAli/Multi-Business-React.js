import Head from 'next/head';
import Home from '../../components/Home';
import SeoHead from '../../components/SeoHead';

import home from '../../lib/api/home';
import metaTag from '../../lib/api/metaTag';
import blog from '../../lib/api/blog';
import company from '../../lib/api/company';
import course from '../../lib/api/course';
import service from '../../lib/api/service';
import registration from '../../lib/api/registration';
import product from '../../lib/api/product';
import search from '../../lib/api/search';

export default function IndexPage({
  homeContent, metaTags, blogs, companies,
  companyTypes, courseDetailPages, serviceDetailPages, 
  registrationDetailPages, productDetailPages,
  structuredData, query
}) {
  return (
    <>
      <SeoHead
        meta_description={homeContent?.meta_description}
        meta_title={query? `You searched for ${query}` : homeContent?.meta_title}
        metaTags={metaTags}
        
        blogs={blogs}
        url="https://bzindia.in/"
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

      <Home 
      homeContent={homeContent}
      metaTags={metaTags}
      blogs={blogs}
      companies={companies}
      companyTypes={companyTypes}
      courseDetailPages={courseDetailPages}
      serviceDetailPages={serviceDetailPages}
      registrationDetailPages={registrationDetailPages}
      productDetailPages={productDetailPages}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {

    const {s} = context.query?? null;
    let matchingItems;
    let companyTypes, companies = [];
    let courseDetailPages, serviceDetailPages, registrationDetailPages, productDetailPages = [];    

    const [homeRes, metaTagRes, blogsRes] = await Promise.all([
      home.getHomeContent(),
      metaTag.getMetaTags(),
      blog.getBlogs(`/blog_api/blogs`)
    ]);

    const homeContent = {
        "title": homeRes.data?.[0]?.title,
        "meta_title": homeRes.data?.[0]?.meta_title,
        "meta_description": homeRes.data?.[0]?.meta_description,
        "description": homeRes.data?.[0]?.description,
    };

    const metaTags = (metaTagRes.data.results || [])
    .slice(0, 12)
    .map(tag => ({"slug": tag.slug, "name": tag.name}));

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

    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const priceValidUntil = sixMonthsLater.toISOString().split("T")[0];

    const structuredData = [
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://bzindia.in/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://bzindia.in/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }),
    ]

    if (s) {
      const matchingItemsRes = await search.getResults(s, 'limit=9&offset=0')
      matchingItems = matchingItemsRes?.data?.results;

      structuredData.push(
        JSON.stringify(
            {
                "@context": "https://schema.org",
                "@type": "SearchResultsPage",
                "mainEntity": {
                    "@type": "SearchAction",
                    "query": s || "undefined",
                    "target": `https://bzindia.in/?q=${s}`,
                    "result": matchingItems?.map(item => ({
                        "@type": "WebPage",
                        "name": item.title || "undefined",
                        "url": `https://bzindia.in/${item.url || "undefined"}`
                    }) || [])
                }
            }, 
            null, 2
        ),

        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "BZIndia",
          "url": "https://bzindia.in/",
          "logo": "https://bzindia.in/images/logo.svg",
          "telephone": "+919606377677",
          "address": {
              "@type": "PostalAddress",
              "streetAddress": "5th Main, 20th Cross, 7th Sector, H.S.R Layout",
              "addressLocality": "Bangalore",
              "addressRegion": "Karnataka",
              "postalCode": "560102",
              "addressCountry": "India"
          },
          "sameAs": [
              "https://www.facebook.com/BZindia/",
              "https://x.com/Bzindia_in",
              "https://www.linkedin.com/company/bzindia",
              "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
              ],
          "contactPoint": [
              {
              "@type": "ContactPoint",
              "telephone": "919606377677" ,
              "contactType": "Contact Number 1",
              "contactOption": "Toll",
              "areaServed": "IN"
              },
              {
              "@type": "ContactPoint",
              "telephone": "919606277677",
              "contactType": "Contact Number 2",
              "contactOption": "Toll",
              "areaServed": "IN"
              },
              {
              "@type": "ContactPoint",
              "telephone": "919606377677" ,
              "contactType": "Whatsapp Number",
              "contactOption": "Toll",
              "areaServed": "IN"
              },
          ].filter(Boolean)
          }, null, 2)
      )

    } else {
      const [companyTypesRes, companiesRes] = await Promise.all([        
        company.getBriefCompanyTypes(),
        company.getBriefCompanies()
      ]);    

      companyTypes = (companyTypesRes.data || [])
          .slice(0, 12)
          .map(c => ({
            id: c.id, 
            name: c.name,
          }));

      companies = (companiesRes.data || [])
          .slice(0, 12)
          .map(c => ({
          id: c.id,
          name: c.name,
          logo_url: c.logo_url,
          get_absolute_url: c.get_absolute_url,
          meta_description: c.meta_description,
          summary: c.summary,
          slug: c.slug,
          sub_categories: c.sub_categories,
          }));    

      // Detail pages
      const companySlug = "all";

      const [
          courseRes,
          serviceRes,
          registrationRes,
          productRes
      ] = await Promise.all([
          course.getSliderDetails(companySlug),
          service.getSliderDetails(companySlug),
          registration.getSliderDetails(companySlug),
          product.getSliderProductDetails(companySlug)
      ]);

      courseDetailPages = (courseRes.data?.results || [])
          .slice(0, 12)
          .map(c => ({
          id: c.id,
          name: c.course?.name,
          image_url: c.course?.image_url,
          price: c.course?.price,
          url: c.url,
          meta_description: c.meta_description,
          company_name: c.course.company_name,
          mode: c.course.mode,
          ending_date: c.course.ending_date,
          starting_date: c.course.starting_date,
          duration: c.course.duration,
          program_name: c.course.program_name,
          rating: c.course.rating,
          rating_count: c.course.rating_count,
          }));

      serviceDetailPages = (serviceRes.data?.results || [])
          .slice(0, 12)
          .map(s => ({
          id: s.id?? null,
          name: s.name?? null,
          price: s.price?? null,
          image_url: s.image_url?? null,
          duration_count: s.duration_count?? null,
          url: s.url?? null,

          sub_category_name: s.sub_category_name?? null,
          company_sub_type: s.company_sub_type?? null,
          company_slug: s.company_slug?? null,
          category_name: s.category_name?? null,
          meta_description: s.meta_description?? null,
          }));

      registrationDetailPages = (registrationRes.data?.results || [])
          .slice(0, 12)
          .map(r => ({
          id: r.id,
          title: r.registration?.title,
          price: r.registration?.price,
          image_url: r.registration?.image_url,
          url: r.url,
          company_slug: r.company_slug,
          company_sub_type: r.company_sub_type,
          meta_description: r.meta_description,
          image_url: r.registration.image_url,
          sub_type: r.registration.sub_type,
          type_name: r.registration.type_name,
          }));

      productDetailPages = (productRes.data?.results || [])
          .slice(0, 12)
          .map(p => ({
          id: p.id,
          name: p.product?.name,
          price: p.product?.price,
          image_url: p.product?.image_url,
          url: p.url,

          category: p.product.category_name,
          company_sub_type: p.company_sub_type,
          company_slug: p.company_slug,
          meta_description: p.meta_description,
          sku: p.product.sku,
          rating: p.product.rating,
          rating_count: p.product.rating_count,
          product_reviews: (p.reviews || [])
          .slice(0, 5)
          .map(review => ({
              "review_by": review.review_by,
              "name": review.name ?? null,
              "created": review.created,
              "text": review.text,
              "rating": review.rating,
          })),
        }));

        structuredData.push(
          JSON.stringify({
            "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": registrationDetailPages?.map(detail => ({
                    "@type": "GovernmentService",
                        "name": detail?.title || "",
                        "serviceType": detail?.sub_type || "",
                        "provider": {
                        "@type": "Organization",
                        "name": detail?.company_sub_type || "",
                        "url": `https://bzindia.in/${detail.company_slug || ""}`
                        },
                        "offers": {
                        "@type": "Offer",
                        "price": detail?.price || "",
                        "priceCurrency": "INR",
                        "availability": "https://schema.org/InStock",
                        "url": `https://bzindia.in/${detail.url || ""}`,
                        },
                        "description": detail?.meta_description || "",
                        "image": detail?.image_url || "",
                        "areaServed": {
                        "@type": "Place",
                        "name": "India"
                        }
                }))
          }),          

          JSON.stringify(
            {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": productDetailPages?.map(detail => ({
                "@type": "Product",
                "name": detail?.name || "",
                "image": detail?.image_url || "",
                "description": detail?.meta_description || "",
                "sku": detail?.sku || "",
                "url": `https://bzindia.in/${detail?.company_slug || ""}`,
                "category": detail?.category || "",
                "offers": {
                    "@type": "Offer",
                    "price": detail?.price || "",
                    "priceCurrency": "INR",
                    "availability": "https://schema.org/InStock",
                    "priceValidUntil": priceValidUntil,
                    "shippingDetails": {
                      "@type": "OfferShippingDetails",
                      "shippingDestination": {
                        "@type": "DefinedRegion",
                        "addressCountry": "IN"
                      },
                      "shippingRate": {
                        "@type": "MonetaryAmount",
                        "value": "0.00",
                        "currency": "INR"
                      },
                      "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": {
                          "@type": "QuantitativeValue",
                          "minValue": 0,
                          "maxValue": 2,
                          "unitCode": "d"
                        },
                        "transitTime": {
                          "@type": "QuantitativeValue",
                          "minValue": 2,
                          "maxValue": 7,
                          "unitCode": "d"
                        }
                      }
                    },
                    "hasMerchantReturnPolicy": {
                      "@type": "MerchantReturnPolicy",
                      "applicableCountry": "IN",
                      "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
                    }
                },
                "aggregateRating": detail?.rating_count > 0 ? {
                    "@type": "AggregateRating",
                    "ratingValue": Number(detail?.rating),
                    "reviewCount": Number(detail?.rating_count)
                } : undefined,
                "review": detail?.product_reviews?.map(review => ({
                    "@type": "Review",
                    "author": {
                      "@type": "Person",
                      "name": review?.review_by || review?.name || ""
                    },                            
                    "datePublished": review?.created || "",
                    "reviewBody": review?.text || "",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": Number(review.rating)
                    }
                }))
                                    
            })) || []
            },
            
        ),

          JSON.stringify({
            "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": serviceDetailPages?.map(detailPage => ({
                    "@type": "Service",
                        "name": detailPage.name || "",
                        "serviceType": detailPage.sub_category_name || "",
                        "provider": {
                        "@type": "Organization",
                        "name": detailPage.company_sub_type || "",
                        "url": `https://bzindia.in/${detailPage.company_slug || ""}`
                        },
                        "offers": {
                        "@type": "Offer",
                        "price": detailPage.price || "",
                        "priceCurrency": "INR",
                        "url": `https://bzindia.in/${detailPage.url || ""}`,
                        "category": detailPage.category_name || "",
                        },
                        "description": detailPage.meta_description || "",
                        "image": detailPage.image_url || "",
                        "areaServed": {
                        "@type": "Place",
                        "name": "India"
                        }
                }))
          }),
          JSON.stringify({
            "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Training Courses",
                "description": "A list of available training courses",
                "itemListElement":
                    courseDetailPages?.map((detailpage) => ({
                        "@type": "Course",
                        "name": detailpage.name || "",
                        "description": detailpage?.meta_description || "",
                        "provider": {
                            "@type": "Organization",
                            "name": detailpage?.company_name || ""
                        },
                        "image": detailpage.image_url || "",
                        "hasCourseInstance": {
                            "@type": "CourseInstance",
                            "courseMode": [detailpage?.mode || ""],
                            "endDate": detailpage.ending_date?.split('T')?.[0] || "",
                            "startDate": detailpage.starting_date?.split('T')?.[0] || "",
                            "courseWorkload": detailpage.duration?"P"+detailpage.duration+"D" : ""
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": detailpage.price || "",
                            "priceCurrency": "INR",
                            "availability": "https://schema.org/InStock",
                            "category": detailpage.program_name || ""
                        },
                        "aggregateRating": detailpage.rating_count > 0 ? {
                            "@type": "AggregateRating",
                            "ratingValue": Number(detailpage.rating),
                            "bestRating": 5,
                            "ratingCount": Number(detailpage.rating_count)
                        } : undefined,                
                    }))
          }),
          
          JSON.stringify({
            "@context": "https://schema.org",
                "@type": "Organization",
                "name": "BZIndia",
                "description": "BZindia.in are a group of the joint venture to provide the best multipage with top companies in different categories from Indian Market",
                "logo": "https://bzindia.in/images/logo.svg",
                "url": "https://bzindia.in/",
                "memberOf": companyTypes?.map((companyType) => (
                    {
                        "@type": "Organization",
                        "name": companyType.name || "undefined"
                    }
                )) || [],
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Clients",
                    "itemListElement": companies?.map((company, index) => (
                        {
                            "@type": "ListItem",
                            "position": index+1,
                            "item": {
                                "@type": "Organization",
                                "name": company.name || "undefined",
                                "url": company.get_absolute_url || "undefined",
                                "logo": company.logo_url || "undefined"
                            }
                        }
                    ))
            }
          }),

          JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": (companies || []).map((company, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                "@type": "Organization",
                "name": company.name || "undefined",
                "url": company.get_absolute_url || "undefined",
                "logo": company.logo_url || "undefined",
                "description": company.meta_description || "undefined"
                }
            }))
        })

        );
    }    
    
    

    return {
      props: {
        homeContent,
        metaTags,
        blogs,
        companies: companies?? null,
        companyTypes: companyTypes?? null,        
        courseDetailPages: courseDetailPages?? null,
        serviceDetailPages: serviceDetailPages?? null,
        registrationDetailPages: registrationDetailPages?? null,
        productDetailPages: productDetailPages?? null,
        structuredData: structuredData?? null,
        query:s || null,
      }
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        homeContent: {},
        metaTags: [],
        blogs: [],
        companies: [],
        companyTypes: [],        
        courseDetailPages: [],
        serviceDetailPages: [],
        registrationDetailPages: [],
        productDetailPages: [],
        structuredData: [],
        query: [],
      }
    };
  }

}
