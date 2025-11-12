import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { offeredServiceSettings } from '../../public/w3/js/slider';
import Loading from '../Loading';
import Link from 'next/link.js';

const CourseSlider = ({courseDetails, error, loading}) => {   
    
    const sliderSettings = {
            ...offeredServiceSettings,
            slidesToShow:
                courseDetails?.length >= 4
                ? offeredServiceSettings.slidesToShow
                : Math.max(courseDetails?.length || 1, 1),
            infinite: courseDetails?.length > 1,
        };

    if (loading) return <Loading/>;
    if (error) return <div>Error: {error}</div>;

  return (
    <>
        <div className="container" id="courses-section">
            <div className="offerd-service-section" style={{paddingTop:"40px"}}>
                <h3>OUR COURSES</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="offerd-service">
                    <Slider {...sliderSettings}>
                    {courseDetails?.slice(0,12)?.map((courseDetail) => (
                        
                        <div className="offerd-service_padd" key={courseDetail?.course?.slug}>
                            <div>
                            <Link href={`/${courseDetail?.url}`} >
                                <div className="offerd-service-section-clm-cntnt">
                                <div>
                                    <div className="offerd-srvs-clm-icon">
                                    <img src={courseDetail?.course?.image_url || '#'} alt={courseDetail?.course?.name} loading="lazy"/>
                                    </div>
                                    <div className="offerd-srvs-clm-text">
                                    <h5>{courseDetail?.course?.name}</h5>
                                    <span>{courseDetail?.course?.program_name}</span>
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

export default CourseSlider