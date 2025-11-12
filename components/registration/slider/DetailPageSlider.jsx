import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { offeredServiceSettings } from '../../../public/w3/js/slider';
import Loading from '../../Loading';
import Link from 'next/link.js';

const DetailPageSlider = ({registrationDetails, error, loading}) => {
    const sliderSettings = {
        ...offeredServiceSettings,
        slidesToShow:
            registrationDetails?.length >= 4
            ? offeredServiceSettings.slidesToShow
            : Math.max(registrationDetails?.length || 1, 1),
        infinite: registrationDetails?.length > 1,
    };

    if (loading) return <Loading/>;

    if (error) {
        console.error(error);
    }

  return (
    <>
        <div className="container" id="registrations-section">
            <div className="offerd-service-section" style={{paddingTop:"40px"}}>
                <h3 className="text-uppercase">Related Startup Services In India</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="offerd-service">
                    <Slider {...sliderSettings}>
                    {registrationDetails?.slice(0,12)?.map((registrationDetail) => (
                        
                        <div className="offerd-service_padd" key={registrationDetail?.slug}>
                            <div>
                            <Link href={`/${registrationDetail.url}`} >
                                <div className="offerd-service-section-clm-cntnt">
                                <div>
                                    <div className="offerd-srvs-clm-icon">
                                    <img src={registrationDetail?.registration?.image_url || "/images/Company-Registration-India.svg"} alt={registrationDetail?.registration?.title} loading="lazy"/>
                                    </div>
                                    <div className="offerd-srvs-clm-text">
                                    <h5>{registrationDetail?.registration?.title}</h5>
                                    <span>{registrationDetail?.registration?.type_name}</span>
                                    </div>
                                </div>
                                </div>
                            </Link>
                            </div>
                        </div>
                    ))}
                                
                    </Slider>                        
                </div>
            </div>
        </div> 
    </>
  )
}

export default DetailPageSlider