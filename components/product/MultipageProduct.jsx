import React, { Fragment, useEffect, useState } from 'react'
import createDOMPurify from 'dompurify';
import slugify from 'slugify';

import AOS from 'aos';
import 'aos/dist/aos.css';

import $ from 'jquery';
import  "/public/easy-responsive-tabs.js";

import NeonPhoneLink from '../common/NeonPhoneLink';
import EnquiryForm from './common/EnquiryForm';
import Faq from '../common/Faq';

import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../LoginForm';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { productsSlider } from '../../public/w3/js/slider';
import Link from 'next/link';
import TagCloud from '../home/TagCloud';

const MultipageProduct = ({
  slug, currentCompany, replacedMultipage,
  setMessage, setMessageClass, state, 
  district, place, isIndianData, pathname
}) => {        
    const [sanitizedDescription, setSanitizedDescription] = useState();    

    const { user, loading, refresh } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    const [formData, setFormData] = useState({});

    useEffect(() => {
      if (user) setShowLogin(false);
    }, [user]);

    const sanitizedTextEditor = (content) => {
      if (!content || typeof window === 'undefined') return;

      const DOMPurify = createDOMPurify(window);
      const sanitized = DOMPurify.sanitize(content || '')

      return sanitized || "";
    }

  useEffect(() => {
      if (typeof window === 'undefined' || !replacedMultipage) return;
                                
      const DOMPurify = createDOMPurify(window);
      const sanitized = DOMPurify.sanitize(replacedMultipage.description || '')
      
      setSanitizedDescription(sanitized);      
    }, [replacedMultipage?.description]);

  useEffect(() => {  
    if (!replacedMultipage?.slug) return;      
  
      setFormData({
        ...formData,
        "product": replacedMultipage?.slug
      })
  
    }, [replacedMultipage?.slug]);  

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
    }, [replacedMultipage?.slug]); // only re-run when page changes

  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, []);  
  
  return (
    <>    
    <section className="bg-half" style={{background: "#f1f1f1 url('/images/bg-pattran.png')"}}>
 
    
 <div className="container">

<div className="row" style={{paddingTop: "40px"}} data-aos="fade-in">

<div className="col-md-5">
  <div className="pro_details_img" id="products-section">
    <div className="products-single-slider">
        <Slider {...productsSlider}>
          {replacedMultipage?.products?.map((product, index) => (
            <article key={product?.slug || index + 1}>
              <div className="product-grid">
                  <div className="product-image">
                      <Link href={`https://api.whatsapp.com/send?phone=91${currentCompany?.whatsapp}`} className="image">
                          <img className="pic-1" src={product?.image_url} alt={product.name}/> 
                          <img className="pic-2" src={product?.image_url} alt={product.name}/>
                      </Link>
                        <span className="product-sale-label">sale!</span>
                      <ul className="social">
                          <li><Link href={`https://api.whatsapp.com/send?phone=91${currentCompany?.whatsapp}`} data-tip="Quick View"><i className="fa fa-eye" aria-hidden="true"></i></Link></li>
                          <li><Link href={`https://api.whatsapp.com/send?phone=91${currentCompany?.whatsapp}`} data-tip="Add to wishlist"><i className="fa fa-heart" aria-hidden="true"></i></Link></li>
                      </ul>
                      <div className="product-rating">
                        <ul className="client_review">                 
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span
                                key={i}
                                className={`fa fa-star${product?.rating >= i ? " checked" : ""}`}
                                aria-hidden="true"
                                onClick={() => handleStar(i)}
                            ></span>
                          ))}
                          
                    </ul>
                          <Link className="add-to-cart" href={`https://api.whatsapp.com/send?phone=91${currentCompany?.whatsapp}`}> BUY NOW </Link>
                      </div>
                  </div>
                  <div className="product-content">
                      <h3 className="title"><Link href={`https://api.whatsapp.com/send?phone=91${currentCompany?.whatsapp}`}>{product?.name}</Link></h3>
                      <div className="price">&#8377;{product?.price}</div>
                      
                  </div>
              </div>
          </article>
        )) || []}                
      </Slider>
    </div>
  </div>
</div>

<div className="col-md-7">
        <h1 className="pro_details_header">
          {isIndianData ?
            <>{replacedMultipage?.title}{!replacedMultipage?.title?.includes("India")?" in India":""}{replacedMultipage?.sub_title}</>
          :
            <>{replacedMultipage?.title}{replacedMultipage?.sub_title}</>
          }
        </h1>
        <div className="client_review" style={{textAlign: "left"}}>
            <p className="pro_details_reviews">
           {replacedMultipage?.rating} <span className="fa fa-star checked" aria-hidden="true" style={{color: "#fff"}}></span>
        </p>
         <p style={{display: "contents"}}>{replacedMultipage?.rating_count} Reviews | <a href="#">Add Your Reviews</a></p>
            
            </div>
    
<p>{replacedMultipage?.summary}</p>

    {!replacedMultipage?.hide_features &&
    <ul className="row list-default no_border">
      {replacedMultipage?.features?.map((feature, index) => <li key={feature?.slug || index + 1}>{feature?.feature}</li>)}    
    
    </ul>
    }
  </div>
