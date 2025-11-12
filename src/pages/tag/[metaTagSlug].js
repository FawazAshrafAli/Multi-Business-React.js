import Head from 'next/head';
import SeoHead from '../../../components/SeoHead';
import home from '../../../lib/api/home';
import metaTag from '../../../lib/api/metaTag';
import blog from '../../../lib/api/blog';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import ListMetaTag from '../../../components/ListMetaTag';

export default function TagPage({
  homeContent, metaTags, blogs,
  companies, currentTag, matchingItems,
  metaTagLocation, mostMatchingCompany
}) {
  return (
    <>
      <SeoHead
      meta_description={`Associated with tag: ${currentTag?.name?.replace("place_name", metaTagLocation?.data?.name || "India")}`}
      meta_title={`${currentTag?.name?.replace("place_name", metaTagLocation?.data?.name || "India")} - ${mostMatchingCompany?.meta_title || homeContent?.[0]?.meta_title || ""}`}
      metaTags={metaTags?.map(metaTag => ({
        ...metaTag,
        name: metaTag.name?.replace("place_name", metaTagLocation?.data?.name || "India"),
        slug: metaTag.slug?.replace("place_name", metaTagLocation?.data?.slug || "india")
    }))}
      
      blogs={mostMatchingCompany?.blogs || blogs}

      currentCompany={mostMatchingCompany}

      url = {`https://bzindia.in/tag/${currentTag?.slug?.replace("place_name", metaTagLocation?.data?.slug || "india")}`}
      /> 

      <Head>
        <script type="application/ld+json">
          {JSON.stringify(
              {
                  "@context": "https://schema.org",
                  "@type": "CollectionPage",
                  "name": currentTag?.name?.replace("place_name", metaTagLocation?.data?.name || "India") || "",
                  "description": currentTag?.meta_description || "",
                  "url": `https://bzindia.in/tag/${currentTag?.slug?.replace("place_name", metaTagLocation?.data?.slug || "india")}/`,
                  "breadcrumb": {
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
                              "name": "Tag",
                              "item": "https://bzindia.in/tag"
                          },
                          {
                              "@type": "ListItem",
                              "position": 3,
                              "name": currentTag?.name?.replace("place_name", metaTagLocation?.data?.name || "India") || "",
                              "item": `https://bzindia.in/tag/${currentTag?.slug?.replace("place_name", metaTagLocation?.data?.slug || "india")}/`
                          }
                      ]
                  },
                  "mainEntity": {
                      "@type": "ItemList",
                      "itemListElement": matchingItems?.map(item => (
                          item.company_type_name == "Service" ?
                          {
                              "@type": "Service",
                              "name": item.title?.replace("place_name", metaTagLocation?.data?.name || "India") || "",
                              "description": item.meta_description || "",
                              "image": item.image_url || "",
                              "url": `https://bzindia.in/${item.url?.replace("place_name", metaTagLocation?.data?.slug || "india")}/`
                          }
                          : item.company_type_name == "Product" ?
                          {
                              "@type": "Product",
                              "name": item.title?.replace("place_name", metaTagLocation?.data?.name || "India") || "",
                              "description": item.meta_description || "",
                              "image": item.image_url || "",
                              "url": `https://bzindia.in/${item.url?.replace("place_name", metaTagLocation?.data?.slug || "india")}/`,
                              "offers": {
                                  "@type": "Offer",
                                  "priceCurrency": "INR",
                                  "price": item.price || "",
                                  "availability": "https://schema.org/InStock",
                                  "url": `https://bzindia.in/${item.url?.replace("place_name", metaTagLocation?.data?.slug || "india")}/`
                              }
                          }
                          : item.company_type_name == "Education" ?
                          {
                              "@context": "https://schema.org",
                              "@type": "Course",
                              "name": item.title?.replace("place_name", metaTagLocation?.data?.name || "India") || "",
                              "description": item.meta_description || "",
                              "provider": {
                                  "@type": "Organization",
                                  "name": item.company_name
                              },
                              "hasCourseInstance": {
                                  "@type": "CourseInstance",
                                  "courseMode": [item.mode],
                                  "startDate": item.start_date,
                                  "endDate": item.end_date,
                                  "courseWorkload": `P${item.duration}M`,
                                  "location": {
                                      "@type": "VirtualLocation",
                                      "url": `https://bzindia.in/${item.url?.replace("place_name", metaTagLocation?.data?.slug || "india")}/`
                                  }
                              },
                              "offers": {
                                  "@type": "Offer",
                                  "price": item.price || "",
                                  "priceCurrency": "INR",
                                  "category": item?.category,
                                  "availability": "http://schema.org/InStock"
                              },
                              "aggregateRating": {
                                  "@type": "AggregateRating",
                                  "ratingValue": item.rating,
                                  "bestRating": "5",
                                  "ratingCount": item.rating_count
                              },
                              "image": item.image_url || "",
                              "url": `https://bzindia.in/${item.url?.replace("place_name", metaTagLocation?.data?.slug || "india")}/`,
                              "inLanguage": "English"
                          }
                          : item.company_type_name == "Registration" ?
                          {
                              "@type": "GovernmentService",
                              "name": item.title?.replace("place_name", metaTagLocation?.data?.name || "India") || "",
                              "description": item.meta_description || "",
                              "image": item.image_url || "",
                              "url": `https://bzindia.in/${item.url?.replace("place_name", metaTagLocation?.data?.slug || "india")}/`
                          }
                          : null
                      )).filter(Boolean) || []
                  }                                    
              },
              null, 2
          )}
          </script>

          <script type="application/ld+json">
              {JSON.stringify({
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
                          "name": "Tag",
                          "item": `https://bzindia.in/tag`
                      },  
                      currentTag &&
                          {
                              "@type": "ListItem",
                              "position": 3,
                              "name": currentTag.name?.replace("place_name", metaTagLocation?.data?.name || "India"),
                              "item": `https://bzindia.in/${currentTag.slug?.replace("place_name", metaTagLocation?.data?.slug || "india")}`
                          },  
                  ]
                  },
                  null, 2
              )}
              </script>
      </Head>

      <ListMetaTag
      blogs={blogs}
      
      companies={companies}
      initialMetaTags={metaTags}
      currentMetaTag={currentTag}
      initialMatchingItems={matchingItems}
      metaTagLocation={metaTagLocation}
      mostMatchingCompany={mostMatchingCompany}
      />
    </>
  );
}

