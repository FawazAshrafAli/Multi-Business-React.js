import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { offeredServiceSettings } from '/public/w3/js/slider';
import Link from 'next/link';

const ServiceSlider = ({detailPages}) => {
    
    return (
        <>  
            <div className="container">
                <div className="offerd-service-section" style={{paddingTop:"0px"}}>
                    <h3>ONLINE SERVICES IN INDIA</h3>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <div className="offerd-service" style={{paddingBottom: "30px"}}>
                        <Slider {...offeredServiceSettings}>
                            {detailPages?.map((detail,index) => (
                                <div className="p-1" key={index+1}>
                                    <div className="position_relative img-scale max_size" style={{maxWidth: "309px"}}>
                                    <figure className="picher_doc">
                                        <img src={detail.image_url || "/images/Automation-Training-Institute-in-India.webp"} alt={detail?.name} height="360.5" style={{objectFit: 'cover'}} loading='lazy' />
                                        <div className="opacity-medium bg-extra-black"></div>
                                        {detail.duration_count&&<div className="date_top">
                                        <span><a href="#" tabIndex="0">Duration: {detail.duration_count} days</a></span>
                                        </div>}
                                        <div className="inner_text">
                                        <h3 className="show_tital">{detail.name}</h3>
                        
                                        <p className="display_block">
                                            {detail.category_name}
                                        </p>
                                        
                                        <Link href={`/${detail.url}`} className="btn btn-text" >Read More <i className="fa fa-arrow-circle-right"></i></Link>
                                        </div>
                                    </figure>
                                    </div>
                                </div>
                            )) || []}
                        </Slider>

                    </div>
                    <Link href="/services"  className="primary_button" style={{margin: "0 auto"}}>View More</Link>
                </div>
            </div>
            
        </>
    )
}

export default ServiceSlider