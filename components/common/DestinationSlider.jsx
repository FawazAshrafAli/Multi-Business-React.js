import React, {useEffect, useState} from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { nearbyDestinationsSettings } from '/public/w3/js/slider';
import Loading from '../Loading';

const DestinationSlider = ({destinations}) => {
  return (
    <>
            <section className="destination_main">
            <div className="destination_sub_bx">
                <div className="container">
                    <h2 style={{textAlign:"center"}}>FIND NEARBY DESTINATION</h2>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    {!destinations?
                        <Loading/>
                    :
                    <div className="row">
                        <div className="nearby-destinations" style={{paddingBottom: "30px"}}>
                            <Slider {...nearbyDestinationsSettings}>
                                {destinations?.slice(0,12)?.map((destination, index) => (
                                    <div className="p-1" style={{padding: "5px"}} key={index + 1}>
                                        <div className="position_relative img-scale max_size">
                                            <figure className="picher_doc">
                                                <img src={destination?.image_url || "/images/no-image.jpeg"} alt={destination.name} loading='lazy'/>
                                                <div className="opacity-medium bg-extra-black"></div>

                                                {destination.attraction_type&&<div className="date_top">
                                                    <span><a href="#" tabIndex="0">{destination.attraction_type}</a></span>
                                                </div>}

                                                <div className="inner_text">
                                                <h3 className="show_tital">{destination.name}</h3>

                                                <p className="display_block">
                                                    {destination.place_name}
                                                </p>
                                                
                                                <a href="#" className="btn btn-text">Read More <i className="fa fa-arrow-circle-right"></i></a>
                                                </div>
                                            </figure>
                                        </div>
                                    </div>
                                )) || []}                    
                            </Slider>                                
                        </div>
                        <a href="#" className="primary_button" style={{margin: "0 auto"}}>VIEW MORE</a>
                    </div>
                    }
                </div>
            </div>
        </section>
    </>
  )
}

export default DestinationSlider