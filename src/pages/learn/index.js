import Head from 'next/head';
import SeoHead from '../../../components/SeoHead';
import home from '../../../lib/api/home';
import metaTag from '../../../lib/api/metaTag';
import blog from '../../../lib/api/blog';
import BlogList from '../../../components/blogs/BlogList';
import { useSearchParams } from 'next/navigation';

export default function ListBlogPage({
  homeContent, metaTags, blogs  
}) {
  const searchParams = useSearchParams();
  const s = searchParams.get("s");

  return (
    <>
      <SeoHead
      meta_description={homeContent?.meta_description || ""}
      meta_title={`${s? `You searched for ${s}` : `Learn`} - ${homeContent?.meta_title || ""}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = "https://bzindia.in/learn"

      isBlogPage={true}
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
      homeContent={homeContent}
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
        company_slug: b.company_slug || null,
    }));    

    return {
      props: {
        homeContent,
        metaTags,
        blogs,
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        homeContent: {},
        metaTags: [],
        blogs: [],
      }
    }
  }

}
