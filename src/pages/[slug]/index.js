import React from 'react'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SeoHead from '../../../components/SeoHead';

import company from '../../../lib/api/company';
import Head from 'next/head';

import course from '../../../lib/api/course';
import service from '../../../lib/api/service';
import product from '../../../lib/api/product';
import registration from '../../../lib/api/registration';
import location from '../../../lib/api/location';
import metaTag from '../../../lib/api/metaTag';
import blog from '../../../lib/api/blog';
import home from '../../../lib/api/home';
import State from '../../../components/common/State';
import District from '../../../components/District';

const CompanyHome = dynamic(() => import('../../../components/CompanyHome'), { ssr: false });

const CompanyHomePage = ({
  currentCompany, detailPages, testimonials, structuredData,

  homeContent, metaTags, blogs, courseDetailPages,
  serviceDetailPages, registrationDetailPages, productDetailPages,
  faqs, state, district, centerCoordinate, isStatePage,
  isDistrictPage,
}) => { 
    const router = useRouter();
    const { slug } = router?.query;

    if (!currentCompany && !isStatePage && !isDistrictPage) return null;

  return (
    <>  
      <>
        {currentCompany ?
        <SeoHead
          meta_description={currentCompany?.meta_description}
          meta_title={currentCompany?.meta_title}
          metaTags={currentCompany?.meta_tags || []}
          
          blogs={currentCompany?.blogs || []}

          url = {`https://bzindia.in/${currentCompany?.slug}`}
          currentCompany={currentCompany}
        />

        : isStatePage ?
          <SeoHead
          meta_description={`Discover ${state?.name}, one of the most beautiful states in India, along with a complete list of districts, towns, and key locations.` }
          meta_title={`${state?.name}- Overview | Explore State-Wise, District-Wise & City Locations - ${homeContent?.[0]?.meta_title || ""}`}
          metaTags={metaTags}
          
          blogs={blogs}

          url = {`https://bzindia.in/${state?.slug}`}
          />
        
        : isDistrictPage ?
          <SeoHead
          meta_description={`Discover ${district?.name}, one of the most beautiful districts in ${district?.state?.name} state of India, along with a complete list of places, towns, and key locations.`}
          meta_title={`${district?.name}- Overview | Explore State-Wise, District-Wise & City Locations - ${homeContent?.[0]?.meta_title || ""}`}
          metaTags={metaTags}
          
          blogs={blogs}

          url = {`https://bzindia.in/${district?.slug}`}
          />

        : null
        }      
        <Head>
          {structuredData.map((schema, i) => (
            <script key={i} type="application/ld+json">
              {schema}
            </script>
          ))}        
        </Head>
      </>
        
      {currentCompany ?
        <CompanyHome
        slug={slug}
        
        detailPages={detailPages}
        testimonials={testimonials}
        currentCompany={currentCompany}
        />
      
        : isStatePage ?
        <State
      
        blogs={blogs}
        metaTags={metaTags}        
        state={state}
        faqs={faqs}
        itemsType="State"
        />

        : isDistrictPage ?
      
        <District
          blogs={blogs}
          metaTags={metaTags}                
          district={district}
          faqs={faqs}
          itemsType="District"
        />

      : null}
    </>
  )
}

