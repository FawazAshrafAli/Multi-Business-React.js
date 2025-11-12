import React, { useEffect, useState } from 'react'
import createDOMPurify from 'dompurify';

import AOS from 'aos';
import 'aos/dist/aos.css';

import $ from 'jquery';
import "/public/easy-responsive-tabs.js";

import product from '../../lib/api/product';

import BannerSlider from '../common/BannerSlider'
import ProductSlider from '../common/ProductSlider.jsx';
import EnquiryForm from './common/EnquiryForm.jsx';
import Faq from '../common/Faq.jsx';
import Link from 'next/link.js';
import ReviewSlider from './common/ReviewSlider.jsx';
import Loading from '../Loading';

const HomeProduct = ({
    slug, currentCompany, reviews,
    detailPages, setMessage, setMessageClass
}) => {    

    const [loading, setLoading] = useState(true);    
    
    const [productCategories, setProductCategories] = useState();
    const [productCategoriesLoading, setProductCategoriesLoading] = useState(true); 

    const [sanitizedDescription, setSanitizedDescription] = useState([]);

    useEffect(() => {
        if (currentCompany) {
            setLoading(false);
        }       

        if (typeof window === 'undefined' || !currentCompany) return;
                        
        const DOMPurify = createDOMPurify(window);
        const sanitized = DOMPurify.sanitize(currentCompany.description || '')
        

        setSanitizedDescription(sanitized);

    }, [currentCompany]);  
    

    // Products & Reviews
    useEffect(() => {        

        const fetchProductCategories = async () => {
            try {
                const response = await product.getHomeProductCategories(slug);
                setProductCategories(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setProductCategoriesLoading(false);
            }
        };

        fetchProductCategories();
    }, [slug]);     


    useEffect(() => {
        
        AOS.init({
              once: true,
            });
    }, []);

    useEffect(() => {
        if (!productCategories) return;

        if (
            productCategories?.length &&            
            document.getElementById('horizontalTab')
        ) {

            $('#horizontalTab').easyResponsiveTabs({
                type: 'horizontal',
                width: 'auto',
                fit: true
            });
        }
    }, [productCategories])
    
  return (
    <>                  
        <BannerSlider slug={slug}/>            
                        
                <section className="inner_home_content_sec" style={{padding: "60px 0 0px 0"}}>
                    <div className="container">
                        <h2>ONLINE SHOPPING </h2>
                        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                        <div className="row">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div id="horizontalTab">
                                    <ul className="resp-tabs-list">
                                        {productCategories
                                            ?.filter(category => category?.details?.length > 0)
                                            .map((category, index) => (
                                                <li key={category?.slug || index}>{category?.name}</li>
                                            ))}
                                    </ul>
                                    <div className="resp-tabs-container">
                                        {productCategoriesLoading ? <Loading/> :
                                        productCategories
                                            ?.filter(category => category?.details?.length > 0)
                                            .map((category, index) => (
                                                <div key={category?.slug || index}>
                                                    <div className="row">
                                                        <h3>{category?.name}</h3>
                                                        {category?.details?.slice(0,12)?.map((detail, index) => (
                                                            <div className="col-md-3" key={detail?.slug || index + 1}>
                                                                <div className="product-grid">
                                                                    <div className="product-image">
                                                                        <Link href={`/${detail.url}`}  className="image" >
                                                                            <img className="pic-1" src={detail?.product?.image_url || '/images/img-3.jpg'} alt={detail.product?.name} style={{maxHeight: "261.5px", objectFit: "contain"}} />
                                                                            <img className="pic-2" src={detail?.product?.image_url || '/images/img-3.jpg'} alt={detail.product?.name} style={{maxHeight: "261.5px", objectFit: "contain"}}/>
                                                                        </Link>
                                                                        <span className="product-sale-label">sale!</span>
                                                                        <ul className="social">
                                                                            <li><Link href={`/${detail.url}`} data-tip="Quick View"><i className="fa fa-eye"></i></Link></li>
                                                                            <li><Link href={`/${detail.url}`} data-tip="Add to wishlist"><i className="fa fa-heart"></i></Link></li>
                                                                        </ul>
                                                                        <div className="product-rating">
                                                                            <ul className="client_review">
                                                                                <span className="fa fa-star checked" aria-hidden="true"></span>
                                                                                <span className="fa fa-star checked" aria-hidden="true"></span>
                                                                                <span className="fa fa-star checked" aria-hidden="true"></span>
                                                                                <span className="fa fa-star" aria-hidden="true"></span>
                                                                                <span className="fa fa-star" aria-hidden="true"></span>
                                                                            </ul>
                                                                            <Link className="add-to-cart" href={`/${detail.url}`}> BUY NOW </Link>
                                                                        </div>
                                                                    </div>
                                                                    <div className="product-content">
                                                                        <h3 className="title"><Link href={detail?.url} >{detail?.product?.name}</Link></h3>
                                                                        <div className="price"><span>&#8377;{ (parseFloat(detail.product?.price || 0) * 1.10).toFixed(2) }</span>&#8377;{detail.product?.price}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                        ))}
                                        <Link href={`/${slug}/products`} className="primary_button my-3"  style={{margin: "0 auto"}}>VIEW MORE</Link>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="row" style={{padding: "40px 0 0px 0"}}>
                            <div className="offerd-service-section" data-aos="fade-up" id="top-products-section">
                                <ProductSlider detailPages={detailPages?.slice(0, 12)} company={currentCompany}/>
                            </div>
                        </div>            

                    </div>                    

                    
                </section>



                {/* registraton faq setion stat */}

                <section>
                    <div className="container-fluid">

                        <div className="product-faq-section"  data-aos="fade-up" style={{padding: "0"}}>                            
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="regstrtn-faq-space">
                                        <div className="registrsn-fq-scrool-bar-clm" id="faqs-section">
                                            <h3>FAQs</h3>
                                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                            <div className="registrsn-fq-scrool-bar-clm-cntnt">
                                                <div className=" pre-scrollable" style={{height: "500px", overflowY: "auto"}}>
                                                    <Faq faqs={currentCompany?.faqs} loading={loading} companyFaq={true}/>                                                        
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

                {/* registraton faq setion end */}



                {/* product-services-section start */}

                <section style={{padding: "60px 0", textAlign: "center"}}>

                    <div className="container">
                <div className="row" style={{paddingBottom: "20px"}}>
                    <div className="row">
                        <div className="col-md-12" data-aos="fade-in">
                        <h1>{currentCompany?.name}</h1>
                        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                        <span dangerouslySetInnerHTML={{__html: sanitizedDescription}}/>
                        </div>
                    </div>

                </div>



                <h3 id="tags-section">Tags Cloud</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="row" data-aos="fade-in">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="tags_cloud">
                            {currentCompany?.meta_tags?.map((item, index) => <Link key={item.slug || index + 1} href={`/tag/${item.slug}`} title={item.name}>{item.name}</Link> ) || []}            
                        </div>
                    </div>
                </div>

                    </div>
                </section>

                {/* product-services-section end */}

                {/* client-review section start */}
                
                <div id="testimonials-section">
                <ReviewSlider testimonials={reviews} loading={loading}/>
                </div>                
    </>
  )
}

export default HomeProduct