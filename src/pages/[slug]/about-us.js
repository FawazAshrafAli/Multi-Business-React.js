import React from 'react'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SeoHead from '../../../components/SeoHead';

import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import Head from 'next/head';

const CompanyAboutUs = dynamic(() => import('../../../components/CompanyAbout'), { ssr: false });

const CompanyAboutUsPage = ({
    currentCompany, detailPages, 
    testimonials
}) => {

    const router = useRouter();
    const { slug } = router?.query;

    if (!slug) return null;
  return (
    <>  
      {currentCompany &&
        <>
          <SeoHead
          meta_description={currentCompany?.meta_description || ""}
          meta_title={`About Us - ${currentCompany?.meta_title || ""}`}
          metaTags={currentCompany?.meta_tags || []}
          
          blogs={currentCompany?.blogs || []}

          url = {`https://bzindia.in/${currentCompany?.slug}/contact-us`}
          currentCompany={currentCompany}
          />

        <Head>        
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "http://schema.org",
                "@type": "LocalBusiness",
                "name": currentCompany?.meta_title || currentCompany?.sub_type || "",
                "url": `https://bzindia.in/${currentCompany?.slug || ""}`,
                "logo": currentCompany?.image_url || "",
                "telephone": currentCompany?.phone1 ? `+91${currentCompany.phone1}` : "",            
                "sameAs": [
                    "https://www.facebook.com/BZindia/",
                    "https://twitter.com/Bzindia_in",
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
                    "name": "About Us",
                    "item": `https://bzindia.in/${currentCompany?.slug}/about_us`
                    },       
                ]
                },
                null, 2
            )}
            </script>        

        </Head>
      </>
      }
        
      <CompanyAboutUs
      slug={slug}
      detailPages={detailPages}
      testimonials={testimonials}
      currentCompany={currentCompany}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    const { slug } = context.params;

    const companyRes = await company.getInnerPageCompany(slug);
    const companyData = companyRes.data;

    const contactUsRes = await company.getContactUs(slug);
    const aboutUs = contactUsRes.data;
    
    return {
      props: {
        currentCompany: companyData || {},                
        aboutUs: aboutUs || {},
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        currentCompany: [],                
        aboutUs: [], 
      }
    }
  }

}


export default CompanyAboutUsPage