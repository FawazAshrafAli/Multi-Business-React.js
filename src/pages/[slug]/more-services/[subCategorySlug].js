import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import location from '../../../../lib/api/location';
import ListServiceDetails from '../../../../components/service/ListServiceDetails';
import blog from '../../../../lib/api/blog';
import service from '../../../../lib/api/service';

export default function ListSubCategoryPage({
  isListServiceDetailsPage,
  structuredData, subCategory, blogs,
  locationData, address
}) {  
  return (
    <>
      {isListServiceDetailsPage &&
        <>
        <SeoHead
        meta_description={`${subCategory.name}, bulk pricing, reliable shipping across ${locationData?.name}."`}
        meta_title={`Sub Categories Wholesale Supplier in ${address}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug}/more-services/${subCategory?.locationSlug || subCategory?.slug}-${locationData?.slug}`}
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
        
        <ListServiceDetails
         
        locationData={locationData}
        subCategory={subCategory}
        />
      </>
      }

    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const {slug, subCategorySlug} = context.params;
    let isListServiceDetailsPage = false;

    let urlLocationRes;
    
    urlLocationRes = await location.getUrlLocation("state", subCategorySlug);
    
    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("district", subCategorySlug);
    }

    if (!urlLocationRes?.data?.data) {
      urlLocationRes = await location.getUrlLocation("place", subCategorySlug);
    }


    const urlLocation = urlLocationRes?.data;

    const locationData = urlLocation?.data;

    const passingSubCategorySlug = subCategorySlug?.replace(`-${locationData?.slug}`, "");

    let subCategory, subCategoryRes;

    subCategoryRes = await service.getSubCategories("all", undefined, `location_slug=${passingSubCategorySlug}`);
    subCategory = subCategoryRes.data?.results?.[0];
    
    if (!subCategory) {

      subCategoryRes = await service.getSubCategory("all", passingSubCategorySlug);
      subCategory = subCategoryRes.data;

    }

    if (subCategory && (locationData?.district_slug == slug || locationData?.state_slug == slug || locationData?.slug == slug)) {
      isListServiceDetailsPage = true;
    }    

    if (!isListServiceDetailsPage) throw new Error("Not a service sub type listing page");

    const detailRes = await service.getSubCategories("all");
    const details = detailRes.data?.results;

    const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
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
        })); 

    const address_list = [];

    if (locationData?.name) address_list.push(locationData?.name);
    if (locationData?.district_name) address_list.push(locationData?.district_name);
    if (locationData?.state_name) address_list.push(locationData?.state_name);

    const address = address_list.join(", ");

    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const priceValidUntil = sixMonthsLater.toISOString().split("T")[0];      

    const structuredData = [];

    return {
      props: {
        structuredData,
        isListServiceDetailsPage: isListServiceDetailsPage || false,
        locationData: locationData || {},
        subCategory: subCategory || null,
        blogs: blogs || [],
        address: address || [],
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        structuredData: [],
        isListServiceDetailsPage: false,
        locationData: {},
        subCategory: null,
        blogs: [],
        address: null,
      }      
    }
  }

}
