import React from 'react'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'

import { clientSlider } from '/public/w3/js/slider';
import Loading from '../../Loading';

const PartnerSlider = ({partners, loading, error, detailPage, heading}) => {
    const sliderSettings = {
        ...clientSlider,
        ...(partners && partners.length < 7 ? { slidesToShow: partners.length } : {})
      };
    
    if (loading) {
        return <Loading/>
    }
    // if (error) return <div>Error: {error}</div>;

    if (error) {
        console.error(error);
    }
  return (
    <>  
        <section className={detailPage? "container": "major-sectin"}>
            <div className={`"major-clients-sldr-bx mb-5"${detailPage&&" row"}`} style={detailPage&&{background : "none", paddingTop: "60px", paddingBottom: "60px"}}>
            <h2 className="text-center">{heading || "CORPORATE PARTNERS"}</h2>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
            {/*  venture slider */}
            <div className="major-clients-slider" >
                <Slider {...sliderSettings}>
                {partners?partners.map((partner) => (
                    <div className="major-clients-slider_padd" key={partner.slug}>
                        <div>
                            <a href="#">
                            <img src={partner?.image_url || "#"} alt={partner.name} style={{height: "125px"}}/>
                            </a>
                        </div>
                    </div>
                )): []}                            
                </Slider>
            </div>
            </div>
        </section>
    </>
  )
}

export default PartnerSlider