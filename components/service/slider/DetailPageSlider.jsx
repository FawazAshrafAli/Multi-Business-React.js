import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { offeredServiceSettings } from '../../../public/w3/js/slider';
import Loading from '../../Loading';
import Link from 'next/link.js';

const DetailPageSlider = ({serviceDetails, error, loading}) => { 
    const sliderSettings = {
        ...offeredServiceSettings,
        slidesToShow:
            serviceDetails?.length >= 4
            ? offeredServiceSettings.slidesToShow
            : Math.max(serviceDetails?.length || 1, 1),
        infinite: serviceDetails?.length > 1,
    };

    if (loading) return <Loading/>;    

    if (error) {
        console.error(error);
    }

  return (
    <>
        <div className="container" id="services-section">
            <div className="offerd-service-section" style={{paddingTop:"40px"}}>
                <h3 className="text-uppercase">Our Services</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="offerd-service">
                    <Slider key={serviceDetails.length} {...sliderSettings}>
                    {serviceDetails?.slice(0,12).map((serviceDetail) => (
                        
                        <div className="offerd-service_padd" key={serviceDetail?.slug}>
                            <div>
                            <Link href={`/${serviceDetail?.url}`} >
                                <div className="offerd-service-section-clm-cntnt">
                                <div>
                                    <div className="offerd-srvs-clm-icon">
                                    <img src={serviceDetail?.image_url || "/images/Company-Registration-India.svg"} alt={serviceDetail?.name} loading='lazy' />
                                    </div>
                                    <div className="offerd-srvs-clm-text">
                                    <h5>{serviceDetail?.name}</h5>
                                    <span>{serviceDetail?.category_name}</span>
                                    </div>
                                </div>
                                </div>
                            </Link>
                            </div>
                        </div>
                    )) || []}
                                
                    </Slider>                    
            
                </div>
            </div>
        </div> 
    </>
  )
}

export default DetailPageSlider