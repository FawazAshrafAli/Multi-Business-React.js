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


const SubCategoryPage = ({
    slug, currentCompany, subCategorySlug, serviceSubCategory, 
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

    const fetchDetails = async (slug, subCategorySlug, params = "") => {
        if (!slug || !subCategorySlug) return;
        setDetailsLoading(true);

        try {
            let url = `/service_api/companies/${slug}/detail-list/?sub_category=${subCategorySlug}`;
            if (params) url += `&${params}`;

            const response = await service.getServiceDetails(url);

            setDetails(prev => {
            const newItems = response.data.results.filter(
                item => !prev.some(existing => existing.slug === item.slug)
            );
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

        // fetch the first page immediately
        fetchDetails(currentCompany.slug, subCategorySlug, initialParams);
    }, [currentCompany?.slug, subCategorySlug]);

        

    const detailsLoadingRef = useRef(false);

    useEffect(() => {
        detailsLoadingRef.current = detailsLoading;
    }, [detailsLoading]);

    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextParams && !detailsLoadingRef.current) {
                    fetchDetails(currentCompany?.slug, subCategorySlug, nextParams);
                }
            },
            { threshold: 0.5 } 
        );

        observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [currentCompany?.slug, subCategorySlug, nextParams]);


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
                            <h1>{`${serviceSubCategory?.name}`}</h1>
                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                             
                        <p id="breadcrumbs">
                           <span>
                           <span><Link href="/" >Home</Link></span> » 
                           <span><Link href={`/${slug}`}>{currentCompany?.sub_type}</Link></span> »
                           <span><Link href={`/${slug}/${serviceSubCategory?.category_slug}`}>{serviceSubCategory?.category_name}</Link></span> »
                            <span className="breadcrumb_last" aria-current="page">{serviceSubCategory?.name}</span>
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

        <h2>{`${serviceSubCategory?.name}`}</h2>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

        <div className="row" data-aos="fade-up">
            {details?.map((detail, index) => (
                <div className="col-md-4" key={detail.slug || index + 1}>
                {/* POST START */}
                <article className="post detail-post">
                    <div className="post-preview">
                        <Link href={detail.url}><img src={detail.service?.image_url || '/images/building-3697342_1280.jpg'} alt={detail.service?.name} className="img-fluid mx-auto d-block"/></Link>
                    </div>

                    <div className="post-header">
                        <h4 className="post-title"><Link href={detail.url}> {detail.service?.name}</Link></h4>                        

                        <div className="post-content">
                            <p className="text-muted" style={{textAlign:"left", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis"}}>{detail.summary}</p>
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

    <TestimonialSlider testimonials={serviceSubCategory?.testimonials} />
    
    </>
  )
}

export default SubCategoryPage