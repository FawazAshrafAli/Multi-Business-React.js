import Head from 'next/head';
import SeoHead from '../../components/SeoHead';
import home from '../../lib/api/home';
import metaTag from '../../lib/api/metaTag';
import blog from '../../lib/api/blog';
import ListProductDetailPage from '../../components/product/ListProductDetailPage';
import product from '../../lib/api/product';

export default function ListProductPage({
  homeContent, metaTags, blogs,
  structuredData,
}) {
  return (
    <>
      <SeoHead
      meta_description={homeContent?.meta_description || ""}
      meta_title={`Products${homeContent?.meta_title ? ` - ${homeContent?.meta_title}` : ""}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = {"https://bzindia.in/products"}
      />

      <Head>
        {structuredData.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {schema}
          </script>
        ))}                  
        </Head>

      <ListProductDetailPage
       
      blogs={blogs} homeContent={homeContent}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {

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
        
    const productDetailPagesRes = await product.getProductDetailList("all");
    const productDetailPages = productDetailPagesRes.data?.results;

    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const priceValidUntil = sixMonthsLater.toISOString().split("T")[0];

    const structuredData = [      
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
                }, ),
                
                JSON.stringify(
                    {
                    "@context": "https://schema.org",
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
                        "name": "Services",
                        "item": `https://bzindia.in/services`
                        },       
                    ]
                    },
                    
                ),
                        
                JSON.stringify(
                    {
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": productDetailPages?.map(detail => ({
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
    ]    

    return {
      props: {
        homeContent,
        metaTags,
        blogs,        
        structuredData
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        homeContent: [],
        metaTags: [],
        blogs: [],
        structuredData: [],        
      }
    }
  }

}
