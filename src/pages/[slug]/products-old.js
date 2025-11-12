import Head from 'next/head';
import SeoHead from '../../../components/SeoHead';
import company from '../../../lib/api/company';
import product from '../../../lib/api/product';
import ListProduct from '../../../components/product/ListProduct';

export default function ListProductPage({
  detailPages, currentCompany,
  reviews
}) {
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const priceValidUntil = sixMonthsLater.toISOString().split("T")[0];
  return (
    <>
        {currentCompany &&
        <>
        <SeoHead
        meta_description={`List of products offered by ${currentCompany?.sub_type}`}
        meta_title={`Products - ${currentCompany?.meta_title}`}
        metaTags={currentCompany?.meta_tags || []}      
        blogs={currentCompany?.blogs || []}

        currentCompany={currentCompany}

        url = {`https://bzindia.in/${currentCompany?.slug}/products`}
        />

        <Head>

                <script type="application/ld+json">
                    {JSON.stringify(
                        {
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "itemListElement": detailPages?.map(detail => ({
                                "@type": "Product",
                                "name": detail?.product?.name || "",
                                "image": detail?.product?.image_url || "",
                                "description": detail?.meta_description || "",
                                "sku": detail?.product?.sku || "",
                                "url": `https://bzindia.in/${detail?.company_slug || ""}`,
                                "category": detail?.product?.category_name || "",
                                "offers": {
                                    "@type": "Offer",
                                    "price": detail?.product?.price || "",
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
                                "review": detail?.product?.reviews?.map(review => ({
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
                    )}
                </script>
                
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "ItemList",
                        "name": "Client Testimonials",
                        "itemListElement": reviews?.map((testimonial, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": "Review",
                                "itemReviewed": {
                                    "@type": "Organization",
                                    "name": testimonial?.product_name || "",
                                    "location": {
                                        "@type": "Place",
                                        "name": ""
                                    }
                                },
                                "reviewRating": {
                                    "@type": "Rating",
                                    "ratingValue": testimonial?.rating || 0
                                },
                                "author": {
                                    "@type": "Person",
                                    "name": testimonial?.review_by || testimonial?.name || ""
                                },
                                "reviewBody": testimonial?.text || "",
                                "image": testimonial?.image_url || ""
                            }
                        })) || [],
                        "numberOfItems": reviews?.length || 0,
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": currentCompany?.rating || 0
                        }
                    }, null, 2)}
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
                            "name": "Products",
                            "item": `https://bzindia.in/${currentCompany?.slug}/products`
                            },            
                        ]
                        },
                        null, 2
                    )}
                </script>

                <script type="application/ld+json">
                    {JSON.stringify(
                        {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": currentCompany?.faqs?.map((faq) => ({
                            "@type": "Question",
                            "name": faq?.question,
                            "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq?.answer
                            }
                        })) || []
                        },
                        null, 2
                    )}
                </script>

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ReturnPolicy",
                        "url": "https://bzindia.in/cancellation-refund-policy",
                        "merchantReturnDays": "7",
                        "returnFees": "FreeReturn",
                        "returnMethod": "ReturnByMail",
                        "returnPolicyCategory": "MerchantReturnFiniteReturnWindow",
                        "applicableCountry": "IN"
                    })}                 
                </script>      
        </Head>
    </>
    }

      <ListProduct
       
      blogs={currentCompany?.blogs}
      currentCompany={currentCompany}
      initialDetailPages={detailPages}
      reviews={reviews}
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
    let reviews = [];
    
    const detailPagesRes = await product.getProductDetailList(slug);
    detailPages = detailPagesRes.data?.results;       
    
    const reviewsRes = await company.getReviews(slug);
    reviews = reviewsRes.data;

    return {
      props: {
        detailPages: detailPages?.slice(0,12) || {},
        currentCompany: currentCompany || {},
        reviews: reviews || {},
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        detailPages: [],
        currentCompany: [],
        reviews: [],
      }
    }
  }

}
