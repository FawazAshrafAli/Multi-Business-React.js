import React, { useEffect, useState } from 'react'
import product from '../../lib/api/product';

import AOS from 'aos';
import 'aos/dist/aos.css';

import createDOMPurify from 'dompurify';

import $ from 'jquery';
import  "/public/easy-responsive-tabs.js";

import NeonPhoneLink from '../common/NeonPhoneLink';
import slugify from 'slugify';
import Faq from '../common/Faq';
import EnquiryForm from './common/EnquiryForm';
import ReviewSlider from './common/ReviewSlider';
import Cookies from 'js-cookie';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../LoginForm';
import Link from 'next/link';
import TagCloud from '../home/TagCloud';

const DetailProduct = ({
  detailPage, currentCompany,
  setMessage, setMessageClass
  }) => {
  const [formData, setFormData] = useState({});
  const [reviewedRating, setReviewedRating] = useState(0);

  const { user, loading, refresh } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const [sanitizedDescription, setSanitizedDescription] = useState();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (user) setShowLogin(false);
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData, 
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const csrfToken = Cookies.get('csrftoken');

    try {
      const response = product.postReview(
        formData, 
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        },
        currentCompany?.slug || ""
      )

      const { success, message } = response?.data || {};


      setMessageClass(success ? "bg-success" : "bg-danger");
      setMessage(message);

      if (success) {
          setFormData({});
      }

    } catch (err) {
      console.error("Submission failed:", err);

      const responseData = err.response?.data;
      setMessageClass("bg-danger");

      if (responseData?.errors) {
          console.error("Validation details:", responseData.errors);
      }

      setMessage(responseData?.message || "Something went wrong.");
    } finally {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const handleStar = (rating) => {
    setReviewedRating(rating);
    setFormData({
      ...formData,
      "rating": rating
    })
  }  
  
  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, []);

  const handleQtyChange = (e) => {
    setQty(e.target.value);
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !detailPage?.description) return;

    const DOMPurify = createDOMPurify(window);
    const sanitized = DOMPurify.sanitize(detailPage.description || '')
    
    setSanitizedDescription(sanitized);
  }, [detailPage?.description]);

  useEffect(() => {
    if (!detailPage?.slug) return;    

    setFormData({
      ...formData,
      "product": detailPage?.slug
    })    

  }, [detailPage?.slug]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.$ || !$.fn.easyResponsiveTabs) return;

    const initTabs = () => {
      const horiz = document.getElementById("horizontalTab");
      if (horiz) {
        // destroy existing instance if any
        try { $(horiz).easyResponsiveTabs('destroy'); } catch {}
        
        $(horiz).easyResponsiveTabs({
          type: 'horizontal',
          width: 'auto',
          fit: true
        });
      }
    };

    // Delay so React mounts DOM first
    const timer = setTimeout(initTabs, 0);

    return () => clearTimeout(timer);
  }, [detailPage?.slug]); // only re-run when page changes


  return (
    <>    
    <section className="bg-half" style={{background: "#f1f1f1 url('/images/bg-pattran.png')"}}>
 
    
 <div className="container">

<div className="row" style={{paddingTop: "40px"}} data-aos="fade-in">

<div className="col-md-5">
  <div className="pro_details_img">
    <img src={detailPage?.image_url || "#"} alt={detailPage?.name} style={{maxHeight: "486px", objectFit: "contain"}}/>
  </div>
</div>

<div className="col-md-7">
<h1 className="pro_details_header">{detailPage?.name}</h1>
<div className="client_review" style={{textAlign: "left"}}>
    <p className="pro_details_reviews">
   {detailPage?.rating} <span className="fa fa-star checked" aria-hidden="true" style={{color: "#fff"}}></span>
</p>
 <p style={{display: "contents"}}>{detailPage?.rating_count} Reviews | <a href="#">Add Your Reviews</a></p>
    
    </div>

<p className="ecom_price">&#8377;{detailPage?.price}/-  <span>Available: {detailPage?.stock > 0 ? <span className="font_green">In stock</span> : <span className="font_red">Out stock</span>} </span></p>



    <div className="product-quantity d-flex align-items-center">
        <div className="quantity-field">
            <label htmlFor="qty">Qty</label>
            <input type="number" id="qty" min="1" max="100" value={qty} onChange={handleQtyChange}/>
            <Link href={detailPage?.buy_now_action === "whatsapp"? `https://api.whatsapp.com/send?phone=91${detailPage?.whatsapp}` : detailPage.external_link || "#"} className="primary_button" target="_blank">Buy Now</Link>
        </div>

        
    </div>
    
<p>{detailPage?.summary}</p>

    {!detailPage?.hide_features &&
    <ul className="row list-default no_border">
      {detailPage?.features?.map((feature, index) => <li key={feature?.slug || index + 1}>{feature?.feature}</li>)}    
    
    </ul>
    }
  </div>
</div>

                
               <div className="row">
                
                <p id="breadcrumbs" className="font_cl_black" style={{textAlign: "center"}}>
                    <span>
                      <span><Link href="/"  >Home</Link></span> » 
                      <span><Link href={`/${currentCompany?.slug}`}>{currentCompany?.sub_type}</Link></span> » 
                      <span><Link href={`/${currentCompany?.slug}/${detailPage?.category_slug}`}>{detailPage?.category_name}</Link></span> » 
                      <span><Link href={`/${currentCompany?.slug}/${detailPage?.category_slug}/${detailPage?.sub_category_slug}`}>{detailPage?.sub_category_name}</Link></span> »                  
                      <span className="breadcrumb_last" aria-current="page">{detailPage?.name?.slice(0,50)}{detailPage?.name?.length > 50 && "..."}</span>
                    </span>
                    </p>
               </div>

            </div>

       
        </section>
  
  <div id="stick_navbar" style={{padding: "0px 0"}}>    
    {detailPage&&!detailPage?.hide_support_languages &&
    <>
        <div className="communicate_language"><p> <span style={{color: "#ff0", textTransform:"uppercase"}}>Support Languages:</span> English <span style={{color: "#f00"}}>|</span> ಕನ್ನಡ <span style={{color: "#f00"}}>|</span> हिंदी <span style={{color: "#f00"}}>|</span> தமிழ் <span style={{color: "#f00"}}>|</span> മലയാളം <span style={{color: "#f00"}}>|</span> తెలుగు</p></div>

        <NeonPhoneLink currentCompany={currentCompany}/>
    </>
    }
    <div style={{clear:"both"}}></div>

    <toc className="bzindia_toc_scroll">
      {detailPage?.toc?.map((title, index) => <a key={index} href={`#${slugify(title || "", { lower: true })}-section`}>{title}</a>) || []}
    </toc>

  


</div>
 
 
    {/*banner-slider end */}

<section style={{padding: "30px 0px 0px 0px"}}>
  <div className="container">
 
    <div className="row">
  <div className="col-md-12 col-sm-12 col-xs-12">
    <div id="horizontalTab">
      <ul className="resp-tabs-list">
      <li>Description</li>
      <li>Reviews</li>
      </ul>
      <div className="resp-tabs-container">
      <div>
      <p>
        <span dangerouslySetInnerHTML={{__html: sanitizedDescription}} />
      </p>
      {!detailPage?.hide_bullets && 
      <ul className="row list-default">
        {detailPage?.bullet_points?.map((bullet, index) => <li key={bullet?.slug || index + 1} className="col col-md-6 col-12">{bullet?.bullet_point}</li>)}        
      </ul>
      }
    
    </div>
      <div>

        <div className="comments-area pb-0">
          <ul className="media-list list-unstyled mb-0">

            {detailPage?.reviews?.map((review, index) => (
              <li className="media" key={review?.slug || index + 1}>
                <a className="float-left pr-3" href="#">
                    <img className="img-fluid d-block mx-auto rounded-circle" src='/images/co-1.jpg' alt={review?.review_by || review?.name}/>
                </a>

                <div className="media-body">
                    
                    <h4 className="media-heading">{review?.review_by || review?.name} <div className="client_review" style={{textAlign: "left", display: "contents"}}>                      
                      {[0, 1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        className={`fa fa-star${review.rating > i ? " checked" : ""}`}
                        aria-hidden="true"
                    ></span>
                    ))}
                      </div> ({review?.rating})</h4>
                    <h6 className="text-muted">{review?.created_date}</h6>
                    <p className="">{review?.text}</p>
                </div>
              </li>
            ))}            
            <li className="bar"></li>
            {/* Post end*/}

            {/* form */}
        </ul>

          <div className="page-title mt-3 mb-3">
              <h4><span>Write a Review</span></h4>
          </div>

          <ul className="media-list list-unstyled mb-0">
 
              <li>                  
                  
                  {user ? 
                  <>
                    <div className="row" style={{paddingBottom: "10px"}}>
                        <div className="col-lg-12">
                          <b>Rating: </b>
                              <div className="client_review" style={{textAlign: "left", display: "contents"}}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                <span
                                    key={i}
                                    className={`fa fa-star${reviewedRating >= i ? " checked" : ""}`}
                                    aria-hidden="true"
                                    onClick={() => handleStar(i)}
                                ></span>
                                ))}
                              </div>
                                      
                        </div>
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <textarea placeholder="Your Review" name="text" className="form-control" onChange={(e) => handleChange(e)} value={formData.text || ""} required></textarea>
                                    <span className="input-focus-effect theme-bg"></span>
                                </div>
                            </div>

                  
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input id="name" name="review_by" type="text" placeholder="Name" className="validate form-control" onChange={(e) => handleChange(e)} value={formData.review_by || ""} required/>
                                    <span className="input-focus-effect theme-bg"></span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <input id="email" type="email" placeholder="Email" name="email" className="validate form-control" onChange={(e) => handleChange(e)} value={formData.email || ""} required/>
                                    <span className="input-focus-effect theme-bg"></span>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="send">
                                    <button className="primary_button" role="button" type="submit">SEND</button>
                                </div>
                            </div>
                        </div>
                    </form>
                  </>
                  :                  
                  <>
                    {showLogin ? (
                      <LoginForm onLoginSuccess={refresh} />
                    ) : (
                      <button onClick={() => setShowLogin(true)}>Login</button>
                    )}
                  </>
                  }
              </li>
              {/* form */}
          </ul>
      </div>

      </div>
      <div>
      <p>Suspendisse blandit velit Integer laoreet placerat suscipit. Sed sodales scelerisque commodo. Nam porta cursus lectus. Proin nunc erat, gravida a facilisis quis, ornare id lectus. Proin consectetur nibh quis Integer laoreet placerat suscipit. Sed sodales scelerisque commodo. Nam porta cursus lectus. Proin nunc erat, gravida a facilisis quis, ornare id lectus. Proin consectetur nibh quis urna gravid urna gravid eget erat suscipit in malesuada odio venenatis.</p>
      </div>
      </div>
      </div>
  </div></div>

 
  </div>
