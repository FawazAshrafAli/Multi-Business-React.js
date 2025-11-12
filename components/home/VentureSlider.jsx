import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Loading from "../Loading";
import { teamSlideSettings } from '/public/w3/js/slider';
import Link from 'next/link';

const VentureSlider = ({companies}) => {    

  return (
    <>
        <section>
            <div className="container">
                <div className="hm-pge-join-vntr-slider">
                    <div className="join-vntr-sldr-bx" data-aos="fade-down">
                        <h2>OUR JOIN VENTURES</h2>

                        {!companies ? <Loading/> :
                        <div className="teams_slide">                            
                            <Slider {...teamSlideSettings}>
                                {companies&&companies.slice(0,12).map((company, index) => (
                                <div key={company?.slug || index} className="team_slider_padd">
                                    <div>
                                    <Link href={`/${company.slug}`}>
                                        <img src={company?.logo_url} alt={company.name}/>
                                    </Link>
                                    </div>
                                </div>
                                ))}            
                            
                            </Slider>                            
                        </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default VentureSlider