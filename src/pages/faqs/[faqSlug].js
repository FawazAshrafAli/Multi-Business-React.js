import React from 'react'
import SeoHead from '../../../components/SeoHead';

import location from '../../../lib/api/location';
import Head from 'next/head';
import home from '../../../lib/api/home';
import metaTag from '../../../lib/api/metaTag';

import customPage from '../../../lib/api/customPage';
import FaqDetail from '../../../components/FaqDetail';
import blog from '../../../lib/api/blog';

const FaqsPage = ({
    detailPages, 
    testimonials, faq, homeContent, metaTags, blogs
}) => {

  return (
    <>  
      <SeoHead
      meta_description={faq?.short_answer || ""}
      meta_title={`FAQs - ${homeContent?.[0]?.meta_title || ""}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = {`https://bzindia.in/faqs/${faq?.slug}`}
      />

      <Head>            

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
                    "name": "FAQs",
                    "item": `https://bzindia.in/faqs`
                    },
                    {
                    "@type": "ListItem",
                    "position": 3,
                    "name": faq?.question,
                    "item": `https://bzindia.in/faqs/${faq?.slug}`
                    },       
                ]
                },
                null, 2
            )}
            </script>
        </Head>
        
      <FaqDetail
      
      detailPages={detailPages}
      testimonials={testimonials}
      currentFaq={faq}
      blogs={blogs}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    const homeRes = await home.getHomeContent();
    const homeData = homeRes.data;

    const metaTagRes = await metaTag.getMetaTags();
    const metaTagData = metaTagRes.data.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogsData = blogsRes.data.results;

    const { faqSlug } = context.params;        

    const faqRes = await customPage.getFaq(faqSlug);
    const faq = faqRes.data;           

    return {
      props: {
        homeContent: homeData || {},
        metaTags: metaTagData?.slice(0,12) || {},
        blogs: Array.isArray(blogsData) ? blogsData.slice(0, 12) : [],
        faq: faq || {},
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        homeContent: [],
        metaTags: [],
        blogs: [],
        faq: [],
      }
    }
  }

}


export default FaqsPage