</section>
 

  {/* registration-services-section start */}
 
 
  {!detailPage?.hide_timeline && 
  <section className="resume segments" id="resume" style={{background: "#ecf2ef", padding: "60px 0px", margin: "0px 0px 0px 0px"}}>
    <div className="container">
    <div className="row">
      <div className="col-md-12 col-sm-12 col-xs-12">
      <h3 id={`${slugify(detailPage?.timeline_title || "", {"lower": true})}-section`}>{detailPage?.timeline_title}</h3>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

      <ul className="timeline">
        {detailPage?.timelines?.map((timeline, index) => (
          <li key={timeline.slug || index + 1}>
            <h4>{timeline?.heading} </h4>
            <span>{timeline?.summary}</span>
          </li> 
        ))}
    </ul>
  </div>
    </div></div>
  </section>
  }

  <section>
    <div className="container-fluid">

      <div className="registration-faq-section my-5" id="faqs-section">        
        <div className="row">
          <div className="col-md-8">
            <div className="regstrtn-faq-space">
              <div className="registrsn-fq-scrool-bar-clm">
                <h3>Product FAQs</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="registrsn-fq-scrool-bar-clm-cntnt">
                  <div className=" pre-scrollable" style={{height: "340px", overflowY: "auto"}}>
                    <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                      <Faq faqs={detailPage?.faqs}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 ">
            <EnquiryForm company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
          </div>
        </div>
      </div>
    </div>
  </section>

  {detailPage?.meta_tags &&
  <div className="content_area001" id="tags-section">
    <TagCloud metaTags={detailPage.meta_tags}/>  
  </div>
  }

  {/* registraton faq setion end */}

  {/* client-testimonial section start */}

  <ReviewSlider testimonials={detailPage?.reviews} />
        
    </>
  )
}

export default DetailProduct