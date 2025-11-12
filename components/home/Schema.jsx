import React, {useEffect, useState} from 'react'

import { Helmet } from 'react-helmet-async';
import company from '../../api/company';
import Loading from '../Loading';
import BaseSchema from '../base/BaseSchema';

const Schema = ({registrationMultiPages, productMultiPages, serviceMultipages, courseMultiPages, destinations, companies, blogs, metaTags, nearestPlace}) => {
    const [companyTypes, setCompanyTypes] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)    

    useEffect(() => {
        const fetchCompanyTypes = async () => {
            try {
                const response = await company.getCompanyTypes();
                setCompanyTypes(response.data);
            } catch (err) {
                setError(response.err)
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyTypes();
    }, [])

    if (loading) return <Loading/>;
    if (error) return <div>Error: {error}</div>;

  return (
    <>
        <BaseSchema destinations={destinations} metaTags={metaTags} blogs={blogs}/>
        <Helmet>
            <script type="application/ld+json">
            {JSON.stringify(
                registrationMultiPages ? registrationMultiPages.map(multipage => ({
                "@context": "https://schema.org",
                "@type": "GovernmentService",
                "name": multipage?.title || "",
                "serviceType": multipage?.registration?.name || "",
                "provider": {
                    "@type": "Organization",
                    "name": multipage?.company_name || "",
                    "url": `https://bzindia.in/${multipage?.company_slug}`
                },
                "offers": {
                    "@type": "Offer",
                    "price": multipage?.registration?.price || "",
                    "priceCurrency": "INR",
                    "availability": "https://schema.org/InStock",
                    "url": `https://bzindia.in/${multipage?.url}`,
                    "priceValidUntil": multipage?.registration?.valid_until || ""
                },
                "description": multipage?.registration?.description || "",
                "image": multipage?.registration?.image_url || "",
                "areaServed": {
                    "@type": "Country",
                    "name": multipage?.registration?.service_area || "India"
                },
                "aggregateRating": multipage?.registration?.rating ? {
                    "@type": "AggregateRating",
                    "ratingValue": multipage?.registration?.rating.toString(),
                    "reviewCount": multipage?.registration?.review_count?.toString() || "0"
                } : undefined
                })).filter(Boolean) : [],
                null, 2
            )}
            </script>

            <script type="application/ld+json">
            {JSON.stringify(
                {
                "@context": "http://schema.org",
                "@type": "ItemList",
                "itemListElement": productMultiPages?.map((multipage) => ({
                    "@type": "Product",
                    "name": multipage.modified_title,
                    "image": multipage.products[0]?.image_url || "",
                    "description": multipage.meta_description,
                    "sku": multipage.sku,
                    "url": `https://bzindia.in${multipage.url}`,
                    "category": multipage.category_name,
                    "offers": {
                    "@type": "Offer",
                    "price": multipage.price,
                    "priceCurrency": "INR",
                    "availability": "http://schema.org/InStock",
                    "priceValidUntil": "",
                    "hasMerchantReturnPolicy": {
                        "@type": "MerchantReturnPolicy",
                        "name": "Return Policy",
                        "description": "No cancellations & Refunds are entertained. Please visit our return policy page for more details.",
                        "url": "https://bzindia.in/return-policy",
                        "applicableCountry": "IN",
                        "returnPolicyCategory": "https://schema.org/NoRefundsReturnPolicy"
                    },
                    "eligibleRegion": {
                        "@type": "Country",
                        "name": "IN"
                    },
                    "eligibleTransactionVolume": {
                        "@type": "PriceSpecification",
                        "priceCurrency": "INR",
                        "minPrice": multipage.price
                    }
                    },
                    "aggregateRating": multipage.rating ? {
                    "@type": "AggregateRating",
                    "ratingValue": multipage.rating,
                    "reviewCount": multipage.rating_count
                    } : undefined,
                    "review": multipage.reviews ? multipage.reviews.map((review) => ({
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": review.name
                    },
                    "datePublished": review.created.date || "2024-03-12",
                    "reviewBody": review.text   ,
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": review.rating
                    }
                    })) : []
                })) || []
                },
                null, 2  
            )}
            </script>

            <script type="application/ld+json">
            {JSON.stringify(
                {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": serviceMultipages?.map((multipage, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                    "@type": "Service",
                    "name": multipage.modified_title || "",
                    "description": multipage.description || "",
                    "image": multipage?.service?.image_url || "",
                    "url": `https://bzindia.in${multipage.url}`,
                    "provider": {
                        "@type": "Organization",
                        "name": multipage.company_name || "",
                        "url": `https://bzindia.in/${multipage.company_slug}`,
                        "logo": multipage.company?.logo_url || "",
                        "address": {
                        "@type": "PostalAddress",
                        "streetAddress": multipage.place?.name || multipage.company_name || "",
                        "addressLocality": multipage.place?.district?.name || "",
                        "addressRegion": multipage.place?.district?.state?.name || "",
                        "postalCode": multipage.place?.pincodes[0]?.pincode || "",
                        "addressCountry": multipage.company_address?.country || "IN"
                        },
                        "sameAs": 
                        [                            
                            multipage.company?.company_social_medias?.map((link) => link) || ""            
                        ]
                    },
                    "serviceType": multipage.service?.category_name || "",
                    "offers": {
                        "@type": "Offer",
                        "price": multipage.service?.price || "0",
                        "priceCurrency": "INR"
                    }
                    }
                })) || []
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
                        courseMultiPages?courseMultiPages.map((multipage) => ({
                            "@type": "Course",
                            "name": multipage?.title || "",
                            "description": multipage?.meta_description || "",
                            "provider": {
                                "@type": "Organization",
                                "name": multipage?.course.company_name || ""
                            },
                            "image": multipage?.course.image_url || "",
                            "hasCourseInstance": {
                                "@type": "CourseInstance",
                                "courseMode": [multipage?.course.mode || "Online"],
                                "endDate": multipage?.course.ending_date ? multipage?.course.ending_date.split('T')[0] : "",
                                "startDate": multipage?.course.starting_date ? multipage?.course.starting_date.split('T')[0] : "",
                                "courseWorkload": multipage?.course.duration?"P"+multipage?.course.duration+"D": ""
                            },
                            "offers": {
                                "@type": "Offer",
                                "price": multipage?.course.price || "",
                                "priceCurrency": "INR",
                                "availability": "http://schema.org/InStock",
                                "category": multipage?.course.program_name || ""
                            },
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": multipage?.course.rating || 0,
                                "bestRating": 5,
                                "ratingCount": multipage?.course.rating_count || 0
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": nearestPlace?.coordinates[0]?.latitude || "",
                                "longitude": nearestPlace?.coordinates[0]?.longitude || ""
                            }
                        })):[]
                    
                },
                null, 2
            )}
            </script>                            

            <script type="application/ld+json">
                {JSON.stringify(
                    {
                        "@context": "http://schema.org",
                        "@type": "WebSite",
                        "url": "https://bzindia.in/",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://bzindia.in/?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    },
                    null, 2
                )}
            </script>

            <script type="application/ld+json">
            {JSON.stringify(
                {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "BZIndia",
                    "description": "BZindia.in are a group of the joint venture to provide the best multipage with top companies in different categories from Indian Market",
                    "logo": "https://bzindia.in/images/logo.svg",
                    "url": "https://bzindia.in/",
                    "memberOf": companyTypes?companyTypes.map((companyType) => (
                        {
                            "@type": "Organization",
                            "name": companyType.name
                        }
                    )):[],
                    "hasOfferCatalog": {
                        "@type": "OfferCatalog",
                        "name": "Clients",
                        "itemListElement": companies?companies.map((company, index) => (
                            {
                                "@type": "ListItem",
                                "position": index+1,
                                "item": {
                                    "@type": "Organization",
                                    "name": company.name || "",
                                    "url": company.get_absolute_url || "",
                                    "logo": company.logo_url || ""
                                }
                            }
                        )): [],
                    },
                },
                null, 2
            )}
            </script>

            <script type="application/ld+json">
            {JSON.stringify(
                {
                    "@context": "http://schema.org",
                    "@type": "ItemList",
                    "itemListElement": companies?companies.map((company, index) => ({
                            "@type": "ListItem",
                            "position": index+1,
                            "item": {
                                "@type": "Organization",
                                "name": company.name || "",
                                "url": company.get_absolute_url || "",
                                "logo": company.logo_url || "",
                                "description": company.description  || ""
                            }
                        })):[],
                },
                null, 2
            )}
            </script>               

        </Helmet>
    </>
  )
}

export default Schema