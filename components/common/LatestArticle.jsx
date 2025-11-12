import React, {useEffect, useState} from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import Loading from '../Loading';
import Link from 'next/link';

const LatestArticle = ({blogs, company}) => {

  return (
    <>
        <section className="blog_section" id="articles-section">
  
            <div className="container">
                
                <h3>LATEST ARTICLES</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>                
                <>
                    <div className="row" style={{paddingBottom:"25px"}}>

                        {blogs?.slice(0,3)?.map((blog, index) => (
                            <div className="col col-md-4 col-12" key={index+1}>
                                <article className="white_back_bx bodr_radius_25px">
                                    <figure className="featured-media">
                                        <Link href={`${blog?.company_slug ? `/${blog.company_slug}` : ""}/learn/${blog.slug}`} aria-label={`Read More about: ${blog.title}`}><img src={blog.image_url?blog.image_url:"/images/food-887348_640.jpg"}  height="244.175" style={{objectFit: "cover"}} alt={blog.title} loading='lazy' /></Link>
                                    </figure>
                                    <h4 className="blog_slider_article_h2"><Link href={`${blog?.company_slug ? `/${blog.company_slug}` : ""}/learn/${blog.slug}`} aria-label={`Read More about: ${blog.title}`}>{blog.title}</Link></h4>
                                    <Link href={`${blog?.company_slug ? `/${blog.company_slug}` : ""}/learn/${blog.slug}`} className="primary_button" aria-label={`Read More about: ${blog.title}`}>Read More</Link>
                                </article>
                            </div>
                        ))||<span className='text-center text-danger'>No blogs to display</span>}
                    </div>
                    
                    {blogs?.length > 3 &&             
                    <Link href={`${company? `/${company?.slug}` : ""}/learn`} className="primary_button" style={{margin:"0 auto"}} >VIEW MORE</Link>
                    }
                </>
            </div>

        </section>
        
    </>
  )
}

export default LatestArticle