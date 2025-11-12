import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import company from '../../../../lib/api/company';
import CompanyFaq from '../../../../components/CompanyFaq';
import course from '../../../../lib/api/course';
import service from '../../../../lib/api/service';
import product from '../../../../lib/api/product';
import registration from '../../../../lib/api/registration';

export default function ListFaqPage({
  currentCompany, detailPages
}) {
  return (
    <>
      {currentCompany &&
      <>
        <SeoHead
        meta_description={`FAQs of ${currentCompany?.name}`}
        meta_title={`FAQs - ${currentCompany?.meta_title || ""}`}
        metaTags={currentCompany?.meta_tags?.slice(0,12)}      
        blogs={currentCompany?.blogs?.slice(0,12)}
        currentCompany={currentCompany}

        url = {`https://bzindia.in/${currentCompany?.slug}/faqs`}
        />      

          <Head>
              <script type="application/ld+json">
                  {JSON.stringify(
                  {
                      "@context": "https://schema.org",
                      "@type": "FAQPage",
                      "mainEntity": currentCompany?.faqs.map((faq) => ({
                      "@type": "Question",
                      "name": faq?.question,
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": faq?.summary
                      }
                      })) || []
                  },
                  null, 2
                  )}
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
                      "name": "FAQs",
                      "item": `https://bzindia.in/${currentCompany?.slug}/faqs`
                      },       
                  ]
                  },
                  null, 2
              )}
              </script>
          </Head>
        </>
        }

      <CompanyFaq
      blogs={currentCompany?.blogs?.slice(0,12)}      
      currentCompany={currentCompany} detailPages={detailPages}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {    
    const params = context.query;
    const slug = params.slug;

    const companyRes = await company.getCompany(slug);
    const currentCompany = companyRes.data;    

    let detailPages;

    if (currentCompany?.company_type === "Education") {
      const courseDetailRes = await course.getDetails(slug);
      detailPages = courseDetailRes.data.results;
    
    } else if (currentCompany?.company_type === "Service") {
      const serviceDetailRes = await service.getDetails(slug);
      detailPages = serviceDetailRes.data.results;

    } else if (currentCompany?.company_type === "Product") {
      const productDetailRes = await product.getProductDetails(slug);
      detailPages = productDetailRes.data.results;

    } else if (currentCompany?.company_type === "Registration") {
      const registrationDetailRes = await registration.getDetails(slug);
      detailPages = registrationDetailRes.data.results;

    }

    return {
      props: {        
        currentCompany: currentCompany || {},
        detailPages: detailPages || {},
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {        
        currentCompany: [],
        detailPages: [],
      }
    }
  }

}