</div>

                
               <div className="row">
                
                <p id="breadcrumbs" className="font_cl_black" style={{textAlign: "center"}}>
                    <span>
                      <span><Link href="/" >Home</Link></span> » 
                      <span><Link href={`/${slug}`} >{currentCompany?.sub_type}</Link></span> » 
                      {replacedMultipage?.url_type == "location_filtered" ?
                      <>
                        {isIndianData ? 
                          <span className="breadcrumb_last" aria-current="page">{replacedMultipage?.title}{!replacedMultipage?.title?.includes("India")?" in India":""}</span>
                        :
                          
                        <>
                          <span><Link href={`/${slug}/${replacedMultipage?.slug}`} >{replacedMultipage?.modified_title || replacedMultipage?.title}</Link></span> »
                          {(place || district) && 
                            <>
                              <span><Link href={`/${slug}/${replacedMultipage?.slug}/${state?.slug}`} >{state?.name}</Link></span> »
                            </>
                          }
                          {place && 
                            <>                                        
                              <span><Link href={`/${slug}/${replacedMultipage?.slug}/${state?.slug}/${district?.slug}`} >{district?.name || state?.name}</Link></span> »
                            </>
                          }
                          <span className="breadcrumb_last" aria-current="page">{place?.name || district?.name || state?.name}</span>
                        </>
                        }
                      </>
                      :
                      <span className="breadcrumb_last" aria-current="page">{replacedMultipage?.title}</span>
                      }
                      </span>
                    </p>
               </div>

            </div>

       
        </section>
  
  <div id="stick_navbar" style={{padding: "0px 0"}}>    
    {replacedMultipage?.hide_support_languages &&
    <>
        <div className="communicate_language"><p> <span style={{color: "#ff0", textTransform:"uppercase"}}>Support Languages:</span> English <span style={{color: "#f00"}}>|</span> ಕನ್ನಡ <span style={{color: "#f00"}}>|</span> हिंदी <span style={{color: "#f00"}}>|</span> தமிழ் <span style={{color: "#f00"}}>|</span> മലയാളം <span style={{color: "#f00"}}>|</span> తెలుగు</p></div>

        <NeonPhoneLink currentCompany={currentCompany}/>
    </>
    }
    <div style={{clear:"both"}}></div>

    <toc className="bzindia_toc_scroll">
      {replacedMultipage?.toc?.map((title, index) => <a key={index} href={`${pathname}#${slugify(title || "", { lower: true })}-section`}>{title}</a>) || []}
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
      {!replacedMultipage?.hide_bullets && replacedMultipage?.bullets?.length > 0 &&
      <ul className="row list-default">
        {replacedMultipage?.bullet_points?.map((bullet, index) => <li key={bullet?.slug || index + 1} className="col col-md-6 col-12">{bullet?.bullet_point}</li>)}        
      </ul>
      }
      
    
    </div>
      <div>

        <div className="comments-area pb-0">
          <ul className="media-list list-unstyled mb-0">

            {replacedMultipage?.reviews?.map((review, index) => (
              <li className="media" key={review?.slug || index + 1}>
                <a className="float-left pr-3" href="#">
                    <img className="img-fluid d-block mx-auto rounded-circle" src='/images/co-1.jpg' alt={replacedMultipage?.title}/>
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
                    </div> ({review?.rating})&nbsp;<small className='text-muted'>({review?.product_name?.slice(0, 50)}{review?.product_name?.length > 50 && "..."})</small></h4>
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

  <section className="content_area001" style={{paddingTop: "30px"}}>
    <div className="container">

      <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12">
            <h3>
              {isIndianData ?
                <>{replacedMultipage?.title}{!replacedMultipage?.title?.includes("India")?" in India":""}{replacedMultipage?.sub_title}</>
              :
                <>{replacedMultipage?.title}{replacedMultipage?.sub_title}</>
              }
            </h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>        
      </div>
      </div>        

      {replacedMultipage?.text_editors?.map((text_editor, editorIndex) => (
        <Fragment key={text_editor.slug || editorIndex + 1}>
          <h3 className="text-start" id={text_editor?.text_editor_title ? `${slugify(text_editor?.text_editor_title, { lower: true })}-section` : undefined}>{text_editor?.text_editor_title}</h3>
          <div className="text-start" dangerouslySetInnerHTML={{__html: sanitizedTextEditor(text_editor.content || "")}} />
        </Fragment>
      ))
      }
</div>



  </section>


 
 
  {!replacedMultipage?.hide_timeline && replacedMultipage?.timelines?.length > 0 &&
  <section className="resume segments" id="resume" style={{background: "#ecf2ef", padding: "60px 0px", margin: "0px 0px 0px 0px"}}>
    <div className="container">
    <div className="row">
      <div className="col-md-12 col-sm-12 col-xs-12">
      <h3 id={`${slugify(replacedMultipage?.timeline_title || "", {"lower": true})}-section`}>{replacedMultipage?.timeline_title}</h3>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

      <ul className="timeline">
        {replacedMultipage?.timelines?.map((timeline, index) => (
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
            <div className="regstrtn-faq-space" id="faqs-section">
              <div className="registrsn-fq-scrool-bar-clm">
                <h3>Product FAQs</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="registrsn-fq-scrool-bar-clm-cntnt">
                  <div className=" pre-scrollable" style={{height: "340px", overflowY: "auto"}}>
                    <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                      <Faq faqs={replacedMultipage?.faqs} />
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

  {replacedMultipage?.meta_tags &&
    <div className="content_area001" id="tags-section">
      <TagCloud
        metaTags={replacedMultipage?.meta_tags?.map(tag => {
          let slug = tag.slug;

          if (place?.name && place?.slug) {
            slug = slug.replace(place.name, place.slug);
          }
          if (district?.name && district?.slug) {
            slug = slug.replace(district.name, district.slug);
          }
          if (state?.name && state?.slug) {
            slug = slug.replace(state.name, state.slug);
          }

          slug = slug.replace("India", "india");

          return {
            name: tag.name,
            slug
          };
        })}
      />
    </div>
  }
          

  {/* registraton faq setion end */}

  {/* client-testimonial section start */}

  {/* <ReviewSlider testimonials={replacedMultipage?.reviews} /> */}
      
    </>
  )
}

export default MultipageProduct