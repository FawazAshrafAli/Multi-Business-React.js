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

    if (isStatePage) {
      const centerCoordinateRes = await location.getStateCenter(slug);
      const centerCoordinate = centerCoordinateRes.data;  
      
      state = {
          ...state, 
          "latitude": centerCoordinate?.latitude,
          "longitude": centerCoordinate?.longitude,
        }      
    
      } else if (isDistrictPage) {
        const centerCoordinateRes = await location.getDistrictCenter(slug);
        const centerCoordinate = centerCoordinateRes.data;

        district = {
          ...district, 
          "latitude": centerCoordinate?.latitude,
          "longitude": centerCoordinate?.longitude,
        }

    }

    if (isStatePage || isDistrictPage) {
      const [
        productCompaniesRes, serviceCompaniesRes,
        educationCompaniesRes, registrationCompaniesRes,
        serviceSubCategoriesRes, registrationSubTypesRes,
        productSubCategoriesRes, courseSpecializationsRes
      ] = await Promise.all([
          company.getInnerPageCompanies("Product", 5),
          company.getInnerPageCompanies("Service", 5),
          company.getInnerPageCompanies("Education", 5),
          company.getInnerPageCompanies("Registration", 5),
          service.getSubCategories("all"), 
          registration.getRegistrationSubTypes("all"),
          product.getSubCategories("all"),
          course.getSpecializations("/course_api/companies/all/specializations")
      ])

      const productCompanies = productCompaniesRes?.data;
      const educationCompanies = educationCompaniesRes?.data;
      const serviceCompanies = serviceCompaniesRes?.data;
      const registrationCompanies = registrationCompaniesRes?.data;

      const companies = [...productCompanies, ...educationCompanies, ...serviceCompanies, ...registrationCompanies]

      const serviceSubCategories = serviceSubCategoriesRes?.data?.results;
      const registrationSubTypes = registrationSubTypesRes?.data?.results;
      const productSubCategories = productSubCategoriesRes?.data?.results;
      const courseSpecializations = courseSpecializationsRes?.data?.results;

      structuredData = [
        JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [

              /* Mother company */
              {
                "@type": "Organization",
                "@id": "https://www.bzindia.in/#org",
                "name": "BZIndia Ventures Pvt. Ltd.",
                "url": "https://www.bzindia.in/",
                "logo": "https://bzindia.in/images/logo.svg",
                "subOrganization": companies?.map(company => ({ "@id": `https://www.bzindia.in/${company?.slug}/#org` }))                           
              },

              /* Courses company */
              educationCompanies?.map(company => ({
                "@type": "EducationalOrganization",
                "@id": `https://www.bzindia.in/${company?.slug}/#org`,
                "name": company?.sub_type,
                "url": `https://www.bzindia.in/${company?.slug}`,
                "logo": company?.logo_url,
                "parentOrganization": { "@id": "https://www.bzindia.in/#org" },
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": company?.district_name || "",
                  "addressRegion": company?.state_name || "",
                  "addressCountry": "IN"
                }
              })),

              /* Services company (with address + rating ON LocalBusiness) */
              serviceCompanies?.map(company => ({
                "@type": "LocalBusiness",
                "@id": `https://www.bzindia.in/${company?.slug}/#org`,
                "name": company?.sub_type,
                "url": `https://www.bzindia.in/${company?.slug}/`,
                "logo": company?.logo_url,
                "parentOrganization": { "@id": "https://www.bzindia.in/#org" },
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": company?.place_name || "",
                  "addressLocality": company?.district_name || "",
                  "addressRegion": company?.state_name || "",
                  "postalCode": company?.pincode || "",
                  "addressCountry": "IN"
                },
                "aggregateRating": company?.rating_count > 0 ? { "@type": "AggregateRating", "ratingValue": Number(company?.rating), "reviewCount": Number(company?.rating_count) } : undefined,
                "makesOffer": serviceSubCategories?.filter(
                  subCategory => subCategory?.company_slug === company.slug
                ).map(subCat => ({
                    "@type": "Offer",
                    "@id": `https://www.bzindia.in/${state?.slug || district?.slug}/services/${subCat?.location_slug || subCat?.slug}/#offer`,
                    "price": subCat?.price,
                    "priceCurrency": "INR",
                    "url": `https://www.bzindia.in/${state?.slug || district?.slug}/services/${subCat?.location_slug || subCat?.slug}/`,
                    "availability": "https://schema.org/InStock",
                    "itemOffered": {
                      "@type": "Service",
                      "@id": `https://www.bzindia.in/${state?.slug || district?.slug}/services/${subCat?.location_slug || subCat?.slug}/#service`,
                      "name": subCat?.name,
                      "description": subCat?.meta_description || ""
                    }
                  }))                 
              })),

              /* Government services company (rating ON Organization, not on GovernmentService) */
              registrationCompanies?.map(company => ({
                "@type": "Organization",
                "@id": `https://www.bzindia.in/${company?.slug}/#org`,
                "name": company?.sub_type,
                "url": `https://www.bzindia.in/${company?.slug}/`,
                "logo": company?.logo_url,
                "parentOrganization": { "@id": "https://www.bzindia.in/#org" },
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": company?.district_name || "",
                  "addressRegion": company?.state_name || "",
                  "addressCountry": "IN"
                },
                "aggregateRating": company?.rating_count > 0 ? { "@type": "AggregateRating", "ratingValue": Number(company?.rating), "reviewCount": Number(company?.rating_count) } : undefined,
                "makesOffer": registrationSubTypes?.map(subType => ({
                    "@type": "Offer",
                    "@id": `https://www.bzindia.in/${state?.slug || district?.slug}/filings/${subType?.location_slug || subType?.slug}/#offer`,
                    "price": subType?.price || "",
                    "priceCurrency": "INR",
                    "url": `https://www.bzindia.in/${state?.slug || district?.slug}/filings/${subType?.location_slug || subType?.slug}/`,
                    "availability": "https://schema.org/InStock",
                    "itemOffered": {
                      "@type": "GovernmentService",
                      "@id": `https://www.bzindia.in/${state?.slug || district?.slug}/filings/${subType?.location_slug || subType?.slug}/#service`,
                      "name": subType?.name,
                      "description": subType?.meta_description || "",
                      "serviceOperator": {
                        "@type": "GovernmentOrganization",
                        "name": "Ministry of MSME, Government of India"
                      },
                      "areaServed": { "@type": "Country", "name": "India" }
                    }
                  }))
                                
              })),

              /* Products company + offers (seller) */
              productCompanies?.map(company => ({
                "@type": "Organization",
                "@id": `https://www.bzindia.in/${company?.slug}/#org`,
                "name": company?.sub_type,
                "url": `https://www.bzindia.in/${company?.slug}/`,
                "logo": company?.logo_url,
                "brand": { "@type": "Brand", "name": productSubCategories?.[0]?.brand_name },
                "parentOrganization": { "@id": "https://www.bzindia.in/#org" },
                "makesOffer": productSubCategories?.map(subCat => ({
                    "@type": "Offer",
                    "@id": `https://www.bzindia.in/${state?.slug || district?.slug}/products/${subCat?.location_slug || subCat?.slug}/#offer`,
                    "price": subCat?.price,
                    "priceCurrency": "INR",
                    "url": `https://www.bzindia.in/${state?.slug || district?.slug}/products/${subCat?.location_slug || subCat?.slug}`,
                    "availability": "https://schema.org/InStock",
                    "seller": { "@id": `https://www.bzindia.in/${company?.slug}/#org` }
                  }))
                                
              })),

              /* Product nodes (ratings ON Product; offers linked by @id) */
              productSubCategories?.map(subCat => ({
                "@type": "Product",
                "@id": `https://www.bzindia.in/${state?.slug || district?.slug}/products/${subCat?.location_slug || subCat?.slug}/#product`,
                "name": subCat?.name,
                "description": subCat?.meta_description?.replace("place_name", state?.name),
                "image": subCat?.image_url,
                "brand": { "@type": "Brand", "name": subCat?.brand_name },
                "manufacturer": { "@id": `https://www.bzindia.in/${subCat?.company_slug}/#org` },
                "aggregateRating": subCat?.rating_count > 0 ? { "@type": "AggregateRating", "ratingValue": Number(subCat?.rating), "reviewCount": Number(subCat?.rating_count) } : undefined,
                "offers": { "@id": `https://www.bzindia.in/${state?.slug || district?.slug}/products/${subCat?.location_slug || subCat?.slug}/#offer`}
              })),              

              /* ONE carousel on page: Courses (ratings ON Course) */
              {
                "@type": "ItemList",
                "@id": `https://www.bzindia.in/${state?.slug || district?.slug}/courses/#list`,
                "name": "Popular Courses",
                "itemListOrder": "ItemListOrderAscending",
                "itemListElement": courseSpecializations?.map((spec, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                      "@type": "Course",
                      "@id": `https://www.bzindia.in/${state?.slug || district?.slug}/courses/${spec?.location_slug || spec?.slug}/#course`,
                      "name": spec?.name,
                      "description": spec?.meta_description?.replace("place_name", state?.name) || spec?.description || spec?.name || "",
                      "provider": { "@id": `https://www.bzindia.in/${spec?.company_slug}/#org` },
                      "aggregateRating": spec?.rating_count > 0 ? { "@type": "AggregateRating", "ratingValue": Number(spec?.rating), "reviewCount": Number(spec?.rating_count) }: undefined
                    }
                  }))                              
              }
            ]
          })
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