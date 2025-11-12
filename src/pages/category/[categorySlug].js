import Head from 'next/head';
import SeoHead from '../../../components/SeoHead';
import home from '../../../lib/api/home';
import metaTag from '../../../lib/api/metaTag';
import blog from '../../../lib/api/blog';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import BlogList from '../../../components/blogs/BlogList';

export default function ListCategoryFilteredBlogPage({
  homeContent, metaTags, blogs,
  companies, category, categorySlug
}) {

  return (
    <>
      <SeoHead
      meta_description={`List of blogs having category: ${category}`}
      meta_title={`${category} - ${homeContent?.[0]?.meta_title || "BZIndia"}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = "https://bzindia.in/learn"
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
                  "name": "Blog",
                  "item": `https://bzindia.in/learn`
                },       
              ]
            },
            null, 2
          )}
        </script>
      </Head>

      <BlogList
      initialBlogs={blogs}
      
      companies={companies}
      category={category}
      categorySlug={categorySlug}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {    
    const {categorySlug} = context.query;
    const category = categorySlug?.replace("-", " ").toUpperCase();

    const homeRes = await home.getHomeContent();
    const homeData = homeRes.data;
  
    const metaTagRes = await metaTag.getMetaTags();
    const metaTagData = metaTagRes.data.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs?category=${categorySlug}`);
    const blogsData = blogsRes.data.results;

    const companiesRes = await company.getCompanies();
    const companiesData = companiesRes.data;     

    return {
      props: {
        homeContent: homeData || {},
        metaTags: metaTagData?.slice(0,12) || {},
        blogs: Array.isArray(blogsData) ? blogsData.slice(0, 12) : [],
        companies: companiesData?.slice(0,12) || {},        
        category: category || {},
        categorySlug: categorySlug || {},
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
        category: [],
        categorySlug: [],
      }
    }
  }

}
