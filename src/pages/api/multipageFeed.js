// pages/api/rss.js


import { Feed } from 'feed';
import destination from '../../../lib/api/destination';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import service from '../../../lib/api/service';
import course from '../../../lib/api/course';
import registration from '../../../lib/api/registration';
import product from '../../../lib/api/product';


export default async function handler(req, res) {
    const multipageParams = req.query;

    let slug, itemSlug, stateSlug, districtSlug, placeSlug;
    let locationName, fetchedPlace, fetchedDistrict, fetchedState;
    let multipageUrl;

    let subTypes, registrationType, registrationSubType, typeSlug, details;
    let courseProgram, courseSpecialization, specializations, programSlug, specializationSlug;
    let serviceCategory, serviceSubCategory, subCategories, categorySlug, subCategorySlug;
    let productCategory, productSubCategory;

    let isRegistrationTypePage, isRegistrationSubTypePage = false;
    let isCourseProgramPage, isCourseSpecializationPage = false;
    let isServiceCategoryPage, isServiceSubCategoryPage = false;
    let isProductCategoryPage, isProductSubCategoryPage = false;

    slug = multipageParams.slug;
    itemSlug = multipageParams.multiPageSlug || multipageParams.itemSlug;
    stateSlug = multipageParams.stateSlug;
    districtSlug = multipageParams.districtSlug;
    placeSlug = multipageParams.placeSlug;
    
    if (!slug) return null;

    const siteUrl = "https://bzindia.in";

    const { lat, lon } = await location.getLocationFromIP(req);

    // Fetch dynamic content
    const companyRes = await company.getCompany(slug);
    const currentCompany = companyRes.data;  

    let multipage;
    let replacedMultipage;

    let detailPage;
    let detailPageUrl;
    let detailPageImage;

    const getImageMimeType = (url) => {
        if (url.endsWith('.png')) return 'image/png';
        if (url.endsWith('.webp')) return 'image/webp';
        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
        return 'image/*';
    };


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

    if (!itemSlug) {
      itemSlug = placeSlug || districtSlug || stateSlug;
    }

    const urlLocationRes = await location.getUrlLocation(undefined, itemSlug);
        const urlLocation = urlLocationRes.data;
    
        const locationData = urlLocation?.data;

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
    
        itemSlug = itemSlug?.toString().replace(`-${fetchedLocationSlug}`, "-place_name");
        
    if (currentCompany?.company_type === "Education") {
    
        try {
          const courseMultipageRes = await location.getCourseMultiPage(stateSlug || "india", itemSlug);
          multipage = courseMultipageRes.data;

          const partnersRes = await course.getPartners(slug);
          clients = partnersRes.data;
        
        } catch (err) {
          programSlug = itemSlug;

          if (Object.keys(multipageParams).length == 2) {

            const specializationRes = await course.getSpecializations(slug, programSlug);
            specializations = specializationRes.data?.results;

            isCourseProgramPage = true;
            
            const courseProgramRes = await course.getProgram(slug, programSlug);            
            courseProgram = courseProgramRes.data;
            courseProgram = {...courseProgram, ["url"]: `${slug}/${programSlug}`};
        
          } else if (Object.keys(multipageParams).length == 3) {    
            specializationSlug = stateSlug;
            
            const detailsRes = await course.getCourseDetails(`/course_api/companies/${slug}/details/?specialization=${specializationSlug}`);
            details = detailsRes.data?.results;

            isCourseSpecializationPage = true;
                        
            const courseSpecializationRes = await course.getSpecialization(slug, specializationSlug);            
            courseSpecialization = courseSpecializationRes.data;

            courseSpecialization = {...courseSpecialization, ["url"]: `${slug}/${programSlug}/${specializationSlug}`}


          } else if (Object.keys(multipageParams).length == 4) {
              const detailPageSlug = multipageParams.districtSlug;  
                
                try {
                  const response = await course.getDetail(slug, detailPageSlug);
                  detailPage = response.data;
                  detailPageImage = detailPage?.course?.image_url;
                  detailPageUrl = `${slug}/${detailPage?.course?.program_slug}/${detailPage?.course?.specialization_slug}/${detailPage?.slug}`

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

        clients = currentCompany?.clients;

      } catch (err) {         
        categorySlug = itemSlug;

          if (Object.keys(multipageParams).length == 2) {

            const subCategoriesRes = await service.getSubCategories(slug, categorySlug);
            subCategories = subCategoriesRes.data?.results;

            isServiceCategoryPage = true;
            
            const serviceCategoryRes = await service.getCategory(slug, categorySlug);            
            serviceCategory = serviceCategoryRes.data;

            serviceCategory = {...serviceCategory, ["url"]: `${slug}/${categorySlug}`}
        
          } else if (Object.keys(multipageParams).length == 3) {    
            subCategorySlug = stateSlug;
            
            const detailsRes = await service.getServiceDetails(`/service_api/companies/${slug}/details/?sub_category=${subCategorySlug}`);
            details = detailsRes.data?.results;

            isServiceSubCategoryPage = true;
                                    
            const serviceSubCategoryRes = await service.getSubCategory(slug, subCategorySlug);            
            serviceSubCategory = serviceSubCategoryRes.data;

            serviceSubCategory = {...serviceSubCategory, ["url"]: `${slug}/${categorySlug}/${subCategorySlug}`}


          } else if (Object.keys(multipageParams).length == 4) {
            const detailPageSlug = multipageParams.districtSlug;
            
            try {
              const response = await service.getDetail(slug, detailPageSlug);
              detailPage = response.data;
              detailPageImage = detailPage?.service?.image_url;
              detailPageUrl = `${slug}/${detailPage?.service?.category_slug}/${detailPage?.service?.sub_category_slug}/${detailPage?.slug}`

              detailPage = {...detailPage, "testimonials": detailPage.service.testimonials, "faqs": detailPage.service.faqs, "blogs": detailPage.service?.blogs}

            } catch (err) {
              console.error(err);
            }
        } else {
          console.error(err);
        }
      }


    } else if (currentCompany?.company_type === "Product") {
      try {
        const productMultipageRes = await location.getProductMultiPage(stateSlug || "india", itemSlug);
        multipage = productMultipageRes.data;

        clients = currentCompany?.clients;
      } catch (err) {
        categorySlug = itemSlug;

          if (Object.keys(multipageParams).length == 2) {

            const subCategoriesRes = await product.getSubCategories(slug, categorySlug);
            subCategories = subCategoriesRes.data?.results;

            isProductCategoryPage = true;
            
            const productCategoryRes = await product.getCategory(slug, categorySlug);            
            productCategory = productCategoryRes.data;

            productCategory = {...productCategory, ["url"]: `${slug}/${categorySlug}`}
        
          } else if (Object.keys(multipageParams).length == 3) {    
            subCategorySlug = stateSlug;
            
            const detailsRes = await product.getProductDetails(`/product_api/companies/${slug}/details/?sub_category=${subCategorySlug}`);
            details = detailsRes.data?.results;

            isProductSubCategoryPage = true;
                                    
            const productSubCategoryRes = await product.getSubCategory(slug, subCategorySlug);            
            productSubCategory = productSubCategoryRes.data;

            productSubCategory = {...productSubCategory, ["url"]: `${slug}/${categorySlug}/${subCategorySlug}`}


          } else if (Object.keys(multipageParams).length == 4) {
          const detailPageSlug = multipageParams.districtSlug;

          try {
            const response = await product.getDetail(slug, detailPageSlug);
            detailPage = response.data;
            detailPageImage = detailPage?.product?.image_url;
            detailPage = {...detailPage, "blogs": detailPage?.product.blogs, "faqs": detailPage?.product.faqs}
            detailPageUrl = `${slug}/${detailPage?.product?.category_slug}/${detailPage?.product?.sub_category_slug}/${detailPage?.slug}`

          } catch (err) {
            console.error(err);
          }
        } else {
          console.error(err);
        }
      }
        

    } else if (currentCompany?.company_type === "Registration") {
      try {    
        const registrationMultipageRes = await location.getRegistrationMultiPage(stateSlug || "india", itemSlug);
        multipage = registrationMultipageRes.data;

        clients = currentCompany?.clients;
      } catch (err) {
        typeSlug = itemSlug;
        if (Object.keys(multipageParams).length == 2) {

          const subTypeRes = await registration.getSubTypes(slug, typeSlug);
          subTypes = subTypeRes.data?.results;

          isRegistrationTypePage = true;
                      
          const registrationTypeRes = await registration.getType(slug, typeSlug);            
          registrationType = registrationTypeRes.data;
          registrationType = {...registrationType, ["url"]: `${slug}/${typeSlug}`};
      
        } else if (Object.keys(multipageParams).length == 3) {    
          
          const subTypeSlug = stateSlug;

          const detailsRes = await registration.getRegistrationDetails(`/registration_api/companies/${slug}/details/?sub_type=${subTypeSlug}`);
          details = detailsRes.data?.results;

          isRegistrationSubTypePage = true;
                      
          const registrationSubTypeRes = await registration.getSubType(slug, subTypeSlug);            
          registrationSubType = registrationSubTypeRes.data;

          registrationSubType = {...registrationSubType, ["url"]: `${slug}/${typeSlug}/${subTypeSlug}`}


        } else if (Object.keys(multipageParams).length == 4) {
            const detailPageSlug = multipageParams.districtSlug;
            
            try {
              const response = await registration.getDetail(slug, detailPageSlug);
              detailPage = response.data;
              detailPageImage = detailPage?.image_url;
              detailPageUrl = `${slug}/${detailPage?.registration?.sub_type?.type_slug}/${detailPage?.registration?.sub_type?.slug}/${detailPage?.slug}`

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
  
      if (multipage?.url_type === "location_filtered") {
        updatedMultipageSlug = updatedMultipageSlug?.replace("-place_name", "");
        locationSlug = placeSlug || districtSlug;

        modified_url = `${multipage.company_slug}/${updatedMultipageSlug}/`;

        if (fetchedPlace?.state) {
          modified_url += `${fetchedPlace?.state?.slug}/${locationSlug || ""}`;
        }
      } else {
        locationSlug = placeSlug || districtSlug || stateSlug || "india";

        updatedMultipageSlug = updatedMultipageSlug?.replace("place_name", locationSlug);            
  
        modified_url = `${multipage.company_slug}/${updatedMultipageSlug}`;
  
        if (!multipage.slug?.toString().endsWith("place_name")) {
          modified_url += `-${locationSlug}`;
        }
      }

      multipageUrl = modified_url;

      replacedMultipage = replaceInObject(multipage, "place_name", locationName);     

    }

    const destinationsRes = await destination.getDestinations( lat, lon );
    const destinations  = await destinationsRes.data.slice(0, 12);



  const feed = new Feed({
    title: `${
      replacedMultipage? replacedMultipage?.modified_meta_title 
      || replacedMultipage?.title 
      :detailPage? detailPage?.meta_title 
      :isRegistrationTypePage? registrationType?.name 
      :isRegistrationSubTypePage? registrationSubType?.name 
      :isCourseProgramPage? courseProgram?.name 
      :isCourseSpecializationPage? courseSpecialization?.name
      :isServiceCategoryPage? serviceCategory?.name 
      :isServiceSubCategoryPage? serviceSubCategory?.name
      :isProductCategoryPage? productCategory?.name 
      :isProductSubCategoryPage? productSubCategory?.name
      : undefined} - RSS Feed`,
    description: replacedMultipage?.meta_description?.slice(0, 300) 
    || detailPage?.meta_description?.slice(0, 300) 
    || registrationSubType?.description?.slice(0, 300) 
    || registrationType?.description?.slice(0, 300) 
    || isCourseSpecializationPage && (courseSpecialization.description?.slice(0, 300) || `List of courses of ${courseSpecialization?.name}`) 
    || isCourseProgramPage && (courseProgram?.description?.slice(0, 300) || `List of specializations of ${courseProgram?.name}`)
    || isServiceSubCategoryPage && (serviceSubCategory?.description?.slice(0, 300) || `List of services of ${serviceSubCategory?.name}`)
    || isServiceCategoryPage && (serviceCategory?.description?.slice(0, 300) || `List of sub categories of ${serviceCategory?.name}`)
    || isProductSubCategoryPage && (productSubCategory?.description?.slice(0, 300) || `List of products of ${productSubCategory?.name}`)
    || isProductCategoryPage && (productCategory?.description?.slice(0, 300) || `List of sub categories of ${productCategory?.name}`),
    
    id: `${siteUrl}/${
      multipage? multipageUrl
      :detailPage? detailPageUrl 
      :isRegistrationTypePage ? registrationType?.url 
      :isRegistrationSubTypePage ? registrationSubType?.url 
      :isCourseProgramPage? courseProgram.url 
      :isCourseSpecializationPage? courseSpecialization.url 
      :isServiceCategoryPage? serviceCategory.url 
      :isServiceSubCategoryPage? serviceSubCategory.url 
      :isProductCategoryPage? productCategory.url 
      :isProductSubCategoryPage? productSubCategory.url 
      : undefined}`,
    link: `${siteUrl}/${
      multipage? multipageUrl
      :detailPage? detailPageUrl 
      :isRegistrationTypePage ? registrationType?.url 
      :isRegistrationSubTypePage ? registrationSubType?.url 
      :isCourseProgramPage ? courseProgram?.url
      :isCourseSpecializationPage? courseSpecialization.url 
      :isServiceCategoryPage? serviceCategory.url 
      :isServiceSubCategoryPage? serviceSubCategory.url 
      :isProductCategoryPage? productCategory.url 
      :isProductSubCategoryPage? productSubCategory.url 
      : undefined}`,
    language: 'en',
    image: isRegistrationTypePage? registrationType?.image_url 
    :isRegistrationSubTypePage? registrationSubType?.image_url 
    :isCourseProgramPage? courseProgram?.image_url
    :isCourseSpecializationPage? courseSpecialization?.image_url
    :isServiceCategoryPage? serviceCategory?.image_url
    :isServiceSubCategoryPage? serviceSubCategory?.image_url
    :isProductCategoryPage? productCategory?.image_url
    :isProductSubCategoryPage? productSubCategory?.image_url
    :currentCompany?.logo_url || `${siteUrl}/images/logo.svg`,
    favicon: currentCompany?.favicon_url,
    updated: replacedMultipage? new Date(replacedMultipage?.updated || new Date()) 
    :detailPage? new Date(detailPage?.updated || new Date()) 
    :isRegistrationTypePage ? new Date(registrationType?.updated || new Date()) 
    :isRegistrationSubTypePage ? new Date(registrationSubType?.updated || new Date()) 
    :isCourseProgramPage ? new Date(courseProgram?.updated || new Date()) 
    :isCourseSpecializationPage ? new Date(courseSpecialization?.updated || new Date()) 
    :isServiceCategoryPage ? new Date(serviceCategory?.updated || new Date()) 
    :isServiceSubCategoryPage ? new Date(serviceSubCategory?.updated || new Date()) 
    :isProductCategoryPage ? new Date(productCategory?.updated || new Date()) 
    :isProductSubCategoryPage ? new Date(productSubCategory?.updated || new Date()) 
    : new Date(new Date),
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${siteUrl}/${
        multipage? multipageUrl
        :detailPage? detailPageUrl 
        :isRegistrationTypePage ? registrationType?.url 
        :isRegistrationSubTypePage ? registrationSubType?.url 
        :isCourseProgramPage ? courseProgram?.url
        :isCourseSpecializationPage? courseSpecialization.url 
        :isServiceCategoryPage? serviceCategory.url 
        :isServiceSubCategoryPage? serviceSubCategory.url 
        :isProductCategoryPage? productCategory.url 
        :isProductSubCategoryPage? productSubCategory.url 
        : undefined}/rss`,
    },
    author: {
      name: currentCompany?.name,
      link: `${siteUrl}/${slug}`,
    },
  });

  {isProductCategoryPage &&
    subCategories?.forEach((subCategory) => {
          feed.addItem({
          title: subCategory.name,
          id: `${siteUrl}/${productCategory?.url}/${subCategory.slug}`,
          link: `${siteUrl}/${productCategory?.url}/${subCategory.slug}`,
          description: subCategory.description?.slice(0, 300),
          date: new Date(subCategory.updated),
          
          enclosure: subCategory.image_url ? {
            url: `${subCategory.image_url}`,  
            type: getImageMimeType(subCategory.image_url)
          } : undefined
          });
      });
  }

  {isServiceCategoryPage &&
    subCategories?.forEach((subCategory) => {
          feed.addItem({
          title: subCategory.name,
          id: `${siteUrl}/${serviceCategory?.url}/${subCategory.slug}`,
          link: `${siteUrl}/${serviceCategory?.url}/${subCategory.slug}`,
          description: subCategory.description?.slice(0, 300),
          date: new Date(subCategory.updated),
          
          enclosure: subCategory.image_url ? {
            url: `${subCategory.image_url}`,  
            type: getImageMimeType(subCategory.image_url)
          } : undefined
          });
      });
  }

  {isRegistrationTypePage &&
    subTypes?.forEach((subType) => {
          feed.addItem({
          title: subType.name,
          id: `${siteUrl}/${registrationType?.url}/${subType.slug}`,
          link: `${siteUrl}/${registrationType?.url}/${subType.slug}`,
          description: subType.description?.slice(0, 300),
          date: new Date(subType.updated),
          
          enclosure: subType.image_url ? {
            url: `${subType.image_url}`,  
            type: getImageMimeType(subType.image_url)
          } : undefined
          });
      });
  }

  {isServiceSubCategoryPage &&
    details?.forEach((detail) => {
          feed.addItem({
          title: detail.service?.name,
          id: `${siteUrl}/${serviceSubCategory?.url}/${detail.slug}`,
          link: `${siteUrl}/${serviceSubCategory?.url}/${detail.slug}`,
          description: detail.description?.slice(0, 300),
          date: new Date(detail.updated),

          enclosure: detail.image_url ? {
            url: `${detail.image_url}`,  
            type: getImageMimeType(detail.image_url)
          } : undefined
          });
      });
  }

  {isCourseSpecializationPage &&
    details?.forEach((detail) => {
          feed.addItem({
          title: detail.course?.name,
          id: `${siteUrl}/${courseSpecialization?.url}/${detail.slug}`,
          link: `${siteUrl}/${courseSpecialization?.url}/${detail.slug}`,
          description: detail.description?.slice(0, 300),
          date: new Date(detail.updated),

          enclosure: detail.image_url ? {
            url: `${detail.image_url}`,  
            type: getImageMimeType(detail.image_url)
          } : undefined
          });
      });
  }

  {isRegistrationSubTypePage &&
    details?.forEach((detail) => {
          feed.addItem({
          title: detail.registration?.sub_type?.name,
          id: `${siteUrl}/${registrationSubType?.url}/${detail.slug}`,
          link: `${siteUrl}/${registrationSubType?.url}/${detail.slug}`,
          description: detail.description?.slice(0, 300),
          date: new Date(detail.updated),

          enclosure: detail.image_url ? {
            url: `${detail.image_url}`,  
            type: getImageMimeType(detail.image_url)
          } : undefined
          });
      });
  }

  {isCourseProgramPage &&
    specializations?.forEach((specialization) => {
          feed.addItem({
          title: specialization.title,
          id: `${siteUrl}/${courseProgram?.url}/${specialization.slug}`,
          link: `${siteUrl}/${courseProgram?.url}/${specialization.slug}`,
          description: specialization.description?.slice(0, 300),
          date: new Date(specialization.updated),

          enclosure: specialization.image_url ? {
            url: `${specialization.image_url}`,  
            type: getImageMimeType(specialization.image_url)
          } : undefined
        });
      });
  }

    // Add companies
    (replacedMultipage || detailPage || currentCompany)?.meta_tags?.forEach((tag) => {
        feed.addItem({
        title: tag.name,
        id: `${siteUrl}/tag/${tag.slug}`,
        link: `${siteUrl}/tag/${tag.slug}`,
        description: tag.meta_description || "",
        date: new Date(tag.updated),
        });
    });

    // Add blog posts
    (replacedMultipage || detailPage || registrationType || registrationSubType || courseProgram || courseSpecialization || serviceSubCategory || serviceCategory || productSubCategory || productCategory)?.blogs?.forEach((post) => {
        feed.addItem({
        title: post.title,
        id: `${siteUrl}/learn/${post.slug}`,
        link: `${siteUrl}/learn/${post.slug}`,
        description: post.summary?.slice(0, 300),
        date: new Date(post.published_on),
        });
    });

    {! isRegistrationTypePage  &&
      // Add faq faqs
      (replacedMultipage || detailPage)?.faqs?.forEach((faq) => {
          feed.addItem({
          title: faq.title,
          id: `${siteUrl}/faqs/${faq.slug}`,
          link: `${siteUrl}/faqs/${faq.slug}`,
          description: faq.question,
          content: `
              <p><strong>Q:</strong> ${faq.question}</p>
              <p><strong>A:</strong> ${faq.answer}</p>
          `,
          date: new Date(faq.updated) || new Date(),
          });
      });
    }

    // Add destinations
    destinations.slice(0, 12).forEach((dest) => {
        feed.addItem({
        title: dest.name,
        id: `${siteUrl}/destination/${dest.slug}`,
        link: `${siteUrl}/destination/${dest.slug}`,
        description: dest.meta_description?.slice(0,300) || `Learn more about ${dest.name}`,
        date: new Date(dest.updated || Date.now()),

        enclosure: dest.image_url ? {
            url: `${dest.image_url}`,  
            type: getImageMimeType(dest.image_url)
          } : undefined
        });
    });

    if (currentCompany?.company_type === "Service") {
        // Add services
        const serviceDetailsRes = await service.getDetails(slug);
        const serviceDetails = serviceDetailsRes.data?.results;

        serviceDetails.slice(0, 12).forEach((detailPage) => {
            feed.addItem({
                title: detailPage.service?.name,
                id: `${siteUrl}/${slug}/${detailPage.service?.category_slug}/${detailPage.service?.sub_category_slug}/${detailPage.slug}`,
                link: `${siteUrl}/${slug}/${detailPage.service?.category_slug}/${detailPage.service?.sub_category_slug}/${detailPage.slug}`,
                description: detailPage.meta_description || "",
                date: new Date(detailPage.updated || Date.now()),

                enclosure: detailPage.image_url ? {
                url: `${detailPage.image_url}`,  
                type: getImageMimeType(detailPage.image_url)
              } : undefined
            });
        });
  
    } else if (currentCompany?.company_type === "Education") {
        // Add courses
        const courseDetailsRes = await course.getDetails(slug);
        const courseDetails = courseDetailsRes.data?.results;

        courseDetails.slice(0, 12).forEach((detailPage) => {
            feed.addItem({
                title: detailPage.course?.name,
                id: `${siteUrl}/${slug}/${detailPage.course?.program_slug}/${detailPage.course?.specialization_slug}/${detailPage.slug}`,
                link: `${siteUrl}/${slug}/${detailPage.course?.program_slug}/${detailPage.course?.specialization_slug}/${detailPage.slug}`,
                description: detailPage.meta_description || "",
                date: new Date(detailPage.updated || Date.now()),

                enclosure: detailPage.image_url ? {
                  url: `${detailPage.image_url}`,  
                  type: getImageMimeType(detailPage.image_url)
                } : undefined
            });
        });
    } else if (currentCompany?.company_type === "Registration") {
        // Add registrations
        const registrationDetailsRes = await registration.getDetails(slug);
        const registrationDetails = registrationDetailsRes.data?.results;

        registrationDetails.slice(0, 12).forEach((detailPage) => {
            feed.addItem({
                title: detailPage.registration?.name,
                id: `${siteUrl}/${slug}/${detailPage.registration?.sub_type?.type_slug}/${detailPage.registration?.sub_type?.slug}/${detailPage.slug}`,
                link: `${siteUrl}/${slug}/${detailPage.registration?.sub_type?.type_slug}/${detailPage.registration?.sub_type?.slug}/${detailPage.slug}`,
                description: detailPage.meta_description || "",
                date: new Date(detailPage.updated || Date.now()),

                enclosure: detailPage.image_url ? {
                  url: `${detailPage.image_url}`,  
                  type: getImageMimeType(detailPage.image_url)
                } : undefined
            });
        });
    } else if (currentCompany?.company_type === "Product") {
        // Add products
        const productDetailsRes = await product.getProductDetails(slug);
        const productDetails = productDetailsRes.data?.results;

        productDetails.slice(0, 12).forEach((detailPage) => {
            feed.addItem({
                title: detailPage.product?.name,
                id: `${siteUrl}/${slug}/${detailPage.product?.category_slug}/${detailPage.product?.sub_category_slug}/${detailPage.slug}`,
                link: `${siteUrl}/${slug}/${detailPage.product?.category_slug}/${detailPage.product?.sub_category_slug}/${detailPage.slug}`,
                description: detailPage.meta_description || "",
                date: new Date(detailPage.updated || Date.now()),

                enclosure: detailPage.image_url ? {
                  url: `${detailPage.image_url}`,  
                  type: getImageMimeType(detailPage.image_url)
                } : undefined
            });
        });
    }

  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(feed.rss2());
  res.end();
}
