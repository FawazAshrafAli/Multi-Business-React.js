import React from 'react'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SeoHead from '../../../components/SeoHead';

import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import Head from 'next/head';

const CompanyHome = dynamic(() => import('../../../components/CompanyContact'), { ssr: false });

const CompanyContactUsPage = ({
    currentCompany, detailPages, 
    testimonials, contactUs
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
          meta_title={currentCompany?.meta_title || ""}
          metaTags={currentCompany?.meta_tags}
          
          blogs={currentCompany?.blogs}

          url = {`https://bzindia.in/${currentCompany?.slug}/contact-us`}
          currentCompany={currentCompany}
          />

        <Head>        
            <script type="application/ld+json">
            {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": currentCompany?.meta_title || currentCompany?.sub_type || "",
                "url": `https://bzindia.in/${currentCompany?.slug}`,
                "logo": currentCompany?.logo_url || "",
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
                    ].filter(Boolean),
                "department": contactUs?.map(contact => ({
                    "@type": "LocalBusiness",
                    "name": `${currentCompany?.name} - ${contact.state_name} Office`,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": contact.place_name || "",
                        "addressLocality": contact.district_name || "",
                        "addressRegion": contact.state_name || "",
                        "postalCode": contact.pincode || "",
                        "addressCountry": "IN"
                    },
                    "telephone": contact.phone || "",
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": contact.lat || "",
                        "longitude": contact.lon || ""
                    }
                    }))
                            
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
                    "name": "Contact Us",
                    "item": `https://bzindia.in/${currentCompany?.slug}/contact_us`
                    },       
                ]
                },
                null, 2
            )}
            </script>

        </Head>
      </>
      }
        
      <CompanyHome
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
    const contactUs = contactUsRes.data;       

    return {
      props: {
        currentCompany: companyData || {},                
        contactUs: contactUs || {},
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        currentCompany: [],                  
        contactUs: [], 
      }
    }
  }

}


export default CompanyContactUsPage