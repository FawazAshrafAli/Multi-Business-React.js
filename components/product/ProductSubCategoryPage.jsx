import React, { useContext, useEffect, useRef, useState } from 'react'
import product from '../../lib/api/product';
import Link from 'next/link';
import Loading from '../Loading';
import BlogContext from '../context/BlogContext';
import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';
import AutoPopUp from '../common/AutoPopUp';
import Message from '../common/Message';

import ReviewSlider from './common/ReviewSlider';

const ProductSubCategoryPage = ({
    slug, currentCompany, subCategorySlug, productSubCategory, 
}) => {
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const [details, setDetails] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [nextParams, setNextParams] = useState('limit=9&offset=0');
    const loaderRef = useRef(null);

    const { setLogo, resetLogo } = useContext(LogoContext);
    const { setTitle, resetTitle } = useContext(TitleContext);
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
    const { setBlogs, resetBlogs } = useContext(BlogContext);''    

    const nextParamsRef = useRef(nextParams);

    useEffect(() => {
        nextParamsRef.current = nextParams;
    }, [nextParams]);

    useEffect(() => {
        if (currentCompany) {
        const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;
    
        if (logo_url) setLogo(logo_url);
        if (meta_title) setTitle(`${productSubCategory?.name} - ${meta_title}`);
        if (blogs) setBlogs(blogs);
    
        const phones = [phone1, phone2].filter(Boolean).join(' - ');
        if (phones) setPhoneNumber(phones);
        }
    
        return () => {
        resetLogo();
        resetTitle();
        resetPhoneNumber();
        resetBlogs();
        };
    }, [currentCompany]);    

    const fetchDetails = async (slug, subCategorySlug, params = "") => {
        if (!slug || !subCategorySlug) return;
        setDetailsLoading(true);

        try {
            let query = `sub_category=${subCategorySlug}`;
            if (params) query += `&${params}`;

            const response = await product.getProductDetailList(slug, query);

            setDetails(prev => {
                const seen = new Set(prev.map(item => item.slug));
                const newItems = response.data.results.filter(item => !seen.has(item.slug));
                return [...prev, ...newItems];
            });


            if (response.data.next) {
            const urlParams = response.data.next.split("?")[1];
            setNextParams(urlParams);
            } else {
            setNextParams(null);
            }
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setDetailsLoading(false);
        }
    };



    useEffect(() => {
        if (!currentCompany?.slug || !subCategorySlug) return;

        setDetails([]);
        const initialParams = "limit=9&offset=0";
        setNextParams(initialParams);
        nextParamsRef.current = initialParams;

        fetchDetails(currentCompany.slug, subCategorySlug, initialParams);
    }, [currentCompany?.slug, subCategorySlug]);


    const detailsLoadingRef = useRef(detailsLoading);
    useEffect(() => {
        detailsLoadingRef.current = detailsLoading;
    }, [detailsLoading]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (
            entries[0].isIntersecting &&
            nextParamsRef.current &&
            !detailsLoadingRef.current
            ) {
            fetchDetails(currentCompany?.slug, subCategorySlug, nextParamsRef.current);
            }
        }, { rootMargin: "200px", threshold: 0 });

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [currentCompany?.slug, subCategorySlug]);


    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                setMessageClass("");
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [message]);
 
  return (
    <>
        
        <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
        {message&&
        <Message message={message} messageClass={messageClass} />
        }
        <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>    
    
    <div className="bg-overlay"></div>
    <div className="home-center">
        <div className="home-desc-center" data-aos="fade-in">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-next-level text-white">
                            <h1>{`${productSubCategory?.name}`}</h1>
                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                             
                        <p id="breadcrumbs">
                           <span>
                           <span><Link href="/" >Home</Link></span> » 
                           <span><Link href={`/${slug}`}>{currentCompany?.sub_type}</Link></span> »
                           <span><Link href={`/${slug}/${productSubCategory?.category_slug}`}>{productSubCategory?.category_name}</Link></span> »
                            <span className="breadcrumb_last" aria-current="page">{productSubCategory?.name}</span>
                           </span>
                           </p>

                        </div>
                    </div>  
                    
                    
                    
               
                    
                </div>
            </div>
        </div>
    </div>
</section>


 
 

<section className="cleints-listing-secion py-5 h2_second">
    <div className="container">

        <h2>{`${productSubCategory?.name}`}</h2>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

        <div className="row" data-aos="fade-up">
            {details?.map((detail, index) => (
                <div className="col-md-4" key={detail.slug || index + 1}>
                {/* POST START */}
                <article className="post detail-post">
                    <div className="post-preview">
                        <Link href={detail.url}><img src={detail.product?.image_url || '/images/building-3697342_1280.jpg'} alt={detail.product?.name} className="img-fluid mx-auto d-block" style={{height: "240.863px", width:"375.975px", objectFit: "cover"}} /></Link>
                    </div>

                    <div className="post-header">
                        <h4 className="post-title"><Link href={detail.url} style={{display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}}> {detail.product?.name}</Link></h4>                        

                        <div className="post-content">
                            <p className="text-muted" style={{display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}}>{detail.summary}</p>
                        </div>

                        <span className="bar"></span>

                        <div className="post-footer">                            
                            <div className="post-more"><Link href={detail.url}>Read More <i className="mdi mdi-arrow-right"></i></Link></div>
                        </div>
                    </div>
                </article>
                {/* POST END */}                
            </div>            
            ))
            }    
            {detailsLoading && <Loading/>}
            <div ref={loaderRef} />              
            
        </div>
    </div>
</section>
    
    {productSubCategory?.testimonials?.length > 0 &&
    <ReviewSlider testimonials={productSubCategory?.testimonials}/>
    }
    
    </>
  )
}

export default ProductSubCategoryPage