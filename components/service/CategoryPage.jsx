import React, { useContext, useEffect, useRef, useState } from 'react'
import service from '../../lib/api/service';
import Link from 'next/link';
import TestimonialSlider from '../common/TestimonialSlider';
import Loading from '../Loading';
import BlogContext from '../context/BlogContext';
import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';
import AutoPopUp from '../common/AutoPopUp';
import Message from '../common/Message';


const CategoryPage = ({
    slug, currentCompany, categorySlug, serviceCategory,     
}) => {
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const [subCategories, setSubCategories] = useState([]);
    const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);        

    const [nextParams, setNextParams] = useState('limit=9&offset=0');
    const loaderRef = useRef(null);

    const { setLogo, resetLogo } = useContext(LogoContext);
    const { setTitle, resetTitle } = useContext(TitleContext);
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
    const { setBlogs, resetBlogs } = useContext(BlogContext);

    const subCategoriesLoadingRef = useRef(false);

    useEffect(() => {
      subCategoriesLoadingRef.current = subCategoriesLoading;
    }, [subCategoriesLoading]);

    useEffect(() => {
        if (currentCompany) {
        const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;
    
        if (logo_url) setLogo(logo_url);
        if (meta_title) setTitle(meta_title);
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
    
    const lastParamsRef = useRef(null);

    const fetchSubCategories = async (slug, categorySlug, params=undefined) => {
        if (lastParamsRef.current === params) return;
        lastParamsRef.current = params;
        
        setSubCategoriesLoading(true);
        try {
            const response = await service.getSubCategories(slug, categorySlug, params);

            setSubCategories(prev => [...prev, ...response.data.results]);

            if (response.data.next) {
                const urlParams = response.data.next.split('?')[1];
                setNextParams(urlParams);
            } else {
                setNextParams(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubCategoriesLoading(false);
        }
    };

    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
            if (
                entries[0].isIntersecting &&
                nextParams &&
                !subCategoriesLoadingRef.current
            ) {
                fetchSubCategories(currentCompany?.slug, categorySlug, nextParams);
            }
            },
            { threshold: 0.5 } // triggers sooner
        );

        observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [currentCompany?.slug, categorySlug, nextParams]);


    useEffect(() => {
        if (!currentCompany?.slug || !categorySlug) return;

        setSubCategories([]);
        const initialParams = "limit=9&offset=0";
        setNextParams(initialParams);

        // fetch first page immediately
        fetchSubCategories(currentCompany.slug, categorySlug, initialParams);
    }, [currentCompany?.slug, categorySlug]);

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
                            <h1>{`${serviceCategory?.name}`}</h1>
                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                             
                        <p id="breadcrumbs">
                           <span>
                           <span><Link href="/">Home</Link></span> » 
                           <span><Link href={`/${slug}`}>{currentCompany?.sub_type}</Link></span> » 
                            <span className="breadcrumb_last" aria-current="page">{serviceCategory?.name}</span>
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

        <h2>{`${serviceCategory?.name}`}</h2>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

        <div className="row" data-aos="fade-up">
            {subCategories?.map((subCategory, index) => (
                <div className="col-md-4" key={subCategory.slug || index + 1}>
                {/* POST START */}
                <article className="post detail-post">
                    <div className="post-preview">
                        <Link href={`/${slug}/${categorySlug}/${subCategory.slug}`}><img src={subCategory.image_url || '/images/building-3697342_1280.jpg'} alt={subCategory.name} className="img-fluid mx-auto d-block" /></Link>
                    </div>

                    <div className="post-header">
                        <h4 className="post-title"><Link href={`/${slug}/${categorySlug}/${subCategory.slug}`}> {subCategory.name}</Link></h4>                        

                        <div className="post-content">
                            <p className="text-muted">{subCategory.description?.slice(0, 150)}</p>
                        </div>

                        <span className="bar"></span>

                        <div className="post-footer">
                            {/* <div className="likes">
                                <ul className="post-meta">
                                    <li><a href="#"><i className="far fa-heart mr-1"></i> <small>29</small></a></li>
                                    <li><a href="#"> <i className="far fa-comment mr-1"></i>
                                        <small>40</small></a>
                                    </li>
                                </ul>
                            </div> */}
                            <div className="post-more"><Link href={`/${slug}/${categorySlug}/${subCategory.slug}`}>Read More <i className="mdi mdi-arrow-right"></i></Link></div>
                        </div>
                    </div>
                </article>
                {/* POST END */}                
            </div>            
            ))
            }    
            {subCategoriesLoading && <Loading/>}
            <div ref={loaderRef} />              
            
        </div>
    </div>
</section>

    <TestimonialSlider testimonials={serviceCategory?.testimonials} />
    
    </>
  )
}

export default CategoryPage