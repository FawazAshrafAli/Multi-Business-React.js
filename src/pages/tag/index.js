import Head from 'next/head';
import SeoHead from '../../../components/SeoHead';
import home from '../../../lib/api/home';
import metaTag from '../../../lib/api/metaTag';
import blog from '../../../lib/api/blog';
import company from '../../../lib/api/company';
import { useSearchParams } from 'next/navigation';
import ListMetaTag from '../../../components/ListMetaTag';

export default function ListTagPage({
  homeContent, metaTags, blogs,
  companies
}) {
  const searchParams = useSearchParams();
  const s = searchParams.get("s");

  return (
    <>
      <SeoHead
      meta_description="List of meta tags."
      meta_title={`${s? `You searched for ${s}` : `Tag`} - ${homeContent?.[0]?.meta_title || "BZIndia"}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = "https://bzindia.in/tag"
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
                  "name": "Tag",
                  "item": `https://bzindia.in/tag`
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

    const companiesRes = await company.getCompanies();
    const companiesData = companiesRes.data; 

    return {
      props: {
        homeContent: homeData || {},
        metaTags: metaTagData?.slice(0,12) || {},
        blogs: Array.isArray(blogsData) ? blogsData.slice(0, 12) : [],
        companies: companiesData?.slice(0,12) || {},
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
      }
    }
  }

}
