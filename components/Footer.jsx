import React, {useContext, useEffect, useRef, useState} from 'react';
import LatestArticle from './common/LatestArticle';

import $ from 'jquery';
import '/public/easy-responsive-tabs';

import FooterCompanies from './home/FooterCompanies';
import FooterContent from './home/FooterContent';
import Loading from './Loading';
import Link from 'next/link';
import location from '../lib/api/location';
import company from '../lib/api/company';
import BlogContext from './context/BlogContext';
import LocationContext from './context/LocationContext';
import { useRouter } from 'next/router';

const Footer = () => {    
  const {blogs} = useContext(BlogContext);

  const router = useRouter();

  let isCscPage = false;

  if (router.pathname.includes('/csc/')) {
    isCscPage = true;
  }
  
  const {slug} = router.query;
  const {multipageParams} = router.query;
  const {placeLocation} = useContext(LocationContext);  

  const [passingSlug, setPassingSlug] = useState();

  const [currentCompany, setCurrentCompany] = useState();

  const [popularCities, setPopularCities] = useState();
  const [popularCitiesLoading, setPopularCitiesLoading] = useState(true);  
  
  const [companies, setCompanies] = useState();
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [states, setStates] = useState();
  const [statesLoading, setStatesLoading] = useState(true);

  const [companyTypes, setCompanyTypes] = useState();
  const [companyTypesLoading, setCompanyTypesLoading] = useState(true);  

  const [locationBasedCompanyTypes, setLocationBasedCompanyTypes] = useState();
  const [locationBasedCompanyTypesLoading, setLocationBasedCompanyTypesLoading] = useState(true);    

  const [nearestPlace, setNearestPlace] = useState([]);
  const [nearestPlaceLoading, setNearestPlaceLoading] = useState([]);

  let cscUrlParentSlug = nearestPlace?.district?.slug || nearestPlace?.state?.slug || "maharashtra";
  let cscUrlChildSlug = `common-service-center-${ nearestPlace?.slug || "thane"}`

  if (placeLocation && placeLocation != "India") {
    cscUrlParentSlug = placeLocation?.district_slug || placeLocation?.district?.slug || placeLocation?.state_slug || placeLocation?.state?.slug || placeLocation?.slug
        
    if (placeLocation?.slug != cscUrlParentSlug) {
      cscUrlChildSlug = `common-service-center-${placeLocation?.slug}`;
    } else {
      cscUrlChildSlug = "";
    }
  }
  
  useEffect(() => {
    if (slug) {
      setPassingSlug(slug);
    } else if (multipageParams?.[0]) {
      if (!(/^\d+$/.test(multipageParams?.[0] ?? ""))) {
        setPassingSlug(multipageParams?.[0]);
      }

    }

  }, [slug, multipageParams]);  

  useEffect(() => {
    if (!passingSlug) return;

    const fetchCurrentCompany = async () => {
      try {
        const response = await company.getCompany(passingSlug);
        setCurrentCompany(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentCompany();

  }, [passingSlug]);

  // Destinations  
  useEffect(() => {    

    const fetchCompanies = async () => {
      try {
        const response = await company.getCompanies();
        setCompanies(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCompaniesLoading(false);
      }
    }

    fetchCompanies();
  }, []);    

  useEffect(() => {
    const fetchCompanyTypes = async () => {
      try {
        let response;

        if (placeLocation) {
          response = await company.getFooterCompanyTypes(placeLocation);
          setLocationBasedCompanyTypes(response.data);

        } else {
          response = await company.getFooterCompanyTypes();
          setCompanyTypes(response.data);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setCompanyTypesLoading(false);
        setLocationBasedCompanyTypesLoading(false);
      }
    };

    fetchCompanyTypes();
  }, [placeLocation]);


  useEffect(() => {    

    const fetchPopularCities = async () => {
      try {
        const response = await location.getPopularCities();
        setPopularCities(
          response.data?.map((city) => ({
            "name": city.name,
            "slug": city.slug,
            "district_name": city.district_name,
            "district_slug": city.district_slug,
            "state_name": city.state_name,
            "state_slug": city.state_slug,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setPopularCitiesLoading(false);
      }
    };

    const fetchStates = async () => {
      try {
        const response = await location.getMinimalStates();
        setStates(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setStatesLoading(false);
      }
    }

    fetchPopularCities();
    fetchStates();
  }, []);  

  // Nearest Place  
  useEffect(() => {
    const fetchNearestPlace = async () => {
        try {          
          const response = await location.getNearestPlace();

          setNearestPlace(response.data);
        } catch (err) {
          console.error("Geolocation error:", err);
        } finally {
          setNearestPlaceLoading(false);
        }
      }
  
    fetchNearestPlace();
  }, []);

  const updatedMultipage = (multipage, city) => {    
    const title = multipage?.title?.replace("place_name", placeLocation?.name || city?.name || "India");
    const slug = multipage?.slug || "";
    const companySlug = multipage?.company_slug || "";
    const urlType = multipage?.url_type;

    let updatedMultipageSlug = slug;
    let modifiedUrl = "";

    if (urlType === "location_filtered") {
      updatedMultipageSlug = updatedMultipageSlug.replace("-place_name", "");
      if (city) {
        modifiedUrl = `${companySlug}${updatedMultipageSlug}/${city?.state_slug}/${city?.district_slug}/${city?.slug}`;
      } else if (placeLocation && placeLocation.district) {
        modifiedUrl = `${companySlug}${updatedMultipageSlug}/${placeLocation?.state?.slug}/${placeLocation?.district?.slug}/${placeLocation?.slug}`;
      } else if (placeLocation && placeLocation.state) {
        modifiedUrl = `${companySlug}${updatedMultipageSlug}/${placeLocation?.state?.slug}/${placeLocation?.slug}`;
      } else if (placeLocation) {
        modifiedUrl = `${companySlug}${updatedMultipageSlug}/${placeLocation?.slug || "india"}`;
      } else {
        modifiedUrl = `${companySlug}${updatedMultipageSlug}/india`;
      }       
    } else {
      updatedMultipageSlug = updatedMultipageSlug.replace("place_name", placeLocation?.slug || city?.slug || "india");
      modifiedUrl = `${companySlug}${updatedMultipageSlug}`;      
    }


    return {
      url: modifiedUrl,
      title,
      slug,
    };

  };

  const tabRef = useRef(null);

  useEffect(() => {
    if (typeof $ !== 'undefined' && $.fn.easyResponsiveTabs && tabRef.current) {
      const hasData = (locationBasedCompanyTypes || companyTypes) && (placeLocation || popularCities);

      if (hasData) {
        const timer = setTimeout(() => {
          $(tabRef.current).easyResponsiveTabs({
            type: 'horizontal',
            width: 'auto',
            fit: true,
          });
        }, 0);

        return () => {
          clearTimeout(timer);

          $(tabRef.current).find('.resp-tab-item').off();
          $(tabRef.current).find('.resp-content').off();

          if (typeof $(tabRef.current).data('easyResponsiveTabs')?.destroy === 'function') {
            $(tabRef.current).data('easyResponsiveTabs').destroy();
          }
        };
      }
    }
  }, [
    companyTypes,
    popularCities,
    locationBasedCompanyTypes,
    placeLocation,
    companiesLoading,
    locationBasedCompanyTypesLoading,
  ]);

  return (
    <>
    {blogs?.length > 0 &&    
    <LatestArticle blogs={blogs} company={currentCompany}/>
    }
     
  {/* footer section start  */}

  <footer>
    <div className="container">

      {companiesLoading ? <Loading/>
      :
      <FooterCompanies companies={companies?.slice(0,12)}/>
      }

<>    

    <div className="row">
      <h1 className="foot_head">
        <a href="#">
          <i className="fa fa-crosshairs" aria-hidden="true"></i>
        </a>
        Public Services & Directories Nearby
      </h1>

      <div className="footer_directory">
        <Link className="anchor" href={`/${cscUrlParentSlug}/csc/${cscUrlChildSlug}`}>Common Service Centre - CSC in Nearby Locations</Link>
        <Link className="anchor" href="#">Post Office & Pincode in Nearby Locations</Link>
        <Link className="anchor" href="#">Police Stations in Nearby Locations</Link>
        <Link className="anchor" href="#">Judicial Courts in Nearby Locations</Link>
        <Link className="anchor" href="#">Bank and IFSC in Nearby Locations</Link>
        <Link className="anchor" href="#"> Destinations in Nearby Locations</Link>
      </div>
    </div>

    <div className="row">
   <h1 className="foot_head" ><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Popular Cities in India</h1>
    <div className="footer_directory">
      {popularCitiesLoading ? <Loading/> :
      popularCities?.map((city, index) => <Link key={`${city.slug}-${index + 1}`} className="anchor" href={`/state-list-in-india/${city.state_slug}/${city.district_slug? `${city.district_slug}/${city.slug}` : `${city.slug}`}`} >{city?.name}</Link>)}
    </div>
  </div>
  </>


<div className="row">
    <h1 className="foot_head"><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Explore State-Wise, District-Wise Locations</h1>
    <div className="footer_directory">      
      {statesLoading ? <Loading/>
      :  
      states?.map((state, index) => <Link key={state?.slug || index + 1} className="anchor" href={`/${state?.slug || ""}`} >District List of {state?.name}</Link>)
      }
  
    </div>
</div>

      {/*  */}
      <div className="row">
  
 
  <div className="col-md-12 col-sm-12 col-xs-12">
    {companyTypesLoading || locationBasedCompanyTypesLoading || popularCitiesLoading ? <Loading/> :
    <div ref={tabRef} className="horizontal-tab">
      <ul className="resp-tabs-list">            
        {(placeLocation? locationBasedCompanyTypes : companyTypes)?.map((company_type, index) => (
          <li key={company_type.slug || index + 1}>{company_type.name === "Education" ? "Course" : company_type.name}s in India</li>    
        ))}          
      </ul>
      <div className="resp-tabs-container">
        {(placeLocation? locationBasedCompanyTypes : companyTypes)?.map((company_type, index) => (

          <div key={`${company_type.slug}-${index + 1}`}>
            {placeLocation ? 
              company_type.companies?.filter(company => company.multipages?.length > 0).map((company, companyIndex) => (
                <div key={`${company_type.slug}-${company.slug}-${companyIndex + 1}`}>
                  <h6 className="foot_head">
                    {company.name}: {company_type.name === "Education" ? "Course" : company_type.name}s
                  </h6>
                  <div className="footer_directory">
                    {company.multipages?.map((multipage, multipageIndex) => (
                      <Link
                        className="anchor"
                        key={`${company_type.slug}-${company.slug}-${multipage.slug}-${multipageIndex}`}
                        href={`/${company.slug}/${updatedMultipage(multipage)?.url}`}
                        
                      
                        title={`${updatedMultipage(multipage)?.title}`}
                      >
                        {updatedMultipage(multipage)?.title}
                      </Link>
                      ))}
                  </div>
                </div>
              ))        
            : 
              popularCitiesLoading ? <Loading/> 
                :
                <>
                {company_type.companies?.filter(company => company.multipages?.length > 0).map((company, companyIndex) => (
                  <div key={company.slug || companyIndex + 1}>
                    <h6 className="foot_head">
                      {company.name}: {company_type.name === "Education" ? "Course" : company_type.name}s
                    </h6>
                    <div className="footer_directory">
                      {company.multipages
                        // ?.filter(multipage => multipage.home_footer_visibility)                    
                        ?.map((multipage, multipageIndex) => (
                          popularCities?.map((city, cityIndex) => (
                            <Link
                              className="anchor"
                              key={`${multipage.slug}-${city.slug}-${cityIndex}`}
                              href={`/${company.slug}/${updatedMultipage(multipage, city).url}`}
                              
                            
                              title={`${updatedMultipage(multipage, city).title}`}
                            >
                              {updatedMultipage(multipage, city).title}
                            </Link>
                          ))
                        ))}
                    </div>
                  </div>
                ))}
                </>
              }
              
              
          </div>

        ))}        
      
      </div>
    </div>
    }
  </div>
 
 
</div>

      {/*  */}
 
      <div className="row" style={{paddingTop: "30px"}}>
     
        <div className="col-md-12">
          <ul className="social-icons" style={{width:"100%"}} itemScope itemType="https://schema.org/Organization">
  <link itemProp="url" href="https://bzindia.in/" />
  <li><Link itemProp="sameAs" href="https://www.facebook.com/BZindia/" title="Facebook" rel="me noopener noreferrer" target="_blank"><i className="fa fa-facebook" aria-hidden="true"></i></Link></li>
  <li><Link itemProp="sameAs" href="https://twitter.com/Bzindia_in" title="Twitter" rel="me noopener noreferrer" target="_blank"><i className="fa fa-twitter" aria-hidden="true"></i></Link></li>
  <li><Link itemProp="sameAs" href="https://www.instagram.com/bzindia/" title="Instagram" rel="me noopener noreferrer" target="_blank"><i className="fa fa-instagram" aria-hidden="true"></i></Link></li>
  <li><Link itemProp="sameAs" href="https://www.linkedin.com/company/bzindia" title="LinkedIn" rel="me noopener noreferrer" target="_blank"><i className="fa fa-linkedin" aria-hidden="true"></i></Link></li>
  <li><Link itemProp="sameAs" href="https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1" title="YouTube" rel="me noopener noreferrer" target="_blank"><i className="fa fa-youtube-play" aria-hidden="true"></i></Link></li>
  <li><Link itemProp="sameAs" href="https://in.pinterest.com/bzindia/" title="Pinterest" rel="me noopener noreferrer" target="_blank"><i className="fa fa-pinterest-p" aria-hidden="true"></i></Link></li>
  <li><Link itemProp="sameAs" href="https://bzindia.tumblr.com/" title="Tumblr" rel="me noopener noreferrer" target="_blank"><i className="fa fa-tumblr" aria-hidden="true"></i></Link></li>
  <li><Link itemProp="sameAs" href="#" title="Google Plus" rel="me noopener noreferrer" target="_blank"><i className="fa fa-google-plus" aria-hidden="true"></i></Link></li>
  <li><Link itemProp="sameAs" href="https://www.slideshare.net/BZindia" title="SlideShare" rel="me noopener noreferrer" target="_blank"><i className="fa fa-slideshare" aria-hidden="true"></i></Link></li>
  <li><Link itemProp="sameAs" href="https://www.reddit.com/user/bzindia-in/" title="Reddit" rel="me noopener noreferrer" target="_blank"><i className="fa fa-reddit" aria-hidden="true"></i></Link></li>	 
  <li><Link itemProp="sameAs" href="https://www.flickr.com/photos/193921536@N03/" title="Flickr" rel="me noopener noreferrer" target="_blank"><i className="fa fa-flickr" aria-hidden="true"></i></Link></li>
  
</ul>
        </div>
        <div className="col-md-12">
          <div className="privecy-plcy-bx">
            <div className="privecy-plcy-bx-cntnt">
              <span className="ftr-spn-privcy">
                <Link href="/">Home</Link>
                <span className="ftr-spn-privcy-divid-br">|</span>
                <Link href="/about-us">About Us</Link>
                <span className="ftr-spn-privcy-divid-br">|</span>
                <Link href="/contact-us">Contact Us</Link>
                <span className="ftr-spn-privcy-divid-br">|</span>
                <Link href="/faqs">FAQs</Link>
                <span className="ftr-spn-privcy-divid-br">|</span>
                <Link href="/learn">Blogs</Link>
                <span className="ftr-spn-privcy-divid-br">|</span>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <span className="ftr-spn-privcy-divid-br">|</span>
                <Link href="/terms-conditions">Terms & Conditions</Link>
                <span className="ftr-spn-privcy-divid-br">|</span>
                <Link href="/shipping-delivery-policy">Shipping & Delivery Policy</Link>
                <span className="ftr-spn-privcy-divid-br">|</span>
                <Link href="/cancellation-refund-policy">Cancellation & Refund Policy</Link>
                <span className="ftr-spn-privcy-divid-br">|</span>                
                <Link href="https://bzindia.in/sitemap.xml">Sitemap</Link>
                </span>
            </div>
          </div>
        </div>        

        <FooterContent currentCompany={currentCompany}/>
        
        <div className="col-md-12">
          <div className="copy-right-bx">
            <div className="copy-right-bx-cntnt">
              <span className="ftr-spn-cpy-1">
                &copy; {new Date().getFullYear()} BZIndia - Top Companies in India
              </span>
            </div>
          </div>
        </div>
      </div>     
    </div>
      
  </footer>

    {currentCompany ?
    
      <div className="mob-top_blk">
      
        <div className="icon-spa whatsap-btn">
            <Link  itemProp="url"  href={`https://api.whatsapp.com/send?phone=91${currentCompany?.whatsapp}`} >
                <i className="fa fa-whatsapp" style={{fontSize: "17px", color:"#fff"}} aria-hidden="true"></i><span>Whatsapp</span>
            </Link>
        </div>
                        
        <div className="icon-spa msg-btn">
            <Link  itemProp="url" href={`mailto:${currentCompany?.email}`}>
                <i className="fa fa-envelope" style={{fontSize: "16px", color:"#fff"}} aria-hidden="true"></i> <span>Mail Us</span>
            </Link>
        </div>

        <div className="icon-spa call-btn">
            <Link  itemProp="url" href={`tel:+91${currentCompany?.phone1}`}>
                <i className="fa fa-phone" style={{fontSize: "15px", color:"#fff"}} aria-hidden="true"></i> <span>Call us</span>
            </Link>
        </div>
        
    </div>

    : isCscPage ? 
      <div className="mob-top_blk">
        <div className="icon-spa whatsap-btn">
          <a rel="noopener" itemProp="url" target="_blank" href="https://api.whatsapp.com/send?phone=919845272560" >
          <i className="fa fa-whatsapp" style={{fontSize: "17px", color:"#fff"}} aria-hidden="true"></i><span>Whatsapp</span>
          </a></div>
                        
          <div className="icon-spa msg-btn">
          <a rel="noopener" itemProp="url" href="mailto:collegeadmission.co@gmail.com">
          <i className="fa fa-envelope" style={{fontSize: "16px", color:"#fff"}} aria-hidden="true"></i> <span>Mail Us</span>
          </a></div>
          
          <div className="icon-spa call-btn"><a rel="noopener" itemProp="url" href="tel:+919845272560">
          <i className="fa fa-phone" style={{fontSize: "15px", color:"#fff"}} aria-hidden="true"></i> <span>Call us</span>
          </a>
        </div>
      </div>
    :
    <>
      {/* top move button  */}
      <div className="whthspp-btn">
        <a href="https://wa.me/0000000000" >
          <i className="fa fa-whatsapp"></i><span>WhatsApp
            <br/><small>+91 0000000000</small></span>
        </a>
      </div>

      <div className="adjust-call">
        <a href="tel:0000000000">
          <i className="fa fa-phone"></i><span>PhoneNumber
            <br/><small>+91 0000000000</small></span>
        </a>
      </div>

    </>
    }

    <div className="mov-top-btn">
      <a href="#banner-top">To The Top</a>
    </div>
   
      
    </>
  )
}

export default Footer