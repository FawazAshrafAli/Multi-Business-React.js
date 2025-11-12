import Head from 'next/head';
import ContactUs from '../../components/ContactUs';
import metaTag from '../../lib/api/metaTag';
import blog from '../../lib/api/blog';

import SeoHead from '../../components/SeoHead';
import home from '../../lib/api/home';

export default function ContactUsPage({
  metaTags, blogs, homeContent, structuredData
}) {
  return (
    <>
      <SeoHead
      meta_description={homeContent?.[0]?.meta_description || ""}
      meta_title={homeContent?.[0]?.meta_title || ""}
      metaTags={metaTags}
      
      blogs={blogs}

      url = {"https://bzindia.in/"}
      />
      <Head>
        {structuredData.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: schema }}
          />
        ))}        
      </Head>
      <ContactUs
      homeContent={homeContent?.[0]}
      metaTags={metaTags}
      
      blogs={blogs}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {   
    const homeRes = await home.getHomeContent();
    const homeData = homeRes.data; 

    const metaTagRes = await metaTag.getMetaTags();
    const metaTagData = metaTagRes.data.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogsData = blogsRes.data.results;        
    
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
        }, null, 2),

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
            "name": "Contact Us",
            "item": `https://bzindia.in/contact-us`
            },       
        ]
        },
        null, 2
    )
    ]

    return {
      props: {
        homeContent: homeData || {},
        metaTags: metaTagData || {},
        blogs: blogsData || {}, 
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
        structuredData              
      }
    }
  }

}