export async function getServerSideProps(context) {
  let isStatePage, isCompanyPage, isDistrictPage = false;
  try {    
    const { slug } = context.params;

    let currentCompany, state, centerCoordinate, faqs, district;
    let structuredData, homeContent, metaTags, blogs = [];

    try {
      const companyRes = await company.getCompany(slug);
      currentCompany = companyRes.data;

      isCompanyPage = true;
    } catch (err) {

      try {
        const stateRes = await location.getState(slug);
        state = stateRes.data;

        isStatePage = true;

      } catch (err) {
        const districtRes = await location.getDistrict(slug);
        district = districtRes.data;

        isDistrictPage = true;
      }
    }

    let detailPages;
    let testimonials;

    let courseDetailPages, serviceDetailPages, registrationDetailPages, productDetailPages;

    if (isCompanyPage) {
      if (currentCompany?.company_type === "Education") {
        const courseDetailRes = await course.getSliderDetails(slug);
        detailPages = (courseDetailRes.data?.results || [])
          .slice(0, 12)
          .map(c => ({
          id: c.id?? null,
          name: c.course?.name?? null,
          image_url: c.course?.image_url?? null,
          price: c.course?.price?? null,
          url: c.url?? null,
          meta_description: c.meta_description?? null,
          company_name: c.course.company_name?? null,
          mode: c.course.mode?? null,
          ending_date: c.course.ending_date?? null,
          starting_date: c.course.starting_date?? null,
          duration: c.course.duration?? null,
          program_name: c.course.program_name?? null,
          rating: c.course.rating?? null,
          rating_count: c.course.rating_count?? null,
          }));

        const testimonialsRes = await course.getTestimonials(slug);
        testimonials = testimonialsRes.data;

      
      } else if (currentCompany?.company_type === "Service") {
        const serviceDetailRes = await service.getSliderDetails(slug);
        detailPages = (serviceDetailRes.data?.results || [])
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

        const testimonialsRes = await company.getTestimonials(slug);
        testimonials = testimonialsRes.data;

      } else if (currentCompany?.company_type === "Product") {
        const productDetailRes = await product.getSliderProductDetails(slug);
        detailPages = (productDetailRes.data?.results || [])
          .slice(0, 12)
          .map(p => ({
          id: p.id?? null,
          name: p.product?.name?? null,
          price: p.product?.price?? null,
          image_url: p.product?.image_url?? null,
          url: p.url?? null,

          category: p.product.category_name?? null,
          company_sub_type: p.company_sub_type?? null,
          company_slug: p.company_slug?? null,
          meta_description: p.meta_description?? null,
          sku: p.product.sku?? null,
          rating: p.product.rating?? null,
          rating_count: p.product.rating_count?? null,
          product_reviews: (p.product.reviews || [])
          .slice(0, 5)
          .map(review => ({
              "review_by": review.review_by,
              "name": review.name ?? null,
              "created": review.created,
              "text": review.text,
              "rating": review.rating,
          })),
          }));

        const testimonialsRes = await company.getReviews(slug);
        testimonials = testimonialsRes.data;

      } else if (currentCompany?.company_type === "Registration") {
        const registrationDetailRes = await registration.getSliderDetails(slug);
        detailPages = (registrationDetailRes.data?.results || [])
          .slice(0, 12)
          .map(r => ({
          id: r.id?? null,
          title: r.registration?.title?? null,
          price: r.registration?.price?? null,
          image_url: r.registration?.image_url?? null,
          url: r.url?? null,
          company_slug: r.company_slug?? null,
          company_sub_type: r.company_sub_type?? null,
          meta_description: r.meta_description?? null,
          image_url: r.registration.image_url?? null,
          sub_type: r.registration.sub_type?? null,
          type_name: r.registration.type_name?? null,
          }));

        const testimonialsRes = await company.getTestimonials(slug);
        testimonials = testimonialsRes.data;

      }    
      
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      const priceValidUntil = sixMonthsLater.toISOString().split("T")[0];
      
      structuredData = [      
            JSON.stringify(
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": `https://bzindia.in/${currentCompany?.slug}/`
                  },            
                ]
              },
              null, 2
            ),        
          
          
            JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": currentCompany?.faqs?.map((faq) => ({
                  "@type": "Question",
                  "name": faq?.question || "",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq?.short_answer || ""
                  }
                })) || []
              },
              null, 2
            ),         
          
            JSON.stringify({
              "@context": "http://schema.org",
              "@type": "LocalBusiness",
              "name": currentCompany?.sub_type || "",
              "url": `https://bzindia.in/${currentCompany?.slug}`,
              "logo": currentCompany?.logo_url || "",
              "telephone": currentCompany?.phone1 ? "+91" + currentCompany.phone1 : "",
              "sameAs": [
                  "https://www.facebook.com/BZindia/",
                  "https://twitter.com/Bzindia_in",
                  "https://www.linkedin.com/company/bzindia",
                  "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
              ],
              "contactPoint": [
                currentCompany?.phone1 ? {
                  "@type": "ContactPoint",
                  "telephone": currentCompany?.phone1? `+91${currentCompany.phone1}` : "",
                  "contactType": "Contact Number 1",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
                currentCompany?.phone2 ? {
                  "@type": "ContactPoint",
                  "telephone": currentCompany?.phone2? `+91${currentCompany.phone2}` : "",
                  "contactType": "Contact Number 2",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
                currentCompany?.whatsapp ? {
                  "@type": "ContactPoint",
                  "telephone": currentCompany?.whatsapp? `+91${currentCompany.whatsapp}` : "",
                  "contactType": "Whatsapp Number",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
              ].filter(Boolean)
            }, null, 2),        
      ]

          if (currentCompany?.company_type === "Education") {
            structuredData.push(          
              JSON.stringify({
          "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Training Courses",
              "description": "A list of available training courses",
              "itemListElement":
                  detailPages?.map((detailpage) => ({
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
                          "courseMode": [detailpage.mode || ""],
                          "endDate": detailpage.ending_date?.split('T')?.[0],
                          "startDate": detailpage.starting_date?.split('T')?.[0] || "",
                          "courseWorkload": detailpage.duration?"P"+detailpage.duration+"D": ""
                      },
                      "offers": {
                          "@type": "Offer",
                          "price": detailpage.price || "",
                          "priceCurrency": "INR",
                          "availability": "http://schema.org/InStock",
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
                      
            JSON.stringify(
                {
                "@context": "http://schema.org",
                "@type": "ItemList",
                "name": "Client Testimonials",
                "itemListElement": testimonials.map((testimonial, index) => ({
                    "@type": "ListItem",
                    "position": index+1,
                    "item": {
                      "@type": "Review",
                      "itemReviewed": {
                        "@type": "Course",
                        "name": testimonial?.course_name || "",
                        "location": {
                          "@type": "Place",
                          "name": testimonial?.place_name || ""
                        }
                      },
                      "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": testimonial?.rating || ""
                      },
                      "author": {
                        "@type": "Person",
                        "name": testimonial?.name || ""
                      },
                      "reviewBody": testimonial?.text || "",
                      "image": testimonial?.image_url || ""
                    },
                }))
                },
                null, 2 
              ),          
            )
          } else if (currentCompany?.company_type === "Service") {
            structuredData.push(
              JSON.stringify(
                    {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": currentCompany?.sub_type || "",
                        "description": currentCompany?.meta_description || "",
                        "logo": currentCompany?.logo_url || "",
                        "url": `https://bzindia.in/${currentCompany?.slug}`,
                        "memberOf": currentCompany?.clients?.map((client) => (
                            {
                                "@type": "Organization",
                                "name": client?.name || ""
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
            
              JSON.stringify({
                "@context": "http://schema.org",
                    "@type": "ItemList",
                    "itemListElement": detailPages?.map(detailPage => ({
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
              
                  JSON.stringify([
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
                              "name": testimonial?.client_company || "",
                              "location": {
                              "@type": "Place",
                              "name": testimonial?.place_name || ""
                              }
                          },
                          "reviewRating": {
                              "@type": "Rating",
                              "ratingValue": Number(testimonial?.rating)
                          },
                          "author": {
                              "@type": "Person",
                              "name": testimonial?.name || ""
                          },
                          "reviewBody": testimonial?.text || "",
                          "image": testimonial?.image_url || ""
                          }
                      })) || [],
                      "numberOfItems": testimonials?.length || ""
                      },
                      {
                      "@context": "http://schema.org",
                      "@type": "AggregateRating",
                      "ratingValue": Number(currentCompany?.rating)
                      }
                  ], null, 2),
                )
          } else if (currentCompany?.company_type === "Registration") {
            structuredData.push(
              JSON.stringify(
                    {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": currentCompany?.sub_type || "",
                        "description": currentCompany?.meta_description || "",
                        "logo": currentCompany?.logo_url || "",
                        "url": `https://bzindia.in/${currentCompany?.slug}`,
                        "memberOf": currentCompany?.clients?.map((client) => (
                            {
                                "@type": "Organization",
                                "name": client?.name || ""
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
            
            JSON.stringify({
              "@context": "http://schema.org",
                  "@type": "ItemList",
                  "itemListElement": detailPages?.map(detail => ({
                      "@type": "GovernmentService",
                          "name": detail?.title || "",
                          "serviceType": detail?.sub_type || "",
                          "provider": {
                          "@type": "Organization",
                          "name": detail?.company_sub_type || "",
                          "url": `https://bzindia.in/${detail.company_slug}`
                          },
                          "offers": {
                          "@type": "Offer",
                          "price": detail?.price || "",
                          "priceCurrency": "INR",
                          "availability": "http://schema.org/InStock",
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
            
                JSON.stringify({
                    "@context": "http://schema.org",
                    "@type": "ItemList",
                    "name": "Client Testimonials",
                    "itemListElement": testimonials ? testimonials.map((testimonial, index) => ({
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
                                "ratingValue": testimonial?.rating || ""
                            },
                            "author": {
                                "@type": "Person",
                                "name": testimonial?.name || ""
                            },
                            "reviewBody": testimonial?.text || "",
                            "image": testimonial?.image_url || ""
                        }
                    })) : [],
                    "numberOfItems": testimonials?.length || "",
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": currentCompany?.rating || ""
                    }
                }, null, 2),
              )
          } else if (currentCompany?.company_type === "Product") {
            structuredData.push(
              JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": detailPages?.map(detail => ({
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
                    "aggregateRating": detail?.product?.rating_count > 0 ? {
                      "@type": "AggregateRating",
                      "ratingValue": Number(detail?.product?.rating),
                      "reviewCount": Number(detail?.product?.rating_count)
                    } : undefined,
                    "review": detail?.reviews?.map(review => ({
                        "@type": "Review",
                        "author": {
                          "@type": "Person",
                          "name": review?.review_by || review?.name || ""
                        },                            
                        "datePublished": review?.created || "",
                        "reviewBody": review?.text || "",
                        "reviewRating": {
                          "@type": "Rating",
                          "ratingValue": Number(review.rating),                        
                        }
                    }))
                                        
                })) || []
              }),            
              
                  JSON.stringify({
                      "@context": "http://schema.org",
                      "@type": "ItemList",
                      "name": "Client Testimonials",
                      "itemListElement": testimonials?.map((testimonial, index) => ({
                          "@type": "ListItem",
                          "position": index + 1,
                          "item": {
                              "@type": "Review",
                              "itemReviewed": {
                                  "@type": "Product",
                                  "name": testimonial?.product_name || "",
                                  "location": {
                                      "@type": "Place",
                                      "name": ""
                                  },
                                  "aggregateRating": testimonial?.rating > 0? {
                                    "@type": "AggregateRating",
                                    "ratingValue": Number(testimonial?.rating),
                                    "reviewCount": Number(testimonials?.length)
                                  }: undefined,                      
                              },
                              "reviewRating": {
                                  "@type": "Rating",
                                  "ratingValue": Number(testimonial?.rating)
                              },
                              "author": {
                                  "@type": "Person",
                                  "name": testimonial?.name || testimonial?.review_by || ""
                              },
                              "reviewBody": testimonial?.text || "",
                              "image": testimonial?.image_url || ""
                          }
                      })) || [],
                      "numberOfItems": testimonials?.length || "",                    
                  }, null, 2),
                ),

                JSON.stringify(
                  {
                    "@context": "https://schema.org",
                    "@type": "ReturnPolicy",
                    "url": "https://bzindia.in/cancellation-refund-policy",
                    "merchantReturnDays": "7",
                    "returnFees": "FreeReturn",
                    "returnMethod": "ReturnByMail",
                    "returnPolicyCategory": "MerchantReturnFiniteReturnWindow",
                    "applicableCountry": "IN"
                  }
                )
          }
    
    } else if ((isStatePage || isDistrictPage) && state != "all") {
      const [homeRes, metaTagRes, blogsRes] = await Promise.all([
            home.getHomeContent(),
            metaTag.getMetaTags(),
            blog.getBlogs(`/blog_api/blogs`),        
          ]);
      
          homeContent = {
              "title": homeRes.data?.[0]?.title,
              "meta_title": homeRes.data?.[0]?.meta_title,
              "meta_description": homeRes.data?.[0]?.meta_description,
              "description": homeRes.data?.[0]?.description,
          };
          
          metaTags = (metaTagRes.data.results || [])
          .slice(0, 12)
          .map(tag => ({"slug": tag.slug, "name": tag.name}));
      
          blogs = (blogsRes.data.results || [])
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
          
          let stateSlug = "all";
      
          stateSlug = slug;        

        const companySlug = "all";
  
    }

    let companies;

    if (isStatePage || isDistrictPage) {     

      const productCompanies = await company.getMinimalCompanies("Product", 5);
      const serviceCompanies = await company.getMinimalCompanies("Service", 5);
      const courseCompanies = await company.getMinimalCompanies("Education", 5);
      const registrationCompanies = await company.getMinimalCompanies("Registration", 5);

      // companies = [
      //   ...productCompanies, ...serviceCompanies, ...courseCompanies, ...registrationCompanies
      // ]
    }
    
    if (isStatePage) {
      const centerCoordinateRes = await location.getStateCenter(slug);
      const centerCoordinate = centerCoordinateRes.data;  
      
      state = {
          ...state, 
          "latitude": centerCoordinate?.latitude,
          "longitude": centerCoordinate?.longitude,
        }

      structuredData = [
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `Multi-category Business Listings – ${state?.name}`,
          "itemListOrder": "ItemListOrderAscending",
          "numberOfItems": 5,
          "itemListElement": 
          
          [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "LocalBusiness",
                "@id": "https://www.bzindia.in/builders/construction-company-kolar-karnataka/#localbusiness",
                "name": "ABC Constructions – Kolar",
                "url": "https://www.bzindia.in/builders/construction-company-kolar-karnataka/",
                "image": "https://www.bzindia.in/media/companies/abc-constructions-kolar.jpg",
                "description": "Leading residential and commercial construction company in Kolar, Karnataka.",
                "logo": "https://www.bzindia.in/media/companies/abc-logo.png",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "MG Road",
                  "addressLocality": "Kolar",
                  "addressRegion": "Karnataka",
                  "postalCode": "563101",
                  "addressCountry": "IN"
                },
                "geo": { "@type": "GeoCoordinates", "latitude": 13.1367, "longitude": 78.1290 }
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "Service",
                "@id": "https://www.bzindia.in/legal/gst-registration-services-delhi/#service",
                "name": "GST Registration & Filing – Delhi",
                "description": "End-to-end GST registration and monthly return filing support for SMEs in Delhi NCR.",
                "provider": {
                  "@type": "Organization",
                  "name": "BizFiler Legal Consultants",
                  "url": "https://www.bzindia.in/legal/bizfiler/",
                  "logo": "https://www.bzindia.in/media/companies/bizfiler-logo.png"
                },
                "areaServed": { "@type": "City", "name": "New Delhi" },
                "image": "https://www.bzindia.in/media/services/gst-delhi.jpg",
                "url": "https://www.bzindia.in/legal/gst-registration-services-delhi/"
              }
            },
            {
              "@type": "ListItem",
              "position": 3,
              "item": {
                "@type": "Product",
                "@id": "https://www.bzindia.in/roofing/ceramic-roof-tiles-mumbai/#product",
                "name": "Ceramic Roof Tiles – Mumbai",
                "description": "High-durability ceramic roof tiles with elegant design and weather-resistant surface. Ideal for residential and commercial buildings.",
                "image": "https://www.bzindia.in/media/products/ceramic-roof-tiles-mumbai.jpg",
                "sku": "CRT-MUM-001",
                "brand": { "@type": "Brand", "name": "Crocotile Roofing" },
                "manufacturer": {
                  "@type": "Organization",
                  "name": "Crocotile Roofing India Pvt. Ltd.",
                  "url": "https://www.bzindia.in/roofing/crocotile/",
                  "logo": "https://www.bzindia.in/media/companies/crocotile-logo.png",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Mumbai",
                    "addressRegion": "Maharashtra",
                    "postalCode": "400001",
                    "addressCountry": "IN"
                  }
                },
                "areaServed": { "@type": "AdministrativeArea", "name": "Mumbai, Maharashtra, India" },
                "offers": {
                  "@type": "Offer",
                  "price": "250",
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock",
                  "priceValidUntil": "2025-12-31",
                  "url": "https://www.bzindia.in/roofing/ceramic-roof-tiles-mumbai/",
                  "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "applicableCountry": "IN",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                    "merchantReturnDays": 7
                  },
                  "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "IN" },
                    "deliveryTime": {
                      "@type": "ShippingDeliveryTime",
                      "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "d" },
                      "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 5, "unitCode": "d" }
                    }
                  }
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 4,
              "item": {
                "@type": "Course",
                "@id": "https://www.bzindia.in/courses/digital-marketing-course-kochi/#course",
                "name": "Advance Digital Marketing Course – Kochi",
                "description": "Industry-oriented training covering SEO, SEM, SMM, analytics and campaign automation.",
                "image": "https://www.bzindia.in/media/courses/dm-kochi.jpg",
                "url": "https://www.bzindia.in/courses/digital-marketing-course-kochi/",
                "provider": {
                  "@type": "CollegeOrUniversity",
                  "name": "Dreamversity™ College",
                  "url": "https://www.bzindia.in/dreamversity/",
                  "logo": "https://www.bzindia.in/media/companies/dreamversity-logo.png"
                },
                "hasCourseInstance": {
                  "@type": "CourseInstance",
                  "courseMode": "onsite",
                  "location": {
                    "@type": "Place",
                    "name": "Dreamversity Kochi Campus",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "Kochi",
                      "addressRegion": "Kerala",
                      "addressCountry": "IN"
                    },
                    "geo": { "@type": "GeoCoordinates", "latitude": 9.9312, "longitude": 76.2673 }
                  },
                  "startDate": "2025-12-01",
                  "endDate": "2026-01-15"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 5,
              "item": {
                "@type": "GovernmentService",
                "@id": "https://www.bzindia.in/legal/udyam-registration-support-india/#govservice",
                "name": "Udyam Registration Support – India",
                "description": "Complete support for MSMEs to obtain Udyam registration and avail government benefits.",
                "provider": {
                  "@type": "Organization",
                  "name": "Greatbell HR Consultancy Services Pvt. Ltd.",
                  "url": "https://www.bzindia.in/consultants/greatbell-hr/",
                  "logo": "https://www.bzindia.in/media/companies/greatbell-logo.png"
                },
                "serviceOperator": {
                  "@type": "GovernmentOrganization",
                  "name": "Ministry of MSME, Government of India"
                },
                "areaServed": { "@type": "Country", "name": "India" },
                "url": "https://www.bzindia.in/legal/udyam-registration-support-india/"
              }
            }
          ]
        }, null, 2)
      ];
    
      } else if (isDistrictPage) {
        const centerCoordinateRes = await location.getDistrictCenter(slug);
        const centerCoordinate = centerCoordinateRes.data;

        district = {
          ...district, 
          "latitude": centerCoordinate?.latitude,
          "longitude": centerCoordinate?.longitude,
        }

        faqs = [
          {
            question: `What is the importance of ${district?.name}?`,
            answer: `${district?.name} plays an important role in its region due to its cultural, historical, and economic relevance.`              
          },
          {
            question: `What are the major industries or occupations in ${district?.name}?`,
            answer: `${district?.name} is known for industries and occupations that contribute to local economic development and employment.`              
          },
          {
            question: `What is the best time to visit ${district?.name}?`,
            answer: `The ideal time to visit ${district?.name} depends on local climate, but generally falls between October and March.`              
          },
          {
            question: `How can I reach ${district?.name}?`,
            answer: `${district?.name} can be reached by road, rail, and in many cases, air, depending on its connectivity and location.`              
          },
          {
            question: `What are the popular attractions in ${district?.name || "India" }?`,
            answer: `${district?.name} offers various local attractions, including historical sites, cultural landmarks, and natural beauty.`              
          },
          {
            question: `How many places are there in ${district.name} District?`,
            answer: `There are ${district.places?.length} places in ${district.name} District.`
          }
        ]

        structuredData = [
      JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${district?.name || ""} - Places and Locations`,
            "url": `https://bzindia.in/${slug}`,
            "description": `Discover ${district?.name || ""}, one of the most beautiful districts in ${district?.state?.name || ""} state of India, along with a complete list of places, towns, and key locations.`,
            "image": [
                    "https://bzindia.in/images/location_delhi.jpeg",
                    "https://bzindia.in/images/location_mumbai.jpeg",
                    "https://bzindia.in/images/location_himachalpradesh.jpeg",
                    "https://bzindia.in/images/location_kerala.jpeg",
                    "https://bzindia.in/images/location_jammu.jpeg",
                    "https://bzindia.in/images/location_karnataka.jpeg"
              ],
            "mainEntity": {
              "@type": "Place",
              "name": district?.name || "",
              "url": `https://bzindia.in/${slug}`,
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": centerCoordinate?.latitude || "",
                "longitude": centerCoordinate?.longitude || ""
              },
              "address": {
                "@type": "PostalAddress",
                "addressRegion": district?.name || "",
                "addressCountry": "India"
              },
              "containedInPlace": {
                "@type": "AdministrativeArea",
                "name": district?.name || ""
              },
              "hasMap": `https://www.google.com/maps?q=${centerCoordinate?.latitude},${centerCoordinate?.longitude}&z=15&output=embed`
            },
            "itemList": {
              "@type": "ItemList",
              "name": `Places in ${district?.name || ""}`,
              "itemListOrder": "ascending",
              "itemListElement": district?.places?.map((place, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": place.name || "",
                "url": `https://bzindia.in/${slug}/${place.slug}`
              }))
            }
          }
      ),      

      JSON.stringify({
        "@context": "http://schema.org",
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
        }
      ),

      JSON.stringify(
          {
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://bzindia.in/"
            },            
            {
            "@type": "ListItem",
            "position": 2,
            "name": district?.name || state?.name || "",
            "item": `https://bzindia.in/${slug}/`
            },
          ]                   
          }
      ),

      JSON.stringify(
          {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs?.map((faq) => ({
              "@type": "Question",
              "name": faq?.question || "",
              "acceptedAnswer": {
              "@type": "Answer",
              "text": faq?.answer || ""
              }
          })) || []
          },
          null, 2
      ),

      JSON.stringify({
        "@context": "http://schema.org",
            "@type": "ItemList",
            "itemListElement": registrationDetailPages?.map(detail => ({
                "@type": "GovernmentService",
                    "name": detail?.title || "",
                    "serviceType": detail?.sub_type || "",
                    "provider": {
                    "@type": "Organization",
                    "name": detail?.company_sub_type || "",
                    "url": `https://bzindia.in/${detail.company_slug}`
                    },
                    "offers": {
                    "@type": "Offer",
                    "price": detail?.price || "",
                    "priceCurrency": "INR",
                    "availability": "http://schema.org/InStock",
                    "url": `https://bzindia.in/${detail.url}`,
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
                "url": `https://bzindia.in/${detail?.company_slug}`,
                "category": detail?.category || "",
                "offers": {
                    "@type": "Offer",
                    "price": detail?.price || "",
                    "priceCurrency": "INR",
                    "availability": "https://schema.org/InStock",
                    "priceValidUntil": "",
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
        "@context": "http://schema.org",
            "@type": "ItemList",
            "itemListElement": serviceDetailPages?.map(detailPage => ({
                "@type": "Service",
                    "name": detailPage.name || "",
                    "serviceType": detailPage.sub_category_name || "",
                    "provider": {
                    "@type": "Organization",
                    "name": detailPage.company_sub_type || "",
                    "url": `https://bzindia.in/${detailPage.company_slug}`
                    },
                    "offers": {
                    "@type": "Offer",
                    "price": detailPage.price || "",
                    "priceCurrency": "INR",
                    "url": `https://bzindia.in/${detailPage.url}`,
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
                        "courseMode": [detailpage.mode || ""],
                        "endDate": detailpage.ending_date?.split('T')?.[0],
                        "startDate": detailpage.starting_date?.split('T')?.[0] || "",
                        "courseWorkload": detailpage.duration?"P"+detailpage.duration+"D": ""
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": detailpage.price || "",
                        "priceCurrency": "INR",
                        "availability": "http://schema.org/InStock",
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
      
    ];
      }
    
    return {
      props: {
        currentCompany: currentCompany || null,                
        detailPages: detailPages || [],
        testimonials: testimonials || {},   
        structuredData,

        homeContent: homeContent || null,
        metaTags: metaTags || [],
        blogs,                        
        courseDetailPages: courseDetailPages || [],
        serviceDetailPages: serviceDetailPages || [],
        registrationDetailPages: registrationDetailPages || [],
        productDetailPages: productDetailPages || [],
        faqs: faqs || [],
        state: state || null,
        district: district || null,
        
        isStatePage: isStatePage || false,
        isDistrictPage: isDistrictPage || false,
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        currentCompany: null,                   
        detailPages: [],
        testimonials: [],
        structuredData: [],

        homeContent: null,
        metaTags: [],
        blogs: [],                               
        courseDetailPages: [],
        serviceDetailPages: [],
        registrationDetailPages: [],
        productDetailPages: [],
        faqs: [],
        state: null,
        district: null,

        isStatePage: false,
        isDistrictPage: false,
      }
    }
    
  }

}


export default CompanyHomePage