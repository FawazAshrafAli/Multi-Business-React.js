import { useRouter } from 'next/router';
import React from 'react'
import CompanyMultipage from '../../components/CompanyMultipage';
import company from '../../lib/api/company';
import product from '../../lib/api/product';
import course from '../../lib/api/course';
import service from '../../lib/api/service';
import registration from '../../lib/api/registration';
import location from '../../lib/api/location';
import SeoHead from '../../components/SeoHead';
import Head from 'next/head';
import slugify from 'slugify';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import CompanyDetail from '../../components/CompanyDetail';
import BlogList from '../../components/blogs/BlogList';
import metaTag from '../../lib/api/metaTag';
import blog from '../../lib/api/blog';
import TypePage from '../../components/registration/TypePage';
import SubTypePage from '../../components/registration/SubTypePage';
import ProgramPage from '../../components/education/ProgramPage';
import SpecializationPage from '../../components/education/SpecializationPage';
import CategoryPage from '../../components/service/CategoryPage';
import SubCategoryPage from '../../components/service/SubCategoryPage';
import ProductCategoryPage from '../../components/product/ProductCategoryPage';
import ProductSubCategoryPage from '../../components/product/ProductSubCategoryPage';

const DynamicMultiPage = ({
  currentCompany, multipageImage, detailPageImage,
  replacedMultipage, wrongLocationStructure, multipageUrl,
  isMultipage, isDetailpage, detailPage, monthAndYear,
  detailPageUrl, metaTags, typeSlug, subTypeSlug,
  registrationType, isRegistrationTypePage, isRegistrationSubTypePage,
  registrationSubType, details, isCourseProgramPage, specializations,
  courseProgram, programSlug, isCourseSpecializationPage,
  courseSpecialization, specializationSlug, isServiceCategoryPage,
  serviceCategory, categorySlug, isServiceSubCategoryPage,
  serviceSubCategory, subCategorySlug, isProductCategoryPage,
  isProductSubCategoryPage, productCategory, productSubCategory,  
  structuredData

}) => {
  const router = useRouter();
    const { multipageParams = [] } = router.query;
  //   const { slug, multiPageSlug } = router?.query;

  if (
    multipageParams?.[0] === '.well-known' ||
    !multipageParams?.[0] ||
    typeof multipageParams?.[0] !== 'string'
  ) {
    return null; 
  }  
  
  let slug;
  let multiPageSlug;
  let itemSlug;
  let stateSlug;
  let districtSlug;
  let placeSlug;

  if (multipageParams.length > 2) {
    [
      slug,
      itemSlug,
      stateSlug,
      districtSlug,
      placeSlug
    ] = multipageParams || [];  
  } else {
    [slug, multiPageSlug] = multipageParams || [];  
  }

  if (!slug || multipageParams.length < 2 ) return null;

  if (wrongLocationStructure) router.push("/404");

  const formatMonthAndYear = (input) => { 
    if (!monthAndYear || !input) return;

    const [year, month] = input?.split('/').map(Number);
      const date = new Date(year, month - 1); // month is 0-indexed
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <SeoHead
        meta_description={
          monthAndYear? `The list of archives of ${monthAndYear && formatMonthAndYear(monthAndYear)}` 
          :isMultipage? replacedMultipage?.meta_description 
          :isDetailpage? detailPage?.meta_description 
          :isRegistrationTypePage? `${registrationType?.meta_description || `List of sub types of ${registrationType?.name}`}`
          :isRegistrationSubTypePage? `${registrationSubType?.meta_description || `List of registrations of ${registrationSubType?.name}`}`
          :isCourseProgramPage? `${courseProgram?.meta_description || `List of specializations of ${courseProgram?.name}`}`
          :isCourseSpecializationPage? `${courseSpecialization?.meta_description || `List of courses of ${courseSpecialization?.name}`}`
          :isServiceCategoryPage? `${serviceCategory?.meta_description || `List of sub categories of ${serviceCategory?.name}`}`
          :isServiceSubCategoryPage? `${serviceSubCategory?.meta_description || `List of services of ${serviceSubCategory?.name}`}`
          :isProductCategoryPage? `${productCategory?.meta_description || `List of sub categories of ${productCategory?.name}`}`
          :isProductSubCategoryPage? `${productSubCategory?.meta_description || `List of products of ${productSubCategory?.name}`}`
          : ""}
        meta_title={
          monthAndYear? `Archives of ${formatMonthAndYear(monthAndYear)}` 
          :isMultipage? `${replacedMultipage?.meta_title || replacedMultipage?.modifiedTitle}`
          :isDetailpage? `${detailPage?.meta_title}`
          :isRegistrationTypePage? `${registrationType?.name} - ${currentCompany?.meta_title}`
          :isRegistrationSubTypePage? `${registrationSubType?.name} - ${currentCompany?.meta_title}`
          :isCourseProgramPage? `${courseProgram?.name} - ${currentCompany?.meta_title}`
          :isCourseSpecializationPage? `${courseSpecialization?.name} - ${currentCompany?.meta_title}`
          :isServiceCategoryPage? `${serviceCategory?.name} - ${currentCompany?.meta_title}`
          :isServiceSubCategoryPage? `${serviceSubCategory?.name} - ${currentCompany?.meta_title}`
          :isProductCategoryPage? `${productCategory?.name} - ${currentCompany?.meta_title}`
          :isProductSubCategoryPage? `${productSubCategory?.name} - ${currentCompany?.meta_title}`
          : ""}
        metaTags={
          monthAndYear? metaTags || []
          :isMultipage? replacedMultipage?.meta_tags || [] 
          :isDetailpage? detailPage?.meta_tags || []
          :(isRegistrationTypePage 
            || isCourseProgramPage 
            || isRegistrationSubTypePage 
            || isCourseSpecializationPage 
            || isServiceCategoryPage 
            || isServiceSubCategoryPage
            || isProductCategoryPage 
            || isProductSubCategoryPage) ? currentCompany?.meta_tags || []
          : []
        }
        
        blogs={!isMultipage ? currentCompany?.blogs?.slice(0,12) || [] : []}
  
        url = {`https://bzindia.in/${
        isMultipage? multipageUrl 
        :isDetailpage? detailPageUrl 
        :isRegistrationSubTypePage? registrationSubType?.url 
        :isRegistrationTypePage? registrationType?.url
        :isCourseProgramPage? courseProgram?.url 
        :isCourseSpecializationPage? courseSpecialization?.url 
        :isServiceCategoryPage? serviceCategory?.url 
        :isServiceSubCategoryPage? serviceSubCategory?.url 
        :isProductSubCategoryPage? productSubCategory?.url 
        :isProductCategoryPage? productCategory?.url 
        : ""}`}

        pageImage={
          isDetailpage? detailPageImage
          :isMultipage? multipageImage
          : ""
        }

        currentCompany = {currentCompany}        
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
      
      
      {monthAndYear ?
      <BlogList monthAndYear={monthAndYear}/>
      : isMultipage ? 
        <CompanyMultipage
          slug={slug}          
          currentCompany={currentCompany}
          multiPageSlug={multiPageSlug}
          replacedMultipage={replacedMultipage}          
        />      
    : isDetailpage ?
        <CompanyDetail 
        slug={slug}        
        currentCompany={currentCompany}
        detailPage={detailPage}
        />
    : isRegistrationTypePage ?
        <TypePage 
          slug={slug}
          currentCompany={currentCompany}
          registrationType={registrationType}
          typeSlug={typeSlug}          
        />
    : isRegistrationSubTypePage ?
        <SubTypePage
          slug={slug}
          currentCompany={currentCompany}
          registrationSubType={registrationSubType}
          subTypeSlug={subTypeSlug}                    
        />

    : isCourseProgramPage ?
      <ProgramPage
        slug={slug}
        currentCompany={currentCompany}
        specializations={specializations}
        programSlug={programSlug}
        courseProgram={courseProgram}        
      />

    : isCourseSpecializationPage ?
        <SpecializationPage 
        slug={slug}
        currentCompany={currentCompany}
        details={details}
        specializationSlug={specializationSlug}
        courseSpecialization={courseSpecialization}                
        />

    :isServiceCategoryPage ?
      <CategoryPage 
      slug={slug}
        currentCompany={currentCompany}
        categorySlug={categorySlug}
        serviceCategory={serviceCategory}                
      />
    
    :isServiceSubCategoryPage ?
      <SubCategoryPage 
      slug={slug}
      currentCompany={currentCompany}
      subCategorySlug={subCategorySlug}
      serviceSubCategory={serviceSubCategory}              
      />

    :isProductCategoryPage ?
      <ProductCategoryPage 
      slug={slug}
      currentCompany={currentCompany}
      categorySlug={categorySlug}
      productCategory={productCategory}              
      />

    :isProductSubCategoryPage ?
      <ProductSubCategoryPage
      slug={slug}
      currentCompany={currentCompany}
      subCategorySlug={subCategorySlug}
      productSubCategory={productSubCategory}
      />

    :
    null
    }
    </>
  )
}

