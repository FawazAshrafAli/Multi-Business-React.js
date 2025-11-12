import React, { useEffect, useState } from 'react'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'

import AOS from 'aos';
import 'aos/dist/aos.css';

import { clientSlider } from '/public/w3/js/slider';
import Loading from '../Loading';

const ClientSlider = ({clients, loading, error, detailPage, multipage, heading}) => {
    const [sliderSettings, setSliderSettings] = useState();

    useEffect(() => {
        if (!clients) return;

        setSliderSettings({
            ...clientSlider,
            ...(clients.length < 7 ? { slidesToShow: clients.length } : {})
        });

        AOS.init({
            once: true,
        });
    }, [clients]);

    if (loading) {
        return <Loading/>
    }

    if (error) {
        console.error(error);
    }
  return (
    <>  
        <section className={(detailPage || multipage)? "container py-4": "major-sectin"}>
            <div className={`"major-clients-sldr-bx mb-5"${detailPage&&" row"}`} style={detailPage&&{background : "none", paddingTop: "60px", paddingBottom: "60px"}}>
            <h2 className="text-center">{heading || "MAJOR CLIENTS"}</h2>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
            {/*  venture slider */}
            <div className="major-clients-slider" data-aos="fade-up">
                <Slider {...sliderSettings}>
                {clients?clients.map((client) => (
                    <div className="major-clients-slider_padd" key={client.slug}>
                        <div>
                            <a href="#">
                            <img src={client.image_url?client.image_url:"#"} alt={client.name} style={{height: "125px"}} loading='lazy'/>
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

export default ClientSlider