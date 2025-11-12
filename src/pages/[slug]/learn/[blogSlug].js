import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import blog from '../../../../lib/api/blog';
import company from '../../../../lib/api/company';
import BlogDetail from '../../../../components/blogs/BlogDetail';

export default function BlogPage({
  blogs, currentCompany, structuredData,
  currentBlog
}) {
  return (
    <>
      {currentCompany && 
        <>
        <SeoHead
        meta_description={currentBlog?.meta_description || ""}
        meta_title={currentBlog?.meta_title || currentBlog?.title || ""}
        metaTags={currentBlog?.meta_tags}
        
        blogs={blogs}
        currentCompany={currentCompany}

        pageImage={currentBlog?.image_url}

        url = {`https://bzindia.in/${currentCompany?.slug}/learn/${currentBlog?.slug}`}

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

      <BlogDetail
      blogs={blogs}      
      currentCompany={currentCompany}
      currentBlog={currentBlog}
      />
    </>
  );
}

export async function getServerSideProps(context) {

  try {
    const params = context.query;

    const slug = params.slug;
    const blogSlug = params.blogSlug

    const companyRes = await company.getInnerPageCompany(slug);
    const currentCompany = companyRes.data;

    const blogRes = await blog.getBlog(blogSlug);
    const currentBlog = blogRes.data;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
    
    const blogs = (blogsRes.data.results || [])
        .slice(0, 12)
        .map(b => ({
        id: b.id?? null,
        title: b.title?? null,
        slug: b.slug?? null,
        summary: b.summary?? null,
        image_url: b.image_url?? null,
        published_date: b.published_date?? null,
        updated: b.updated?? null,
        get_absolute_url: b.get_absolute_url?? null,
        content: b.content?? null,
        meta_tags: b.meta_tags?? [],
        company_slug: b.company_slug?? null,
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
                  "item": `https://bzindia.in/${currentCompany.slug}`
                },  
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Learn",
                  "item": `https://bzindia.in/${currentCompany.slug}/learn`
                },  
                {
                    "@type": "ListItem",
                    "position": 4,
                    "name": currentBlog?.title || "",
                    "item": `https://bzindia.in/${currentCompany.slug}/learn/${currentBlog?.slug}`
                },  
              ]
            },
            null, 2
        ),
        
        JSON.stringify(
            {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": currentBlog?.title || "",
                "datePublished": currentBlog?.published_date || "",
                "author": {
                    "@type": "Person",
                    "name": "Admin",
                    "url": "https://bzindia.in/" // Add the URL of the author's page here
                },
                "articleBody": currentBlog?.content || "",
                "image": currentBlog?.image_url || "", // Add the URL of the image here                
            },
            null, 2
        )
    ]

    return {
      props: {
        blogs,
        currentBlog,
        currentCompany,
        structuredData,
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        blogs: [],        
        currentBlog: [],
        currentCompany: [],  
        structuredData: [],  
      }
    }
  }

}
