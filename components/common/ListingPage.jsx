import React, { useEffect, useRef, useState } from 'react'
import company from '../../lib/api/company';
import Loading from '../Loading';
import Link from 'next/link';
import product from '../../lib/api/product';
import service from '../../lib/api/service';
import { useShuffle } from '../../hooks/useShuffle';
import registration from '../../lib/api/registration';
import course from '../../lib/api/course';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import location from '../../lib/api/location';
import GeneralEnquiryForm from './GeneralEnquiryForm';
import Message from './Message';
import useFetchSubTypes from '../../hooks/useFetchSubTypes';
import Faq from './Faq';
import useFetchRegistrationDetails from '../../hooks/useFetchRegistrationDetails';
import createDOMPurify from 'dompurify';
import useFetchProdSubCategories from '../../hooks/useFetchProdSubCategories';
import useFetchProductDetails from '../../hooks/useFetchProductDetails';
import useFetchCourseSpecializations from '../../hooks/useFetchCourseSpecializations';
import useFetchCourseDetails from '../../hooks/useFetchCourseDetails';
import useFetchServSubCategories from '../../hooks/useFetchServSubCategories';
import useFetchServiceDetails from '../../hooks/useFetchServiceDetails';

const ListingPage = ({
  items, itemsType, childPlace, parentPlace, 
  handleNearby, faqs, locationData, subType,
  
  subCategory, specialization,

  state, district
}) => {

    const shuffle = useShuffle();
    const loaderRef = useRef(null);  
    
    const [nearbyCscCenters, setNearbyCscCenters] = useState([]);
    const [nearbyCscCentersLoading, setNearbyCscCentersLoading] = useState(true);  
    
    const [productCompanies, setProductCompanies] = useState();
    const [productCompaniesLoading, setProductCompaniesLoading] = useState(true);

    const [serviceCompanies, setServiceCompanies] = useState();
    const [serviceCompaniesLoading, setServiceCompaniesLoading] = useState(true);

    const [courseCompanies, setCourseCompanies] = useState();
    const [courseCompaniesLoading, setCourseCompaniesLoading] = useState(true);

    const [registrationCompanies, setRegistrationCompanies] = useState();
    const [registrationCompaniesLoading, setRegistrationCompaniesLoading] = useState(true);

    const [productSubCategories, setProductSubCategories] = useState([]);
    const [serviceSubCategories, setServiceSubCategories] = useState([]);
    const [courseSpecializations, setCourseSpecializations] = useState([]);
    const [registrationSubTypes, setRegistrationSubTypes] = useState([]);

    const [popularProducts, setPopularProducts] = useState([]);

    const [stateDistricts, setStateDistricts] = useState(state?.districts || []);
    const [stateDistrictsLoading, setStateDistrictsLoading] = useState(state? false : true);

    const [shuffledCategories, setShuffledCategories] = useState([]);

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();  

    const {subTypes, subTypesLoading, nextParams, fetchSubTypes} = useFetchSubTypes();
    const {prodSubCategories, prodSubCategoriesLoading, nextProdParams, fetchProdSubCategories} = useFetchProdSubCategories();
    const {registrationDetails, registrationDetailsLoading, nextRegistrationDetailsParams, fetchRegistrationDetails} = useFetchRegistrationDetails(); 
    const {productDetails, productDetailsLoading, nextProductDetailsParams, fetchProductDetails} = useFetchProductDetails(); 
    const {eduSpecializations, eduSpecializationsLoading, fetchEduSpecializations} = useFetchCourseSpecializations();
    const {courseDetails, courseDetailsLoading, nextCourseDetailUrl, fetchCourseDetails} = useFetchCourseDetails(); 
    const {servSubCategories, servSubCategoriesLoading, nextServParams, fetchServSubCategories} = useFetchServSubCategories();
    const {serviceDetails, serviceDetailsLoading, nextServiceDetailsParams, fetchServiceDetails} = useFetchServiceDetails(); 

    const [sanitizedContent, setSanitizedContent] = useState([]);  

    const [firstMultipage, setFirstMultipage] = useState(null);

    useEffect(() => {
      if (itemsType != "State" && itemsType != "District") return;
      if (!state && !district) return;

        let latitude = state?.latitude;
        let longitude = state?.longitude;

        if (district) {
          latitude = district?.latitude;
          longitude = district?.longitude;
        }        

          const fetchNearbyCscCenters = async () => {
              try {
              const response = await location.getNearbyCscCenters(latitude, longitude);
              setNearbyCscCenters(response.data?.slice(0, 6));        
              } catch (err) {
              console.error("Error in fetching nearby csc centers: ", err);
              } finally {
              setNearbyCscCentersLoading(false);
              }
          };          
          
          fetchNearbyCscCenters();
      }, [state, district, itemsType]) 


    useEffect(() => {
      if (!subType?.slug || !locationData?.state_slug || itemsType != "RegistrationDetail") return;

      const fetchFirstMultipage = async () => {
        try {
          const response = await registration.getRegistrationMultipages(locationData?.state_slug, `sub_type=${subType?.slug}`);
          const multipage = response.data?.results?.[0];

          const slug = multipage?.slug || "";
          const companySlug = multipage?.company_slug || "";
          const urlType = multipage?.url_type;

          let updatedMultipageSlug = slug;
          let modifiedUrl = "";

          if (urlType === "location_filtered") {
            updatedMultipageSlug = updatedMultipageSlug.replace("-place_name", "");
            modifiedUrl = `${companySlug}/${updatedMultipageSlug}/${locationData?.state_slug}/${locationData?.district_slug}/${locationData?.slug}`;
          } else {
            updatedMultipageSlug = updatedMultipageSlug.replace("place_name", locationData?.slug || "india");
            modifiedUrl = `${companySlug}/${updatedMultipageSlug}`;      
          }

          if (multipage) {
            setFirstMultipage({
              ...multipage,
              url: modifiedUrl,
              title: multipage?.title?.replace("place_name", locationData?.name || "India")
            })          
          }

        } catch (err) {
          console.error(err);
        }
        
      }
      
      
      fetchFirstMultipage();
      
    }, [subType?.slug, locationData?.state_slug, itemsType]);
    
    
    let districtSlug;

    let possibleStateSlug = locationData?.state?.slug || locationData?.state_slug || locationData?.slug;

    if (possibleStateSlug != locationData?.slug) {
      districtSlug = possibleStateSlug;
    }

    if (parentPlace || childPlace) {
      possibleStateSlug = parentPlace?.state?.slug || parentPlace?.state_slug || parentPlace?.slug || childPlace?.state?.slug;
      
      if (possibleStateSlug != parentPlace?.slug) {
        districtSlug = possibleStateSlug;
      }
    }

    useEffect(() => {
      if (typeof window === 'undefined' || (!subType?.content && subCategory?.content && specialization?.content)) return;
  
        const infoContent = subType?.content || subCategory?.content || specialization?.content || "";
  
        const DOMPurify = createDOMPurify(window);
        const sanitized = DOMPurify.sanitize( infoContent || '');         
  
        setSanitizedContent(sanitized);
      }, [subType?.content, subCategory?.content, specialization?.content]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                setMessageClass("");
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
      if (stateDistricts?.length < 1 && shuffledCategories?.length < 1) return;

      const timeout = setTimeout(() => {
        import("../../public/js/newScript.js");
      }, 300); 

      return () => clearTimeout(timeout);
    }, [stateDistricts, shuffledCategories]);

    const fetchDistricts = async (stateSlug) => {
      try {
        const response = await location.getMinimalDistricts(stateSlug);
        setStateDistricts(response?.data);
      } catch (err) {
        console.error("Failed to fetch state districts: ", err)
      } finally {
        setStateDistrictsLoading(false);
      }
    };

    useEffect(() => {
      if (!possibleStateSlug && !district?.state?.slug && !state?.slug) return;

      const passingStateSlug = possibleStateSlug || district?.state?.slug || state?.slug;


      fetchDistricts(passingStateSlug);

    }, [possibleStateSlug, district?.state?.slug, state?.slug]);  
    
    useEffect(() => {
      let isMounted = true;
        const fetchProductSubCategories = async() => {
            try {
                const response = await product.getSubCategories("all");

                setProductSubCategories(response.data?.results?.slice(0,4))                
            } catch (err) {
                console.error(`Error fetching product sub categories:`, err);
            }
        };

        const fetchServiceSubCategories = async() => {
            try {
                const response = await service.getSubCategories("all");
                setServiceSubCategories(response.data?.results?.slice(0,4))                
            } catch (err) {
                console.error(`Error fetching service sub categories:`, err);
            }
        };

        const fetchRegistrationSubTypes = async() => {
            try {
                const response = await registration.getRegistrationSubTypes("all");
                
                setRegistrationSubTypes(response.data?.results?.map(subType => ({
                      "name": subType?.name, "category_name": subType?.type_name, 
                      "slug": subType?.slug, "image_url": subType?.image_url,
                      "url": subType?.url
                    }))?.slice(0,4))
            } catch (err) {
                console.error(`Error fetching registration sub types:`, err);
            }
        };

        const fetchCourseSpecializations = async() => {
            try {
                const response = await course.getSpecializations("/course_api/companies/all/specializations");

                setCourseSpecializations(response.data?.results?.map(specialization => (
                    {
                      "name": specialization.name, "category_name": specialization.program_name, 
                      "slug": specialization.slug, "image_url": specialization.image_url,
                      "url": specialization.url
                  }
                ))?.slice(0,4))
            } catch (err) {
                console.error(`Error fetching course specializations:`, err);
            }
        };

        const fetchPopularProducts = async() => {
            try {
                const response = await product.getSliderProductDetails("all");

                setPopularProducts(response.data.results?.slice(0,2))                
            } catch (err) {
                console.error(`Error fetching product detail pages:`, err);
            }
        };

        fetchProductSubCategories();
        fetchServiceSubCategories();
        fetchRegistrationSubTypes();
        fetchCourseSpecializations();
        fetchPopularProducts();
      return () => {
        isMounted = false;
      }
    }, []);

    useEffect(() => {
      let categories = [...productSubCategories, ...serviceSubCategories, ...registrationSubTypes, ...courseSpecializations];

      setShuffledCategories(shuffle(categories))

    }, [productSubCategories, serviceSubCategories, registrationSubTypes, courseSpecializations])


    useEffect(() => {
        let isMounted = true;

        const fetchCompanies = async(companyType, setCompanies, setCompaniesLoading) => {
            try {
                const response = await company.getMinimalCompanies(companyType, 5);

                setCompanies(response.data?.map(company => (
                    {"name": company.name, "slug": company.slug}
                )))
            } catch (err) {
                console.error(`Error fetching ${companyType.toLowerCase()} companies:`, err);
            } finally {
                if (isMounted) setCompaniesLoading(false);
            }
        };        

        fetchCompanies("Product", setProductCompanies, setProductCompaniesLoading);
        fetchCompanies("Service", setServiceCompanies, setServiceCompaniesLoading);
        fetchCompanies("Education", setCourseCompanies, setCourseCompaniesLoading);
        fetchCompanies("Registration", setRegistrationCompanies, setRegistrationCompaniesLoading);

        return () => {
            isMounted = false;
        }
    }, []);    


    if (itemsType === "RegistrationDetail") {
      faqs = subType?.faqs?.map(faq => ({...faq, "question": faq.question?.replace("place_name", locationData?.name), "answer": faq.answer?.replace("place_name", locationData?.name)}));

    } else if (itemsType === "ProductDetail") {
      faqs = subCategory?.faqs?.map(faq => ({...faq, "question": faq.question?.replace("place_name", locationData?.name), "answer": faq.answer?.replace("place_name", locationData?.name)}));
    
    } else if (itemsType === "CourseDetail") {
      faqs = specialization?.faqs?.map(faq => ({...faq, "question": faq.question?.replace("place_name", locationData?.name), "answer": faq.answer?.replace("place_name", locationData?.name)}));
    
    } else if (itemsType === "ServiceDetail") {
      faqs = subCategory?.faqs?.map(faq => ({...faq, "question": faq.question?.replace("place_name", locationData?.name), "answer": faq.answer?.replace("place_name", locationData?.name)}));
    
    }

    // *********************************************** */
    // *********************************************** */
    // Registrations              

    // ***********************************************
    useEffect(() => {
      if (!loaderRef.current) return;
      const observer = new IntersectionObserver(
          entries => {
              if (!entries[0].isIntersecting) return;

              if (itemsType === "RegistrationSubType") {
                if (nextParams && !subTypesLoading) {

                 fetchSubTypes("all", null, nextParams);
                }
              } else if (itemsType === "RegistrationDetail") {
                if (nextRegistrationDetailsParams && !registrationDetailsLoading) {
                  fetchRegistrationDetails(subType?.slug, nextRegistrationDetailsParams);
                }
              } else if (itemsType === "ProductSubCategory") {
                if (nextProdParams && !prodSubCategoriesLoading) {
                  fetchProdSubCategories("all", null, nextProdParams);
                }
              } else if (itemsType === "ProductDetail") {
                if (nextProductDetailsParams && !productDetailsLoading) {
                  fetchProductDetails("all", subCategory?.slug, nextProductDetailsParams);
                }
              } else if (itemsType === "CourseSpecialization") {
                if (!eduSpecializationsLoading) {
                  fetchEduSpecializations();
                }
              } else if (itemsType === "CourseDetail") {
                if (nextCourseDetailUrl && !courseDetailsLoading) {
                  fetchCourseDetails("all", specialization?.slug);
                }
              } else if (itemsType === "ServiceSubCategory") {

                if (nextServParams && !servSubCategoriesLoading) {
                  fetchServSubCategories("all", null, nextServParams);
                }
              } else if (itemsType === "ServiceDetail") {
                if (nextServiceDetailsParams && !serviceDetailsLoading) {
                  fetchServiceDetails("all", subCategory?.slug, nextServiceDetailsParams);
                }
              }
          },
          { threshold: 1 }
      );

      observer.observe(loaderRef.current);
      return () => observer.disconnect();

    }, [
      itemsType, nextParams, subTypesLoading, 
      nextRegistrationDetailsParams, registrationDetailsLoading,
      nextProdParams, prodSubCategoriesLoading,
      nextProductDetailsParams, productDetailsLoading, subCategory?.slug,
      eduSpecializationsLoading, specialization?.slug, nextCourseDetailUrl,
      courseDetailsLoading, nextServParams, servSubCategoriesLoading
    ]);

    useEffect(() => {
      if (itemsType === "RegistrationDetail") {
        fetchRegistrationDetails(subType?.slug, null, true);
      }
    }, [itemsType, subType?.slug]);   
    
    useEffect(() => {
      if (itemsType === "ProductDetail") {
        fetchProductDetails("all", subCategory?.slug, null, true);
      }
    }, [itemsType, subCategory?.slug]);

    useEffect(() => {
      if (itemsType === "CourseDetail") {
        fetchCourseDetails("all", specialization?.slug, true);
      }
    }, [itemsType, specialization?.slug]);

    useEffect(() => {
      if (itemsType === "ServiceDetail") {
        fetchServiceDetails("all", subCategory?.slug, null, true);
      }
    }, [itemsType, subCategory?.slug]);
    
    //******************************* */



  return (
    <>
      {message&&
        <Message message={message} messageClass={messageClass} />
      }      
        <section id="bznew_list_section">
  <div className="container">
    {/* Top: mobile dropdown, breadcrumb, headline, search + near me + cities */}
    <div className="row g-3">
{/* ================= MOBILE CATEGORY DROPDOWN ================= */}
<div className="col-12 d-lg-none position-relative">
  <button className="bznew_list_catBtn w-100" id="bz_cat_btn" type="button" aria-expanded="false">
    <span>🗂️</span>
    <span>Categories</span>
    <svg className="bz_caret" viewBox="0 0 24 24" width="18" height="18">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  </button>

  <div id="bz_cat_menu" className="bznew_list_catMenu hidden">
    {/* PRODUCTS */}
    <h4 className="bz_cat_heading">Products</h4>    
    {productCompaniesLoading ? <Loading/> :
    productCompanies?.map((company, index) => <Link key={company.slug || index} className="bznew_list_catItem" href={`/${company.slug}`}>{company.name}</Link>)}    

    {/* COURSES */}
    <h4 className="bz_cat_heading">Courses</h4>
    {courseCompaniesLoading ? <Loading/> :
    courseCompanies?.map((company, index) => <Link key={company.slug || index} className="bznew_list_catItem" href={`/${company.slug}`}>{company.name}</Link>)}

    {/* SERVICES */}
    <h4 className="bz_cat_heading">Services</h4>
    {serviceCompaniesLoading ? <Loading/> :
    serviceCompanies?.map((company, index) => <Link key={company.slug || index} className="bznew_list_catItem" href={`/${company.slug}`}>{company.name}</Link>)}

    {/* STARTUP SERVICES */}
    <h4 className="bz_cat_heading">Startup Services</h4>
    {registrationCompaniesLoading ? <Loading/> :
    registrationCompanies?.map((company, index) => <Link key={company.slug || index} className="bznew_list_catItem" href={`/${company.slug}`}>{company.name}</Link>)}

    {/* USEFUL DIRECTORIES */}
    <h4 className="bz_cat_heading">Useful Directories</h4>
    <a className="bznew_list_catItem" href="#">Common Service Centre</a>
    <a className="bznew_list_catItem" href="#">Post Office &amp; Pincode</a>
    <a className="bznew_list_catItem" href="#">Bank &amp; IFSC</a>
    <a className="bznew_list_catItem" href="#">Judicial Courts</a>
    <a className="bznew_list_catItem" href="#">Police Station</a>
  </div>
</div>



      <div className="col-12">
        <div className="bznew_list_breadcrumb">
          <Link href="/">Home</Link> <span>›</span>
          {itemsType === "CSC" ?
          <>
            <Link href={`/${parentPlace?.state_slug || parentPlace?.district_slug || parentPlace?.slug}`}>{parentPlace?.district_name || parentPlace?.state_name || parentPlace?.name}</Link> <span>›</span>
            {parentPlace?.state_slug || parentPlace?.district_slug ?
            <>
              <Link href={`/${parentPlace?.state_slug || parentPlace?.district_slug}/csc/`}>CSC</Link> <span>›</span>
            <span>Common Service Center {parentPlace?.name || ""}</span>
            </>
            :
              <span>CSC</span>
            }
          </>

          : itemsType === "RegistrationSubType" ?
            <>
              <Link href={`/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}`}>{locationData?.district_name || locationData?.state_name || locationData?.name}</Link> <span>›</span>
              <span>Filings</span>              
            </>

          : itemsType === "RegistrationDetail" ?
            <>
              <Link href={`/${locationData?.district_slug || locationData?.state_slug}`}>{locationData?.district_name || locationData?.state_name || locationData?.name}</Link> <span>›</span>
              <Link href={`/${locationData?.district_slug || locationData?.state_slug}/filings`}>Filings</Link> <span>›</span>
              <span>{subType?.starting_title} {subType?.name} {subType?.ending_title} {locationData?.name}</span>
            </>

          : itemsType === "ProductSubCategory" ?
            <>
              <Link href={`/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}`}>{locationData?.district_name || locationData?.state_name || locationData?.name}</Link> <span>›</span>
              <span>Products</span>              
            </>

          : itemsType === "ProductDetail" ?
            <>
              <Link href={`/${locationData?.district_slug || locationData?.state_slug}`}>{locationData?.district_name || locationData?.state_name || locationData?.name}</Link> <span>›</span>
              <Link href={`/${locationData?.district_slug || locationData?.state_slug}/products`}>Products</Link> <span>›</span>
              <span>{subCategory?.starting_title} {subCategory?.name} {subCategory?.ending_title} {locationData?.name}</span>
            </>

          : itemsType === "CourseSpecialization" ?
            <>
              <Link href={`/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}`}>{locationData?.district_name || locationData?.state_name || locationData?.name}</Link> <span>›</span>
              <span>Courses</span>              
            </>

          : itemsType === "CourseDetail" ?
            <>
              <Link href={`/${locationData?.district_slug || locationData?.state_slug}`}>{locationData?.district_name || locationData?.state_name || locationData?.name}</Link> <span>›</span>
              <Link href={`/${locationData?.district_slug || locationData?.state_slug}/courses`}>Courses</Link> <span>›</span>
              <span>{specialization?.starting_title} {specialization?.name} {specialization?.ending_title} {locationData?.name}</span>
            </>

          : itemsType === "ServiceSubCategory" ?
            <>
              <Link href={`/${locationData?.state_slug || locationData?.district_slug || locationData?.slug}`}>{locationData?.district_name || locationData?.state_name || locationData?.name}</Link> <span>›</span>
              <span>Services</span>              
            </>

          : itemsType === "ServiceDetail" ?
            <>
              <Link href={`/${locationData?.district_slug || locationData?.state_slug}`}>{locationData?.district_name || locationData?.state_name || locationData?.name}</Link> <span>›</span>
              <Link href={`/${locationData?.district_slug || locationData?.state_slug}/more-services`}>Services</Link> <span>›</span>
              <span>{subCategory?.starting_title} {subCategory?.name} {subCategory?.ending_title} {locationData?.name}</span>
            </>

          : itemsType === "State" ?
            <>
              <span>{state?.name}</span>              
            </>

          : itemsType === "District" ?
            <>
              <span>{district?.name}</span>              
            </>

          : null
          }
        </div>
        <h1 className="bznew_list_headline">
          {itemsType === "CSC" ?
            <>Common Service Centers {parentPlace?.name || ""} <small>({`${items?.length || 0} Centers`})</small></>  

            : itemsType === "RegistrationSubType" ?
            <>Filing {locationData?.name || ""} </>  

            : itemsType === "RegistrationDetail" ?
            <>{subType?.starting_title} {subType?.name} {subType?.ending_title} {locationData?.name} </>

            : itemsType === "ProductSubCategory" ?
            <>Products {locationData?.name || ""} </> 

            : itemsType === "ProductDetail" ?
            <>{subCategory?.starting_title} {subCategory?.name} {subCategory?.ending_title} {locationData?.name} </>
            
            : itemsType === "CourseSpecialization" ?
            <>Courses {locationData?.name || ""} </> 

            : itemsType === "CourseDetail" ?
            <>{specialization?.starting_title} {specialization?.name} {specialization?.ending_title} {locationData?.name} </>

            : itemsType === "ServiceSubCategory" ?
            <>Services {locationData?.name || ""} </> 

            : itemsType === "ServiceDetail" ?
            <>{subCategory?.starting_title} {subCategory?.name} {subCategory?.ending_title} {locationData?.name} </>

            : itemsType === "State" ?
            <>{state?.name || ""} </> 

            : itemsType === "District" ?
            <>{district?.name || ""} </> 

          : null
          }
          </h1>
      </div>
      
      

      <div className="col-12">
     



<div className="bznew_list_searchRow">
  {/* filter icon (unchanged) */}
  <button className="bznew_list_iconBtn" aria-label="Filter">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>
    </svg>
  </button>

  {/* search (unchanged) */}
  <div className="bznew_list_search" role="search">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input id="cityInput" placeholder="Please Enter Your City Name" />
    <div id="citySuggest" className="bznew_list_suggest" role="listbox" aria-label="City suggestions"></div>
  </div>

  {/* NEW: view toggle */}
  <div className="bz_view_toggle" aria-label="Change view">
    {/* Grid button */}
    <button type="button" className="bz_view_btn" id="viewGrid" title="Grid view" aria-pressed="true">
      {/* 4 squares icon */}
      <svg viewBox="0 0 24 24" strokeWidth="2">
        <rect x="4"  y="4"  width="6" height="6" rx="1"></rect>
        <rect x="14" y="4"  width="6" height="6" rx="1"></rect>
        <rect x="4"  y="14" width="6" height="6" rx="1"></rect>
        <rect x="14" y="14" width="6" height="6" rx="1"></rect>
      </svg>
    </button>
    {/* List button */}
    <button type="button" className="bz_view_btn" id="viewList" title="List view" aria-pressed="false">
      {/* two stacked rows icon */}
      <svg viewBox="0 0 24 24" strokeWidth="2">
        <rect x="3" y="5" width="6" height="6" rx="1"></rect>
        <rect x="11" y="6" width="10" height="4" rx="1"></rect>
        <rect x="3" y="13" width="6" height="6" rx="1"></rect>
        <rect x="11" y="14" width="10" height="4" rx="1"></rect>
      </svg>
    </button>
  </div>

  {/* Near Me (unchanged) */}
  <Link className="bznew_list_citychip bznew_list_nearme" href="#" onClick={(e) =>  {e.preventDefault(); handleNearby()}}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
    </svg>
    Near Me
  </Link>

 {/* one-line city slider (unchanged) */}
  <div className="bznew_list_cityrail">
    <button className="bznew_list_city-nav bznew_list_city-prev" id="cityPrev" aria-label="Previous city">‹</button>
    <div className="bznew_list_city-viewport" id="cityViewport">
      <div className="bznew_list_city-track" id="cityTrack">
        <Link className="bznew_list_citychip" href="#"><span className="pin">📍</span>All India</Link>
        {stateDistrictsLoading ? <Loading/> :
          stateDistricts?.map((district, index) => (
          <Link className="bznew_list_citychip" href={itemsType === "CSC" ?
            `/${district.state_slug}/csc/common-service-center-${district.slug}`

          : itemsType === "RegistrationSubType" ?
          `/${district.slug}/filings`

          : itemsType === "RegistrationDetail" ?
          `/${district.state_slug}/filings/${subType?.location_slug || subType?.slug}-${district.slug}`
          
          : itemsType === "ProductSubCategory" ?
          `/${district.slug}/products`

          : itemsType === "ProductDetail" ?
          `/${district.state_slug}/products/${subCategory?.location_slug || subCategory?.slug}-${district.slug}`

          : itemsType === "CourseSpecialization" ?
          `/${district.slug}/courses`

          : itemsType === "CourseDetail" ?
          `/${district.state_slug}/courses/${specialization?.location_slug || specialization?.slug}-${district.slug}`

          : itemsType === "ServiceSubCategory" ?
          `/${district.slug}/more-services`

          : itemsType === "ServiceDetail" ?
          `/${district.state_slug}/more-services/${subCategory?.location_slug || subCategory?.slug}-${district.slug}`

          : itemsType === "State" || itemsType === "District" ?
          `/${district.slug}/`

          : "#"} key={district.slug || index + 1}>{district.name}</Link>)
          )
        }     
      </div>
    </div>
    <button className="bznew_list_city-nav bznew_list_city-next" id="cityNext" aria-label="Next city">›</button>
  </div>
</div>

      </div>
    </div>
  </div>

  {/* FULL-WIDTH BLUE STRIP with slider */}
  <div className="bznew_list_strip">
    <div className="container">
      <div className="bznew_list_card bznew_list_slider">
        <button id="prevBtn" className="bznew_list_nav-btn bznew_list_nav-prev" aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="bznew_list_slider-viewport" id="miniViewport">
          <div className="bznew_list_slider-track" id="miniTrack">
            {/* cards show IMAGE */}

            {shuffledCategories?.map((subCategory, index) => (
              <Link href={`/${subCategory?.url || "#"}`} className="bznew_list_slider-card" key={subCategory.slug || index + 1}>
                <div className="bznew_list_pic">
                  <img src={subCategory?.image_url || "https://admin.bzindia.in/media/product_images/s3.jpg"} alt={subCategory.name}/>
                </div>
                <div>
                  <h6 className="mb-1">{subCategory.name}</h6>
                  <p className="mb-0 bznew_list_muted">{subCategory?.category_name}</p>
                </div>
              </Link>
            ))}
            
          </div>
        </div>

        <button id="nextBtn" className="bznew_list_nav-btn bznew_list_nav-next" aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  </div>
  {/* /FULL-WIDTH BLUE STRIP */}

  <div className="container">
    {/* Main grid: sidebar / main / right rail */}
    <div className="row g-3 mt-2">
{/* ================= DESKTOP CATEGORY SIDEBAR ================= */}
<aside className="col-12 col-lg-3">
  <div className="bznew_list_card p-3 d-none d-lg-block bz_sidebar_sticky">

    {/* PRODUCTS */}
    <div className="bz_cat_group">
      <strong className="bz_cat_heading">Products</strong>
      <div className="bznew_list_list">
        {productCompaniesLoading ? <Loading/> :
        productCompanies?.map((company, index) => <Link href={`/${company?.slug}`} key={company?.slug || index + 1}><span className="bznew_list_dot"></span>{company.name}</Link>)}
         <Link href="#" className="more-link"><span className="more_list_dets">View More...</span></Link>
      </div>
    </div>

    {/* COURSES */}
    <div className="bz_cat_group mt-3">
      <strong className="bz_cat_heading">Courses</strong>
      <div className="bznew_list_list">
        {courseCompaniesLoading ? <Loading/> :
        courseCompanies?.map((company, index) => <Link href={`/${company?.slug}`} key={company?.slug || index + 1}><span className="bznew_list_dot"></span>{company.name}</Link>)}
        <Link href="#" className="more-link"><span className="more_list_dets">View More...</span></Link>
      </div>
    </div>

    {/* SERVICES */}
    <div className="bz_cat_group mt-3">
      <strong className="bz_cat_heading">Services</strong>
      <div className="bznew_list_list">
        {serviceCompaniesLoading ? <Loading/> :
        serviceCompanies?.map((company, index) => <Link href={`/${company?.slug}`} key={company?.slug || index + 1}><span className="bznew_list_dot"></span>{company.name}</Link>)}
        <Link href="#" className="more-link"><span className="more_list_dets">View More...</span></Link>
      </div>
    </div>

    {/* STARTUP SERVICES */}
    <div className="bz_cat_group mt-3">
      <strong className="bz_cat_heading">Startup Services</strong>
      <div className="bznew_list_list">
        {registrationCompaniesLoading ? <Loading/> :
        registrationCompanies?.map((company, index) => <Link href={`/${company?.slug}`} key={company?.slug || index + 1}><span className="bznew_list_dot"></span>{company.name}</Link>)}
        <Link href="#" className="more-link"><span className="more_list_dets">View More...</span></Link>
      </div>
    </div>

    {/* USEFUL DIRECTORIES */}
    <div className="bz_cat_group mt-3">
      <strong className="bz_cat_heading">Useful Directories</strong>
      <div className="bznew_list_list">
        <Link href="#"><span className="bznew_list_dot"></span>Common Service Centre</Link>
        <Link href="#"><span className="bznew_list_dot"></span>Post Office & Pincode</Link>
        <Link href="#"><span className="bznew_list_dot"></span>Bank & IFSC</Link>
        <Link href="#"><span className="bznew_list_dot"></span>Judicial Courts</Link>
        <Link href="#"><span className="bznew_list_dot"></span>Police Station</Link>
       <Link href="#" className="more-link"><span className="more_list_dets">View More...</span></Link>
      </div>
    </div>

    <button className="bznew_list_filterBtn mt-4">Filters</button>
  </div>
</aside>


   <main className="col-12 col-lg-6">
  <div id="listing" className="bz_listing list"> {/* default = list */}

    {itemsType === "CSC" ?
    items?.map((center, index) => (
      <div className="bznew_list_product-hero" key={center.slug || index + 1}>
      <div className="bznew_list_feature-row">
        <div className="bznew_list_imgbox">
          {/* <span className="bznew_list_badge">NEW</span> */}
          <img alt={center.title} src="/images/csc_logo.jpg"/>
          
          <div className="bz_rating" aria-label="Rated 4 out of 5">
        <span className="score">4.0</span>
        <span className="stars">
          {/* 4 filled stars */}
          <span className="bz_star">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
            </svg>
          </span>
          <span className="bz_star">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
            </svg>
          </span>
          <span className="bz_star">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
            </svg>
          </span>
          <span className="bz_star">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
            </svg>
          </span>

          {/* last star (half or empty). Use ONE of these: */}
          {/* half: */}
          <span className="bz_star bz_star--empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
            </svg>
          </span> 

        </span>
      </div>

          
        </div>
        <div className="bznew_list_product-body">
          <h2 className="bznew_list_title">
            <span dangerouslySetInnerHTML={{__html:center.title}}/>
          </h2>
  <div className="bz_meta">  
  <div className="bz_meta_row">
    <span className="bz_meta_label">Place</span>
    <span className="bz_meta_sep">:</span>
    <span className="bz_meta_value">{center.place_name || "Unavailable"}</span>
  </div>
  <div className="bz_meta_row">
    <span className="bz_meta_label">District</span>
    <span className="bz_meta_sep">:</span>
    <span className="bz_meta_value">{center.district_name || "Unavailable"}</span>
  </div>
  <div className="bz_meta_row">
    <span className="bz_meta_label">State</span>
    <span className="bz_meta_sep">:</span>
    <span className="bz_meta_value">{center.state_name || "Unavailable"}</span>
  </div>
  <div className="bz_meta_row">
    <span className="bz_meta_label">Pincode</span>
    <span className="bz_meta_sep">:</span>
    <span className="bz_meta_value">{center.pincode || "Unavailable"}</span>
  </div>
</div>
<div className="bznew_list_cta">
            <a href={`https://www.google.com/maps?q=${center.latitude},${center.longitude}`} target="_blank" rel="noopener noreferrer" style={{padding: "5px 8px"}} className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-compass" aria-hidden="true"></i></a>
            {/* <Link href={`${stateSlug ? `/${stateSlug}`: ""}/${parentPlace?.slug}/csc/${center.slug}`} className="bznew_list_btn primary">Read More</Link> */}
            <Link href={`/${center.district?.slug || parentPlace?.slug}/csc/${center.slug}`} className="bznew_list_btn primary">Read More</Link>
            <a href={`tel:+91${center.contact_number}`} className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
          </div>
        </div>
      </div>
    </div>
    ))    

    : (itemsType === "RegistrationSubType") ? 
      <>
      {subTypesLoading && subTypes.length === 0 && <Loading />}
      {subTypes?.map((subType, index) => (
            <div className="bznew_list_product-hero" key={`${subType?.slug}-${index+1}`}>
              <div className="bznew_list_feature-row">
                <div className="bznew_list_imgbox">
                  {/* <span className="bznew_list_badge">NEW</span> */}
                  <img alt={subType?.name} src={subType?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"}/>
                  <div className="bz_rating" aria-label="Rated 4 out of 5">
          <span className="score">4.0</span>
          <span className="stars">
            {/* 4 filled stars */}
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>

            {/* last star (half or empty). Use ONE of these: */}
            {/* half: */}
            <span className="bz_star bz_star--empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
              </svg>
            </span> 

          </span>
        </div>
          </div>
          <div className="bznew_list_product-body">
            <h2 className="bznew_list_title">
              {subType?.name}

            </h2>
        <div className="bz_meta">
    <div className="bz_meta_row">
      <span className="bz_meta_label">Price</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{subType?.price? `INR ${subType?.price}/-` : "Unavailable"}</span>
    </div>
    <div className="bz_meta_row">
      <span className="bz_meta_label">Time Required</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{subType?.duration || "Unavailable"}</span>
    </div>
    <div className="bz_meta_row">
      <span className="bz_meta_label">Service</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{subType?.type_name}</span>
    </div>
    <div className="bz_meta_row">
      <span className="bz_meta_label">Company</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{subType?.company_name}</span>
    </div>
  </div>
            <div className="bznew_list_cta">
              <a href={`/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/filings/${subType?.location_slug || subType?.slug}-${locationData?.slug}`} className="bznew_list_btn primary">Read More</a>
              <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
            </div>
          </div>
        </div>
      </div>
    ))}
    {subTypesLoading && subTypes.length > 0 && <Loading />}
    <div ref={loaderRef} style={{ height: '1px' }} />
    </>

    : (itemsType === "RegistrationDetail") ? 
      <>
      {registrationDetailsLoading && registrationDetails.length === 0 && <Loading />}
      {registrationDetails?.map((detail, index) => (
            <div className="bznew_list_product-hero" key={`${detail.slug}-${index+1}`}>
              <div className="bznew_list_feature-row">
                <div className="bznew_list_imgbox">
                  {/* <span className="bznew_list_badge">NEW</span> */}
                  <img alt={detail.title} src={detail.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"}/>
                  <div className="bz_rating" aria-label="Rated 4 out of 5">
          <span className="score">4.0</span>
          <span className="stars">
            {/* 4 filled stars */}
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>

            {/* last star (half or empty). Use ONE of these: */}
            {/* half: */}
            <span className="bz_star bz_star--empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
              </svg>
            </span> 

          </span>
        </div>
          </div>
          <div className="bznew_list_product-body">
            <h2 className="bznew_list_title">
              {detail.title}

            </h2>
        <div className="bz_meta">
    <div className="bz_meta_row">
      <span className="bz_meta_label">Price</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{detail.price? `INR ${detail.price}/-` : "Unavailable"}</span>
    </div>
    <div className="bz_meta_row">
      <span className="bz_meta_label">Time Required</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{detail.time_required || "Unavailable"}</span>
    </div>
    <div className="bz_meta_row">
      <span className="bz_meta_label">Service</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{detail.type_name}</span>
    </div>
    <div className="bz_meta_row">
      <span className="bz_meta_label">Company</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{detail?.company_name}</span>
    </div>
  </div>
            <div className="bznew_list_cta">
              <a href={`/${detail.url}`} className="bznew_list_btn primary">Read More</a>
              <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
            </div>
          </div>
        </div>
      </div>
    ))}
    {registrationDetailsLoading && registrationDetails.length > 0 && <Loading />}

    {(!registrationDetailsLoading && firstMultipage) &&
      <div className="bznew_list_product-hero">
              <div className="bznew_list_feature-row">
                <div className="bznew_list_imgbox">
                  {/* <span className="bznew_list_badge">NEW</span> */}
                  <img alt={firstMultipage.title?.replace("place_name", locationData?.name)} src={firstMultipage.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"}/>
                  <div className="bz_rating" aria-label="Rated 4 out of 5">
          <span className="score">4.0</span>
          <span className="stars">
            {/* 4 filled stars */}
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>
            <span className="bz_star">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
              </svg>
            </span>

            {/* last star (half or empty). Use ONE of these: */}
            {/* half: */}
            <span className="bz_star bz_star--empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
              </svg>
            </span> 

          </span>
        </div>
          </div>
          <div className="bznew_list_product-body">
            <h2 className="bznew_list_title">
              {firstMultipage.title}

            </h2>
        <div className="bz_meta">
    <div className="bz_meta_row">
      <span className="bz_meta_label">Price</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{firstMultipage.price? `INR ${firstMultipage.price}/-` : "Unavailable"}</span>
    </div>
    <div className="bz_meta_row">
      <span className="bz_meta_label">Time Required</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{firstMultipage.time_required || "Unavailable"}</span>
    </div>
    <div className="bz_meta_row">
      <span className="bz_meta_label">Service</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{firstMultipage.type_name}</span>
    </div>
    <div className="bz_meta_row">
      <span className="bz_meta_label">Company</span>
      <span className="bz_meta_sep">:</span>
      <span className="bz_meta_value">{firstMultipage?.company_name}</span>
    </div>
  </div>
            <div className="bznew_list_cta">
              <a href={`/${firstMultipage.url}`} className="bznew_list_btn primary">Read More</a>
              <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
            </div>
          </div>
        </div>
      </div>
    }
    <div ref={loaderRef} style={{ height: '1px' }} />
    </>

    : (itemsType === "State" || itemsType === "District") ?
      <>
      <div className="bznew_list_product-hero">
        <div className="bznew_list_feature-row">
          <div className="bznew_list_imgbox">
            <img alt="Filings" src={registrationSubTypes?.filter(subType => subType?.image_url && subType)?.[0]?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"} loading='lazy' />                 
          </div>
          <div className="bznew_list_product-body">
            <h2 className="bznew_list_title">
              Filings
            </h2>
            <div className="bz_meta">    
              <ul className="bz_inline-bullet-list">
                {registrationSubTypes?.map((subType, index) => <li key={subType?.slug || index + 1}><Link href={`/${state?.slug || district?.slug}/filings/${subType?.location_slug || subType?.slug}-${state?.slug || district?.slug}`}>{subType?.name}</Link></li>)}      
              </ul>
            </div>
            <div className="bznew_list_cta">
              <a href={`/${state?.slug || district?.slug}/filings/`} className="bznew_list_btn primary">Read More</a>
              <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bznew_list_product-hero">
        <div className="bznew_list_feature-row">
          <div className="bznew_list_imgbox">
            <img alt="Products" src={productSubCategories?.filter(sub_cat => sub_cat?.image_url && sub_cat)?.[0]?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"}/>                 
          </div>
          <div className="bznew_list_product-body">
            <h2 className="bznew_list_title">
              Products
            </h2>
            <div className="bz_meta">    
              <ul className="bz_inline-bullet-list">
                {productSubCategories?.map((subCategory, index) => <li key={subCategory?.slug || index + 1}><Link href={`/${state?.slug || district?.slug}/products/${subCategory?.location_slug || subCategory?.slug}-${state?.slug || district?.slug}`}>{subCategory?.name}</Link></li>)}      
              </ul>
            </div>
            <div className="bznew_list_cta">
              <a href={`/${state?.slug || district?.slug}/products/`} className="bznew_list_btn primary">Read More</a>
              <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bznew_list_product-hero">
        <div className="bznew_list_feature-row">
          <div className="bznew_list_imgbox">
            <img alt="Courses" src={courseSpecializations?.filter(spec => spec?.image_url && spec)?.[0]?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"}/>                 
          </div>
          <div className="bznew_list_product-body">
            <h2 className="bznew_list_title">
              Courses
            </h2>
            <div className="bz_meta">    
              <ul className="bz_inline-bullet-list">
                {courseSpecializations?.map((specialization, index) => <li key={specialization?.slug || index + 1}><Link href={`/${state?.slug || district?.slug}/courses/${specialization?.location_slug || specialization?.slug}-${state?.slug || district?.slug}`}>{specialization?.name}</Link></li>)}      
              </ul>
            </div>
            <div className="bznew_list_cta">
              <a href={`/${state?.slug || district?.slug}/courses/`} className="bznew_list_btn primary">Read More</a>
              <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bznew_list_product-hero">
        <div className="bznew_list_feature-row">
          <div className="bznew_list_imgbox">
            <img alt="Services" src={serviceSubCategories?.filter(subCat => subCat?.image_url && subCat)?.[0]?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"}/>                 
          </div>
          <div className="bznew_list_product-body">
            <h2 className="bznew_list_title">
              Services
            </h2>
            <div className="bz_meta">    
              <ul className="bz_inline-bullet-list">
                {serviceSubCategories?.map((subCategory, index) => <li key={subCategory?.slug || index + 1}><Link href={`/${state?.slug || district?.slug}/more-services/${subCategory?.location_slug || subCategory?.slug}-${state?.slug || district?.slug}`}>{subCategory?.name}</Link></li>)}      
              </ul>
            </div>
            <div className="bznew_list_cta">
              <a href={`/${state?.slug || district?.slug}/more-services/`} className="bznew_list_btn primary">Read More</a>
              <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bznew_list_product-hero">
      <div className="bznew_list_feature-row">
        <div className="bznew_list_imgbox">
          {/* <span className="bznew_list_badge">NEW</span> */}
          <img alt="Common Service Centers" src="/images/csc_logo.jpg"/>                    

          
        </div>
        <div className="bznew_list_product-body">
          <h2 className="bznew_list_title">
            Common Service Centers
          </h2>
  <div className="bz_meta">  
  <ul className="bz_inline-bullet-list">
    {
      nearbyCscCentersLoading? <Loading/> :
    nearbyCscCenters?.map((center, index) => <li key={center?.slug || index + 1}><Link href={`/${district?.slug || state?.slug}/csc/${center.slug}`}>{center?.name}</Link></li>)
    }      
  </ul>
</div>
<div className="bznew_list_cta">
            {/* <Link href={`${stateSlug ? `/${stateSlug}`: ""}/${parentPlace?.slug}/csc/${center.slug}`} className="bznew_list_btn primary">Read More</Link> */}
            <Link href={`/${district?.state?.slug || state?.slug}/csc/${district?.slug ? `common-service-center-${district?.slug}` : ""}`} className="bznew_list_btn primary">Read More</Link>
             <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
          </div>
        </div>
      </div>
    </div>

      </>

    : (itemsType === "ProductSubCategory") ? 
      <>
        {prodSubCategoriesLoading && prodSubCategories.length === 0 && <Loading />}
        {prodSubCategories?.map((subCategory, index) => (
          <div className="bznew_list_product-hero" key={`${subCategory?.slug} - ${index + 1}`}>
            <div className="bznew_list_feature-row">
              <div className="bznew_list_imgbox">
                {/* <span className="bznew_list_badge">NEW</span> */}
                <img alt={subCategory?.name || ""} src={subCategory?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"} />
                
                <div className="bz_rating" aria-label="Rated 4 out of 5">
                  <span className="score">4.0</span>
                  <span className="stars">
                    {/* 4 filled stars */}
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>

                    {/* last star (half or empty). Use ONE of these: */}
                    {/* half: */}
                    <span className="bz_star bz_star--empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
                      </svg>
                    </span> 

                  </span>
                </div>

                
              </div>
              <div className="bznew_list_product-body">
                <h2 className="bznew_list_title">
                  {subCategory.name}
                </h2>
                <div className="bz_meta">
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Price</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{subCategory?.price? `INR ${subCategory?.price}/-` : "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Stock</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{subCategory?.stock || "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Product</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{subCategory?.category_name}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Company</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{subCategory?.company_name}</span>
                </div>
              </div>
              <div className="bznew_list_cta">
                  <a href={`/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/products/${subCategory?.location_slug || subCategory?.slug}-${locationData?.slug}`} className="bznew_list_btn primary">Buy Now</a>
                  <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {prodSubCategoriesLoading && prodSubCategories.length > 0 && <Loading />}
        <div ref={loaderRef} style={{ height: '1px' }} />
      </>

    : (itemsType === "ProductDetail") ? 
      <>
        {productDetailsLoading && productDetails.length === 0 && <Loading />}
        {productDetails?.map((detail, index) => (
          <div className="bznew_list_product-hero" key={`${detail?.slug} - ${index + 1}`}>
            <div className="bznew_list_feature-row">
              <div className="bznew_list_imgbox">
                {/* <span className="bznew_list_badge">NEW</span> */}
                <img alt={detail?.product?.name || ""} src={detail?.product?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"} />
                
                <div className="bz_rating" aria-label="Rated 4 out of 5">
                  <span className="score">4.0</span>
                  <span className="stars">
                    {/* 4 filled stars */}
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>

                    {/* last star (half or empty). Use ONE of these: */}
                    {/* half: */}
                    <span className="bz_star bz_star--empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
                      </svg>
                    </span> 

                  </span>
                </div>

                
              </div>
              <div className="bznew_list_product-body">
                <h2 className="bznew_list_title" style={{display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}} title={detail.product?.name}>
                  {detail.product?.name}
                </h2>
                <div className="bz_meta">
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Price</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{detail?.product?.price? `INR ${detail?.product?.price}/-` : "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Stock</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{detail?.product?.stock || "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Product</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{detail?.product?.category_name}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Company</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{detail?.product?.company_name}</span>
                </div>
              </div>
              <div className="bznew_list_cta">
                  <a href={`/${detail?.url}`} className="bznew_list_btn primary">Buy Now</a>
                  <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {productDetailsLoading && productDetails.length > 0 && <Loading />}
        <div ref={loaderRef} style={{ height: '1px' }} />
      </>   
      
    : (itemsType === "CourseSpecialization") ? 
      <>
        {eduSpecializationsLoading && eduSpecializations.length === 0 && <Loading />}
        {eduSpecializations?.map((specialization, index) => (
          <div className="bznew_list_product-hero" key={`${specialization?.slug} - ${index + 1}`}>
            <div className="bznew_list_feature-row">
              <div className="bznew_list_imgbox">
                {/* <span className="bznew_list_badge">NEW</span> */}
                <img alt={specialization?.name || ""} src={specialization?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"} />
                
                <div className="bz_rating" aria-label="Rated 4 out of 5">
                  <span className="score">4.0</span>
                  <span className="stars">
                    {/* 4 filled stars */}
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>

                    {/* last star (half or empty). Use ONE of these: */}
                    {/* half: */}
                    <span className="bz_star bz_star--empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
                      </svg>
                    </span> 

                  </span>
                </div>

                
              </div>
              <div className="bznew_list_product-body">
                <h2 className="bznew_list_title">
                  {specialization.name}
                </h2>

                <div className="bz_meta">
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Price</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{specialization?.price? `INR ${specialization?.price}/-` : "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Duration</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{specialization?.duration || "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Course Mode</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{specialization?.mode || "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Institution</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{specialization?.company_name}</span>
                </div>
              </div>
              <div className="bznew_list_cta">
                  <a href={`/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/courses/${specialization?.location_slug || specialization?.slug}-${locationData?.slug}`} className="bznew_list_btn primary">Read More</a>
                  <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {eduSpecializationsLoading && eduSpecializations.length > 0 && <Loading />}
        <div ref={loaderRef} style={{ height: '1px' }} />
      </>

    : (itemsType === "CourseDetail") ? 
      <>
        {courseDetailsLoading && courseDetails.length === 0 && <Loading />}
        {courseDetails?.map((detail, index) => (
          <div className="bznew_list_product-hero" key={`${detail?.slug} - ${index + 1}`}>
            <div className="bznew_list_feature-row">
              <div className="bznew_list_imgbox">
                {/* <span className="bznew_list_badge">NEW</span> */}
                <img alt={detail?.course?.name || ""} src={detail?.course?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"} />
                
                <div className="bz_rating" aria-label="Rated 4 out of 5">
                  <span className="score">4.0</span>
                  <span className="stars">
                    {/* 4 filled stars */}
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>

                    {/* last star (half or empty). Use ONE of these: */}
                    {/* half: */}
                    <span className="bz_star bz_star--empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
                      </svg>
                    </span> 

                  </span>
                </div>

                
              </div>
              <div className="bznew_list_product-body">
                <h2 className="bznew_list_title">
                  {detail.course?.name}
                </h2>

                <div className="bz_meta">
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Price</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{detail?.course?.price? `INR ${detail?.course?.price}/-` : "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Duration</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{detail?.course?.duration || "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Course Mode</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{detail?.course?.mode || "Unavailable"}</span>
                </div>
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Institution</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{detail?.company_name}</span>
                </div>
              </div>
              <div className="bznew_list_cta">
                  <a href={`/${detail?.url}`} className="bznew_list_btn primary">Read More</a>
                  <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {courseDetailsLoading && courseDetails.length > 0 && <Loading />}
        <div ref={loaderRef} style={{ height: '1px' }} />
      </>

    : (itemsType === "ServiceSubCategory") ? 
      <>
        {servSubCategoriesLoading && servSubCategories.length === 0 && <Loading />}
        {servSubCategories?.map((subCategory, index) => (
          <div className="bznew_list_product-hero" key={`${subCategory?.slug} - ${index + 1}`}>
            <div className="bznew_list_feature-row">
              <div className="bznew_list_imgbox">
                {/* <span className="bznew_list_badge">NEW</span> */}
                <img alt={subCategory?.name || ""} src={subCategory?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"} />
                
                <div className="bz_rating" aria-label="Rated 4 out of 5">
                  <span className="score">4.0</span>
                  <span className="stars">
                    {/* 4 filled stars */}
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>

                    {/* last star (half or empty). Use ONE of these: */}
                    {/* half: */}
                    <span className="bz_star bz_star--empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
                      </svg>
                    </span> 

                  </span>
                </div>

                
              </div>
              <div className="bznew_list_product-body">
                <h2 className="bznew_list_title">
                  {subCategory.name}
                </h2>
                <div className="bz_meta">
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Price</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{subCategory?.price? `INR ${subCategory?.price}/-` : "Unavailable"}</span>
              </div>
              <div className="bz_meta_row">
                <span className="bz_meta_label">Duration</span>
                <span className="bz_meta_sep">:</span>
                <span className="bz_meta_value">{subCategory?.duration || "Unavailable"}</span>
              </div>
              <div className="bz_meta_row">
                <span className="bz_meta_label">Service</span>
                <span className="bz_meta_sep">:</span>
                <span className="bz_meta_value">{subCategory?.category_name || "Unavailable"}</span>
              </div>
              <div className="bz_meta_row">
                <span className="bz_meta_label">Company</span>
                <span className="bz_meta_sep">:</span>
                <span className="bz_meta_value">{subCategory?.company_name}</span>
              </div>
              </div>
              <div className="bznew_list_cta">
                  <a href={`/${locationData?.district_slug || locationData?.state_slug || locationData?.slug}/more-services/${subCategory?.location_slug || subCategory?.slug}-${locationData?.slug}`} className="bznew_list_btn primary">Read More</a>
                  <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {servSubCategoriesLoading && servSubCategories.length > 0 && <Loading />}
        <div ref={loaderRef} style={{ height: '1px' }} />
      </>

    : (itemsType === "ServiceDetail") ? 
      <>
        {serviceDetailsLoading && serviceDetails.length === 0 && <Loading />}
        {serviceDetails?.map((detail, index) => (
          <div className="bznew_list_product-hero" key={`${detail?.slug} - ${index + 1}`}>
            <div className="bznew_list_feature-row">
              <div className="bznew_list_imgbox">
                {/* <span className="bznew_list_badge">NEW</span> */}
                <img alt={detail?.service?.name || ""} src={detail?.service?.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"} />
                
                <div className="bz_rating" aria-label="Rated 4 out of 5">
                  <span className="score">4.0</span>
                  <span className="stars">
                    {/* 4 filled stars */}
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>
                    <span className="bz_star">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.896 4.66 23.17l1.403-8.168L.125 9.211l8.207-1.193z"/>
                      </svg>
                    </span>

                    {/* last star (half or empty). Use ONE of these: */}
                    {/* half: */}
                    <span className="bz_star bz_star--empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 18l-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z"/>
                      </svg>
                    </span> 

                  </span>
                </div>

                
              </div>
              <div className="bznew_list_product-body">
                <h2 className="bznew_list_title">
                  {detail.service?.name}
                </h2>
                <div className="bz_meta">
                <div className="bz_meta_row">
                  <span className="bz_meta_label">Price</span>
                  <span className="bz_meta_sep">:</span>
                  <span className="bz_meta_value">{detail?.service?.price? `INR ${detail?.service?.price}/-` : "Unavailable"}</span>
              </div>
              <div className="bz_meta_row">
                <span className="bz_meta_label">Duration</span>
                <span className="bz_meta_sep">:</span>
                <span className="bz_meta_value">{detail?.service?.duration || "Unavailable"}</span>
              </div>
              <div className="bz_meta_row">
                <span className="bz_meta_label">Service</span>
                <span className="bz_meta_sep">:</span>
                <span className="bz_meta_value">{detail?.service?.category_name || "Unavailable"}</span>
              </div>
              <div className="bz_meta_row">
                <span className="bz_meta_label">Company</span>
                <span className="bz_meta_sep">:</span>
                <span className="bz_meta_value">{detail?.company_name}</span>
              </div>
              </div>
              <div className="bznew_list_cta">
                  <a href={`/${detail?.url}`} className="bznew_list_btn primary">Read More</a>
                  <a href="#" className="bznew_list_btn ghost"><i className="bi bi-telephone"></i><i className="fa fa-phone" aria-hidden="true"></i> Call Us</a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {serviceDetailsLoading && serviceDetails.length > 0 && <Loading />}
        <div ref={loaderRef} style={{ height: '1px' }} />
      </>

    : null
    }

  

    {/* Duplicate more cards */}
    
  </div>
</main>


      {/* right */}
      <aside className="col-12 col-lg-3">
      <div className="bznew_list_card p-3">
        
               <div className="faq-form-section" style={{padding: "0px 0px 20px 0px", boxShadow: "none", marginBottom:"25px", borderRadius: "0", border: "0", borderBottom:"1px solid var(--line)"}}>
                <h2 style={{color:"#000"}}>ENQUIRE NOW</h2>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                 <GeneralEnquiryForm setMessage={setMessage} setMessageClass={setMessageClass}/>
              </div>
      
        
          <h3 className="h6">Popular Products</h3>
          {popularProducts?.map((detail, index) => (
            <div className="bznew_list_p-card mt-2" key={detail.slug || index}>
              <img src={detail.product?.image_url || "/images/no_image.jpeg"} className="bznew_list_img" alt={detail.product?.name}/>
              <div>
                <Link href={`/${detail.url}`} style={{textAlign:"left", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis"}}>{detail.product?.name}</Link>
                <div className="bznew_list_price">&#8377;{detail.product?.price}</div>
                <Link className="bznew_list_buy" href={`/${detail.url}`}>Buy Now</Link>
              </div>
            </div>
          ))}

        </div>
      </aside>
    </div>
  </div>
</section>




{(
  itemsType === "CSC" 
  || itemsType === "RegistrationDetail"
  || itemsType === "ProductDetail"
  || itemsType === "CourseDetail"
) && 
  <section className="cleints-listing-secion py-5 h2_second">
      <div className="container">

          <h2>{
          itemsType === "RegistrationDetail" ? subType?.name 
          : itemsType === "ProductDetail" ? subCategory?.name 
          : itemsType === "CourseDetail" ? specialization?.name 
          : "Common Service Center (CSC) in India"
          }</h2>
          <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

          <div className="row" data-aos="fade-up">
            <div className="col-md-12">
              {(itemsType === "RegistrationDetail" || itemsType === "ProductDetail" || itemsType === "CourseDetail")?
               <div style={{textAlign: "left"}} dangerouslySetInnerHTML={{__html:sanitizedContent}} />
              :
                <p>


The Common Services Centre (CSC) programme, spearheaded by the Ministry of Electronics and IT (MeitY), Government of India, serves as a cornerstone for providing digital services to both rural and urban populations across the country. This initiative plays a vital role in fostering a society that is both digitally and financially inclusive. In rural areas, CSCs act not only as hubs for service delivery but also as catalysts for transformation, driving rural entrepreneurship and enhancing skills, livelihoods, and local capacities.

CSC e-Governance Services India Limited, established under the Companies Act, 1956, operates as the central body facilitating the efficient delivery of services through CSCs. This ensures the operational viability and long-term sustainability of the programme. These centres offer a wide range of web-enabled e-governance services, such as applications for essential documents like Passports, PAN cards, Aadhaar, Voter ID, and Ration Cards. Additionally, they handle utility bill payments for electricity, water, and telephone services.

Through CSCs, citizens gain access to affordable and high-quality services in areas such as e-governance, education, healthcare, telemedicine, tele-law, and entertainment. By bridging the digital divide, CSCs continue to empower communities and drive India's digital transformation.
        </p>
              }            
              </div>
            
          </div>
        

      </div>
  </section>
}

{(
  itemsType === "CSC" 
  || (itemsType === "RegistrationDetail" && !subType?.hide_faqs)
  || (itemsType === "ProductDetail" && !subCategory?.hide_faqs)
  || (itemsType === "CourseDetail" && !specialization?.hide_faqs)
  ) && 
<div className="container">
  <div className="row">
    <div className="col-md-12" data-aos="fade-up">
      <div className="regstrtn-faq-space">
        <div className="registrsn-fq-scrool-bar-clm">
          <h3 id="slug-faqs">{itemsType === "RegistrationDetail"? subType?.name : "CSC"} FAQ'S</h3>
          <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
          <div className="registrsn-fq-scrool-bar-clm-cntnt">
            <div className=" pre-scrollable" style={{height: "470px", overflowY: "auto"}}>                    
              <div itemScope="" itemProp="mainEntity" itemType="https://schema.org/Question">

                <Faq faqs={faqs}/>

              </div>                    
            </div>
          </div>
        </div>
      </div>
    </div>          
  </div>
</div>
} 

    </>
  )
}

export default ListingPage