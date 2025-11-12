import React, { useEffect, useState } from 'react'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'

import Loading from '../../Loading'

import { offeredServiceSettings } from '/public/w3/js/slider'
import Link from 'next/link.js';

const LargeRegistrationSlider = ({company, registrationDetails, loading, companyTypeSlug}) => {
    const sliderSettings = {
        ...offeredServiceSettings,
        ...(registrationDetails&&registrationDetails.length < 4? {"slidesToShow": registrationDetails.length}: {})
    }    
    
  return (
    <>
        {loading? (
            <Loading/>
        ) : (
            <div className="container">
                <div className="offerd-service-section" style={{paddingTop:"0px"}}>
                    <h2>STARTUP SERVICES IN INDIA</h2>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <div className="offerd-service" style={{paddingBottom: "30px"}}>
                        <Slider {...sliderSettings}>
                            {registrationDetails?.map((registrationDetail, index) => (
                                <div className="p-1 offerd-registration-padd" style={{padding: "5px !important;"}} key={registrationDetail?.slug || index + 1}>
                                    <div className="position_relative img-scale max_size">
                                    <figure className="picher_doc">
                                        <img src={`${registrationDetail?.image_url || "/images/Automation-Training-Institute-in-India.webp"}`} alt={registrationDetail?.title} height="360.5"/>
                                        <div className="opacity-medium bg-extra-black"></div>                                        
                                        <div className="inner_text">
                                        <h3 className="show_tital">{registrationDetail?.title}</h3>
                        
                                        <p className="display_block">
                                            {registrationDetail?.type_name}
                                        </p>
                                        
                                        <Link href={`/${registrationDetail.url}`}  className="btn btn-text">Read More <i className="fa fa-arrow-circle-right"></i></Link>
                                        </div>
                                    </figure>
                                    </div>
                                </div>
                            )) || []}
                        </Slider>

                    </div>
                    <a href={`/${company?.slug}/registrations`} className="primary_button" style={{margin: "0 auto"}}>View More</a>
                </div>
            </div>
        )}
    </>
  )
}

export default LargeRegistrationSlider