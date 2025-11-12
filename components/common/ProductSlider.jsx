import React, {useEffect, useState} from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { offeredServiceSettings } from '/public/w3/js/slider';
import Link from 'next/link';

const ProductSlider = ({detailPages}) => {    

  return (
    <>        
        <h3>TOP PRODUCTS</h3>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
        <div className="offerd-service">
            <Slider {...offeredServiceSettings}>
                {detailPages?.map((detail, index) => (
                    <div className="p-1" style={{padding: "5px"}} key={index+1}>
                        <div className="product-grid" style={{maxWidth: "309px"}}>
                            <div className="product-image">
                                <Link href={`/${detail.url}`} className="image"  >
                                    <img className="pic-1" src={detail.image_url || "/images/img-3.jpg"} alt={detail.name} style={{height: "262.95px", width: "277.4px", objectFit: "contain", objectPosition: "center"}} loading='lazy' />
                                    <img className="pic-2" src={detail.image_url || "/images/img-4.jpg"} alt={detail.name} style={{height: "262.95px", width: "277.4px", objectFit: "contain", objectPosition: "center"}} loading='lazy' />
                                </Link>
                                <span className="product-sale-label">sale!</span>
                                <ul className="social">
                                    <li><Link href={`/${detail.url}`} data-tip="Quick View"><i className="fa fa-eye"></i></Link></li>
                                    <li><Link href={`/${detail.url}`} data-tip="Add to wishlist"><i className="fa fa-heart"></i></Link></li>
                                </ul>
                                <div className="product-rating">
                                    <ul className="client_review">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                        <span
                                            key={i}
                                            className={`fa fa-star${detail.rating_count > i ? " checked" : ""}`}
                                            aria-hidden="true"
                                        ></span>
                                        ))}
                                    
                                    </ul>
                                    <Link className="add-to-cart" href={`/${detail.url}` || "#"} > BUY NOW </Link>
                                </div>
                            </div>
                            <div className="product-content">
                                <h3 className="title"><Link href={`/${detail.url}` || "#"} style={{display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}}>{detail.name}</Link></h3>
                                <div className="price">&#8377;{detail.price}</div>
                            </div>
                        </div>
                    </div>
                ))}            
            </Slider>
        </div>
                        
    </>
  )
}

export default ProductSlider