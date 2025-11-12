import React, { useEffect, useState } from 'react'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'

import Loading from '../../Loading'

import { offeredServiceSettings } from '/public/w3/js/slider'
import Link from 'next/link.js';

const LargeCourseSlider = ({company, courseDetails, loading}) => {
    const sliderSettings = {
        ...offeredServiceSettings,
        ...(courseDetails&&courseDetails.length < 4? {"slidesToShow": courseDetails.length}: {})
    }

  return (
    <> 
        {loading? (
            <Loading/>
        ) : (
            <div className="container">
                <div className="offerd-service-section" style={{paddingTop:"0px"}}>
                    <h3>ONLINE COURSES IN INDIA</h3>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <div className="offerd-service" style={{paddingBottom: "30px"}}>
                        <Slider {...sliderSettings}>
                            {courseDetails?.map((courseDetail) => (
                                <div className="p-1 offerd-course-padd" style={{padding: "5px !important;"}} key={courseDetail.slug}>
                                    <div className="position_relative img-scale max_size">
                                    <figure className="picher_doc">
                                        <img src={courseDetail.image_url?courseDetail.image_url:"/images/Automation-Training-Institute-in-India.webp"} alt={courseDetail.name} loading="lazy" height="360.5"/>
                                        <div className="opacity-medium bg-extra-black"></div>
                                        {courseDetail.duration&&<div className="date_top">
                                        <span><a href="#" tabIndex="0">Duration: {courseDetail.duration} days</a></span>
                                        </div>}
                                        <div className="inner_text">
                                        <h3 className="show_tital">{courseDetail.name}</h3>
                        
                                        <p className="display_block">
                                            {courseDetail.program_name}
                                        </p>
                                        
                                        <Link href={`/${courseDetail.url}`}  className="btn btn-text">Read More <i className="fa fa-arrow-circle-right"></i></Link>
                                        </div>
                                    </figure>
                                    </div>
                                </div>
                            )) || []}
                        </Slider>

                    </div>
                    <Link href={`/${company?.slug}/courses`}  className="primary_button" style={{margin: "0 auto"}}>View More</Link>
                </div>
            </div>
        )}
    </>
  )
}

export default LargeCourseSlider