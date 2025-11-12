import SeoHead from '../../../components/SeoHead';

import Faqs from '../../../components/Faqs';
import metaTag from '../../../lib/api/metaTag';
import blog from '../../../lib/api/blog';
import company from '../../../lib/api/company';
import home from '../../../lib/api/home';
import Head from 'next/head';
import customPage from '../../../lib/api/customPage';

export default function IndexPage({
  homeContent, metaTags, blogs, companies,
  structuredData
}) {
  return (
    <>
      <SeoHead
      meta_description="List of FAQs"
      meta_title={`FAQs - ${homeContent?.meta_title || "BZIndia"}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = {"https://bzindia.in/faqs"}
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

      <Faqs 
      homeContent={homeContent?.[0]}
      metaTags={metaTags}
      
      blogs={blogs}
      companies={companies}            
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
        company_slug: b.company_slug,
      }));

    const companiesRes = await company.getFaqCompanies();
    const companiesData = companiesRes.data;
    
    const faqsRes = await customPage.getBzindiaFaqs();
    const faqsData = faqsRes.data;

    const bzindFaqs = faqsData?? []
    const companiesFaqs = companiesData?.flatMap(company => company.faqs ?? []) ?? [];

    const faqs = [...bzindFaqs, ...companiesFaqs];
    
    const structuredData = [
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
              "name": "FAQs",
              "item": `https://bzindia.in/faqs`
              },                         
          ]
          },
          null, 2
      ),
      
      JSON.stringify(
      {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs?.map((faq) => ({
          "@type": "Question",
          "name": faq?.question,
          "acceptedAnswer": {
              "@type": "Answer",
              "text": faq?.short_answer
          }
          })) || []
      },
      null, 2
      )
    ]

    return {
      props: {
        homeContent,
        metaTags,
        blogs,
        companies: companiesData?.slice(0,12) || {},
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
        companies: [],
        structuredData: [],
      }
    }
  }

}
