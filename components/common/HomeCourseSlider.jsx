import React, { useEffect, useState } from 'react'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { offeredServiceSettings } from '/public/w3/js/slider';
import Link from 'next/link.js';

const HomeCourseSlider = ({detailPages}) => {    
  return (
    <>
        <div className="container">
      <div className="offerd-service-section" style={{paddingTop:"40px"}}>
          <h3 className='text-uppercase'>OUR COURSES IN INDIA</h3>
          <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
          <div className="offerd-service">
              <Slider {...offeredServiceSettings}>
              {detailPages?.slice(0,12)?.map((detail, index) => (                  
                  <div className="offerd-service_padd px-2" key={detail?.slug || index + 1}>
                      <div>
                      <Link href={`/${detail?.url}`}  >
                          <div className="offerd-service-section-clm-cntnt">
                          <div>
                              <div className="offerd-srvs-clm-icon">
                              <img src={detail.image_url || '/images/Company-Registration-India.svg'} alt={detail?.name} loading='lazy' />
                              </div>
                              <div className="offerd-srvs-clm-text">
                              <h5>{detail.name}</h5>
                              <span>{detail.program_name}</span>
                              </div>
                          </div>
                          </div>
                      </Link>
                      </div>
                  </div>
              )) || []}
                          
              </Slider>       
    
          </div>
          <Link href="/courses"  className="primary_button" style={{margin: "0 auto"}}>View More</Link>
      </div>
  </div> 
    </>
  )
}

export default HomeCourseSlider