export async function getServerSideProps(context) {

  const multipageParams = context.params?.multipageParams || [];

  try {
    if (multipageParams[0] === '.well-known') {
      return { notFound: true };
    }

    let slug = /^\d+$/.test(multipageParams?.[0] ?? "")
    ? undefined
    : multipageParams?.[0];

    let multiPageSlug;
    let itemSlug;
    let stateSlug = multipageParams?.[2];
    let districtSlug = multipageParams?.[3];
    let placeSlug = multipageParams?.[4];    

    let currentCompany;
    let metaTags;
    let blogs;

    if (multipageParams.length > 2) {
      itemSlug = multipageParams[1]      
    } else {
      multiPageSlug = multipageParams[1];  
    }

    let monthAndYear = null;

    try {
      const year = parseInt(multipageParams[0]);
      const month = parseInt(multipageParams[1]);

      if (year > 2000 && year < 2125 && month < 13) {        
        monthAndYear = `${year}/${month}`

        const metaTagRes = await metaTag.getMetaTags();
        metaTags = metaTagRes.data.results;

        const passingMonthAndYear = monthAndYear.replace("/", "-");

        const blogsRes = await blog.getBlogs(`/blog_api/blogs/?month_and_year=${passingMonthAndYear}`);
        blogs = blogsRes.data.results;

      }


    } catch (err) {
      console.error(err);
      return;
    }

    if (!monthAndYear && slug) {

      const companyRes = await company.getInnerPageCompany(slug);
      currentCompany = companyRes.data; 
    }

    let testimonials;
    let fetchedState;
    let fetchedDistrict;
    let fetchedPlace;
   
    
    let multipage;
    let multipageImage;
    let detailPage;
    let detailPageImage;
    let detailPageUrl;
    let replacedMultipage;
    let locationName;
    let wrongLocationStructure = false;
    let multipageUrl;
    let articleBody;
    let clients = [];

    let isMultipage = false;
    let isDetailpage = false;
    let typeSlug;
    let isRegistrationTypePage = false;
    let subTypes;
    let registrationType;
    let subTypeSlug;
    let isRegistrationSubTypePage = false;
    let registrationSubType;

    let programSlug, specializationSlug;
    let isCourseProgramPage, isCourseSpecializationPage = false;
    let specializations;
    let courseProgram, courseSpecialization;

    let categorySlug, subCategorySlug;
    let isServiceCategoryPage, isServiceSubCategoryPage = false;
    let subCategories;
    let serviceCategory, serviceSubCategory;

    let isProductCategoryPage, isProductSubCategoryPage = false;
    let productCategory, productSubCategory;

    let details;

    const replaceInObject = (obj, search, replacement) => {
      if (typeof obj === 'string') {
        return obj.replaceAll(search, replacement ?? '');
      } else if (Array.isArray(obj)) {
        return obj.map(item => replaceInObject(item, search, replacement));
      } else if (typeof obj === 'object' && obj !== null) {
        const replaced = {};
        for (let key in obj) {
          replaced[key] = replaceInObject(obj[key], search, replacement);
        }
        return replaced;
      }
      return obj;
    };

    if (!multiPageSlug) {
      multiPageSlug = placeSlug || districtSlug || stateSlug;
    }

    const urlLocationRes = await location.getUrlLocation(undefined, multiPageSlug);
    const urlLocation = urlLocationRes.data;

    const locationData = urlLocation?.data;
    
    let [initialPlaceSlug, initialDistrictSlug, initialStateSlug] = [placeSlug, districtSlug, stateSlug]

    if (urlLocation?.match_type === "state") {
      fetchedState = locationData;
      stateSlug = locationData?.slug;

    } else if (urlLocation?.match_type === "district") {
      fetchedDistrict = locationData;
      districtSlug =  locationData?.slug;
      stateSlug = locationData?.state?.slug;

    } else if (urlLocation?.match_type === "place") {
      fetchedPlace = locationData;
      placeSlug = locationData?.slug;
      districtSlug =  locationData?.district?.slug;
      stateSlug = locationData?.state?.slug;
    } else {
      stateSlug = stateSlug;
    }

    const fetchedLocationSlug = placeSlug || districtSlug || stateSlug || "india";


    if (!fetchedState && !fetchedDistrict && !fetchedPlace) {
      locationName = "India";
    } else {
      let locationStateSlug = fetchedPlace?.district?.state?.slug || fetchedDistrict?.state?.slug || fetchedState?.slug;      

      if (locationStateSlug && stateSlug && locationStateSlug != stateSlug) {
        wrongLocationStructure = true;
      }

      let placeName = fetchedPlace?.name;
      let districtName = fetchedPlace?.district?.name || fetchedDistrict?.name;
      let stateName = fetchedPlace?.district?.state?.name || fetchedDistrict?.state?.name || fetchedState?.name;    

      let locationList = [];

      [placeName, districtName, stateName, "India"].map(item => {
        if (item) {
          locationList.push(item);
        }
      });

      // locationName = locationList.join(", ");
      locationName = locationList?.[0];
    }

    if (!itemSlug) {
      itemSlug = multiPageSlug?.toString().replace(`-${fetchedLocationSlug}`, "-place_name");
    }

    const passingLocationData={
      "placeSlug": placeSlug || initialPlaceSlug || null,
      "districtSlug": districtSlug || initialDistrictSlug || null,
      "stateSlug": stateSlug || initialStateSlug || null
    }

    if (currentCompany?.company_type === "Education") {

      try {
        
        // const courseMultipageRes = await location.getCourseMultiPage(districtSlug || stateSlug || "india", itemSlug, `${districtSlug? 'district' :stateSlug? 'state' : undefined}`);
        const courseMultipageRes = await location.getCourseMultiPage(passingLocationData, itemSlug);
        multipage = courseMultipageRes.data;
        multipageImage = multipage?.image_url;
  
        const partnersRes = await course.getPartners(slug);
        clients = partnersRes.data;

        isMultipage = true;

      } catch (err) {
        programSlug = itemSlug || multiPageSlug;

        if (multipageParams.length == 2) {
          const specializationUrl = `/course_api/companies/${slug}/specializations/?program=${programSlug}`;

          try {
            const specializationRes = await course.getSpecializations(specializationUrl);
            specializations = specializationRes.data?.results;

            isCourseProgramPage = true;
            
            const courseProgramRes = await course.getProgram(slug, programSlug);            
            courseProgram = courseProgramRes.data;
            courseProgram = {...courseProgram, "url": `/${slug}/${programSlug}`}            

          } catch (err) {
            console.error(err);
          }

        } else if (multipageParams.length == 3) {
          specializationSlug = multipageParams?.[2];

          try {       
            const detailsRes = await course.getCourseDetails(`/course_api/companies/${slug}/detail-list/?specialization=${specializationSlug}`);
            details = detailsRes.data?.results;

            isCourseSpecializationPage = true;
                        
            const courseSpecializationRes = await course.getSpecialization(slug, specializationSlug);            
            courseSpecialization = courseSpecializationRes.data;
            courseSpecialization = {...courseSpecialization, "url": `/${slug}/${courseSpecialization?.program_slug}/${specializationSlug}`}


          } catch (err) {
            console.error(err);
          }

       } else if (programSlug && multipageParams.length == 4) {
          const courseProgramSlug = multipageParams[1]
          const courseSpecializationSlug = multipageParams[2]
          const detailPageSlug = multipageParams[3];            
            
            try {
              const response = await course.getDetail(slug, detailPageSlug);
              const courseDetailRes = response.data;

              if (courseDetailRes.testimonials?.length < 1) {
                const fallbackCourseTestimonialsRes = await course.getTestimonials(slug);
                courseDetailRes["fallback_testimonials"] = fallbackCourseTestimonialsRes.data;
              }
              
              isDetailpage = true;

              if (
                courseDetailRes.program_slug === courseProgramSlug &&
                courseDetailRes.specialization_slug === courseSpecializationSlug
              ) {
                detailPage = response.data;
                detailPageImage = detailPage?.image_url;
                detailPageUrl = detailPage?.url;
              }              

            } catch (err) {
              console.error(err);
            }
        } else {
          console.error(err);
        }
      }
      
    
    } else if (currentCompany?.company_type === "Service") {
      try {
        
        const serviceMultipageRes = await location.getServiceMultiPage(stateSlug || "india", itemSlug);
        multipage = serviceMultipageRes.data;
        multipageImage = multipage?.image_url;      
        
        clients = currentCompany?.clients;

        isMultipage = true;

      } catch (err) {
        categorySlug = itemSlug || multiPageSlug;

        if (multipageParams.length == 2) {

          try {
            const subCategoriesRes = await service.getSubCategories(slug, categorySlug);
            subCategories = subCategoriesRes.data?.results;

            isServiceCategoryPage = true;
            
            const serviceCategoryRes = await service.getCategory(slug, categorySlug);            
            serviceCategory = serviceCategoryRes.data;

            serviceCategory = {...serviceCategory, "url": `${slug}/${categorySlug}`}

          } catch (err) {
            console.error(err);
          }

        } else if (multipageParams.length == 3) {
          subCategorySlug = multipageParams?.[2];

          try {         
            const detailsRes = await service.getServiceDetails(`/service_api/companies/${slug}/detail-list/?sub_category=${subCategorySlug}`);
            details = detailsRes.data?.results;

            isServiceSubCategoryPage = true;
                        
            const serviceSubCategoryRes = await service.getSubCategory(slug, subCategorySlug);            
            serviceSubCategory = serviceSubCategoryRes.data;
            serviceSubCategory = {...serviceSubCategory, "url": `${slug}/${serviceSubCategory?.category_slug}/${subCategorySlug}`}

          } catch (err) {
            console.error(err);
          }

        } else if (multipageParams.length == 4) {
          const serviceCategorySlug = multipageParams[1]
          const serviceSubCategorySlug = multipageParams[2]
          const detailPageSlug = multipageParams[3];
            
            try {
              const response = await service.getDetail(slug, detailPageSlug);              
              const serviceDetailRes = response.data;

              isDetailpage = true;

              if (
                serviceDetailRes.category_slug === serviceCategorySlug &&
                serviceDetailRes.sub_category_slug === serviceSubCategorySlug
              ) {
                detailPage = response.data;
                detailPageImage = detailPage?.image_url;
                detailPageUrl = `${detailPage?.url}`

              }              

            } catch (err) {
              console.error(err);
            }
        } else {
          console.error(err);
        }
      }          

    } else if (currentCompany?.company_type === "Product") {
      try {
        const productMultipageRes = await location.getProductMultiPage(passingLocationData, itemSlug);
        multipage = productMultipageRes.data;
        multipageImage = multipage?.products?.[0]?.image_url;
  
        clients = currentCompany?.clients;

        isMultipage = true;

      } catch (err) {
        categorySlug = itemSlug || multiPageSlug;

        if (multipageParams.length == 2) {

          try {
            const subCategoriesRes = await product.getSubCategories(slug, categorySlug);
            subCategories = subCategoriesRes.data?.results;

            isProductCategoryPage = true;
            
            const productCategoryRes = await product.getCategory(slug, categorySlug);            
            productCategory = productCategoryRes.data;

            productCategory = {...productCategory, ["url"]: `${slug}/${categorySlug}`}

          } catch (err) {
            console.error(err);
          }

        } else if (multipageParams.length == 3) {
          subCategorySlug = multipageParams?.[2];

          try {         
            const detailsRes = await product.getProductDetailList(slug, `sub_category=${subCategorySlug}`);
            details = detailsRes.data?.results;

            isProductSubCategoryPage = true;
                        
            const productSubCategoryRes = await product.getSubCategory(slug, subCategorySlug);            
            productSubCategory = productSubCategoryRes.data;

            productSubCategory = {...productSubCategory, ["url"]: `${slug}/${productSubCategory.category_slug}/${categorySlug}`}

          } catch (err) {
            console.error(err);
          }

        } else if (multipageParams.length == 4) {
          const productCategorySlug = multipageParams[1]
          const productSubCategorySlug = multipageParams[2]
          const detailPageSlug = multipageParams[3];
          
          try {
            const response = await product.getDetail(slug, detailPageSlug);
            const productDetailRes = response.data;

            isDetailpage = true;

            if (
              productDetailRes.category_slug === productCategorySlug &&
              productDetailRes.sub_category_slug === productSubCategorySlug
            ) {
              detailPage = response.data;
              detailPageImage = detailPage?.image_url;
              detailPage = {...detailPage, "faqs": detailPage?.faqs?? null}
              detailPageUrl = `${detailPage?.url}`
            }

          } catch (err) {
            console.error(err);
          }
        } else {
          console.error(err);
        }
      }
      

    } else if (currentCompany?.company_type === "Registration") {
      try {
        const registrationMultipageRes = await location.getRegistrationMultiPage(passingLocationData, itemSlug);
        multipage = registrationMultipageRes.data;
        multipageImage = multipage?.image_url;
        clients = currentCompany?.clients;
        
        isMultipage = true;

      } catch (err) {

        typeSlug = itemSlug || multiPageSlug;

        if (multipageParams.length == 2) {

          try {
            const subTypeRes = await registration.getSubTypes(slug, typeSlug);
            subTypes = subTypeRes.data?.results;

            isRegistrationTypePage = true;
            
            const registrationTypeRes = await registration.getType(slug, typeSlug);            
            registrationType = registrationTypeRes.data;

            registrationType = {...registrationType, ["url"]: `${slug}/${typeSlug}`};


          } catch (err) {
            console.error(err);
          }

        } else if (multipageParams.length == 3) {
          subTypeSlug = multipageParams?.[2];

          try {     
            const detailsRes = await registration.getRegistrationDetails(`/registration_api/companies/${slug}/detail-list/?sub_type=${subTypeSlug}`);
            details = detailsRes.data?.results;

            isRegistrationSubTypePage = true;
            
            const registrationSubTypeRes = await registration.getSubType(slug, subTypeSlug);            
            registrationSubType = registrationSubTypeRes.data;
            
            registrationSubType = {...registrationSubType, ["url"]: `${slug}/${subTypeSlug}`}

          } catch (err) {
            console.error(err);
          }


        } else if (multipageParams.length == 4) {
          const registrationTypeSlug = multipageParams[1]
          const registrationSubTypeSlug = multipageParams[2]
          const detailPageSlug = multipageParams[3];          
            
            try {
              const response = await registration.getDetail(slug, detailPageSlug);
              const registrationDetailRes = response.data;

              isDetailpage = true;
              
              if (
                registrationDetailRes.type_slug === registrationTypeSlug &&
                registrationDetailRes.sub_type_slug === registrationSubTypeSlug
              ) {
                detailPage = response.data;
                detailPageImage = detailPage?.image_url;
                detailPageUrl = `/${detailPage?.url}`
              }

            } catch (err) {
              console.error(err);
            }
        } else {
          console.error(err);
        }
      }

    }    

    if (multipage) {
      let modified_url = '';
      let updatedMultipageSlug = multipage?.slug || '';
      let locationSlug;
      let modified_title = null;
  
      if (multipage?.url_type === "location_filtered") {
        modified_title = multipage.title?.replace("in place_name", "").replace("at place_name", "").replace("place_name", "");

        updatedMultipageSlug = updatedMultipageSlug?.replace("-place_name", "");
        locationSlug = placeSlug || districtSlug;

        modified_url = `${currentCompany?.slug}/${updatedMultipageSlug}/`;

        if (fetchedPlace?.state) {
          modified_url += `${fetchedPlace?.state?.slug}/${locationSlug || "undefined"}`;
        }
      } else {
        locationSlug = placeSlug || districtSlug || stateSlug || "india";

        updatedMultipageSlug = updatedMultipageSlug?.replace("place_name", locationSlug);            
  
        modified_url = `${currentCompany?.slug}/${updatedMultipageSlug}`;
  
        if (!multipage.slug?.toString().endsWith("place_name")) {
          modified_url += `-${locationSlug}`;
        }
      }

      multipageUrl = modified_url;

      replacedMultipage = replaceInObject(multipage, "place_name", locationName);   

      replacedMultipage["modified_title"] = modified_title;  

    }

    if (detailPage) {      

      const window = new JSDOM('').window;
      const DOMPurify = createDOMPurify(window);
      const sanitizedDescription = DOMPurify.sanitize(detailPage.description || '');

      articleBody = `<section>
                  <div class="container">
                    <div class="row">
                      <div class="tg-authorbox" data-aos="fade-up">
                        ${detailPage?.detailPageImage ? `
                          <figure class="tg-authorpic">
                            <a href="#"><img src="${detailPage?.detailPageImage}" alt=${detailPage?.name} /></a>
                          </figure>` : ''}
                        <div class="tg-authorinfo">
                          <div class="tg-section-heading">
                            <h2>${detailPage?.name || ''}</h2>
                          </div>
                          <div class="tg-description">
                            <p>${detailPage?.summary || ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section class="content_area001">
                  <div class="container">
                    <div class="row">
                      <div class="col-md-12 col-sm-12 col-xs-12">
                        ${sanitizedDescription}
                      </div>
                    </div>
                    ${!detailPage?.hide_vertical_tab && detailPage?.vertical_tabs?.length ? `
                    <h3 id="${slugify(detailPage.vertical_title || '', { lower: true })}-section">${detailPage.vertical_title}</h3>
                    <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>
                    <div class="row" data-aos="fade-in">
                      <div class="col-md-12 col-sm-12 col-xs-12">
                        <div id="verticalTab">
                          <ul class="resp-tabs-list">
                            ${detailPage.vertical_tabs.map(tab => `<li>${tab.heading}</li>`).join('')}
                          </ul>
                          <div class="resp-tabs-container">
                            ${detailPage.vertical_tabs.map(tab => `
                              <div>
                                <h4>${tab.sub_heading}</h4>
                                <p>${tab.summary}</p>
                                <ul class="row list-default">
                                  ${(tab.bullets || []).map(bullet => `<li class="col col-md-6 col-12">${bullet.bullet}</li>`).join('')}
                                </ul>
                              </div>`).join('')}
                          </div>
                        </div>
                      </div>
                    </div>` : ''}
                    ${!detailPage?.hide_horizontal_tab && detailPage?.horizontal_tabs?.length ? `
                    <h3 id="${slugify(detailPage.horizontal_title || '', { lower: true })}-section">${detailPage.horizontal_title}</h3>
                    <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>
                    <div class="row">
                      <div class="col-md-12 col-sm-12 col-xs-12" data-aos="fade-in">
                        <div id="horizontalTab">
                          <ul class="resp-tabs-list">
                            ${detailPage.horizontal_tabs.map(tab => `<li>${tab.heading}</li>`).join('')}
                          </ul>
                          <div class="resp-tabs-container">
                            ${detailPage.horizontal_tabs.map(tab => `
                              <div>
                                <p>${tab.summary}</p>
                                <ul class="row list-default">
                                  ${(tab.bullets || []).map(bullet => `<li class="col col-md-6 col-12">${bullet.bullet}</li>`).join('')}
                                </ul>
                              </div>`).join('')}
                          </div>
                        </div>
                      </div>
                    </div>` : ''}
                    ${!detailPage?.hide_table && detailPage?.tables?.length && detailPage?.get_data?.length ? `
                    <h3 id="${slugify(detailPage.table_title || '', { lower: true })}-section">${detailPage.table_title}</h3>
                    <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>
                    <div class="row" data-aos="fade-up">
                      <div class="col-md-12 col-sm-12 col-xs-12">
                        <table>
                          <thead>
                            <tr>
                              ${detailPage.tables.map(th => `<th>${th.heading}</th>`).join('')}
                            </tr>
                          </thead>
                          <tbody>
                            ${detailPage.get_data.map(row => `
                              <tr>
                                ${row.map(data => `<td>${data}</td>`).join('')}
                              </tr>`).join('')}
                          </tbody>
                        </table>
                      </div>
                    </div>` : ''}
                    ${!detailPage?.hide_bullets && detailPage?.bullet_points?.length ? `
                    <h3 id="${slugify(detailPage.bullet_title || '', { lower: true })}-section">${detailPage.bullet_title}</h3>
                    <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>
                    <ul class="row list-default" data-aos="fade-up">
                      ${detailPage.bullet_points.map(bullet => `<li class="col col-md-6 col-12">${bullet.bullet_point}</li>`).join('')}
                    </ul>` : ''}
                    ${!detailPage?.hide_tags && detailPage?.tags?.length ? `
                    <h3 id="${slugify(detailPage.tag_title || '', { lower: true })}-section">${detailPage.tag_title}</h3>
                    <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>
                    <div class="row" data-aos="fade-up">
                      <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="tags_cloud">
                          ${detailPage.tags.map(tag => `<a href="#" title="${tag.tag}">${tag.tag}</a>`).join('')}
                        </div>
                      </div>
                    </div>` : ''}
                  </div>
                </section>`
    }    

    const formatMonthAndYear = (input) => { 
      if (!monthAndYear || !input) return;

      const [year, month] = input?.split('/').map(Number);
        const date = new Date(year, month - 1); // month is 0-indexed
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    let structuredData = [];

    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const priceValidUntil = sixMonthsLater.toISOString().split("T")[0];

    if (monthAndYear) {
          structuredData.push(JSON.stringify(
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
                  "name": `Archives of ${formatMonthAndYear(monthAndYear)}`,
                  "item": `https://bzindia.in/${monthAndYear}`
                },       
              ]
            },
            
          ))
      } else {          
          if (!isRegistrationTypePage 
          && !isRegistrationSubTypePage 
          && !isCourseProgramPage 
          && !isCourseSpecializationPage 
          && !isServiceCategoryPage 
          && !isServiceSubCategoryPage
          && !isProductCategoryPage 
          && !isProductSubCategoryPage) {

          structuredData.push(JSON.stringify(
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": (replacedMultipage?.faqs || detailPage?.faqs)?.map((faq) => ({
                "@type": "Question",
                "name": faq?.question || "",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq?.answer || ""
                }
                })) || []
            },
            
            ))
          }          

        if (isMultipage) {
          structuredData.push(JSON.stringify(
              {
                  "@context": "http://schema.org",
                  "@type": "ItemList",
                  "name": "Table of Contents",
                  "numberOfItems": replacedMultipage?.toc?.length,
                  "itemListElement": replacedMultipage?.toc?.map((title, index) => ({
                    "@type": "ListItem",
                    "position": index+1,
                    "item": {
                        "@type": "CreativeWork",
                        "name": title || "",
                        "url": `https://bzindia.in/${multipageUrl}#${slugify(title || '', { lower: true })}-section`
                    }
                    }) || [])
                },
                
              ),

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
                    "name": currentCompany?.sub_type || "",
                    "item": `https://bzindia.in/${currentCompany?.slug}/`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": replacedMultipage?.title,
                    "item": `https://bzindia.in/${multipageUrl}`
                  },       
                ]
              },
              
            ),  

            JSON.stringify({
              "@context": "http://schema.org",
              "@type": "LocalBusiness",
              "name": currentCompany?.sub_type || "",
              "url": `https://bzindia.in/${currentCompany?.slug}`,
              "logo": currentCompany?.logo_url || "",
              "telephone": currentCompany&&currentCompany.phone1 ? `+91${currentCompany.phone1}` : "" ,
              "address": {
                  "@type": "PostalAddress",
                  "streetAddress": fetchedPlace?.name || currentCompany?.name || "",
                  "addressLocality": fetchedPlace?.district_name || fetchedDistrict?.name || fetchedState?.name || "",
                  "addressRegion": fetchedPlace?.state_name || fetchedDistrict?.state_name || fetchedState?.name || "",
                  "postalCode": fetchedPlace?.pincode || fetchedDistrict?.pincode || fetchedState?.pincode || "",
                  "addressCountry": "IN"
              },
              "sameAs": [
                "https://www.facebook.com/BZindia/",
                "https://twitter.com/Bzindia_in",
                "https://www.linkedin.com/company/bzindia",
                "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
            ],
              "contactPoint": [
                currentCompany?.phone1 ? {
                  "@type": "ContactPoint",
                  "telephone": currentCompany?.phone1 ? `+91${currentCompany.phone1}` : "" ,
                  "contactType": "Contact Number 1",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
                currentCompany?.phone2 ? {
                  "@type": "ContactPoint",
                  "telephone": currentCompany?.phone2 ? `+91${currentCompany.phone2}` : "" ,
                  "contactType": "Contact Number 2",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
                currentCompany?.whatsapp ? {
                  "@type": "ContactPoint",
                  "telephone": currentCompany?.whatsapp ? `+91${currentCompany.whatsapp}` : "" ,
                  "contactType": "Whatsapp Number",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
              ].filter(Boolean)
            }, ))

          if (["Registration", "Service", "Education"].includes(currentCompany.company_type)) {
              structuredData.push(JSON.stringify(
                  {
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      "name": currentCompany?.sub_type || "",
                      "description": currentCompany?.meta_description || "",
                      "logo": currentCompany?.logo_url || "",
                      "url": `https://bzindia.in/${currentCompany?.slug}`,
                      "memberOf": clients?.map((client) => (
                          {
                              "@type": "Organization",
                              "name": client.name
                          }
                      )) || [],
                      "hasOfferCatalog": {
                          "@type": "OfferCatalog",
                          "name": "Clients",
                          "itemListElement": clients?.map((client, index) => (
                              {
                                  "@type": "ListItem",
                                  "position": index+1,
                                  "item": {
                                      "@type": "Organization",
                                      "name": client?.name || "",
                                      "url": client?.url || "",
                                      "logo": client?.image_url || ""
                                  }
                              }
                          )) || [],
                      },
                  },
                  
              ))          
          }        

          if (currentCompany.company_type === "Registration") {
            structuredData.push(JSON.stringify(
                  {
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": currentCompany?.sub_type || "",
                    "description": currentCompany?.meta_description || "",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": fetchedPlace?.name || currentCompany?.name || "",
                      "addressLocality": fetchedPlace?.district_name || fetchedDistrict?.name || fetchedState?.name || "",
                      "addressRegion": fetchedPlace?.state_name || fetchedDistrict?.state_name || fetchedState?.name || "",
                      "postalCode": fetchedPlace?.pincode || fetchedDistrict?.pincode || fetchedState?.pincode || "",
                      "addressCountry": "IN"
                    },
                    "telephone": currentCompany?.phone1 ? `+91${currentCompany.phone1}` : "" ,
                    "priceRange": currentCompany?.price_range || "",
                    "openingHoursSpecification": [
                      {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday"
                        ],
                        "opens": "09:00",
                        "closes": "18:00"
                      },
                      {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": "Sunday",
                        "closes": "closed"
                      }
                    ],
                    "image": currentCompany?.logo_url || "",
                    "url": `https://bzindia.in/${currentCompany?.slug}/`,
                    "sameAs": [
                "https://www.facebook.com/BZindia/",
                "https://twitter.com/Bzindia_in",
                "https://www.linkedin.com/company/bzindia",
                "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
            ],
                    "serviceArea": {
                      "@type": "GeoCircle",
                      "geoMidpoint": {
                        "@type": "GeoCoordinates",
                        "latitude": fetchedPlace?.latitude || fetchedDistrict?.latitude || fetchedState?.latitude || "",
                        "longitude": fetchedPlace?.longitude || fetchedDistrict?.longitude || fetchedState?.longitude || ""
                      },
                      "geoRadius": "500", // Approximately 500 km radius to cover a large area in India
                      "description": currentCompany?.meta_description || ""
                    },
                    "hasOfferCatalog": {
                      "@type": "OfferCatalog",
                      "name": "Services Offered",
                      "itemListElement": {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": replacedMultipage?.title || "",
                          "description": replacedMultipage?.meta_description || "",
                          "url": `https://bzindia.in/${multipageUrl || ""}`
                        },
                        "price": replacedMultipage?.price || "", // Price in Indian Rupees for the service
                        "priceCurrency": "INR"                 
                      }
                    }
                  },
                
                ),
      
              JSON.stringify(
                    {
                "@context": "https://schema.org",
                "@type": "GovernmentService",
                "name": replacedMultipage?.title,
                "description": replacedMultipage?.meta_description || "",
                "provider": {
                    "@type": "GovernmentOrganization",
                    "name": currentCompany?.sub_type || "",
                    "url": `https://bzindia.in/${currentCompany?.slug}`
                },
                "serviceType": "Registration",
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": "India"
                },
                "url": `https://bzindia.in/${multipageUrl}`,
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Registration Fees",
                    "itemListElement": [
                    {
                        "@type": "Offer",
                        "name": "Consulting Fee",
                        "description": "Fee for consulting services provided by the government registration service",
                        "price": replacedMultipage?.price || "",
                        "priceCurrency": "INR",
                        "url": `https://bzindia.in/${multipageUrl}`
                    },                    
                    ]
                }
                },
                    
                ),                                              
      
            JSON.stringify({
              "@context": "http://schema.org",
              "@type": "LocalBusiness",
              "name": currentCompany?.sub_type || "",
              "url": `https://bzindia.in/${currentCompany?.slug}`,
              "logo": currentCompany?.logo_url || "",
              "telephone": currentCompany&&currentCompany.phone1 ? `+91${currentCompany.phone1}` : "" ,
              "address": {
                  "@type": "PostalAddress",
                  "streetAddress": fetchedPlace?.name || currentCompany?.name || "",
                  "addressLocality": fetchedPlace?.district_name || fetchedDistrict?.name || fetchedState?.name || "",
                  "addressRegion": fetchedPlace?.state_name || fetchedDistrict?.state_name || fetchedState?.name || "",
                  "postalCode": fetchedPlace?.pincode || fetchedDistrict?.pincode || fetchedState?.pincode || "",
                  "addressCountry": "IN"
              },
              "sameAs": [
                "https://www.facebook.com/BZindia/",
                "https://twitter.com/Bzindia_in",
                "https://www.linkedin.com/company/bzindia",
                "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
            ],
              "contactPoint": [
                currentCompany?.phone1 ? {
                  "@type": "ContactPoint",
                  "telephone": currentCompany?.phone1 ? `+91${currentCompany.phone1}` : "" ,
                  "contactType": "Contact Number 1",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
                currentCompany?.phone2 ? {
                  "@type": "ContactPoint",
                  "telephone": currentCompany?.phone2 ? `+91${currentCompany.phone2}` : "" ,
                  "contactType": "Contact Number 2",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
                currentCompany?.whatsapp ? {
                  "@type": "ContactPoint",
                  "telephone": currentCompany?.whatsapp ? `+91${currentCompany.whatsapp}` : "" ,
                  "contactType": "Whatsapp Number",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
              ].filter(Boolean)
            }, ))

           } else if (currentCompany.company_type === "Education") {
              structuredData.push(JSON.stringify(
                  {
                  "@context": "https://schema.org",
                  "@type": "Course",
                  "name": replacedMultipage?.title,
                  "description": replacedMultipage?.meta_description || "",
                  "provider": {
                      "@type": "Organization",
                      "name": currentCompany?.sub_type || ""
                  },
                  "hasCourseInstance": {
                      "@type": "CourseInstance",
                      "courseMode": [replacedMultipage?.mode || "Online"],
                      "startDate": replacedMultipage?.starting_date ? replacedMultipage?.starting_date.split('T')[0] : "",
                      "endDate": replacedMultipage?.ending_date ? replacedMultipage?.ending_date.split('T')[0] : "",
                      "courseWorkload": replacedMultipage?.duration?"P"+replacedMultipage?.duration+"D": "",
                      "location": {
                      "@type": "VirtualLocation",
                      "url": `https://bzindia.in/${multipageUrl}`
                      }
                  },
                  "offers": {
                      "@type": "Offer",
                      "price": replacedMultipage?.price || "",
                      "priceCurrency": "INR",
                      "category": replacedMultipage?.program_name || "",
                      "availability": "http://schema.org/InStock"
                  },
                  "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": replacedMultipage?.rating || "",
                      "bestRating": 5,
                      "ratingCount": replacedMultipage?.rating_count || ""
                  },
                  "image": replacedMultipage?.image_url || "",
                  "url":  `https://bzindia.in/${multipageUrl}`,
                  "inLanguage": "English"   
                  },
                  
              ),             

              JSON.stringify(
                  {
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": currentCompany?.meta_title || currentCompany?.name || "",
                    "description": currentCompany?.meta_description || "",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": fetchedPlace?.name || currentCompany?.name || "",
                      "addressLocality": fetchedPlace?.district_name || fetchedDistrict?.name || fetchedState?.name || "",
                      "addressRegion": fetchedPlace?.state_name || fetchedDistrict?.state_name || fetchedState?.name || "",
                      "postalCode": fetchedPlace?.pincode || fetchedDistrict?.pincode || fetchedState?.pincode || "",
                      "addressCountry": "IN"
                    },
                    "telephone": currentCompany?.phone1 ? `+91${currentCompany.phone1}` : "" ,
                    "priceRange": currentCompany?.price_range || "",
                    "openingHoursSpecification": [
                      {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday"
                        ],
                        "opens": "09:00",
                        "closes": "18:00"
                      },
                      {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": "Sunday",
                        "closes": "closed"
                      }
                    ],
                    "image": currentCompany?.logo_url || "",
                    "url": `https://bzindia.in/${currentCompany?.slug}/`,
                    "sameAs": [
                "https://www.facebook.com/BZindia/",
                "https://twitter.com/Bzindia_in",
                "https://www.linkedin.com/company/bzindia",
                "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
            ],
                    "serviceArea": {
                      "@type": "GeoCircle",
                      "geoMidpoint": {
                        "@type": "GeoCoordinates",
                        "latitude": fetchedPlace?.latitude || fetchedDistrict?.latitude || fetchedState?.latitude || "",
                        "longitude": fetchedPlace?.longitude || fetchedDistrict?.longitude || fetchedState?.longitude || ""
                      },
                      "geoRadius": "500", // Approximately 500 km radius to cover a large area in India
                      "description": currentCompany?.meta_description || ""
                    },
                    "hasOfferCatalog": {
                      "@type": "OfferCatalog",
                      "name": "Services Offered",
                      "itemListElement": {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": replacedMultipage?.meta_title || replacedMultipage?.title || "",
                          "description": replacedMultipage?.meta_description || "",
                          "url": `https://bzindia.in/${multipageUrl}`
                        },
                        "price": replacedMultipage?.price || "", // Price in Indian Rupees for the service
                        "priceCurrency": "INR" // Indian Rupee
                      }
                    }
                  },
                
                ))
          
            } else if (currentCompany.company_type === "Service") {
              structuredData.push(JSON.stringify(
                  {
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": currentCompany?.meta_title || currentCompany?.name || "",
                    "description": currentCompany?.meta_description || "",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": fetchedPlace?.name || currentCompany?.name || "",
                      "addressLocality": fetchedPlace?.district_name || fetchedDistrict?.name || fetchedState?.name || "",
                      "addressRegion": fetchedPlace?.state_name || fetchedDistrict?.state_name || fetchedState?.name || "",
                      "postalCode": fetchedPlace?.pincode || fetchedDistrict?.pincode || fetchedState?.pincode || "",
                      "addressCountry": "IN"
                    },
                    "telephone": currentCompany?.phone1 ? `+91${currentCompany.phone1}` : "" ,
                    "priceRange": currentCompany?.price_range || "",
                    "openingHoursSpecification": [
                      {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday"
                        ],
                        "opens": "09:00",
                        "closes": "18:00"
                      },
                      {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": "Sunday",
                        "closes": "closed"
                      }
                    ],
                    "image": currentCompany?.logo_url || "",
                    "url": `https://bzindia.in/${currentCompany?.slug}/`,
                    "sameAs": [
                "https://www.facebook.com/BZindia/",
                "https://twitter.com/Bzindia_in",
                "https://www.linkedin.com/company/bzindia",
                "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
            ],
                    "serviceArea": {
                      "@type": "GeoCircle",
                      "geoMidpoint": {
                          "@type": "GeoCoordinates",
                          "latitude": fetchedPlace?.latitude || fetchedDistrict?.latitude || fetchedState?.latitude || "",
                          "longitude": fetchedPlace?.longitude || fetchedDistrict?.longitude || fetchedState?.longitude || ""
                      },
                      "geoRadius": "500", // Approximately 500 km radius to cover a large area in India
                      "description": currentCompany?.meta_description || ""
                    },
                    "hasOfferCatalog": {
                      "@type": "OfferCatalog",
                      "name": "Services Offered",
                      "itemListElement": {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": replacedMultipage?.meta_title || replacedMultipage?.title || "",
                          "description": replacedMultipage?.meta_description || "",
                          "url": `https://bzindia.in/${multipageUrl}`
                        },
                        "price": replacedMultipage?.price || "", // Price in Indian Rupees for the service
                        "priceCurrency": "INR" // Indian Rupee                  
                      }
                    }
                  },
                
                ))
              
            } else if (currentCompany.company_type === "Product") {
              structuredData.push(JSON.stringify({
                    "@context": "http://schema.org",
                    "@graph": replacedMultipage?.products?.map(product => ({
                    "@type": "Product",
                    "name": product.meta_title || product.name || "",
                    "image": product.image_url || "",
                    "description": product.meta_description || product.description || "",
                    "category": {
                        "@type": "Thing",
                        "name": product.category_name || "",
                        "url": `https://bzindia/${currentCompany?.slug}/products/`
                    },
                    "brand": {
                        "@type": "Brand",
                        "name": product.brand_name || ""
                    },
                    "sku": product.sku || "",
                    "mpn": "",
                    "manufacturer": {
                        "@type": "Organization",
                        "name": currentCompany?.sub_type || "",
                        "url": `https://bzindia.in/${currentCompany?.slug}`
                    },
                    "offers": {
                        "@type": "Offer",
                        "url": `https://bzindia.in/${multipageUrl}`,
                        "priceCurrency": "INR",
                        "price": product.price || "",
                        "itemCondition": "https://schema.org/NewCondition",
                        "availability": "https://schema.org/InStock",
                        "seller": {
                        "@type": "LocalBusiness",
                        "name": currentCompany?.meta_title || currentCompany?.name || "",
                        "telephone": currentCompany?.phone1 || "",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": fetchedPlace?.name || currentCompany?.name || "",
                            "addressLocality": fetchedPlace?.district_name || fetchedDistrict?.name || fetchedState?.name || "",
                            "addressRegion": fetchedPlace?.state_name || fetchedDistrict?.state_name || fetchedState?.name || "",
                            "postalCode": fetchedPlace?.pincode || fetchedDistrict?.pincode || fetchedState?.pincode || "",
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": fetchedPlace?.latitude || fetchedDistrict?.latitude || fetchedState?.latitude || "",
                            "longitude": fetchedPlace?.longitude || fetchedDistrict?.latitude || ""
                        }
                        }
                    }
                    })) || []
                }, ),

                JSON.stringify(
                  {
                    "@context": "https://schema.org",
                    "@type": "ReturnPolicy",
                    "url": "https://bzindia.in/cancellation-refund-policy",
                    "merchantReturnDays": "7",
                    "returnFees": "FreeReturn",
                    "returnMethod": "ReturnByMail",
                    "returnPolicyCategory": "MerchantReturnFiniteReturnWindow",
                    "applicableCountry": "IN"
                  }
                )
              
              )
              

              }

                
          } else if (isDetailpage) {          
            structuredData.push(JSON.stringify({
              "@context": "http://schema.org",
              "@type": "LocalBusiness",
              "name": currentCompany?.sub_type || "",
              "url": `https://bzindia.in/${currentCompany?.slug}`,
              "logo": currentCompany?.logo_url || "",
              "telephone": currentCompany?.phone1 ? `+91${currentCompany.phone1}` : "",
              "address": {
                  "@type": "PostalAddress",
                  "streetAddress": currentCompany?.place_name || currentCompany?.name,
                  "addressLocality": currentCompany?.district_name,
                  "addressRegion": currentCompany?.state_name,
                  "postalCode": currentCompany?.pincode,
                  "addressCountry": "IN"
                },
              "sameAs": [
                "https://www.facebook.com/BZindia/",
                "https://twitter.com/Bzindia_in",
                "https://www.linkedin.com/company/bzindia",
                "https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1"
            ],
              "contactPoint": [
                currentCompany?.phone1 ? {
                  "@type": "ContactPoint",
                  "telephone": "+91" + currentCompany.phone1,
                  "contactType": "Contact Number 1",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
                currentCompany?.phone2 ? {
                  "@type": "ContactPoint",
                  "telephone": "+91" + currentCompany.phone2,
                  "contactType": "Contact Number 2",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
                currentCompany?.whatsapp ? {
                  "@type": "ContactPoint",
                  "telephone": "+91" + currentCompany.whatsapp,
                  "contactType": "Whatsapp Number",
                  "contactOption": "Toll",
                  "areaServed": "IN"
                } : null,
              ].filter(Boolean)
            }, ),

          JSON.stringify(
              {
                "@context": "http://schema.org",
                "@type": "ItemList",
                "name": "Table of Contents",
                "numberOfItems": detailPage?.toc?.length || "",
                "itemListElement": detailPage?.toc.map((title, index) => ({
                  "@type": "ListItem",
                  "position": index+1,
                  "item": {
                    "@type": "CreativeWork",
                    "name": title || "",
                    "url": company ? `https://bzindia.in/${detailPageUrl || ""}#${slugify(title || "", { lower: true })}-section`: ""
                  }
                }))
              },
              
            ),

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
                    "name": currentCompany?.sub_type || "",
                    "item": `https://bzindia.in/${currentCompany?.slug}/`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": detailPage?.program_name || detailPage?.category_name || detailPage?.category_name || detailPage?.type_name || "",
                    "item": `https://bzindia.in/${currentCompany?.slug}/${detailPage?.program_slug || detailPage?.category_slug || detailPage?.category_slug || detailPage?.type_slug || ""}/`
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": detailPage?.specialization_name || detailPage?.sub_category_name || detailPage?.sub_category_name || detailPage?.sub_type_name || "",
                    "item": `https://bzindia.in/${currentCompany?.slug}/${detailPage?.program_slug || detailPage?.category_slug || detailPage?.category_slug || detailPage?.type_slug || ""}/${detailPage?.specialization_slug || detailPage?.sub_category_slug || detailPage?.sub_category_slug || detailPage?.sub_type_slug || ""}/`
                  },
                  {
                    "@type": "ListItem",
                    "position": 5,
                    "name": detailPage?.name || detailPage?.name || detailPage?.name || detailPage?.title || "",
                    "item": `https://bzindia.in/${detailPageUrl || ""}`
                  },       
                ]
              },
              
            ))   

          if (currentCompany?.company_type === "Education") { 
              structuredData.push(JSON.stringify([
                    {
                    "@context": "http://schema.org",
                    "@type": "ItemList",
                    "name": "Client Testimonials",
                    "itemListElement": (detailPage?.testimonials?.length > 0 ? detailPage?.testimonials : detailPage?.fallback_testimonials || [])?.map((testimonial, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                        "@type": "Review",
                        "itemReviewed": {
                            "@type": "Course",
                            "name": testimonial?.course_name || "",
                            "description": testimonial?.course_meta_description || `Description of ${testimonial?.course_name}`,
                            "location": {
                              "@type": "Place",
                              "name": testimonial?.place_name || ""
                              },
                        },
                        "reviewRating": {
                            "@type": "Rating",
                            "ratingValue": testimonial?.rating || ""
                        },
                        "author": {
                            "@type": "Person",
                            "name": testimonial?.name || ""
                        },
                        "reviewBody": testimonial?.text || "",
                        "image": testimonial?.image_url || ""
                        }
                    })) || [],
                    "numberOfItems": Number((detailPage?.testimonials?.length > 0 ? detailPage?.testimonials : detailPage?.fallback_testimonials || [])?.length)
                    },
                    detailPage?.testimonials?.length > 0 ?
                   {
                    "@context": "http://schema.org",
                    "@type": "AggregateRating",
                    "itemReviewed": {
                      "@type": "Course",
                      "name": detailPage?.name || "",
                      "description": detailPage?.meta_description || `Description of ${detailPage?.name}`,                      
                    },
                    "ratingValue": Number(detailPage?.rating),
                    "reviewCount": Number(detailPage?.testimonials?.length)
                  } : null
                ].filter(Boolean), ),

                JSON.stringify(
                  {
                  "@context": "https://schema.org",
                    "@type": "Course",
                    "name": detailPage?.meta_title || detailPage?.name || "",
                    "description": detailPage?.meta_description || "",
                    "provider": {
                      "@type": "Organization",
                      "name": currentCompany?.meta_title || currentCompany?.name || ""
                    },
                    "hasCourseInstance": {
                      "@type": "CourseInstance",
                      "courseMode": [detailPage?.mode || "Online"],
                      "startDate": detailPage?.starting_date ? detailPage?.starting_date.split('T')[0] : "",
                      "endDate": detailPage?.ending_date ? detailPage?.ending_date.split('T')[0] : "",
                      "courseWorkload": detailPage?.duration?"P"+detailPage?.duration+"D": "",
                      "location": {
                        "@type": "VirtualLocation",
                        "url": `https://bzindia.in/${detailPageUrl}`
                      }
                    },
                    "offers": {
                      "@type": "Offer",
                      "price": detailPage?.price || "",
                      "priceCurrency": "INR",
                      "category": detailPage?.program_name || "",
                      "availability": "http://schema.org/InStock"
                    },
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": detailPage?.rating || "",
                      "bestRating": 5,
                      "ratingCount": detailPage?.rating_count || ""
                    },
                    "image": detailPage?.image_url || "",
                    "url":  `https://bzindia.in/${detailPageUrl}`,
                    "inLanguage": "English"   
                  },
                  
                ),

              JSON.stringify(
                  {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": detailPage?.meta_title || detailPage?.name || "",
                    "description": detailPage?.meta_description || "",
                    "keywords": `${detailPage?.meta_tags?.map(metaTag => metaTag?.name) || ""}`,
                    "image": [detailPage?.image_url || ""],
                    "datePublished": detailPage?.published || "",              
                    "dateModified": detailPage?.modified || "",
                    "author": {
                      "@type": "Organization",
                      "name": currentCompany?.sub_type || "",
                      "url": `https://bzindia.in/${currentCompany?.slug}`
                    },
                    "articleBody": articleBody? articleBody : ""
                  },
                  
                ))

            } else if (currentCompany?.company_type === "Service") {
                structuredData.push(JSON.stringify({
                      "@type": "Service",
                      "name": detailPage?.meta_title || detailPage?.meta_title || detailPage?.name || "",
                      "serviceType": detailPage?.sub_category_name || "",
                      "provider": {
                          "@type": "Organization",
                          "name": currentCompany?.sub_type || "",
                          "url": `https://bzindia.in/${currentCompany?.slug}`
                      },
                      "offers": {
                          "@type": "Offer",
                          "price": detailPage?.price || "",
                          "priceCurrency": "INR",
                          "url": `https://bzindia.in/${detailPageUrl}`,
                          "category": detailPage?.category_name || ""
                      },
                      "description": detailPage?.meta_description || "",
                      "image": detailPage?.image_url || "",
                      "areaServed": {
                          "@type": "Place",
                          "name": "India"
                      }                    
                      },
                      
                  ),

                  JSON.stringify(
                      {
                      "@context": "https://schema.org",
                      "@type": "Article",
                      "headline": detailPage?.name || "",
                      "description": detailPage?.summary || "",
                      "keywords": `${detailPage?.meta_tags?.map(metaTag => metaTag?.name) || ""}`,
                      "image": [detailPage?.image_url || ""],
                      "datePublished": detailPage?.published || "",              
                      "dateModified": detailPage?.modified || "",
                      "author": {
                          "@type": "Organization",
                          "name": currentCompany?.sub_type || "",
                          "url": `https://bzindia.in/${currentCompany?.slug}`
                      },
                      "articleBody": articleBody? articleBody : ""
                      },
                      
                  ))
          
            } else if (currentCompany?.company_type === "Registration") {
              structuredData.push(JSON.stringify(
                    {
                "@context": "https://schema.org",
                "@type": "GovernmentService",
                "name": detailPage?.title || "",
                "description": detailPage?.meta_description || "",
                "provider": {
                    "@type": "GovernmentOrganization",
                    "name": currentCompany?.meta_title || currentCompany?.name || "",
                    "url": `https://bzindia.in/${currentCompany?.slug}`
                },
                "serviceType": "Registration",
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": "India"
                },
                "url": `https://bzindia.in/${detailPageUrl}`,
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Registration Fees",
                    "itemListElement": [
                    {
                        "@type": "Offer",
                        "name": "Consulting Fee",
                        "description": "Fee for consulting services provided by the government registration service",
                        "price": detailPage?.price || "",
                        "priceCurrency": "INR",
                        "url": `https://bzindia.in/${detailPageUrl}`
                    },                    
                    ]
                }
                },
                    
                ),

                JSON.stringify(
                    {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": detailPage?.meta_title || detailPage?.title || "",
                    "description": detailPage?.meta_description || "",
                    "keywords": `${detailPage?.meta_tags?.map(metaTag => metaTag?.name) || ""}`,
                    "image": [detailPage?.image_url || ""],
                    "datePublished": detailPage?.published || "",              
                    "dateModified": detailPage?.modified || "",
                    "author": {
                        "@type": "Organization",
                        "name": currentCompany?.sub_type || "",
                        "url": `https://bzindia.in/${currentCompany?.slug}`
                    },
                    "articleBody": articleBody? articleBody : ""
                    },
                    
                ))

              } else if (currentCompany?.company_type === "Product") {
                structuredData.push(JSON.stringify(
                  {
                    "@context": "http://schema.org",
                    "@type": "Product",
                    "name": detailPage?.meta_title || detailPage?.meta_title || detailPage?.name || "",
                    "category": detailPage?.category_name || "",
                    "image": [
                      detailPage?.image_url || ""
                    ],
                    "description": detailPage?.meta_description || detailPage?.meta_description || "",
                    "sku": detailPage?.sku || "",
                    "brand": {
                      "@type": "Brand",
                      "name": detailPage?.brand_name || ""
                    },
                    "offers": {
                      "@type": "Offer",
                      "priceCurrency": "INR",
                      "availability": "http://schema.org/InStock",
                      "url": `https://bzindia.in/${detailPageUrl || ""}`,
                      "priceValidUntil": priceValidUntil,
                      "seller": {
                        "@type": "Organization",
                        "name": currentCompany?.name || ""
                      },
                      "itemCondition": "http://schema.org/NewCondition",
                      "eligibleRegion": {
                        "@type": "Country",
                        "name": "IN"
                      },
                      "price": detailPage?.price || "", // Offer price in INR
                    
                    "hasMerchantReturnPolicy": {
                              "@type": "MerchantReturnPolicy",
                              "name": "Return Policy",
                              "description": "No cancellations & Refunds are entertained. Please visit our return policy page for more details.",
                              "url": "https://bzindia.in/cancellation-refund-policy/",
                              "applicableCountry": "IN",
                              "returnPolicyCategory": "https://schema.org/NoRefundsReturnPolicy"
                            },
                      "shippingDetails": {
                        "@type": "OfferShippingDetails",
                        "shippingRate": {
                          "@type": "MonetaryAmount",
                          "value": 50.00,
                          "currency": "INR"
                        }
                      }
                    },
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": Number(detailPage?.rating),
                      "reviewCount": Number(detailPage?.rating_count)
                    },
                    "review": detailPage?.reviews?.map(review => ({
                        "@type": "Review",
                        "author": {
                          "@type": "Person",
                          "name": review.review_by|| review.name || ""
                        },
                        "datePublished": review.created || "",
                        "reviewBody": review.text || "",
                        "reviewRating": {
                          "@type": "Rating",
                          "ratingValue": Number(review.rating)
                        }
                      })) || [],                                                      
                    "additionalProperty": detailPage?.extra?.map(item => ({
                        "@type": "PropertyValue",
                        "name": item.name || "",
                        "value": item.value || ""
                      })) || [],                                 
                    "mainEntityOfPage": {
                      "@type": "WebPage",
                      "@id": `https://bzindia.in/${detailPageUrl || ""}`
                    }
                  },
                  
                ),

                JSON.stringify(
                  {
                    "@context": "https://schema.org",
                    "@type": "ReturnPolicy",
                    "url": "https://bzindia.in/cancellation-refund-policy",
                    "merchantReturnDays": "7",
                    "returnFees": "FreeReturn",
                    "returnMethod": "ReturnByMail",
                    "returnPolicyCategory": "MerchantReturnFiniteReturnWindow",
                    "applicableCountry": "IN"
                  }
                ),

                JSON.stringify([
                  {
                    "@context": "http://schema.org",
                    "@type": "ItemList",
                    "name": "Client Testimonials",
                    "itemListElement": (detailPage?.reviews || []).map((review, index) => ({
                      "@type": "ListItem",
                      "position": index + 1,
                      "item": {
                        "@type": "Review",
                        "itemReviewed": {
                          "@type": "Organization",
                          "name": review.review_by || review.name || "",
                          "location": {
                            "@type": "Place",
                            "name": ""
                          }
                        },
                        "reviewRating": {
                          "@type": "Rating",
                          "ratingValue": review.rating || ""
                        },
                        "author": {
                          "@type": "Person",
                          "name": review.review_by || review.name || ""
                        },
                        "reviewBody": review.text || "",
                        "image": review.image_url || ""
                      }
                    })),
                    "numberOfItems": detailPage?.reviews?.length || ""
                  },
                  {
                    "@context": "http://schema.org",
                    "@type": "AggregateRating",
                    "ratingValue": parseInt(detailPage?.rating || ""),
                    "reviewCount": detailPage?.rating_count || ""
                  }
                ], ),

                JSON.stringify(
                    {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": detailPage?.meta_title || detailPage?.meta_title || detailPage?.name || "",
                    "description": detailPage?.meta_description || "",
                    "keywords": `${detailPage?.meta_tags?.map(metaTag => metaTag?.name) || ""}`,
                    "image": [detailPage?.image_url || ""],
                    "datePublished": detailPage?.created || "",              
                    "dateModified": detailPage?.updated || "",
                    "author": {
                        "@type": "Organization",
                        "name": currentCompany?.sub_type || "",
                        "url": `https://bzindia.in/${currentCompany?.slug}`
                    },
                    "articleBody": articleBody? articleBody : ""
                    },
                    
                ))

          }

      
          } else if (isRegistrationTypePage 
          || isRegistrationSubTypePage 
          || isCourseProgramPage 
          || isCourseSpecializationPage 
          || isServiceCategoryPage 
          || isServiceSubCategoryPage
          || isProductCategoryPage 
          || isProductSubCategoryPage) {
            structuredData.push(JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `Search results for '${
                  isRegistrationSubTypePage? subTypeSlug 
                  :isRegistrationTypePage? typeSlug 
                  :isCourseProgramPage? programSlug
                  :isCourseSpecializationPage? specializationSlug 
                  :isServiceCategoryPage? categorySlug
                  :isServiceSubCategoryPage? subCategorySlug  
                  :isProductCategoryPage? categorySlug
                  :isProductSubCategoryPage? subCategorySlug  
                  : ""}'`,
                "url": `https://bzindia.in/?q=${
                  isRegistrationSubTypePage? subTypeSlug 
                  :isRegistrationTypePage? typeSlug 
                  :isCourseProgramPage? programSlug 
                  :isCourseSpecializationPage? specializationSlug 
                  :isServiceCategoryPage? categorySlug
                  :isServiceSubCategoryPage? subCategorySlug
                  :isProductCategoryPage? categorySlug
                  :isProductSubCategoryPage? subCategorySlug
                  : ""}`,
                "numberOfItems": (
                  (isRegistrationSubTypePage || isCourseSpecializationPage || isServiceSubCategoryPage || isProductSubCategoryPage) ? details 
                  :isRegistrationTypePage? subTypes 
                  :isCourseProgramPage? specializations 
                  :isServiceCategoryPage? subCategories 
                  :isProductCategoryPage? subCategories                   
                  : "")?.length || "",
                "itemListElement": (
                  (isRegistrationSubTypePage || isCourseSpecializationPage || isServiceSubCategoryPage || isProductSubCategoryPage) ? details 
                  :isRegistrationTypePage? subTypes 
                  :isCourseProgramPage? specializations 
                  :isServiceCategoryPage? subCategories 
                  :isProductCategoryPage? subCategories 
                  : "")?.map((item, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "name": item.title || item.course?.name || item.service?.name || item.product?.name || item.name || "",
                  "url": `https://bzindia.in/${slug}/${
                    (isRegistrationSubTypePage || isRegistrationTypePage)? typeSlug 
                    :(isCourseProgramPage || isCourseSpecializationPage)? programSlug
                    :(isServiceCategoryPage || isServiceSubCategoryPage)? categorySlug
                    :(isProductCategoryPage || isProductSubCategoryPage)? categorySlug
                    : ""}/${
                      isRegistrationSubTypePage? subTypeSlug 
                      :isRegistrationTypePage? item.slug
                      :isCourseSpecializationPage? specializationSlug 
                      :isCourseProgramPage? item.slug 
                      :isServiceSubCategoryPage? serviceSubCategory.slug
                      :isServiceCategoryPage? item.slug
                      :isProductSubCategoryPage? productSubCategory.slug
                      :isProductCategoryPage? item.slug
                      : ""}`,
                  "image": item.registration?.image_url 
                  || item.course?.image_url 
                  || item.service?.image_url
                  || item.product?.image_url 
                  || item.image_url 
                  || ""
                })) || []
              }))
          }

        }

        if (isProductSubCategoryPage) {
          structuredData.push(
            JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": details?.map(detail => ({
                    "@type": "Product",
                    "name": detail?.product?.name || "",
                    "image": detail?.product?.image_url || "",
                    "description": detail?.meta_description || "",
                    "sku": detail?.product?.sku || "",
                    "url": `https://bzindia.in/${detail?.company_slug || ""}`,
                    "category": detail?.product?.category_name || "",
                    "offers": {
                        "@type": "Offer",
                        "price": detail?.product?.price || "",
                        "priceCurrency": "INR",
                        "availability": "https://schema.org/InStock",
                        "priceValidUntil": priceValidUntil,
                        "shippingDetails": {
                          "@type": "OfferShippingDetails",
                          "shippingDestination": {
                            "@type": "DefinedRegion",
                            "addressCountry": "IN"
                          },
                          "shippingRate": {
                            "@type": "MonetaryAmount",
                            "value": "0.00",
                            "currency": "INR"
                          },
                          "deliveryTime": {
                            "@type": "ShippingDeliveryTime",
                            "handlingTime": {
                              "@type": "QuantitativeValue",
                              "minValue": 0,
                              "maxValue": 2,
                              "unitCode": "d"
                            },
                            "transitTime": {
                              "@type": "QuantitativeValue",
                              "minValue": 2,
                              "maxValue": 7,
                              "unitCode": "d"
                            }
                          }
                        },
                        "hasMerchantReturnPolicy": {
                          "@type": "MerchantReturnPolicy",
                          "applicableCountry": "IN",
                          "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
                        }
                    },
                    "aggregateRating": detail?.product?.rating_count > 0 ? {
                      "@type": "AggregateRating",
                      "ratingValue": Number(detail?.product?.rating),
                      "reviewCount": Number(detail?.product?.rating_count)
                    } : undefined,
                    "review": detail?.product?.reviews?.map(review => ({
                        "@type": "Review",
                        "author": {
                          "@type": "Person",
                          "name": review?.review_by || review?.name || ""
                        },                            
                        "datePublished": review?.created || "",
                        "reviewBody": review?.text || "",
                        "reviewRating": {
                          "@type": "Rating",
                          "ratingValue": Number(review.rating)
                        }
                    }))
                                        
                })) || []
              },
              
            )
          )
        }

        if (isCourseSpecializationPage) {
          structuredData.push(
            JSON.stringify(
                  {
                      "@context": "https://schema.org",
                      "@type": "ItemList",
                      "name": "Training Courses",
                      "description": "A list of available training courses",
                      "itemListElement":
                          details?.map((detail) => ({
                              "@type": "Course",
                              "name": detail?.meta_title || "",
                              "description": detail?.meta_description || "",
                              "provider": {
                                  "@type": "Organization",
                                  "name": detail?.course?.company_name || ""
                              },
                              "image": detail?.course?.image_url || "",
                              "hasCourseInstance": {
                                  "@type": "CourseInstance",
                                  "courseMode": [detail?.course?.mode || "Online"],
                                  "endDate": detail?.course?.ending_date ? detail?.course?.ending_date.split('T')[0] : "",
                                  "startDate": detail?.course?.starting_date ? detail?.course?.starting_date.split('T')[0] : "",
                                  "courseWorkload": detail?.course?.duration?"P"+detail?.course?.duration+"D": ""
                              },
                              "offers": {
                                  "@type": "Offer",
                                  "price": detail?.course?.price || "",
                                  "priceCurrency": "INR",
                                  "availability": "http://schema.org/InStock",
                                  "category": detail?.course?.program_name || ""
                              },
                              "aggregateRating": detail?.course?.rating_count > 0 ? {
                                  "@type": "AggregateRating",
                                  "ratingValue": Number(detail?.course?.rating),
                                  "bestRating": 5,
                                  "ratingCount": Number(detail?.course?.rating_count)
                              } : undefined,                      
                          })) || []
                      
                  },
                  
              )
          )
        }

    return {
      props: {
        currentCompany: currentCompany || {},                
        testimonials: testimonials?.slice(0,12) || {},
        replacedMultipage: replacedMultipage || {},
        multipageUrl: multipageUrl || {},
        fetchedPlace: fetchedPlace || {},
        fetchedDistrict: fetchedDistrict || {},
        fetchedState: fetchedState || {},
        articleBody: articleBody || {},
        clients: clients?.slice(0,12) || {},

        isMultipage: multipage ? true : false,
        isDetailpage: detailPage ? true : false,
        detailPage: detailPage || {},
        detailPageUrl: detailPageUrl || {},
        monthAndYear: monthAndYear || null,
        blogs: blogs || [],
        metaTags: metaTags || [],

        isRegistrationTypePage: isRegistrationTypePage || false,
        subTypes: subTypes || [],
        registrationType: registrationType || {},
        typeSlug: typeSlug || {},

        isRegistrationSubTypePage: isRegistrationSubTypePage || false,        
        registrationSubType: registrationSubType || {},
        subTypeSlug: subTypeSlug || {},

        isCourseProgramPage: isCourseProgramPage || false,
        specializations: specializations || {},
        courseProgram: courseProgram || {},
        programSlug: programSlug || {},

        isCourseSpecializationPage: isCourseSpecializationPage || false,
        courseSpecialization: courseSpecialization || {},
        specializationSlug: specializationSlug || {},

        isServiceCategoryPage: isServiceCategoryPage || false,
        subCategories: subCategories || {},
        serviceCategory: serviceCategory || {},
        categorySlug: categorySlug || {},

        isServiceSubCategoryPage: isServiceSubCategoryPage || false,
        serviceSubCategory: serviceSubCategory || {},
        subCategorySlug: subCategorySlug || {},

        isProductCategoryPage: isProductCategoryPage || false,
        productCategory: productCategory || {},

        isProductSubCategoryPage: isProductSubCategoryPage || false,
        productSubCategory: productSubCategory || {},

        details: details || [],

        structuredData,

        multipageImage: multipageImage || "",
        detailPageImage: detailPageImage || "",
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {
        currentCompany: [],                
        testimonials: [],
        replacedMultipage: [],
        multipageUrl: [],
        fetchedPlace: [],
        fetchedDistrict: [],
        fetchedState: [],
        articleBody: [],
        clients: [],

        isMultipage: false,
        isDetailpage: false,
        detailPage: [],
        detailPageUrl: [],
        monthAndYear: null,
        blogs: [],
        metaTags: [],

        isRegistrationTypePage: false,
        subTypes: [],
        registrationType: [],
        typeSlug: [],

        isRegistrationSubTypePage: false,
        registrationSubType: [],
        subTypeSlug: [],
        
        isCourseProgramPage: false,
        specializations: [],
        courseProgram: [],
        programSlug: [],
        
        isCourseSpecializationPage: false,
        courseSpecialization: [],
        specializationSlug: [],

        isServiceCategoryPage: false,
        subCategories: [],
        serviceCategory: [],
        categorySlug: [],

        isServiceSubCategoryPage: false,
        serviceSubCategory: [],
        subCategorySlug: [],

        isProductCategoryPage: false,
        productCategory: [],

        isProductSubCategoryPage: false,
        productSubCategory: [],
        
        details: [],
        structuredData: [],

        multipageImage: [],
        detailPageImage: [],
      }
    }
  }

}

export default DynamicMultiPage