export async function getServerSideProps(context) {

  try {
    const query = context.query;
    let metaTagSlug = query.metaTagSlug
    const orginalTagSlug = metaTagSlug;

    const metaTagLocationRes = await location.getUrlLocation(undefined, metaTagSlug);
    const metaTagLocation = metaTagLocationRes.data;

    const matchingLocation = metaTagLocation.data;
    let currentTagRes;
    
    if (
        metaTagLocation?.match_type &&
        ["state", "district", "place"].includes(metaTagLocation.match_type) &&
        matchingLocation?.slug
    ) {
    metaTagSlug = metaTagSlug.replace(matchingLocation?.slug, "place_name");
    }

    const homeRes = await home.getHomeContent();
    const homeData = homeRes.data;

    const metaTagsRes = await metaTag.getMetaTags();
    const metaTagsData = metaTagsRes.data.results;

    try {
        if (metaTagSlug.includes("india")) {
            const replacedMetaTagSlug = metaTagSlug.replace("india", "place_name");
            
            if (replacedMetaTagSlug) {
                try {
                    currentTagRes = await metaTag.getMetaTag(replacedMetaTagSlug);
                } catch {
                    currentTagRes = await metaTag.getMetaTag(metaTagSlug);
                }
            }
        } else {
            currentTagRes = await metaTag.getMetaTag(metaTagSlug);
        }

    } catch (err) {
        if (matchingLocation) {
            currentTagRes = await metaTag.getMetaTag(orginalTagSlug);
        }
    }
    const currentTag = currentTagRes.data;

    const mostMatchingCompanyRes = await metaTag.getMostMatchingCompany(currentTag?.slug);
    const mostMatchingCompany = mostMatchingCompanyRes.data?.[0] || null

    const initialUrl = `/meta_tag_api/matching_items/${currentTag?.slug}/?limit=9&offset=0`;

    const matchingItemsRes = await metaTag.getMatchingItems(initialUrl);
    const matchingItems = matchingItemsRes.data.results;
    
    const matchingItemsTags = matchingItems
    ?.flatMap(item => (item.meta_tags || []).slice(0, 12));

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogsData = blogsRes.data.results;

    const companiesRes = await company.getCompanies();
    const companiesData = companiesRes.data; 

    return {
      props: {
        homeContent: homeData || {},
        metaTags: matchingItemsTags || metaTagsData?.slice(0,12) || {},
        blogs: Array.isArray(blogsData) ? blogsData.slice(0, 12) : [],
        companies: companiesData?.slice(0,12) || {},        
        matchingItems: matchingItems || {},
        currentTag: currentTag || {},
        metaTagLocation: metaTagLocation || {},
        mostMatchingCompany: mostMatchingCompany?? null,
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        homeContent: [],
        metaTags: [],
        blogs: [],
        companies: [],        
        matchingItems: [],
        currentTag: [],
        metaTagLocation: [],
        mostMatchingCompany: [],
      }
    }
  }

}
