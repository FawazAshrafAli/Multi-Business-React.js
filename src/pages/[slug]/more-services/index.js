import Head from 'next/head';
import SeoHead from '../../../../components/SeoHead';
import service from '../../../../lib/api/service';
import location from '../../../../lib/api/location';
import blog from '../../../../lib/api/blog';
import ListServiceSubCategories from '../../../../components/service/ListServiceSubCategories';

export default function ListSubCategoriePage({
  isSubCategoryListingPage, blogs,
  structuredData, address,
  locationData
}) {
  return (
    <>
      {isSubCategoryListingPage &&
        <>
        <SeoHead
        meta_description={`Find Sub Categories wholesale suppliers in ${address}.`}
        meta_title={`Sub Categories Wholesale Supplier in ${address}`}
        blogs={blogs || []}


        url = {`https://${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/services`}
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

      <ListServiceSubCategories
       blogs={blogs}
       locationData={locationData}
       />
       </>
      }

    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const {slug} = context.params;
    let isSubCategoryListingPage = false;
    let locationData = {};

         
    try {

      const districtRes = await location.getMinimalDistrict(slug);
      const district = districtRes.data;

      isSubCategoryListingPage = true;

      const districtCenterRes = await location.getDistrictCenter(slug);
      const districtCenter = districtCenterRes.data;

      locationData = {
          ...district, 
          "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
      }
    } catch (err) {
      const stateRes = await location.getMinimalState(slug);
      const state = stateRes.data;          
      
      isSubCategoryListingPage = true;
      
      const stateCenterRes = await location.getStateCenter(slug);
      const stateCenter = stateCenterRes.data;

      locationData = {
          ...state, 
          "latitude": stateCenter?.latitude, "longitude": stateCenter?.longitude
      }
    }            

    if (!isSubCategoryListingPage) throw new Error("Not a service sub type listing page");    

    const subCategoryRes = await service.getSubCategories("all");
    const subCategories = subCategoryRes.data?.results;

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
        subCategories: subCategories || [],
        isSubCategoryListingPage: isSubCategoryListingPage || false,
        locationData: locationData || {},
        blogs: blogs || [],
        address: address || null
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        subCategories: [],
        structuredData: [],
        isSubCategoryListingPage: false,
        locationData: {},
        blogs: [],
        address: null
      }
    }
  }

}
