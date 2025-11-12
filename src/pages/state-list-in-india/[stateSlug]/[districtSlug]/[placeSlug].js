import SeoHead from '../../../../../components/SeoHead';
import metaTag from '../../../../../lib/api/metaTag';
import blog from '../../../../../lib/api/blog';
import location from '../../../../../lib/api/location';
import home from '../../../../../lib/api/home';
import Head from 'next/head';
import DetailLocation from '../../../../../components/DetailLocation';
import product from '../../../../../lib/api/product';
import registration from '../../../../../lib/api/registration';
import service from '../../../../../lib/api/service';
import course from '../../../../../lib/api/course';

export default function StateLocation({
  homeContent, metaTags, blogs, courseDetailPages,
  serviceDetailPages, registrationDetailPages, productDetailPages,
  faqs, state, centerCoordinate, district, place,
  neighboringPlaces, structuredData, isLocationPage
}) {
  if (!isLocationPage) return;
  return (
      <>
        <SeoHead
        meta_description={`${place?.name} is a notable town located in the ${place?.district?.name} district of ${place?.state?.name}, India. Known for its cultural heritage, local traditions, and developing infrastructure, ${place?.name} serves as an important hub for residents and visitors alike. The area offers a blend of historical significance, natural beauty, and modern growth, making it a key part of the region's identity. Whether you're exploring its neighborhoods, learning about its history, or experiencing its local charm, {place?.name} represents a vibrant part of India's diverse landscape.`}
        meta_title={`${place?.name} - Overview | Explore State-Wise, District-Wise & City Locations - ${homeContent&&homeContent[0]?.meta_title || ""}`}
        metaTags={metaTags}
        
        blogs={blogs}

        url = {`https://bzindia.in/state-list-in-india/${state?.slug}/${district?.slug}/${place?.slug}/`}
        />

          <Head>
          {structuredData.map((schema, i) => (
            <script key={i} type="application/ld+json">
              {schema}
            </script>
          ))}
        </Head>
        
        <DetailLocation
        
        blogs={blogs}
        metaTags={metaTags}
        neighboringPlaces={neighboringPlaces}
        place={place}
        courseDetailPages={courseDetailPages}
        registrationDetailPages={registrationDetailPages}
        productDetailPages={productDetailPages}
        serviceDetailPages={serviceDetailPages}
        initialState={state}
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

    let { lat, lon } = await location.getLocationFromIP(context.req);    
    
    let district;
    let state; 
    let place;   

    let centerCoordinate;

    let placeSlug = params.placeSlug;    

    let faqs;    

    if (placeSlug) {
        const placeRes = await location.getPlace(placeSlug);
        place = placeRes.data;

        
        const centerCoordinateRes = await location.getPlaceCenter(placeSlug);
        centerCoordinate = centerCoordinateRes.data;
        
        if (centerCoordinate?.latitude && centerCoordinate?.longitude) {
          lat = centerCoordinate?.latitude
          lon = centerCoordinate?.longitude
        }

        faqs = [
          {
            question: `Where is ${place.name} located?`,
            answer: `${place.name} is a town situated in the ${place.district?.name} district of ${place.state?.name}, India.`              
          },
          {
            question: `What is the PIN code of ${place.name}?`,
            answer: `The official postal PIN code of ${place.name} is ${place?.pincodes[0]?.pincode}.`
          },
          {
            question: `Which district and state does Kottakkal belong to?`,
            answer: `${place.name} is part of ${place.district?.name} district in the state of ${place.state?.name}, India.`              
          },
          {
            question: `What are the geographic coordinates of ${place.name}`,
            answer: `The approximate latitude and longitude of ${place.name} are ${centerCoordinate?.latitude}° N, ${centerCoordinate?.longitude}° E.`              
          },
          {
            question: `How can I reach ${place.name}?`,
            answer: `${place.name} is accessible by road from nearby towns and cities. Depending on your location, it may also be reachable via nearby railway stations or airports.`              
          },
          {
            question: `What is the time zone of ${place.name}?`,
            answer: `${place.name} follows Indian Standard Time (IST), UTC +5:30.`              
          },
          {
            question: `What are the nearby major towns or cities to ${place.name}?`,
            answer: `The proximity of ${place.name} to nearby towns or cities depends on its geographic location within the district or state. Nearby urban centers usually provide access to broader facilities such as transportation hubs, hospitals, and higher education institutions.`              
          },
        ]
    }

    district = place?.district;
    state = place?.state;

    let districtSlug = district.slug;
    let stateSlug = state.slug;

    if (stateSlug === params.stateSlug && districtSlug === params.districtSlug) {
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

    const neighboringPlacesRes = await location.getNearbyPlaces(lat, lon);
    const neighboringPlaces = neighboringPlacesRes?.data?.filter(item => item.slug !== place?.slug);

    const overviewHeading = `${place?.name} - Overview`;
    const heading = `Places near ${place.name}`;

    const articleBody = `
        <section class="content_area001" style="padding: 30px 0px 40px 0px; margin-bottom: 0px; border-bottom: 1px solid #ddd;">
            <div class="container" data-aos="fade-in">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                <h3>${overviewHeading.toUpperCase() || ""}</h3>
                <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>

                <p>                        
                    ${place?.name || ""} is a notable town located in the ${place?.district?.name || ""} district of ${place?.state?.name || ""}, India. Known for its cultural heritage, local traditions, and developing infrastructure, ${place?.name || ""} serves as an important hub for residents and visitors alike. The area offers a blend of historical significance, natural beauty, and modern growth, making it a key part of the region's identity. Whether you're exploring its neighborhoods, learning about its history, or experiencing its local charm, ${place?.name || ""} represents a vibrant part of India's diverse landscape.                        
                </p>
                </div>
            </div>

            <h3 style="text-align: center;">${heading.toUpperCase() || ""}</h3>
            <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>

            <ul class="row list-default" style="padding: 10px 0 20px 0;" itemscope itemtype="http://www.schema.org/SiteNavigationElement">
                ${neighboringPlaces
                        ?.map(
                        (p, index) => `
                            <li itemprop="name" class="col col-md-3 col-12" key="${p.slug || index + 1}">
                            <a itemprop="url" href="/state-list-in-india/${p.slug || ""}">${p.name || ""}</a>
                            </li>`
                        )
                        .join('')
                }
            </ul>

            <div class="row" style="padding: 30px; margin-top: 20px;" id="slug-location-map">
                <div class="col-md-12" data-aos="fade-up" style="background: #fff; padding: 0;">
                ${
                    `<iframe src="https://www.google.com/maps?q=${centerCoordinate?.latitude},${centerCoordinate?.longitude}&z=15&output=embed" style="border: 0; width: 100%; height: 340px;"></iframe>`
                }
                </div>
            </div>
            </div>
        </section>
        `

      const structuredData = [
        JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                {
                    "@type": "WebPage",
                    "name": `${place?.name || ""} - Overview & Nearby Locations`,
                    "url": `https://bzindia.in/state-list-in-india/${place?.state?.slug}/${place?.district?.slug}/${place?.slug}`,
                    "description": `Explore ${place?.name}, a major city in ${place?.state?.name}, India. Find geographic details, address, and a list of nearby locations like ${neighboringPlaces?.slice(0, 3).map(p => p.name || "").join(", ")}.`,
                    "image": [
                        "https://bzindia.in/images/location_delhi.jpeg",
                        "https://bzindia.in/images/location_mumbai.jpeg",
                        "https://bzindia.in/images/location_himachalpradesh.jpeg",
                        "https://bzindia.in/images/location_kerala.jpeg",
                        "https://bzindia.in/images/location_jammu.jpeg",
                        "https://bzindia.in/images/location_karnataka.jpeg"
                    ],
                    "mainEntity": {
                    "@type": "City",
                    "name": place?.name || "",
                    "alternateName": "",
                    "url": `https://bzindia.in/state-list-in-india/${place?.state?.slug}/${place?.district?.slug}/${place?.slug}`,
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": centerCoordinate?.latitude || "",
                        "longitude": centerCoordinate?.longitude || ""
                    },
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": place?.name || "",
                        "addressRegion": place?.state?.name || "",
                        "postalCode": place?.pincodes?.[0]?.pincode || "",
                        "addressCountry": "India"
                    },
                    "containedInPlace": {
                        "@type": "AdministrativeArea",
                        "name": `${place?.district?.name || ""} District`
                    },
                    "hasMap": `https://www.google.com/maps?q=${centerCoordinate?.latitude},${centerCoordinate?.longitude}&z=15&output=embed`
                    }
                },
                {
                    "@type": "ItemList",
                    "name": `Nearby Locations to ${place?.name || ""}`,
                    "itemListOrder": "ascending",
                    "itemListElement": neighboringPlaces?.map((nearPlace, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": nearPlace?.name || "",
                    "url": `https://bzindia.in/state-list-in-india/${nearPlace?.state?.slug}/${nearPlace?.district?.slug}/${nearPlace?.slug}`
                    }))
                }
                ]
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
                  {
                  "@type": "ListItem",
                  "position": 5,
                  "name": place?.name || "",
                  "item": `https://bzindia.in/state-list-in-india/${state?.slug}/${district?.slug}/${place?.slug}/`
                  },
                ]                   
              },
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
        ),

        JSON.stringify(
          {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Find State List in India | Explore State-Wise, District-Wise & City Locations",
          "description": "Explore the complete list of Indian states with an interactive location map and search option to find state-wise, district-wise, and city-level details across India.",
          "keywords": "List of States in India, State List in India, India State List, Find State List in India",
          "image": [
              "https://bzindia.in/images/location_delhi.jpeg",
              "https://bzindia.in/images/location_mumbai.jpeg",
              "https://bzindia.in/images/location_himachalpradesh.jpeg",
              "https://bzindia.in/images/location_kerala.jpeg",
              "https://bzindia.in/images/location_jammu.jpeg",
              "https://bzindia.in/images/location_karnataka.jpeg"
          ],
          "datePublished": "2022-01-01T00:00:00+05:30",
          "dateModified": "2024-07-30T16:16:22+05:30",
          "author": {
              "@type": "Organization",
              "name": "BZIndia",
              "url": "https://www.bzindia.in/"
          },
          "articleBody": articleBody? articleBody : ""
          },
        )
      ]

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
        neighboringPlaces: neighboringPlaces || {},
        place: place || {},
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
        courseDetailPages: [],
        serviceDetailPages: [],
        registrationDetailPages: [],
        productDetailPages: [],        
        faqs: [],
        state: [],
        centerCoordinate: [],
        district: [],
        neighboringPlaces: [],
        place: [],
        structuredData: [],
        isLocationPage: false,
      }
    }
  }

}
