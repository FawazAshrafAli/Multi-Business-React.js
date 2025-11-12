import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import metaTag from '../../../../lib/api/metaTag';
import blog from '../../../../lib/api/blog';
import company from '../../../../lib/api/company';
import BlogList from '../../../../components/blogs/BlogList';
import { useSearchParams } from 'next/navigation';

export default function ListBlogPage({
  metaTags, blogs, structuredData,
  currentCompany
}) {
  const searchParams = useSearchParams();
  const s = searchParams.get("s");

  return (
    <>
      {currentCompany && 
      <>
        <SeoHead
        meta_description={`Latest articles from ${currentCompany?.name}`}
        meta_title={`${s? `You searched for ${s}` : `Learn`} - ${currentCompany?.meta_title || ""}`}
        metaTags={metaTags}
        
        blogs={blogs}
        currentCompany={currentCompany}

        url = {`https://bzindia.in/${currentCompany?.slug}/learn`}

        isBlogPage={true}
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
      </>
      }

      <BlogList
      currentCompany={currentCompany}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {    
    const params = context.query;
    const slug = params.slug;

    const companyRes = await company.getInnerPageCompany(slug);
    const currentCompany = companyRes.data;
  
    const metaTagRes = await metaTag.getMetaTags();
    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    
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
              "name": currentCompany?.sub_type,
              "item": `https://bzindia.in/${currentCompany?.slug}`
            }, 
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Blog",
              "item": `https://bzindia.in/${currentCompany?.slug}/learn`
            },       
          ]
        },
        null, 2
      )
    ]

    return {
      props: {
        metaTags,
        blogs,
        currentCompany,
        structuredData,
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        metaTags: [],
        blogs: [],
        currentCompany: [],
        structuredData: [],
      }
    }
  }

}
