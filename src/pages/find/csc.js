import SeoHead from '../../../components/SeoHead';

import metaTag from '../../../lib/api/metaTag';
import blog from '../../../lib/api/blog';
import company from '../../../lib/api/company';
import home from '../../../lib/api/home';
import Head from 'next/head';
import HomeCsc from '../../../components/csc/HomeCsc';

export default function IndexPage({
  homeContent, metaTags, blogs, companies, structuredData,
  nearbyPlaces, nearestPlace
}) {
  return (
    <>
      <SeoHead
      meta_description="List of FAQs"
      meta_title={`CSC - ${homeContent?.meta_title || ""}`}
      metaTags={metaTags}
      
      blogs={blogs}

      url = {"https://bzindia.in/faq/csc"}
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

      <HomeCsc
      homeContent={homeContent?.[0]}
      metaTags={metaTags}
      
      blogs={blogs}
      companies={companies}            
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

    const companiesRes = await company.getFaqCompanies();
    const companiesData = companiesRes.data;
    
    let nearestPlace;
    let nearbyPlaces;

    // if (lat && lon) {
    //   const nearestPlaceRes = await location.getNearestPlace(lat, lon);
    //   nearestPlace = nearestPlaceRes.data;

    //   const nearbyPlacesRes = await location.getNearbyPlaces(lat, lon);
    //   nearbyPlaces = nearbyPlacesRes.data;
      
    // }

    const structuredData = []

    return {
      props: {
        homeContent,
        metaTags,
        blogs,
        companies: companiesData?.slice(0,12) || {},   
        structuredData,
        nearbyPlaces: nearbyPlaces || [],
        nearestPlace: nearestPlace || null,
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
        structuredData: [],
        nearbyPlaces: [],
        nearestPlace: null,   
      }
    }
  }

}
