import Head from 'next/head';
import SeoHead from '../../components/SeoHead';
import home from '../../lib/api/home';
import metaTag from '../../lib/api/metaTag';
import blog from '../../lib/api/blog';
import ListDetailPageService from '../../components/service/ListDetailPageService';
import service from '../../lib/api/service';

export default function ListServicesPage({
  homeContent, metaTags, blogs,
  structuredData
}) {
  return (
    <>
      <SeoHead
      meta_description={homeContent?.[0]?.meta_description || ""}
      meta_title={`Services${homeContent?.meta_title ? ` - ${homeContent?.meta_title}` : ""}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = {"https://bzindia.in/services"}
      />

      <Head>
        {structuredData.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {schema}
          </script>
        ))}        
      </Head>

      <ListDetailPageService
       
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

    const serviceDetailPageRes = await service.getDetailList("all");
    const serviceDetailPages = serviceDetailPageRes.data?.results;    

    const structuredData = [      
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
                }, ),            
                
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
                    "name": "Services",
                    "item": `https://bzindia.in/services`
                    },       
                ]
                },
                
            ),            
            
            JSON.stringify(
                {
                "@context": "http://schema.org",
                "@type": "ItemList",
                "itemListElement": serviceDetailPages?.map(detail => ({
                    "@type": "Service",
                        "name": detail.service?.name || "",
                        "serviceType": detail.service?.sub_category_name || "",
                        "provider": {
                        "@type": "Organization",
                        "name": detail?.compnay_sub_type,
                        "url": `https://bzindia.in/${detail?.company_slug}`
                        },
                        "offers": {
                        "@type": "Offer",
                        "price": detail.service?.price || "",
                        "priceCurrency": "INR",
                        "url": `https://bzindia.in/${detail.url}`,
                        "category": detail.service?.category_name || "",
                        },
                        "description": detail.meta_description || "",
                        "image": detail.service?.image_url   || "",
                        "areaServed": {
                        "@type": "Place",
                        "name": "India"
                        }
                })) || []
                },
                
            ),            
    ];

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
