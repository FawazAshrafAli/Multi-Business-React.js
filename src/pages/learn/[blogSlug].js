import Head from 'next/head';
import SeoHead from '../../../components/SeoHead';
import blog from '../../../lib/api/blog';
import BlogDetail from '../../../components/blogs/BlogDetail';

export default function BlogPage({
  blogs, currentBlog, structuredData
}) {
  return (
    <>
      <SeoHead
      meta_description={currentBlog?.meta_description || ""}
      meta_title={currentBlog?.meta_title || currentBlog?.title || ""}
      metaTags={currentBlog?.meta_tags?.slice(0,12)}
      
      blogs={blogs}
      
      pageImage={currentBlog?.image_url}

      url = {`https://bzindia.in/learn/${currentBlog?.slug}`}

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

      <BlogDetail
      blogs={blogs}
      currentBlog={currentBlog}
      />
    </>
  );
}

export async function getServerSideProps(context) {

  try {
    const query = context.query;
    const blogSlug = query.blogSlug    

    const blogRes = await blog.getBlog(blogSlug);
    const currentBlog = blogRes.data;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    const blogsData = blogsRes.data.results;       
    
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
                  "name": "Blog",
                  "item": `https://bzindia.in/learn`
                },  
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": currentBlog?.title || "undefined",
                    "item": `https://bzindia.in/learn/${currentBlog?.slug}`
                },  
              ]
            },
            null, 2
        ),

        JSON.stringify(
            {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": currentBlog?.title || "undefined",
                "datePublished": currentBlog?.published_date || "undefined",
                "author": {
                    "@type": "Person",
                    "name": "Admin",
                    "url": "https://bzindia.in/" // Add the URL of the author's page here
                },
                "articleBody": currentBlog?.content || "undefined",
                "image": currentBlog?.image_url || "undefined", // Add the URL of the image here                
            },
            null, 2
        )
    ]

    return {
      props: {
        blogs: Array.isArray(blogsData) ? blogsData.slice(0, 12) : [],
        currentBlog: currentBlog || {},
        structuredData
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        blogs: [],
        currentBlog: [],      
        structuredData: []
      }
    }
  }

}
