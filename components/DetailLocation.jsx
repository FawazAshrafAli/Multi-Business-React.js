import React, { useEffect, useState, useRef, useContext } from 'react'
import Link from 'next/link';
import { useParams } from 'next/navigation';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Cookies from 'js-cookie';

import destination from '../lib/api/destination';

import Loading from './Loading';
import location from '../lib/api/location';
import company from '../lib/api/company';
import ServiceSlider from './common/ServiceSlider';
import ProductSlider from './common/ProductSlider';
import RegistrationSlider from './home/RegistrationSlider';
import HomeCourseSlider from './common/HomeCourseSlider';
import Faq from './common/Faq';
import DestinationSlider from './common/DestinationSlider';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useSearchableDropdown } from '../hooks/useSearchableDropdown';
import Message from './common/Message';
import enquiry from '../lib/api/enquiry';
import TitleContext from './context/TitleContext';
import { useRouter } from 'next/router';
import BlogContext from './context/BlogContext';
import LocationContext from './context/LocationContext';
import TagCloud from './home/TagCloud';

const DetailLocation = ({
  initialDestinations, neighboringPlaces, place, initialDistrict,
  initialState, faqs, blogs, metaTags, serviceDetailPages,
  courseDetailPages, registrationDetailPages, productDetailPages, centerCoordinate
}) => {
    const router = useRouter();

    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const [states, setStates] = useState();

    const {stateSlug, districtSlug} = useParams();        

    const [district, setDistrict] = useState(initialDistrict);
    const [districtError, setDistrictError] = useState(null);
    const [districtLoading, setDistrictLoading] = useState(false); 

    const [state, setState] = useState(initialState);
    const [stateError, setStateError] = useState(null);
    const [stateLoading, setStateLoading] = useState(false); 

    const [destinations, setDestinations] = useState(initialDestinations);
    const [destinationsError, setDestinationsError] = useState(null);
    const [destinationsLoading, setDestinationsLoading] = useState(true);    

    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [nearbyPlacesError, setNearbyPlacesError] = useState(null);
    const [nearbyPlacesLoading, setNearbyPlacesLoading] = useState(true);

    const [companies, setCompanies] = useState();
    const [companiesError, setCompaniesError] = useState(null);
    const [companiesLoading, setCompaniesLoading] = useState(true);

    const [companySubTypes, setCompanySubTypes] = useState();

    const [overviewHeading, setOverviewHeading] = useState();

    const [districts, setDistricts] = useState();
    const [districtsLoading, setDistrictsLoading] = useState(false);
    const [districtsError, setDistrictsError] = useState(null);

    const [selectedState, setSelectedState] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);    

    const { setTitle, resetTitle } = useContext(TitleContext)

    const { setBlogs, resetBlogs } = useContext(BlogContext)
    const {setLocation, resetLocation} = useContext(LocationContext);      

    useEffect(() => {
      const fetchStates = async () => {
        try {
          const responce = await location.getMinimalStates();
          setStates(responce.data)
        } catch (err) {
          console.error(err);
        }
      };

      fetchStates();
  
    }, []);

    useEffect(() => {
      if (place) {      

      setLocation(place);
      }
  
      return () => {      
      resetLocation();
      };
    }, [place]);

    useEffect(() => {
        if (blogs) {      

        setBlogs(blogs);
        }
    
        return () => {      
        resetBlogs();
        };
    }, [blogs]);

    useEffect(() => {
        if (place?.name) {
          setTitle(`${place.name} Overview & Nearby Locations`);
        }    
    
        return () => {      
        resetBlogs();
        };
    }, [place?.name]);        


    useEffect(() => {
      if (!districtSlug || !state) return;

      const fetchDistrict = async () => {
        try {
            const response = await location.getDistrict(districtSlug);
            if (response.data?.state?.slug === state?.slug) {
              setDistrict(response.data);
            } else {
              setDistrict(null);
            }
        } catch (err) {
            setDistrictError(err);
        } finally {
            setDistrictLoading(false);
        }
      };

      fetchDistrict();

    }, [districtSlug, state])

    useEffect(() => {
      if (!stateSlug) return;

      const fetchState = async () => {
        try {
            const response = await location.getState(stateSlug);
            setState(response.data);
        } catch (err) {
            setStateError(err);
        } finally {
            setStateLoading(false);
        }
      };

      fetchState();

    }, [stateSlug])
    

    useEffect(() => {
        if (!place) return;
        
        let overViewTitle = `${place.name} - Overview`;        

        setOverviewHeading(overViewTitle.toUpperCase());

    }, [place]);    

    // Destinations
    useEffect(() => {
      const fetchDestinations = async () => {
        if (navigator.geolocation) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
  
            const { latitude, longitude } = position.coords;
  
            // ✅ Pass as object, not separate arguments
            const response = await destination.getDestinations(latitude, longitude);
  
            setDestinations(response.data.slice(0, 10));
          } catch (err) {
            console.error("Geolocation error:", err);
            setDestinationsError(err);
          } finally {
            setDestinationsLoading(false);
          }
        } else {
          setDestinationsError(new Error("Geolocation not supported"));
          setDestinationsLoading(false);
        }
      };
  
      fetchDestinations();
    }, []);
    
    useEffect(() => {
        const fetchNearbyPlaces = async () => {
            try {
                const response = await location.getNearbyPlaces();
                setNearbyPlaces(response.data);        
            } catch (err) {
                setNearbyPlacesError(err);
            } finally {
                setNearbyPlacesLoading(false);
            }
        };        

        const fetchCompanies = async () => {
            try {
                const response = await company.getMinimalCompanies();
                setCompanies(response.data);
            } catch (err) {
            setCompaniesError(err);
            } finally {
            setCompaniesLoading(false);
            }
        };
                
        fetchCompanies();
        fetchNearbyPlaces();

    }, []);

    useEffect(() => {
      if (!companies) return;

      const allCompanySubTypes = [];

      companies.map(company => {
        allCompanySubTypes.push({"name": company.sub_type, "slug": company.slug});
      })

      const sortedCompanySubTypes = allCompanySubTypes.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

      setCompanySubTypes(sortedCompanySubTypes);

    }, [companies])

    const fetchStates = async() => {
        const stateSlug =  nearbyPlaces[0]?.state?.slug;

        if (!stateSlug) {
            return;
        }        
        
    };    

    useEffect(() => {
        fetchStates();
    }, [nearbyPlaces]);            

    const images = [
      { src: "/images/location_delhi.jpeg", alt: "New Delhi, India" },
      { src: "/images/location_mumbai.jpeg", alt: "Mumbai, India" },
      { src: "/images/location_himachalpradesh.jpeg", alt: "Himachal Pradesh, India" },
      { src: "/images/location_kerala.jpeg", alt: "Kerala, India" },
      { src: "/images/location_jammu.jpeg", alt: "Jammu Kashmir, India" },
      { src: "/images/location_karnataka.jpeg", alt: "Karnataka, India" },
    ];

  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef();

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (oldIndex, newIndex) => setSlideIndex(newIndex),
  };

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  // Fetch functions (already manage their own state)
  const fetchDistricts = async (stateSlug) => {
    try {
      const response = await location.getDistricts(stateSlug);
      setDistricts(response.data);
    } catch (err) {
      setDistrictsError(err);
    } finally {
      setDistrictsLoading(false);
    }
  };

  // Selection handlers
  const onStateSelect = (state) => {
    setSelectedState(state);
    setSelectedDistrict(null);
    fetchDistricts(state.slug);
  };

  const onDistrictSelect = (district) => {
    setSelectedDistrict(district);
  };

  const stateDropdown = useSearchableDropdown(states, onStateSelect);
  const districtDropdown = useSearchableDropdown(districts, onDistrictSelect);
  
  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      const csrfToken = Cookies.get('csrftoken');

      try {
          const response = await enquiry.postEnquiry(
              formData,
              {
                  headers: {
                      'X-CSRFToken': csrfToken,
                      'Content-Type': 'application/json',
                  },
                  withCredentials: true
              }
          );

          const { success, message } = response.data || {};

          setMessageClass(success?"bg-success":"bg-danger");
          setMessage(message);

          if (success) {
              setFormData({});
          }

      } catch (err) {
          const responseData = err.response?.data;
          setMessageClass("bg-danger");

          if (responseData?.error) {
              // Stop after displaying the first error message
              const errors = responseData.error;
              let firstErrorMessage = "";
          
              // Loop through the errors and stop at the first field's error
              for (const [field, messages] of Object.entries(errors)) {
                firstErrorMessage = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${messages[0]}`;
                break; // Stop after the first error is encountered
              }
          
              setMessage(firstErrorMessage);  // Set the message with the first error
            } else {
              setMessage(responseData?.message || "Submission failed");
            }
      } finally {            
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const handleSearch = (e) => {
    e.preventDefault;

    if (!selectedDistrict && !selectedState) return;

    let endPoint;

    if (selectedState) {
      endPoint = `/state-list-in-india/${selectedState.slug}/`;

      if (selectedDistrict) {
        endPoint += `${selectedDistrict.slug}/`
      }
    }

    if (endPoint) router.push(endPoint);

  }

  useEffect(() => {
      if (message) {
          const timer = setTimeout(() => {
              setMessage(null);
              setMessageClass("");
          }, 5000);
  
          return () => clearTimeout(timer);
      }
  }, [message]);
    

    [
        companiesError, stateError, districtError,
        nearbyPlacesError, destinationsError, districtsError
    ].map(error => {
        if (error) {
            console.error(error);
        }
    });

    useEffect(() => {
            AOS.init({
            once: true,
        });
    }, []);

  return (
    <>      
      {message&&
        <Message message={message} messageClass={messageClass} />
      }        

 <section
      className="bg-half main_slide_bx bg-half-nopadding"
      style={{
        padding: "0px 0px",
        background:
          "linear-gradient(61deg, rgba(247,101,31,1) 0%, rgba(255,255,255,1) 50%, rgba(4,103,54,1) 100%)",
      }}
      data-aos="fade-in"
    >
      <div className="desti_container">
        <Slider ref={sliderRef} {...settings}>
          {images.map((image, index) => (
            <div key={index} className="mySlides">
              <div className="numbertext">
                {index + 1} / {images.length}
              </div>
              <img src={image.src} style={{ width: "100%" }} alt={image.alt} />
            </div>
          ))}
        </Slider>

        <a className="desti_prev" onClick={prevSlide}>
          ❮
        </a>
        <a className="desti_next" onClick={nextSlide}>
          ❯
        </a>

        <div className="caption-container">
          <p id="caption">{images[slideIndex].alt}</p>
        </div>

        <div className="desti_row">
          {images.map((image, index) => (
            <div className="desti_column" key={index}>
              <img
                className={`desti_demo desti_cursor${
                  index === slideIndex ? " desti_active" : ""
                }`}
                src={image.src}
                style={{ width: "100%" }}
                onClick={() => goToSlide(index)}
                alt={image.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </section> 


    <section className="banner-sech-bar inner_search_csc">
<div className="container">
<div className="row">
<form className="container" role="search">

     <div className="row">
 
     <div className="col col-md-5 col-12">
      <div className="searchable">
    <input        
          ref={stateDropdown.inputRef}
          type="text"
          value={stateDropdown.search}
          placeholder="Select State"
          onChange={(e) => {stateDropdown.setSearch(e.target.value); setDistrict(null); districtDropdown.setSearch("")}}
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

     <div className="col col-md-5 col-12">
     <div className="searchable">
    <input        
          ref={districtDropdown.inputRef}
          type="text"
          value={districtDropdown.search}
          placeholder="Select District"
          onChange={(e) => {districtDropdown.setSearch(e.target.value); setDistrict(e.target.value === "" ? null : district)}}
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

<div className="col col-md-2 col-12">
        <button className="primary_button" style={{padding: "13px 0 13px 0; width: 100%"}} type="button" onClick={(e) => handleSearch(e)}>SEARCH</button>
        </div>

</div>

      </form>
</div>
</div>
</section>   
 
  
  <section className="content_area001" style={{padding: "30px 0px 40px 0px", marginBottom: "0px", borderBottom: "1px solid #ddd"}}>
    <div className="container" data-aos="fade-in">
 
          
        <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12">
            <h3>{overviewHeading}</h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
    
        <p>
          {!place ?
          <Loading/>
          :
          <>

            {place?.name} is a notable town located in the {place?.district?.name} district of {place?.district?.state?.name}, India. Known for its cultural heritage, local traditions, and developing infrastructure, {place?.name} serves as an important hub for residents and visitors alike. The area offers a blend of historical significance, natural beauty, and modern growth, making it a key part of the region's identity. Whether you're exploring its neighborhoods, learning about its history, or experiencing its local charm, {place?.name} represents a vibrant part of India's diverse landscape.
          </>          
        }
 
        </p>
      </div>
      </div>
      
  
 <h3 style={{textAlign:"center"}}>NEARBY LOCATIONS</h3>
 <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>      
   
<ul className="row list-default" style={{padding:"10px 0 20px 0"}} itemScope="" itemType="http://www.schema.org/SiteNavigationElement">

{
  neighboringPlaces?.map((place, index) => <li itemProp="name" className="col col-md-3 col-12" key={place.slug || index + 1}><Link itemProp="url" href={`/state-list-in-india/${place?.state?.slug}/${place?.district?.slug}/${place.slug}`} >{place.name}</Link></li>)
}
</ul>


      
      
      
      
      
      <div className="row" style={{padding:"30px", marginTop:"20px"}} id="slug-location-map">
<div className="col-md-12" data-aos="fade-up" style={{background:"#fff", padding:"0"}}>
    {!centerCoordinate ?
    <Loading/>
    :
    <iframe src={`https://www.google.com/maps?q=${centerCoordinate?.latitude || 11.95819859},${centerCoordinate?.longitude || 79.82296944}&z=15&output=embed`} style={{border:"0", width: "100%", height: "340px"}}></iframe>
    }

</div>
 
</div>
      
       
  </div>

</section>



  <DestinationSlider destinations={destinations} loading={destinationsLoading}/>
  

  
  <section style={{padding:"30px 0px 0px 0px"}}>
    
    
    <div className="container">
    <div className="row">
          <div className="col-md-8" data-aos="fade-up">

            <div className="regstrtn-faq-space">

              <div className="registrsn-fq-scrool-bar-clm">
                <h3>{place?.name} FAQs</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="registrsn-fq-scrool-bar-clm-cntnt">
                  <div className=" pre-scrollable" style={{height: "500px", overflowY: "auto"}}>
                    
 <div itemScope="" itemProp="mainEntity" itemType="https://schema.org/Question">
 
  <Faq faqs={faqs}/>
</div>
                    
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="col-md-4 ">
            <div className="regstrtn-faq-space" data-aos="fade-up">
              <div className="faq-form-section">
                  <h2>Apply Now</h2>
                  <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                  <form action="#" method="post" onSubmit={handleSubmit}>
                      <input type="text" name="name" placeholder="Your Name:" value={formData?.name || ''} onChange={handleChange} required/><br/>
                      <input type="tel" name="phone" placeholder="Phone Number:" value={formData?.phone || ''} onChange={handleChange} required /><br/>
                      <input type="email" name="email" placeholder="E-Mail Address:" value={formData?.email || ''} onChange={handleChange} required/><br/>
                      <select className="country" name="company_sub_type" value={formData?.company_sub_type || ''} onChange={handleChange} required>
                          <option value="" disabled hidden>-- Select Service --</option>
                          {companiesLoading? <option value="" disabled>Loading . . .</option> :
                          companySubTypes?.map((subType, index) => <option key={subType.slug || index + 1} value={subType.name}>{subType.name}</option>)
                          }
      
                      </select><br/>
                      <select className="country" name="state" value={formData?.state || ''} onChange={handleChange} required>
                          <option value="" disabled hidden>-- Select State --</option>
                          {!states? <option value="" disabled>Loading . . .</option> :
                          states&&states.map((state) => <option key={state.slug} value={state.slug}>{state.name}</option>)
                          }
                      
                      </select><br/>
  
                      <div className="frm-btn-sctn">
                          <div>
                              <button className="primary_button" role="button" type="submit">SUBMIT</button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
          </div>
        </div>
    </div>
  </section>
 
  <section className="content_area001" style={{padding: "0px 0px 40px 0px", marginBottom: "0px", borderBottom: "1px solid #ddd"}}>
    <div className="container" data-aos="fade-up">
 
    <TagCloud metaTags={metaTags}/>
  </div>
  
  <RegistrationSlider detailPages = {registrationDetailPages?.slice(0,15)} />
  <HomeCourseSlider detailPages={courseDetailPages}  />
  <ServiceSlider detailPages={serviceDetailPages}  />
</section>

<section style={{background: "#f1f1f1", marginBottom: "20px", padding: "0px 0px 50px 0px"}}>
    <div className="container">
      <div className="row">
        <div className="row" style={{padding: "40px 0 0px 0", textAlign: "center"}}>
          <div className="offerd-service-section" style={{margin: "0"}}>
            <ProductSlider detailPages={productDetailPages}  multipage={true}/>
          </div>
          <Link href="/products"  className="primary_button" style={{margin: "0 auto"}}>Buy More</Link>
        </div>  
      </div>            
    </div>
  </section>  
  
    </>
  )
}

export default DetailLocation