import React, {useEffect, useState} from 'react';
import DirectorySlider from './common/DirectorySlider'
import DestinationSlider from './common/DestinationSlider'
import LatestArticle from './common/LatestArticle';

import $ from 'jquery';
import '/public/easy-responsive-tabs';

import FooterCompanies from './home/FooterCompanies';
import FooterContent from './home/FooterContent';
import Loading from './Loading';
import Link from 'next/link';
import location from '../lib/api/location';
import company from '../lib/api/company';

const Footer = ({
  blogs, destinations, destinationsLoading, place, district, state,
  companies, companiesLoading, isListLocationPage = false, nearbyPlaces,
  nearbyPlacesLoading, homeContent, states
}) => {  
  const [popularCities, setPopularCities] = useState();
  const [popularCitiesLoading, setPopularCitiesLoading] = useState(true);  

  const [footerStates, setFooterStates] = useState(states);
  const [footerStatesLoading, setFooterStatesLoading] = useState(true);

  const [companyTypes, setCompanyTypes] = useState();
  const [companyTypesLoading, setCompanyTypesLoading] = useState(true);  

  useEffect(() => {
    const fetchCompanyTypes = async () => {
      try {
        const response = await company.getCompanyTypes();
        setCompanyTypes(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCompanyTypesLoading(false);
      }
    };

    const fetchPopularCities = async () => {
      try {
        const response = await location.getPopularCities();
        setPopularCities(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setPopularCitiesLoading(false);
      }
    };

    const fetchStates = async () => {
      try {
        const response = await location.getStates();
        setFooterStates(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setFooterStatesLoading(false);
      }
    }

    fetchCompanyTypes();
    fetchPopularCities();
    fetchStates();
  }, []);  

  const updatedMultipage = (multipage) => {    
    const title = multipage?.title?.replace(" in place_name", "").replace(" at place_name", "") || "";
    const slug = multipage?.slug || "";
    const companySlug = multipage?.company_slug || "";
    const urlType = multipage?.url_type;

    let updatedMultipageSlug = slug;
    let modifiedUrl = "";

    if (urlType === "location_filtered") {
      updatedMultipageSlug = updatedMultipageSlug.replace("-place_name", "");
      modifiedUrl = `${companySlug}/${updatedMultipageSlug}/`;
    } else {
      updatedMultipageSlug = updatedMultipageSlug.replace("place_name", place?.slug || district?.slug || state?.slug || "india");
      modifiedUrl = `${companySlug}/${updatedMultipageSlug}`;

      if (!slug.endsWith("place_name")) {
        modifiedUrl += `-${place?.slug || district?.slug || state?.slug || "india"}`;
      }
    }

    return {
      url: modifiedUrl,
      title,
    };

  };

  useEffect(() => {
    if ($.fn.easyResponsiveTabs) {

    $('#horizontalTab').easyResponsiveTabs({
        type: 'horizontal',
        width: 'auto',
        fit: true
    });
    } else {
    console.warn('easyResponsiveTabs is not loaded properly');
    }
  }, [companyTypes]);

  return (
    <>
      <DirectorySlider/>
      {!isListLocationPage &&    
      <DestinationSlider destinations={destinations} loading={destinationsLoading} />
      }
      <LatestArticle blogs={blogs} />

    <footer>
      <div className="container">
        

        {isListLocationPage && 
        nearbyPlacesLoading? 
        <Loading/>
        :
        <>
        <>
        <div className="row">
          <h1 className="foot_head" onClick={() => toggleAccordion(this)}><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Common Service Centre - CSC in Nearby Locations</h1>
          <div className="footer_directory">
            {nearbyPlaces && nearbyPlaces.length > 0? nearbyPlaces.map((place) => (
              <a className="anchor" href="#" key={place?.slug}>Common Service Center in {place?.name}</a>
            )):"Failed to fetch location data"}    
          </div>
        </div>

        <div className="row">
          <h1 className="foot_head" onClick={() => toggleAccordion(this)}><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Post Office & Pincode in Nearby Locations</h1>
          <div className="footer_directory">
          {nearbyPlaces && nearbyPlaces.length > 0? nearbyPlaces.map((place) => (
              <a className="anchor" href="#" key={place?.slug}>Post Office in {place?.name}</a>
            )):"Failed to fetch location data"}  
          </div>
        </div>

        <div className="row">
        <h1 className="foot_head" onClick={() => toggleAccordion(this)}><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Police Stations in Nearby Locations</h1>
          <div className="footer_directory">
          {nearbyPlaces && nearbyPlaces.length > 0? nearbyPlaces.map((place) => (
              <a className="anchor" href="#" key={place?.slug}>Police Station in {place?.name}</a>
            )):"Failed to fetch location data"}  
          </div>
        </div>

        <div className="row">
        <h1 className="foot_head" onClick={() => toggleAccordion(this)}><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Judicial Courts in Nearby Locations</h1>
          <div className="footer_directory">
          {nearbyPlaces && nearbyPlaces.length > 0? nearbyPlaces.map((place) => (
              <a className="anchor" href="#" key={place?.slug}>Judicial Court in {place?.name}</a>
            )):"Failed to fetch location data"}  
          </div>
        </div>


        <div className="row">
        <h1 className="foot_head" onClick={() => toggleAccordion(this)}><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Bank and IFSC in Nearby Locations</h1>
          <div className="footer_directory">
          {nearbyPlaces && nearbyPlaces.length > 0? nearbyPlaces.map((place) => (
              <a className="anchor" href="#" key={place?.slug}>Banks in {place?.name}</a>
            )):"Failed to fetch location data"}  
          </div>
        </div>


        <div className="row">
        <h1 className="foot_head" onClick={() => toggleAccordion(this)}><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Destinations in Nearby Locations</h1>
          <div className="footer_directory">
          {nearbyPlaces && nearbyPlaces.length > 0? nearbyPlaces.map((place) => (
              <a className="anchor" href="#" key={place?.slug}>Destinations in {place?.name}</a>
            )):"Failed to fetch location data"}  
          </div>
        </div>
      </>
      


<div className="row">
 <h1 className="foot_head" ><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Popular Cities in India</h1>
  <div className="footer_directory">
    {popularCitiesLoading ? <Loading/> :
    popularCities?.map((city, index) => <Link key={city.slug || index + 1} className="anchor" href={`/state-list-in-india/${city.state?.slug}/${city.slug}`} >{city?.name}</Link>)}
  </div>
</div>

<div className="row">
 <h1 className="foot_head" onClick={() => toggleAccordion(this)}><a href="#"><i className="fa fa-crosshairs" aria-hidden="true"></i></a> Explore State-Wise, District-Wise Locations</h1>
  <div className="footer_directory">
    <Link className="anchor" href={`/state-list-in-india/`} >State List of India</Link>
    {
      footerStatesLoading ? <Loading/> :
    footerStates?.map((state, index) => <Link key={state?.slug || index + 1} className="anchor" href={`/state-list-in-india/${state?.slug}`} >District List of {state?.name}</Link>)
    }

  </div>
</div>

<div className="row">
  
 
  <div className="col-md-12 col-sm-12 col-xs-12">
    {companyTypesLoading? <Loading/> :
    <div id="horizontalTab">
      <ul className="resp-tabs-list">            
        {companyTypes?.map((company_type, index) => (
          <li key={company_type.slug || index + 1}>{company_type.name === "Education" ? "Course" : company_type.name}s in India</li>    
        ))}          
      </ul>
      <div className="resp-tabs-container">
        {companyTypes?.map((company_type, index) => (

          <div key={company_type.slug || index + 1}>
            {company_type.companies?.filter(company => company.multipages?.length > 0).map((company, companyIndex) => (
              <div key={company.slug || companyIndex + 1}>
                <h6 className="foot_head">
                  {company.name}: {company_type.name === "Education" ? "Course" : company_type.name}s
                </h6>
                <div className="footer_directory">
                  {company.multipages?.map((multipage, multipageIndex) => (
                    <Link
                      className="anchor"
                      key={`${multipage.slug}-${multipage.slug || multipageIndex}`}
                      href={`/${company.slug}/${updatedMultipage(multipage)?.url}`}
                      
                     
                      title={`${updatedMultipage(multipage)?.title} in ${place?.name || district?.name || state?.name || "India"}`}
                    >
                      {updatedMultipage(multipage)?.title} in {place?.name || district?.name || state?.name || "India"}
                    </Link>
                    ))}
                </div>
              </div>
            ))}            
          </div>

        ))}        
      
      </div>
    </div>
    }
  </div>
 
 
</div>
</>
        }

        <FooterCompanies companies={companies&&companies.slice(0,12)} loading = {companiesLoading}/>
      </div>

      <div className="row" style={{paddingTop: "30px"}}>
     
        <div className="col-md-12">
          <ul className="social-icons" style={{width:"100%"}} itemScope itemType="https://schema.org/Organization">
            <link itemProp="url" href="https://bzindia.in/" />
            <li><a itemProp="sameAs" href="https://www.facebook.com/BZindia/" title="Facebook"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
            <li><a itemProp="sameAs" href="https://twitter.com/Bzindia_in" title="Twitter"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
            <li><a itemProp="sameAs" href="https://www.instagram.com/bzindia/" title="Instagram"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
            <li><a itemProp="sameAs" href="https://www.linkedin.com/company/bzindia" title="LinkedIn"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
            <li><a itemProp="sameAs" href="https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1" title="YouTube"><i className="fa fa-youtube-play" aria-hidden="true"></i></a></li>
            <li><a itemProp="sameAs" href="https://in.pinterest.com/bzindia/" title="Pinterest"><i className="fa fa-pinterest-p" aria-hidden="true"></i></a></li>
            <li><a itemProp="sameAs" href="https://bzindia.tumblr.com/" title="Tumblr"><i className="fa fa-tumblr" aria-hidden="true"></i></a></li>
            <li><a itemProp="sameAs" href="#" title="Google Plus"><i className="fa fa-google-plus" aria-hidden="true"></i></a></li>
            <li><a itemProp="sameAs" href="https://www.slideshare.net/BZindia" title="SlideShare"><i className="fa fa-slideshare" aria-hidden="true"></i></a></li>
            <li><a itemProp="sameAs" href="https://www.reddit.com/user/bzindia-in/" title="Reddit"><i className="fa fa-reddit" aria-hidden="true"></i></a></li>	 
            <li><a itemProp="sameAs" href="https://www.flickr.com/photos/193921536@N03/" title="Flickr"><i className="fa fa-flickr" aria-hidden="true"></i></a></li>
            
          </ul>
        </div>

        <div className="col-md-12">
          <div className="privecy-plcy-bx">
            <div className="privecy-plcy-bx-cntnt">
              <span className="ftr-spn-privcy"><a href="#">Privacy Policy</a> <span className="ftr-spn-privcy-divid-br">|</span><a href="#">Terms &
                Conditions</a><span className="ftr-spn-privcy-divid-br">|</span><a href="#">Shipping & Delivery Policy</a><span
                  className="ftr-spn-privcy-divid-br">|</span><a href="#">Cancellation & Refund Policy</a>
                  <span className="ftr-spn-privcy-divid-br">|</span>
                  <Link href={"https://bzindia.in/sitemap-django.xml"}>Sitemap</Link>
                  </span>
            </div>
          </div>
        </div>  

        {isListLocationPage && 
        <>
          <div className="container">
          <FooterContent homeContent={homeContent} />
          </div>
        </>
        }

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
    </footer>

  <div className="whthspp-btn">
    <Link href="https://wa.me/9645850158" >
      <i className="fa fa-whatsapp"></i><span>WhatsApp<br/><small>+91 9645850158</small></span>
    </Link>
  </div>

  <div className="adjust-call">
    <Link href="tel:9645850158">
      <i className="fa fa-phone"></i><span>PhoneNumber<br/><small>+91 9645850158</small></span>
    </Link>
  </div>

  <div className="mov-top-btn">
    <a href="#banner-top">To The Top</a>
  </div>
      
    </>
  )
}

export default Footer