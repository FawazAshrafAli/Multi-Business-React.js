import React, { useEffect, useState } from 'react'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'

import Loading from '../../Loading'

import { offeredServiceSettings } from '/public/w3/js/slider'
import Link from 'next/link.js';

const LargeServiceSlider = ({company, serviceDetails, loading, companyTypeSlug}) => {

    const [sliderSettings, setSliderSettings] = useState();

    useEffect(() => {
        if (!serviceDetails) return;

        setSliderSettings({
            ...offeredServiceSettings,
        ...(serviceDetails&&serviceDetails.length < 4? {"slidesToShow": serviceDetails.length}: {})
        });
    }, [serviceDetails]);    

  return (
    <>
        {loading? (
            <Loading/>
        ) : (
            <div className="container">
                <div className="offerd-service-section" style={{paddingTop:"0px"}}>
                    <h2>OFFERED SERVICES IN INDIA</h2>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <div className="offerd-service" style={{paddingBottom: "30px"}}>
                        <Slider {...sliderSettings}>
                            {serviceDetails?.map((serviceDetail, index) => (
                                <div className="p-1 offerd-service-padd" style={{padding: "5px !important;"}} key={serviceDetail.service?.slug || index + 1}>
                                    <div className="position_relative img-scale max_size">
                                    <figure className="picher_doc">
                                        <img src={serviceDetail.image_url || "/images/Automation-Training-Institute-in-India.webp"} alt={serviceDetail.name} height="360.5" loading='lazy'/>
                                        <div className="opacity-medium bg-extra-black"></div>                                        
                                        <div className="inner_text">
                                        <h3 className="show_tital">{serviceDetail.name}</h3>
                        
                                        <p className="display_block">
                                            {serviceDetail.category_name}
                                        </p>
                                        
                                        <Link href={`/${serviceDetail.url}`}  className="btn btn-text">Read More <i className="fa fa-arrow-circle-right"></i></Link>
                                        </div>
                                    </figure>
                                    </div>
                                </div>
                            )) || []}
                        </Slider>

                    </div>
                    <Link href={`/${company?.slug}/more-services`}  className="primary_button" style={{margin: "0 auto"}}>View More</Link>
                </div>
            </div>
        )}
    </>
  )
}

export default LargeServiceSlider