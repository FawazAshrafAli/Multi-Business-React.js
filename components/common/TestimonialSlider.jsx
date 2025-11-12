import React from 'react'
import { clientTestimonialSlider } from '/public/w3/js/slider';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const TestimonialSlider = ({testimonials, loading}) => {

    const sliderSettings = {
        ...clientTestimonialSlider,
        ...({infinite: testimonials&&testimonials.length > 1}),
        ...(testimonials&&testimonials.length < 3 ? {slidesToShow: testimonials.length}: {slidesToShow: 4})
    }
    
  return (
    <>        
        <section>
        <div className="client-testimonial-section">
        <div className="container">
            <h2>TESTIMONIALS</h2>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
            <div className="client-testimonial-slider" >

            {testimonials && testimonials.length > 0 && (
            <Slider {...sliderSettings}>
            {testimonials?testimonials.slice(0,12).map((testimonial, index) => (
                <div className="client-testimonial-slider-padd" key={testimonial.slug || testimonial.id || index + 1}>
                <div className="client-testimonal-box" style={{minHeight: "352.3", minWidth: "279px"}}>
                <div className="testmnl-clin-img-bg">
                    <div className="testmnl-clin-img-bx">
                    <img src={testimonial.image_url?testimonial.image_url: '/images/model-2911332_640 1.jpg'} alt={testimonial.name || testimonial.review_by} loading='lazy'/>
                    </div>
                </div>
                <div className="testmnl-clin-review-bx">
                    <div className="testmnl-clin-review">
                    <span>
                        <i className="fa-solid fa-quote-left"></i>
                        <span className="clnt-tesmnl-cmnt">{testimonial?.text}</span>
                        <i className="fa-solid fa-quote-right"></i>
                    </span>
                    </div>
                    <div className="client-name">
                        <span>{testimonial.review_by || testimonial.name}</span>
                    </div>
                    <div className="client-cmpny-dtls">
                        <span className="clnt-cmpny-name"> {testimonial?.client_company ||  (testimonial?.product_name?.length > 25  ? `${testimonial.product_name.slice(0, 25)}...`  : testimonial?.product_name) || ""}</span>
                        <span className="clnt-cmpny-location">{testimonial?.place_name||""}</span>
                    </div>
                    <div className="client_review">                                                   
                    {[0, 1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        className={`fa fa-star${testimonial.rating > i ? " checked" : ""}`}
                    ></span>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            )): []}                            
            </Slider>
            )}

            </div>
        </div>
        </div>
    </section>
        
    </>
  )
}

export default TestimonialSlider