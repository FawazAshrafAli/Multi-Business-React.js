import React, { useEffect, useState, useRef, useContext } from 'react'

import Link from 'next/link';

import { useRouter } from 'next/router';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Cookies from 'js-cookie';

import destination from '../lib/api/destination';

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
import BlogContext from './context/BlogContext';
import LocationContext from './context/LocationContext';
import TagCloud from './home/TagCloud';

const ListLocations = ({
  blogs, metaTags, initialStates=[], serviceDetailPages, 
  courseDetailPages, registrationDetailPages, productDetailPages,
  faqs, state, centerCoordinate, initialDistrict
}) => {  

    const router = useRouter();

    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();    

    const [states, setStates] = useState(initialStates);
    const [statesLoading, setStatesLoading] = useState(true);

    const [district, setDistrict] = useState(initialDistrict);    

    const [destinations, setDestinations] = useState();
    const [destinationsError, setDestinationsError] = useState(null);
    const [destinationsLoading, setDestinationsLoading] = useState(true);    

    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [nearbyPlacesError, setNearbyPlacesError] = useState(null);
    const [nearbyPlacesLoading, setNearbyPlacesLoading] = useState(true);

    const [companies, setCompanies] = useState();
    const [companiesError, setCompaniesError] = useState(null);
    const [companiesLoading, setCompaniesLoading] = useState(true);

    const [companySubTypes, setCompanySubTypes] = useState();

    const [listHeading, setListHeading] = useState();  
    const [overviewHeading, setOverviewHeading] = useState();

    const [districts, setDistricts] = useState();
    const [districtsLoading, setDistrictsLoading] = useState(false);
    const [districtsError, setDistrictsError] = useState(null);

    const [selectedState, setSelectedState] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);        

    const [locationPincode, setLocationPincode] = useState();

    const { setTitle, resetTitle } = useContext(TitleContext)

    const { setBlogs, resetBlogs } = useContext(BlogContext)      

    const {setLocation, resetLocation} = useContext(LocationContext);

    useEffect(() => {
        if (blogs) {      

        setBlogs(blogs);
        }
    
        return () => {      
        resetBlogs();
        };
    }, [blogs]);

    useEffect(() => {
        const currentLocation = district || state || "India";

        setLocation(currentLocation);
    
        return () => {      
        resetLocation();
        };
    }, [state, district]);    

    useEffect(() => {      
      
      setTitle(`${district?.name || state?.name || "India State List"} - Overview | Explore State-Wise, District-Wise & City Locations`);
      
        // return () => {
        // resetTitle();
        // };
    }, [state, district]);
    
    const fetchStatePincode = async (stateSlug) => {
      try {
        const responce = await location.getStatePincode(stateSlug);
        setLocationPincode(responce.data)
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(() => {
      const fetchStates = async () => {
        try {
          const responce = await location.getMinimalStates();
          setStates(responce.data)
        } catch (err) {
          console.error(err);
        }
      };

      if (!states.length) {
        fetchStates();
      } 

    }, [initialStates]);

    const fetchDistrictPincode = async (districtSlug) => {
      try {
        const responce = await location.getDistrictPincode(districtSlug);
        setLocationPincode(responce.data)
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(() => {
      let heading;
      let overViewTitle;

      if (state) {
        stateDropdown.setSearch(state.name);
        setSelectedState(state);
        fetchDistricts(state?.slug)
      }

      if (district) {
        districtDropdown.setSearch(district.name);
        setSelectedDistrict(district);
      }
      
      if (district) {
        heading = `LIST OF PLACES IN ${district.name}`;
        overViewTitle = `${district.name} Place List - Overview Description`;
        fetchDistrictPincode(district.slug);
      } else if (state) {
        heading = `LIST OF DISTRICTS IN ${state.name}`;
        overViewTitle = `${state.name} District List - Overview Description`;
        fetchStatePincode(state.slug);
      } else {
        heading = "LIST OF STATES IN INDIA";
        overViewTitle = "India State List - Overview Description";
      }

      setListHeading(heading.toUpperCase());
      setOverviewHeading(overViewTitle.toUpperCase());

    }, [state, district]);

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
        // fetchBlogs();
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

    useEffect(() => {
      if (state || district) {
        let regional_faqs = [
          {
            question: `What is the importance of ${district?.name || state?.name || "India" }?`,
            answer: `${district?.name || state?.name} plays an important role in its region due to its cultural, historical, and economic relevance.`              
          },
          {
            question: `What are the major industries or occupations in ${district?.name || state?.name || "India" }?`,
            answer: `${district?.name || state?.name} is known for industries and occupations that contribute to local economic development and employment.`              
          },
          {
            question: `What is the best time to visit ${district?.name || state?.name || "India" }?`,
            answer: `The ideal time to visit ${district?.name || state?.name} depends on local climate, but generally falls between October and March.`              
          },
          {
            question: `How can I reach ${district?.name || state?.name || "India" }?`,
            answer: `${district?.name || state?.name} can be reached by road, rail, and in many cases, air, depending on its connectivity and location.`              
          },
          {
            question: `What are the popular attractions in ${district?.name || state?.name || "India" }?`,
            answer: `${district?.name || state?.name} offers various local attractions, including historical sites, cultural landmarks, and natural beauty.`              
          },
      
        ];

        
        if (state) {
          regional_faqs.push({
            question: `How many district are there in ${state.name} State?`,
            answer: `There are ${state.districts?.length} districts in ${state.name} State.`
          })
        }

        if (district) {
          regional_faqs.push({
            question: `How many places are there in ${district.name} District?`,
            answer: `There are ${district.places?.length} places in ${district.name} District.`
          })
        }

        // setFaqs(regional_faqs);
      }

    }, [state, district])

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
      const response = await location.getMinimalDistricts(stateSlug);
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
      endPoint = `/${selectedState.slug}/`;

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

    useEffect(() => {
            AOS.init({
            once: true,
        });
    }, []);

    [
        companiesError, nearbyPlacesError, destinationsError, districtsError
    ].map(error => {
        if (error) {
            console.error(error);
        }
    });

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
 
          

      
  
 <h3 style={{textAlign:"center"}}>{listHeading}</h3>
 <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>      
   
<ul className="row list-default" style={{padding:"10px 0 20px 0"}} itemScope="" itemType="http://www.schema.org/SiteNavigationElement">

{district?   
  district.places?.map((place, index) => <li itemProp="name" className="col col-md-3 col-12" key={place.slug || index + 1}><Link itemProp="url" href={`/state-list-in-india/${state?.slug || district?.state?.slug}/${district.slug}/${place.slug}`}  >{place.name}</Link></li>)

:state?  
  state.districts?.map((district, index) => <li itemProp="name" className="col col-md-3 col-12" key={district.slug || index + 1}><Link itemProp="url" href={`/state-list-in-india/${state?.slug || district?.state?.slug}/${district.slug}`} >{district.name}</Link></li>)
:

states?.map((state, index) => <li itemProp="name" className="col col-md-3 col-12" key={state.slug || index + 1}><Link itemProp="url" href={`/state-list-in-india/${state.slug}`} >{state.name}</Link></li>)
}
</ul>


      <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12">
            <h3>{overviewHeading}</h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
    
        <p>
          {district?
          <>
            {district.name} is one of the key administrative districts in the Indian state of {district.state?.name}. Functioning as a vital local governance unit, it plays an important role in the state’s administrative, economic, and regional development.

            Each district in India is designed to efficiently manage local governance, law enforcement, and developmental activities. {district.name} includes several towns, cities, villages, and local bodies, each contributing to the district’s overall structure.
          </>
          :state? 
          <>
            {state.name} is one of the 28 states of India, recognized for its distinct administrative identity and regional characteristics. The state is divided into {state.districts?.length} districts, enabling effective governance and localized development across its regions.
            Each district plays a vital role in shaping the state's administrative structure and contributing to its overall development within India's federal system.
          </>
          :
          <>
            India, officially known as the Republic of India, is a vast and culturally rich country located in South Asia. It is the seventh-largest country in the world by area and the most populous country, with over 1.4 billion people. Administratively, India is divided into 28 states and 8 union territories, each functioning under its own local government and administrative setup. These divisions allow the country to manage its immense diversity and regional governance effectively. Each Indian state reflects a unique combination of language, heritage, climate, and topography — from the snow-capped Himalayas in the north, the fertile Indo-Gangetic plains, the vibrant Thar Desert, to the lush Western Ghats and coastal backwaters in the south. This geographical and cultural variety makes India one of the most diverse countries in the world.

            This page offers a comprehensive directory of all Indian states, enabling users to explore geographic, political, economic, and cultural information at a glance. Whether you are planning to travel, conducting research, or seeking educational knowledge, this resource helps you easily navigate to individual state profile pages, view maps, explore nearby districts, and access reliable data. From Kerala’s backwaters and high literacy, to Rajasthan’s deserts and forts, and Punjab’s agricultural prosperity, every state contributes uniquely to India’s national identity and development. Explore this page to understand India’s administrative structure, regional uniqueness, and collective unity in diversity. The state list is displayed below as part of the India directory, accompanied by an interactive location map that features a search option to help users find state-wise lists, district-wise locations, and city-level details — offering a complete and user-friendly location directory of Indian states, districts, and cities.
          </>  
        }
 
        </p>
      </div>
      </div>
      
      
      
      
      <div className="row" style={{padding:"30px", marginTop:"20px"}} id="slug-location-map">
<div className="col-md-12" data-aos="fade-up" style={{background:"#fff", padding:"0"}}>
<iframe src={`https://www.google.com/maps?q=${centerCoordinate?.latitude || 20.5937},${centerCoordinate?.longitude || 78.9629}&z=15&output=embed`} style={{border:"0", width: "100%", height: "340px"}}></iframe>

{/* https://www.google.com/maps?q=11.1876748,76.2531472&amp;z=15&amp;output=embed */}
{/* https://www.google.com/maps?q=11.95819859,79.82296944&z=15&output=embed */}
</div>
 
</div>
      
       
  </div>

</section>



  <DestinationSlider destinations={destinations} loading={destinationsLoading} />
  

  
  <section style={{padding:"30px 0px 0px 0px"}}>
    
    
    <div className="container">
    <div className="row">
          <div className="col-md-8" data-aos="fade-up">

            <div className="regstrtn-faq-space">

              <div className="registrsn-fq-scrool-bar-clm">
                <h3>{district?.name || state?.name || "INDIA"} FAQs</h3>
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
  
  <RegistrationSlider detailPages = {registrationDetailPages?.slice(0,12)} />
  <HomeCourseSlider detailPages={courseDetailPages?.slice(0,12)} />
  <ServiceSlider detailPages={serviceDetailPages?.slice(0,12)} />
</section>

<section style={{background: "#f1f1f1", marginBottom: "20px", padding: "0px 0px 50px 0px"}}>
    <div className="container">
      <div className="row">
        <div className="row" style={{padding: "40px 0 0px 0", textAlign: "center"}}>
          <div className="offerd-service-section" style={{margin: "0"}}>
            <ProductSlider detailPages={productDetailPages?.slice(0,12)}/>
          </div>
          <Link href="/products"  className="primary_button" style={{margin: "0 auto"}}>Buy More</Link>
        </div>  
      </div>            
    </div>
  </section>    
  
    </>
  )
}

export default ListLocations