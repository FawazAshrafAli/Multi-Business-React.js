import Head from 'next/head';
import AboutUs from '../../components/AboutUs';
import metaTag from '../../lib/api/metaTag';
import blog from '../../lib/api/blog';

import SeoHead from '../../components/SeoHead';
import home from '../../lib/api/home';
import company from '../../lib/api/company';

export default function AboutUsPage({
  metaTags, blogs, homeContent,
  aboutUs, structuredData
}) {

  return (
    <>
      <SeoHead
      meta_description={homeContent?.meta_description || ""}
      meta_title={`About Us - ${homeContent?.meta_title || "BZIndia"}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = {"https://bzindia.in/about-us"}
      />
      <Head>
        {structuredData.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {schema}
          </script>
        ))}
      </Head>
      <AboutUs
      homeContent={homeContent?.[0]}
      metaTags={metaTags}      
      blogs={blogs}
      aboutUs={aboutUs}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {   
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

    const aboutUsRes = await company.getCompanyAbout("bzindia");
    const aboutUsData = aboutUsRes.data?.[0]; 

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
    
    const structuredData = [
      JSON.stringify({
        "@context": "http://schema.org",
        "@type": "LocalBusiness",
        "name": "BZIndia",
        "url": "https://bzindia.in/",
        "logo": "https://bzindia.in/images/logo.svg",
        "telephone": "+919606377677",                
        "sameAs": [
            "https://www.facebook.com/BZindia/",
            "https://x.com/Bzindia_in",
            "https://www.linkedin.com/company/bzindia",
            "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
          ],
        "contactPoint": [
            {
            "@type": "AboutPoint",
            "telephone": "919606377677" ,
            "contactType": "About Number 1",
            "contactOption": "Toll",
            "areaServed": "IN"
            },
            {
            "@type": "AboutPoint",
            "telephone": "919606277677",
            "contactType": "About Number 2",
            "contactOption": "Toll",
            "areaServed": "IN"
            },
            {
            "@type": "AboutPoint",
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
            "item": `https://bzindia.in/`
            },
            {
            "@type": "ListItem",
            "position": 2,
            "name": "About Us",
            "item": `https://bzindia.in/about-us`
            },       
        ]
        },
      ),


    ]

    return {
      props: {
        homeContent,
        metaTags,
        blogs,
        aboutUs: aboutUsData || {},        
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
        aboutUs: [],        
        structuredData: []
      }
    }
  }

}
