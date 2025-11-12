import React, { useContext, useEffect, useState } from 'react'

import { useSearchableDropdown } from '../../hooks/useSearchableDropdown';
import location from '../../lib/api/location';
import { useRouter } from 'next/router';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { cscSlider } from '../../public/w3/js/slider';
import Link from 'next/link';

import RegistrationSlider from '../home/RegistrationSlider';
import ProductSlider from '../common/ProductSlider';
import ServiceSlider from '../common/ServiceSlider';
import HomeCourseSlider from '../common/HomeCourseSlider';
import TagCloud from '../home/TagCloud';
import Message from '../common/Message';
import BlogContext from '../context/BlogContext';
import useNearestPlace from '../../hooks/useNearestPlace';
import GeneralEnquiryForm from '../common/GeneralEnquiryForm';

const DetailCsc = ({
  center, fullPath, locationData, slug,
  courseDetailPages, serviceDetailPages,
  registrationDetailPages, productDetailPages,
  metaTags, blogs, initialNearbyCenters
}) => {
    const router = useRouter();

    const [states, setStates] = useState([]);

    const [district, setDistrict] = useState();
    const [place, setPlace] = useState();

    const [districts, setDistricts] = useState();
    const [districtsLoading, setDistrictsLoading] = useState(false);

    const [selectedState, setSelectedState] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);        
    
    const [places, setPlaces] = useState();
    const [placesLoading, setPlacesLoading] = useState(false);

    const [nearbyCscCenters, setNearbyCscCenters] = useState(initialNearbyCenters || []);
    const [nearbyCscCentersLoading, setNearbyCscCentersLoading] = useState(true);

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState(); 

    const { setBlogs, resetBlogs } = useContext(BlogContext);

    const { nearestPlace, loading, error, fetchNearestPlace } = useNearestPlace();
    
    useEffect(() => {
        if (blogs) setBlogs(blogs);      
    
        return () => {      
          resetBlogs();
        };
    }, [blogs]);
    

    const addressListRaw = [center?.street, center?.place_name && `${center?.place_name} Block`, center?.district_name && `${center?.district_name} District`, center?.state_name];

    let addressList = [];

    addressListRaw?.forEach(item => {

      const trimmedItem = item?.trim();

      if (trimmedItem) {
        addressList.push(trimmedItem);
      }
    });

    const address = addressList?.join(", ");

    let phoneNumber = center?.contact_number || center?.mobile_number || center?.whatsapp_number;

    if (!phoneNumber.startsWith(+91)) {
        phoneNumber = `+91-${phoneNumber}`;
    }

    useEffect(() => {
        import('jquery').then(($) => {
            import('/public/js/script.js');
        });
    }, []);


    useEffect(() => {
        const fetchStates = async () => {
          try {
              const responce = await location.getMinimalStates();
              setStates(responce.data)
          } catch (err) {
              console.error(err);
          }
        };

        if (states?.length == 0) {
            fetchStates();
        } 

    }, [states]);

    // Fetch functions (already manage their own state)
    const fetchDistricts = async (stateSlug) => {

        try {
            const response = await location.getMinimalDistricts(stateSlug);
            setDistricts(response.data);
        } catch (err) {
            console.error("Error in fetching districts: ", err);
        } finally {
            setDistrictsLoading(false);
        }
    };

    const fetchPlaces = async (stateSlug) => {

        try {
            const response = await location.getMinimalPlaces(stateSlug);
            setPlaces(response.data);
        } catch (err) {
            console.error("Error in fetching places: ", err);
        } finally {
            setPlacesLoading(false);
        }
    };


    // Selection handlers
    const onStateSelect = (state) => {
        setSelectedState(state);
        setSelectedDistrict(null);
        setSelectedPlace(null);
        fetchDistricts(state.slug);
    };

    const onDistrictSelect = (district) => {
        setSelectedDistrict(district);
        setSelectedPlace(null);
        fetchPlaces(district.slug);
    };

    const onPlaceSelect = (place) => {
        setSelectedPlace(place);
    };

    const stateDropdown = useSearchableDropdown(states, onStateSelect);
    const districtDropdown = useSearchableDropdown(districts, onDistrictSelect);  
    const placeDropdown = useSearchableDropdown(places, onPlaceSelect);  

    const handleSearch = (e) => {
        e.preventDefault;

        if (!selectedPlace && !selectedDistrict && !selectedState) return;

        let endPoint = `/${selectedState.slug}/csc/`;

        if (selectedPlace) {
            endPoint = `/${selectedDistrict.slug || selectedState.slug}/csc/common-service-center-${selectedPlace.slug}`;
        
        } else if (selectedDistrict) {
            endPoint += `common-service-center-${selectedDistrict.slug}`;
        }

        if (endPoint) router.push(endPoint);

    }

    const fetchNearbyCscCenters = async () => {
        try {
        const response = await location.getNearbyCscCenters(locationData?.latitude, locationData?.longitude);
        setNearbyCscCenters(response.data);        
        } catch (err) {
        console.error("Error in fetching nearby csc centers: ", err);
        } finally {
        setNearbyCscCentersLoading(false);
        }
    };

    useEffect(() => {
        if (nearbyCscCenters?.length < 1 && nearbyCscCentersLoading) {
          fetchNearbyCscCenters();
        }
    }, [locationData]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                setMessageClass("");
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [message]);
          
    const handleNearby = async () => {
      try {
        await fetchNearestPlace();
      } catch (err) {
        console.error("Error in handing nearby function: ", err)
      }
    }

    useEffect(() => {
      if (!nearestPlace) return;

      router.push(`/${nearestPlace?.district?.slug}/csc/common-service-center-${nearestPlace?.slug}`)          

    }, [nearestPlace]);

  return (
    <>
      {message&&
      <Message message={message} messageClass={messageClass} />
      }      
        <section className="banner-sech-bar inner_search_csc">
<div className="container">
<div className="row">
<form className="container" role="search">

     <div className="row">
 
     <div className="col col-md-3 col-12">
      <div className="searchable">
    <input        
          ref={stateDropdown.inputRef}
          type="text"
          value={stateDropdown.search}
          placeholder="Select State"
          onChange={(e) => {stateDropdown.setSearch(e.target.value); setDistrict(null); setPlace(null); districtDropdown.setSearch(""); placeDropdown.setSearch("")}}
          onKeyDown={stateDropdown.handleKeyDown}
          onFocus={() => stateDropdown.setShowList(true)}
          onBlur={stateDropdown.handleBlur}
          autoComplete="off"
          name="state"
        />
        {stateDropdown.showList && (
          <ul ref={stateDropdown.listRef} className={stateDropdown.showList? "d-block" : ""}>
            {stateDropdown.filtered.length ? (
              stateDropdown.filtered.map((state, index) => (
                <li
                  key={state.slug || index}
                  className={index === stateDropdown.highlightedIndex ? "selected" : ""}
                  onMouseEnter={() => stateDropdown.setHighlightedIndex(index)}
                  onMouseDown={() => stateDropdown.handleSelect(state)}               
                >
                  {state.name}
                </li>
              ))
            ) : (
              <li className="no-results">No match found</li>
            )}
          </ul>
        )}
    </div>
</div>

     <div className="col col-md-3 col-12">
     <div className="searchable">
    <input        
          ref={districtDropdown.inputRef}
          type="text"
          value={districtDropdown.search}
          placeholder="Select District"
          onChange={(e) => {districtDropdown.setSearch(e.target.value); setDistrict(e.target.value === "" ? null : district); setPlace(null); placeDropdown.setSearch("")}}
          onKeyDown={districtDropdown.handleKeyDown}
          onFocus={() => districtDropdown.setShowList(true)}
          onBlur={districtDropdown.handleBlur}
          autoComplete="off"
          name="district"
        />
        {districtDropdown.showList && (
          <ul ref={districtDropdown.listRef} className={districtDropdown.showList? "d-block" : ""}>
            {districtDropdown.filtered.length ? (
              districtDropdown.filtered.map((district, index) => (
                <li
                  key={district.slug || index}
                  className={index === districtDropdown.highlightedIndex ? "selected" : ""}
                  onMouseEnter={() => districtDropdown.setHighlightedIndex(index)}
                  onMouseDown={() => districtDropdown.handleSelect(district)}                  
                >
                  {district.name}
                </li>
              ))
            ) : (
              <li className="no-results">No match found</li>
            )}
          </ul>
        )}
    </div>
</div>

        <div className="col col-md-3 col-12">
     <div className="searchable">
    <input        
          ref={placeDropdown.inputRef}
          type="text"
          value={placeDropdown.search}
          placeholder="Select Place"
          onChange={(e) => {placeDropdown.setSearch(e.target.value); setPlace(e.target.value === "" ? null : place)}}
          onKeyDown={placeDropdown.handleKeyDown}
          onFocus={() => placeDropdown.setShowList(true)}
          onBlur={placeDropdown.handleBlur}
          autoComplete="off"
          name="place"
        />
        {placeDropdown.showList && (
            <ul ref={placeDropdown.listRef} className={placeDropdown.showList? "d-block" : ""}>
                {placeDropdown.filtered.length ? (
                placeDropdown.filtered.map((place, index) => (
                    <li
                    key={place.slug || index}
                    className={index === placeDropdown.highlightedIndex ? "selected" : ""}
                    onMouseEnter={() => placeDropdown.setHighlightedIndex(index)}
                    onMouseDown={() => placeDropdown.handleSelect(place)}                  
                    >
                    {place.name}
                    </li>
                ))
                ) : (
                <li className="no-results">No match found</li>
                )}
            </ul>
        )}
    </div>
</div>

<div className="col col-md-2 col-12">
        <button className="primary_button" style={{padding: "13px 0 13px 0; width: 100%"}} type="button" onClick={(e) => handleSearch(e)}>SEARCH</button>
        </div>

</div>

      </form>
</div>
</div>
</section>   

 <section className="bg-half main_slide_bx" style={{padding: "20px 0px", background: "linear-gradient(61deg, rgba(247,101,31,1) 0%, rgba(255,255,255,1) 50%, rgba(4,103,54,1) 100%), url() no-repeat fixed center top / cover"}} data-aos="fade-in">
 <div className="container">
 <div className="row">
 <div className="col-2 col-md-1 college-logo"><img src={"/images/csc_logo.jpg"} alt=""/></div>
 <div className="col-12 col-md-10">
 <div className="college_top_main_bx">
 <h1>{center?.title} – e-Governance Services, Digital Seva, Common Service Center</h1> 
<label><a href="https://www.google.com/maps?q=11.95819859,79.82296944" target="_blank"><i className="fa fa-map-marker"></i> {center?.street || center?.place_name}, {center?.district_name} - {center?.pincode}, {center?.state_name}, India</a></label>
<p style={{display: "inline-block"}}>
<a href="#"><i className="fa fa-share-alt"></i> Share</a>
</p> 
<p style={{display: "inline-block"}}>
<a href="#write_a_review" style={{background: "#444"}}><i className="fa fa-comments" aria-hidden></i> Write a Review</a>
</p> 
<div className="client_review" style={{display: "inline-block", background: "#ffffff8c", borderRadius: "5px", padding: "3px 10px"}}>
<span className="fa fa-star checked" aria-hidden></span>
<span className="fa fa-star checked" aria-hidden></span>
<span className="fa fa-star checked" aria-hidden></span>
<span className="fa fa-star" aria-hidden></span>
<span className="fa fa-star" aria-hidden></span>
</div>
<p style={{display: "inline-block", color: "#333"}}>1 Reviews</p>


</div>
</div>
</div></div>
 </section>   
 


<div id="stick_navbar" style={{padding: "0px 0", background: "#005c9f"}} data-aos="fade-in">
<div className="communicate_language"><p> Common Service Centers (CSC) in {locationData?.name || "India"}</p> </div>

<div className="csc_near_dv">
<Link href="#" onClick={(e) =>  {e.preventDefault(); handleNearby()}} style={{padding: "3px 15px 3px 15px", fontSize:"14px"}}><i className="fa fa-crosshairs" aria-hidden></i> CSC Near Me</Link>
</div>
<div style={{clear:"both"}}></div>


<toc className="bzindia_toc_scroll">
<a href="#slug-info">Info</a>
<a href="#slug-about">About Us</a>
<a href="#slug-services">Services</a>
<a href="#slug-faqs">Faq's</a>
<a href="#articles-section">Articles</a>
<a href="#slug-tags">Tags</a>
<a href="#csc-state-wise">CSC State wise</a>
<a href="#nearby-destinations">Nearby Destinations</a>
<a href="#slug-location-map">Location Map</a>
<a href="#slug-contact">Contact Us</a>
<a href="#slug-apply">Apply Now</a>
</toc>

  


</div>
  {/* home -banner section-end */}

  <section style={{background: "#f1f1f1", marginBottom: "20px", padding: "0px 0px 50px 0px"}}>
    <div className="container">


<div className="row" style={{padding: "40px 0 0px 0",textAlign: "center"}} data-aos="fade-down">
  <div className="offerd-service-section" style={{margin: "0"}}>
      <h2 id="slug-info">{center?.title} – e-Governance Services, Digital Seva, Common Service Center</h2>
      <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
              <p>

The {center?.name || "CSC center"}, located in the <strong><a href="#">{center?.place_name}</a></strong> Block of <strong><a href="#">{center?.district_name}</a></strong> District, <strong><a href="#">{center?.state_name}</a></strong>, is an integral part of the Common Services Centre (CSC) programme under the Government of India's Digital India initiative. This center delivers a wide range of digital and e-governance services, empowering rural and urban communities across the region. Key services offered include <strong><a href="#">Aadhaar card assistance</a>, <a href="#">PAN card applications</a>, <a href="#">passport services</a>, <a href="#">voter ID registration</a>, <a href="#">ration card applications</a>, <a href="#">lectricity bill</a>, <a href="#">water bill</a>, and <a href="#">telephone services</a>.</strong> The center also plays a vital role in enhancing digital literacy, fostering financial inclusion, and supporting rural entrepreneurship. Additionally, it provides affordable access to essential services in education, healthcare, telemedicine, tele-law, and entertainment. By bridging the digital divide and driving local development, the {center?.name || "CSC center"}, <strong>{center?.place_name}</strong> Block, <strong>{center?.district_name}</strong> District, {center?.state_name}, serves as a reliable and high-quality service hub, empowering citizens and contributing to India's journey toward a digitally inclusive society.
        </p>
   </div>
 </div>  
 
 
 
 <ul className="row inner_list_style" id="slug-services">
 <h3 style={{textAlign:"center"}}>OUR SERVICES</h3>
<p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
{center?.registrations?.map((registration, index) => <li key={registration?.slug || index + 1} className="col col-md-3 col-6"><a href="#">{registration?.name}</a></li>)}
</ul> 




<div className="row" style={{padding: "40px 0 0px 0", textAlign: "center"}}>
  <div className="offerd-service-section" style={{margin: "0"}}>
      <h2>NEARBY CSC CENTERS IN {locationData?.name?.toUpperCase() || "INDIA"}</h2>
      <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
      <div className="csc_centers_india">
      <Slider {...cscSlider}>
        {nearbyCscCenters?.map((center, index) => {
            const fullLocationList = [center.place_name, center.district_name, center.state_name];
            const fullLocation = fullLocationList.join(", ");

            return (
            <div className="services-block-two" key={center.slug || index}>
                <div className="inner-box csc_main_slide">
                <div className="image csc_img_bx">
                <Link href={`/${slug}/csc/${center?.slug}`}><img src={"/images/csc_logo.jpg"} alt={center.title}/></Link>
                </div>
                <h3 className="csc_head_bx"><Link href={`/${slug}/csc/${center?.slug}`}>{center.title}</Link>
                <span><i className="fa fa-map-marker" aria-hidden></i> {fullLocation}</span>
                <Link href={`/${slug}/csc/${center?.slug}`} className="simple_menu_stle" title="Find Nearby Police Station"><i className="fa fa-angle-double-right" aria-hidden></i> View Details</Link></h3>
                </div>
            </div>
        )})}                                  
  
        </Slider>
        
        </div>
    </div>
    <Link href={`/${center?.state?.slug || slug}/csc/${center?.district?.slug ? `common-service-center-${center?.district?.slug}` : ""}`} className="primary_button" style={{margin: "0 auto"}}>View More</Link>
</div>  

             

<div className="row" style={{padding:"30px 30px 25px 30px", borderRadius: "30px", marginTop:"45px", background:"#fff"}} id="slug-contact">


<div className="col-md-4" data-aos="fade-in">
<h4 className="contact_area_head">Location Map</h4>
<iframe id="slug-location-map" src={`https://www.google.com/maps?q=${center?.latitude || ""},${center?.longitude|| ""}&z=15&output=embed`} style={{border:"0", width: "100%", height: "350px"}}></iframe>
</div>
<div className="col-md-4" data-aos="fade-in" style={{background:"#fff"}}>
<h4 className="contact_area_head">Address Details</h4>
<div style={{display:"block"}} itemScope itemType="http://schema.org/GovernmentOffice">
      
      {/* Adding the image field */}
    <p itemProp="image" itemScope itemType="https://schema.org/ImageObject">
        <img src={"/images/csc_logo.jpg"} alt={center?.name} width="50" itemProp="url" />
        <meta itemProp="width" content="50" />
        <meta itemProp="height" content="50" />
    </p>
    
    <h4 itemProp="name">{center?.title}</h4>
    <p style={{padding: "0px 0px 0px 0px"}} itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
        <i className="fa fa-map-marker"></i> 
        <span itemProp="streetAddress">{center?.street || center?.place_name},</span> 
        <span itemProp="addressLocality">{center?.district_name}</span> - 
        <span itemProp="postalCode">{center?.pincode}</span>, 
        <span itemProp="addressRegion">{center?.state_name}</span>, 
        <span itemProp="addressCountry">India</span><br/><br/>
        Tel: <span itemProp="telephone">{phoneNumber}</span><br/> 
        E-mail: <span itemProp="email">{center?.email || "Unavailable"}</span><br/> 
        Web: <Link href={fullPath} itemProp="url" rel="noopener noreferrer">{process.env.NEXT_PUBLIC_SITE_URL}{fullPath}</Link>
    </p>
    
    {/* Adding latitude and longitude */}
    <p itemProp="geo" itemScope itemType="http://schema.org/GeoCoordinates">
        <meta itemProp="latitude" content="12.9716" />
        <meta itemProp="longitude" content="77.5946" />
    </p>
</div>

</div>

<div className="col-md-4" data-aos="fade-in">
<h4 className="contact_area_head">Opening Time</h4>

<ul id="MainContent_ulTimings" className="bTimings">

<li>
<div className="timingsList">
<span className="dayDisplay">Sunday</span>
<span className="timeDisplay">Holiday</span>
<span className="openStatus closed">Closed</span>
</div>
</li>

<li>
<div className="timingsList">
<span className="dayDisplay">Monday</span>
<span className="timeDisplay">10:00AM - 8:30PM</span>
<span className="openStatus open">Open</span>
</div>
</li>

<li>
<div className="timingsList">
<span className="dayDisplay">Tuesday</span>
<span className="timeDisplay">10:00AM - 8:30PM</span>
<span className="openStatus open">Open</span>
</div>
</li>

<li>
<div className="timingsList">
<span className="dayDisplay">Wednesday</span>
<span className="timeDisplay">10:00AM - 8:30PM</span>
<span className="openStatus open">Open</span>
</div>
</li>

<li>
<div className="timingsList">
<span className="dayDisplay">Thursday</span>
<span className="timeDisplay">10:00AM - 8:30PM</span>
<span className="openStatus open">Open</span>
</div>
</li>

<li>
<div className="timingsList">
<span className="dayDisplay">Friday</span>
<span className="timeDisplay">10:00AM - 8:30PM</span>
<span className="openStatus open">Open</span>
</div>
</li>

<li>
<div className="timingsList">
<span className="dayDisplay">Saturday</span>
<span className="timeDisplay">10:00AM - 8:30PM</span>
<span className="openStatus open">Open</span>
</div>
</li>

    </ul>
    </div>
    
</div> 


   <div className="row" style={{paddingTop:"30px", textAlign:"center"}}>
 <h1 className="foot_head" onClick="toggleAccordion(this)">CSC Center Amenities</h1>
  <div className="footer_directory">
<a className="anchor" href="#">Wheel Chair</a>
<a className="anchor" href="#">Accessible Entrance And Exit</a>
<a className="anchor" href="#">Wheel Chair</a>
<a className="anchor" href="#">Accessible In Car Parking</a>
</div>
</div>   



<div className="row" style={{paddingTop:"30px", textAlign:"center"}}>

 <h3 id="write_a_review">WRITE A REVIEW</h3>
      <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

<form action="" method="post">


  <div className="rate">
    <input type="radio" id="star5" name="rate" value="5" />
    <label htmlFor="star5" title="text">5 stars</label>
    <input type="radio" id="star4" name="rate" value="4" />
    <label htmlFor="star4" title="text">4 stars</label>
    <input type="radio" id="star3" name="rate" value="3" />
    <label htmlFor="star3" title="text">3 stars</label>
    <input type="radio" id="star2" name="rate" value="2" />
    <label htmlFor="star2" title="text">2 stars</label>
    <input type="radio" id="star1" name="rate" value="1" />
    <label htmlFor="star1" title="text">1 star</label>
  </div>


<input type="text" name="name" placeholder="Title:"/><br/>
<input type="email" name="email" placeholder="E-Mail ID:"/><br/>
 <textarea name="message" rows="4" placeholder="Reviews:" cols="50"></textarea><br/>
<div className="frm-btn-sctn">
<div>
<button className="primary_button" role="button" type="submit">POST REVIEW</button>
</div>
</div>
</form>

<div style={{paddingTop:"40px"}}>

<div className="review_cont_area">
<ul className="reviewsList">
<li>
<div className="review_photo_main">
<div className="photo_block_bx">
<div className="reviewerphoto"><img src={"/images/no_photo.jpeg"} alt=""/></div>

</div>

<div className="review_text_bx"><a className="reviewtitle">Comprehensive and Reliable Banking Information at Your Fingertips</a>
<div className="rating_bx">
<div className="client_review" style={{display: "inline-block"}}>
<span className="fa fa-star checked" aria-hidden></span>
<span className="fa fa-star checked" aria-hidden></span>
<span className="fa fa-star checked" aria-hidden></span>
<span className="fa fa-star" aria-hidden></span>
<span className="fa fa-star" aria-hidden></span>
</div>
<p style={{display: "inline-block", color: "#333", fontSize: "12px"}}>18/06/2019, 15:23</p>
</div>
<p>The Bank Directory is an invaluable resource for anyone seeking accurate and up-to-date banking information. It provides a comprehensive database of bank branches, including essential details such as IFSC codes, MICR codes, branch addresses, contact numbers, and more. Whether you’re looking to initiate NEFT/RTGS transactions, locate a nearby branch, or verify banking details, this directory delivers with precision and ease.
</p>
</div>


</div>
</li>

</ul>
</div>


<div className="review_cont_area">
<ul className="reviewsList">
<li>
<div className="review_photo_main">
<div className="photo_block_bx">
<div className="reviewerphoto"><img src={"/images/no_photo.jpeg"} alt=""/></div>

</div>

<div className="review_text_bx"><a className="reviewtitle">Comprehensive and Reliable Banking Information at Your Fingertips</a>
<div className="rating_bx">
<div className="client_review" style={{display: "inline-block"}}>
<span className="fa fa-star checked" aria-hidden></span>
<span className="fa fa-star checked" aria-hidden></span>
<span className="fa fa-star checked" aria-hidden></span>
<span className="fa fa-star" aria-hidden></span>
<span className="fa fa-star" aria-hidden></span>
</div>
<p style={{display: "inline-block", color: "#333", fontSize: "12px"}}>18/06/2019, 15:23</p>
</div>
<p>The Bank Directory is an invaluable resource for anyone seeking accurate and up-to-date banking information. It provides a comprehensive database of bank branches, including essential details such as IFSC codes, MICR codes, branch addresses, contact numbers, and more. Whether you’re looking to initiate NEFT/RTGS transactions, locate a nearby branch, or verify banking details, this directory delivers with precision and ease.
</p>
</div>


</div>
</li>

</ul>
</div>
</div>


</div>
    </div>
  </section>


 
  
  <section style={{padding:"30px 0px 0px 0px"}}>
    
    
    <div className="container">
    <div className="row">
          <div className="col-md-8" data-aos="fade-up">

            <div className="regstrtn-faq-space">

              <div className="registrsn-fq-scrool-bar-clm">
                <h3 id="slug-faqs">CSC FAQ'S</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="registrsn-fq-scrool-bar-clm-cntnt">
                  <div className=" pre-scrollable" style={{height: "470px", overflowY: "auto"}}>
                    
 <div itemScope="" itemProp="mainEntity" itemType="https://schema.org/Question">
 
  <div itemProp="mainEntity" itemScope="" itemType="https://schema.org/Question" className="marg_btm_8">
    <h6 itemProp="name" className="faqs_accordion">What services are provided by {center?.title}?</h6>
    <div className="faqs_panel" itemProp="acceptedAnswer" itemScope="" itemType="https://schema.org/Answer">
      <p itemProp="text"><strong>The {center?.name} offers a variety of services including:</strong></p>
      <ol>
<li>Issuance of government certificates like birth, death, income, caste, and domicile.</li>
<li>Aadhaar updates and enrollment.</li>
<li>Utility bill payments (electricity, water, gas).</li>
<li>PAN card and voter ID applications.</li>
<li>Banking, insurance, e-commerce, and telemedicine services.</li>
</ol>
    </div>
  </div>
  
    <div itemProp="mainEntity" itemScope="" itemType="https://schema.org/Question" className="marg_btm_8">
    <h6 itemProp="name" className="faqs_accordion">Where is the {center?.name} located?</h6>
    <div className="faqs_panel" itemProp="acceptedAnswer" itemScope="" itemType="https://schema.org/Answer">
      <p itemProp="text">The {center?.name} is located in {address}. It is easily accessible for residents in the surrounding areas.</p>
 
    </div>
  </div>
  
  
    <div itemProp="mainEntity" itemScope="" itemType="https://schema.org/Question" className="marg_btm_8">
    <h6 itemProp="name" className="faqs_accordion">What government programs are available through {center?.name}?</h6>
    <div className="faqs_panel" itemProp="acceptedAnswer" itemScope="" itemType="https://schema.org/Answer">
      <p itemProp="text"><strong>The center facilitates major government programs such as:</strong></p>

<ol>
<li>Aadhaar enrollment and updates.</li>
<li>Pradhan Mantri Jan Arogya Yojana (PMJAY) for health services.</li>
<li>Digital India initiatives for promoting e-governance.</li>
<li>FSSAI registration for small food businesses.</li>
</ol>
    </div>
  </div>
  
  
    <div itemProp="mainEntity" itemScope="" itemType="https://schema.org/Question" className="marg_btm_8">
    <h6 itemProp="name" className="faqs_accordion">What private sector services does the {center?.name} provide?</h6>
    <div className="faqs_panel" itemProp="acceptedAnswer" itemScope="" itemType="https://schema.org/Answer">
      <p itemProp="text"><strong>In collaboration with private organizations, the center offers:</strong></p>

<ol>
<li>Banking services through Digital Seva Kendras.</li>
<li>Insurance premium payments.</li>
<li>E-commerce support and product delivery.</li>
<li>Telemedicine consultations and pharmaceutical assistance.</li>
</ol>   
    </div>
  </div>
  
  
    <div itemProp="mainEntity" itemScope="" itemType="https://schema.org/Question" className="marg_btm_8">
    <h6 itemProp="name" className="faqs_accordion">Who can access services at {center?.name}?</h6>
    <div className="faqs_panel" itemProp="acceptedAnswer" itemScope="" itemType="https://schema.org/Answer">
      <p itemProp="text">The services are available to all citizens, especially those in rural and underserved areas around {address}. Special focus is given to students, women, and marginalized communities.</p>
    </div>
  </div>
  
  
      <div itemProp="mainEntity" itemScope="" itemType="https://schema.org/Question" className="marg_btm_8">
    <h6 itemProp="name" className="faqs_accordion">How can I contact the Village Level Entrepreneur (VLE) at the {center?.name}?</h6>
    <div className="faqs_panel" itemProp="acceptedAnswer" itemScope="" itemType="https://schema.org/Answer">
      <p itemProp="text">You can visit the {center?.title} to meet the VLE. They are available during operating hours to assist with your queries and services.</p>
    </div>
  </div>
  
  
      <div itemProp="mainEntity" itemScope="" itemType="https://schema.org/Question" className="marg_btm_8">
    <h6 itemProp="name" className="faqs_accordion">What skill development and education programs are offered at the {center?.name}?</h6>
    <div className="faqs_panel" itemProp="acceptedAnswer" itemScope="" itemType="https://schema.org/Answer">
      <p itemProp="text">The center offers training programs in IT, healthcare, and vocational skills. It also assists with online applications for competitive exams and distance education programs.</p>
    </div>
  </div>
  
  
        <div itemProp="mainEntity" itemScope="" itemType="https://schema.org/Question" className="marg_btm_8">
    <h6 itemProp="name" className="faqs_accordion">What are the operating hours of {center?.title}?</h6>
    <div className="faqs_panel" itemProp="acceptedAnswer" itemScope="" itemType="https://schema.org/Answer">
      <p itemProp="text">The {center?.name} operates from 9:00 AM to 6:00 PM, Monday to Saturday. It remains closed on public holidays.</p>
 
    </div>
  </div>


</div>
                    
                  </div>
                </div>
              </div>
            </div>

          </div>
          


          <div className="col-md-4 ">

            <div className="regstrtn-faq-space aos-init" data-aos="fade-up">

              <div className="faq-form-section">
                <h2 id="slug-apply">APPLY NOW !</h2>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <GeneralEnquiryForm setMessage={setMessage} setMessageClass={setMessageClass}/>
              </div>

            </div>

          </div>
        </div>
    </div>
  </section>
  
  

  
  
  <section className="content_area001" style={{padding: "30px 0px 40px 0px", marginBottom: "40px", borderBottom: "1px solid #ddd"}} id="csc-state-wise">
    <div className="container" data-aos="fade-in">
 
        
      <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12">
            <h3>Common Service Center (CSC) in India</h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
    

      </div>
      </div>
   
<ul className="row list-default" style={{padding: "10px 0 20px 0"}} itemScope="" itemType="http://www.schema.org/SiteNavigationElement">
{states?.map((state, index) => <li key={state?.slug || index + 1} itemProp="name" className="col col-md-3 col-12"><a itemProp="url" href={`/${state?.slug}/csc`}>CSC Centers in {state?.name}</a></li>)}
</ul>
 
  </div>

</section>


  {/* what-we-do section end */}

 
  <section className="content_area001" style={{padding: "0px 0px 40px 0px", marginBottom: "0px", borderBottom: "0px solid #ddd"}} id="slug-tags">
    <div className="container" data-aos="fade-in">

    <TagCloud metaTags={metaTags}/>

     
  </div>
  
  
    
  
    <RegistrationSlider detailPages = {registrationDetailPages?.slice(0,15)}/>
 
    <HomeCourseSlider detailPages={courseDetailPages}/>
  
    <ServiceSlider detailPages={serviceDetailPages}/>

</section>


 
<section style={{background: "#f1f1f1", marginBottom: "20px", padding: "0px 0px 50px 0px"}}>
  <div className="container">
    <div className="row">
      <div className="row" style={{padding: "40px 0 0px 0",textAlign: "center"}}>
        <div className="offerd-service-section" style={{margin: "0"}}>
          <ProductSlider detailPages={productDetailPages}/>
        </div>   
      </div>
    </div>
  </div>
</section>

    </>
  )
}

export default DetailCsc