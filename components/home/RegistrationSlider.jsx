import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { offeredServiceSettings } from '/public/w3/js/slider';
import Link from 'next/link';

const RegistrationSlider = ({detailPages, nearestLocation}) => {    
    
  return (
    <>
      <div className="container">
        <div className="offerd-service-section" style={{marginBottom: "0px"}}>
          <h3>STARTUP SERVICES IN INDIA</h3>
          <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
          <div className="offerd-service">
            <Slider {...offeredServiceSettings}>
              {detailPages?.map((detail, index) => (
                
                <div key={detail?.slug || index} className="offerd-service_padd">
                <div>
                  <Link href={`/${detail?.url}`}  >
                    <div className="offerd-service-section-clm-cntnt">
                      <div>
                        <div className="offerd-srvs-clm-icon">
                          <img src={`${detail?.image_url || "/images/Company-Registration-India.svg" }`} alt={detail?.title}/>
                        </div>
                        <div className="offerd-srvs-clm-text">
                          <h5>{detail?.title}</h5>
                          <span>{detail?.type_name}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>              
              ))}
                          
            </Slider>
    
          </div>
          {nearestLocation &&
          <Link href={`/${nearestLocation?.district?.slug || nearestLocation?.state?.slug}/filings`}  className="primary_button" style={{margin: "0 auto"}}>View More</Link>          
          }
        </div>
      </div>
    </>
  )
}

export default RegistrationSlider