import React from 'react'
import { useRouter } from 'next/router';
import SeoHead from '../../../../components/SeoHead';

import company from '../../../../lib/api/company';
import Head from 'next/head';

import CompanyFaqDetail from '../../../../components/CompanyFaqDetail';
import customPage from '../../../../lib/api/customPage';

const CompanyContactUsPage = ({
    currentCompany, detailPages, 
    testimonials, faq
}) => {

    const router = useRouter();
    const { slug } = router?.query;

    if (!slug) return null;
  return (
    <>
      {currentCompany && 
      <>
        <SeoHead
        meta_description={faq?.short_answer || ""}
        meta_title={`${faq?.question} - ${currentCompany?.meta_title || ""}`}
        metaTags={currentCompany?.meta_tags}
        
        blogs={currentCompany?.blogs}

        url = {`https://bzindia.in/${currentCompany?.slug}/faqs/${faq?.slug}`}
        currentCompany={currentCompany}
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
                      "name": currentCompany?.sub_type,
                      "item": `https://bzindia.in/${currentCompany?.slug}/`
                      },
                      {
                      "@type": "ListItem",
                      "position": 3,
                      "name": "FAQs",
                      "item": `https://bzindia.in/${currentCompany?.slug}/faqs`
                      },
                      {
                      "@type": "ListItem",
                      "position": 4,
                      "name": faq?.question,
                      "item": `https://bzindia.in/${currentCompany?.slug}/faqs/${faq?.slug}`
                      },       
                  ]
                  },
                  null, 2
              )}
              </script>
          </Head>
        </>
        }
        
      <CompanyFaqDetail
      slug={slug}
      
      detailPages={detailPages}
      testimonials={testimonials}
      currentCompany={currentCompany}
      currentFaq={faq}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    const { slug, faqSlug } = context.params;    

    const companyRes = await company.getCompany(slug);
    const companyData = companyRes.data;

    const faqRes = await customPage.getFaq(faqSlug);
    const faq = faqRes.data;    
    
    return {
      props: {
        currentCompany: companyData || {},                
        faq: faq || {},
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        currentCompany: [],                  
        faq: [],
      }
    }
  }

}


export default CompanyContactUsPage