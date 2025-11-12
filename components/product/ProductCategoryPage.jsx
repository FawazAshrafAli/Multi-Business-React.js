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

import { useRouter } from 'next/router';
import ReviewSlider from './common/ReviewSlider';

const ProductCategoryPage = ({ slug, currentCompany, categorySlug, productCategory }) => {
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();
    const [subCategories, setSubCategories] = useState([]);
    const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextParams, setNextParams] = useState('limit=9&offset=0');

    const loaderRef = useRef(null);
    const router = useRouter();

    const { setLogo, resetLogo } = useContext(LogoContext)
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext)
    const { setBlogs, resetBlogs } = useContext(BlogContext);

    // Set company info
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
            resetLogo(); resetTitle(); resetPhoneNumber(); resetBlogs();
        };
    }, [currentCompany]);

    // Fetch subcategories
    const fetchSubCategories = async (slug, categorySlug, params) => {
        if (!hasMore) return;
        setSubCategoriesLoading(true);
        try {
            const response = await product.getSubCategories(slug, categorySlug, params);
            setSubCategories(prev => {
                const newItems = response.data.results.filter(
                    item => !prev.some(existing => existing.slug === item.slug)
                );
                return [...prev, ...newItems];
            });

            if (response.data.next) {
                const urlParams = response.data.next.split('?')[1];
                setNextParams(urlParams);
                setHasMore(true);
            } else {
                setNextParams(null);
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubCategoriesLoading(false);
        }
    };

    // Reset on category/company/path change
    useEffect(() => {
        if (!currentCompany?.slug || !categorySlug) return;
        setSubCategories([]);
        setNextParams('limit=9&offset=0');
        setHasMore(true);
        fetchSubCategories(currentCompany.slug, categorySlug, 'limit=9&offset=0');
    }, [currentCompany?.slug, categorySlug, router.asPath]);

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && nextParams && !subCategoriesLoading) {
                fetchSubCategories(currentCompany?.slug, categorySlug, nextParams);
            }
        }, { rootMargin: '200px', threshold: 0 });

        observer.observe(loaderRef.current);
        return () => {
            observer.disconnect();
        };
    }, [nextParams, hasMore, subCategoriesLoading, currentCompany, categorySlug]);

    // Auto hide messages
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => { setMessage(null); setMessageClass(""); }, 5000);
        return () => clearTimeout(timer);
    }, [message]);

    return (
        <>
            
                <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
                {message && <Message message={message} messageClass={messageClass} />}

                <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>    
                    <div className="bg-overlay"></div>
                    <div className="home-center">
                        <div className="home-desc-center" data-aos="fade-in">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="page-next-level text-white">
                                            <h1>{productCategory?.name}</h1>
                                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                            <p id="breadcrumbs">
                                                <span>
                                                    <span><Link href="/">Home</Link></span> » 
                                                    <span><Link href={`/${slug}`}>{currentCompany?.sub_type}</Link></span> » 
                                                    <span className="breadcrumb_last" aria-current="page">{productCategory?.name}</span>
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
                        <h2>{productCategory?.name}</h2>
                        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                        <div className="row" data-aos="fade-up">
                            {subCategories.map((subCategory, index) => (
                                <div className="col-md-4" key={subCategory.slug || index}>
                                    <article className="post detail-post">
                                        <div className="post-preview">
                                            <Link href={`/${slug}/${categorySlug}/${subCategory.slug}`}>
                                                <img src={subCategory.image_url || '/images/building-3697342_1280.jpg'} 
                                                     alt={subCategory.name} 
                                                     className="img-fluid mx-auto d-block" 
                                                     style={{height: "240.863px", width:"375.975px", objectFit: "contain"}} />
                                            </Link>
                                        </div>
                                        <div className="post-header">
                                            <h4 className="post-title">
                                                <Link href={`/${slug}/${categorySlug}/${subCategory.slug}`}>{subCategory.name}</Link>
                                            </h4>                        
                                            <div className="post-content">
                                                <p className="text-muted">{subCategory.description?.slice(0, 150)}</p>
                                            </div>
                                            <span className="bar"></span>
                                            <div className="post-footer">
                                                <div className="post-more">
                                                    <Link href={`/${slug}/${categorySlug}/${subCategory.slug}`}>
                                                        Read More <i className="mdi mdi-arrow-right"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            ))}
                            {subCategoriesLoading && hasMore && <Loading />}
                            <div ref={loaderRef} />
                        </div>
                    </div>
                </section>

                {productCategory?.testimonials?.length > 0 && 
                    <ReviewSlider testimonials={productCategory?.testimonials}/>
                }
            
        </>
    );
};

export default ProductCategoryPage;
