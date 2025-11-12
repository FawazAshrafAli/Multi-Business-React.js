import SeoHead from '../../../../components/SeoHead';
import metaTag from '../../../../lib/api/metaTag';
import blog from '../../../../lib/api/blog';
import location from '../../../../lib/api/location';
import ListLocations from '../../../../components/ListLocations';
import home from '../../../../lib/api/home';
import Head from 'next/head';
import product from '../../../../lib/api/product';
import registration from '../../../../lib/api/registration';
import service from '../../../../lib/api/service';
import course from '../../../../lib/api/course';

export default function StateLocation({
  homeContent, metaTags, blogs, courseDetailPages,
  serviceDetailPages, registrationDetailPages, productDetailPages,
  faqs, state, centerCoordinate, district, structuredData, 
  isLocationPage
}) {
  if (!isLocationPage) return;
  return (
    <>
      <SeoHead
      meta_description={`Discover ${district?.name}, one of the most beautiful districts in ${district?.state?.name} state of India, along with a complete list of places, towns, and key locations.`}
      meta_title={`${district?.name}- Overview | Explore State-Wise, District-Wise & City Locations - ${homeContent?.[0]?.meta_title || ""}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = {`https://bzindia.in/state-list-in-india/${state?.slug}/${district?.slug}/`}
      />

      <Head>
        {structuredData.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {schema}
          </script>
        ))}
      </Head>
      
      <ListLocations
      blogs={blogs}
      metaTags={metaTags}      
      courseDetailPages={courseDetailPages}
      registrationDetailPages={registrationDetailPages}
      productDetailPages={productDetailPages}
      serviceDetailPages={serviceDetailPages}
      state={state}
      centerCoordinate={centerCoordinate}
      faqs={faqs}
      initialDistrict={district}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {   
    let isLocationPage = false;

    const params = context.query;

    const [homeRes, metaTagRes, blogsRes] = await Promise.all([
      home.getHomeContent(),
      metaTag.getMetaTags(),
      blog.getBlogs(`/blog_api/blogs`),        
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
        id: b.id?? null,
        title: b.title?? null,
        slug: b.slug?? null,
        summary: b.summary?? null,
        image_url: b.image_url?? null,
        published_date: b.published_date?? null,
        updated: b.updated?? null,
        get_absolute_url: b.get_absolute_url?? null,
        content: b.content?? null,
        meta_tags: b.meta_tags?? null,
        }));           

    let stateSlug = "all";
    let district;    
    let state;    

    let centerCoordinate;

    let districtSlug = params.districtSlug;

    let faqs;    

    if (districtSlug) {
        const districtRes = await location.getDistrict(districtSlug);
        district = districtRes.data;

        const centerCoordinateRes = await location.getDistrictCenter(districtSlug);
        centerCoordinate = centerCoordinateRes.data;

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
    }

    state = district?.state;
    stateSlug = state?.slug;

    if (stateSlug === params.stateSlug) {
      isLocationPage = true;
    }


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

    const courseDetailPages = (courseRes.data?.results || [])
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

  const serviceDetailPages = (serviceRes.data?.results || [])
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

  const registrationDetailPages = (registrationRes.data?.results || [])
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

  const productDetailPages = (productRes.data?.results || [])
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
          "review_by": review.review_by?? null,
          "name": review.name ?? null,
          "created": review.created?? null,
          "text": review.text?? null,
          "rating": review.rating?? null,
      })),
    }));

    const structuredData = [
      JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${district?.name || ""} - Places and Locations`,
            "url": `https://bzindia.in/state-list-in-india/${district?.state?.slug}/${district?.slug}`,
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
              "url": `https://bzindia.in/state-list-in-india/${district?.state?.slug}/${district?.slug}`,
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
                "url": `https://bzindia.in/state-list-in-india/${district?.state?.slug}/${district?.slug}/${place.slug}`
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
            "name": "State List In India",
            "item": "https://bzindia.in/state-list-in-india/"
            },
            {
            "@type": "ListItem",
            "position": 3,
            "name": state?.name || "",
            "item": `https://bzindia.in/state-list-in-india/${state?.slug}/`
            },
            {
            "@type": "ListItem",
            "position": 4,
            "name": district?.name || "",
            "item": `https://bzindia.in/state-list-in-india/${state?.slug}/${district?.slug}/`
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


    return {
      props: {
        homeContent,
        metaTags,
        blogs,                
        courseDetailPages,
        serviceDetailPages,
        registrationDetailPages,
        productDetailPages,
        faqs: faqs || [],
        state: state || [],
        centerCoordinate: centerCoordinate || [],
        district: district || [],
        structuredData,
        isLocationPage
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        homeContent: [],
        metaTags: [],
        blogs: [],                      
        states: [],
        courseDetailPages: [],
        serviceDetailPages: [],
        registrationDetailPages: [],
        productDetailPages: [],
        faqs: [],
        state: [],
        centerCoordinate: [],
        district: [],
        structuredData: [],
        isLocationPage: false,
      }
    }
  }

}
