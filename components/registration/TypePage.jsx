import React, { useContext, useEffect, useRef, useState } from 'react';
import registration from '../../lib/api/registration';
import Link from 'next/link';
import TestimonialSlider from '../common/TestimonialSlider';
import Loading from '../Loading';
import BlogContext from '../context/BlogContext';
import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';
import AutoPopUp from '../common/AutoPopUp';
import Message from '../common/Message';


const TypePage = ({ slug, currentCompany, typeSlug, registrationType }) => {
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();
    const [subTypes, setSubTypes] = useState([]);
    const [subTypesLoading, setSubTypesLoading] = useState(false);
    const [nextParams, setNextParams] = useState('limit=9&offset=0');
    const [noSubTypesMsg, setNoSubTypesMsg] = useState('');

    const loaderRef = useRef(null);
    const fetchingRef = useRef(false);

    const { setLogo, resetLogo } = useContext(LogoContext);
    const { setTitle, resetTitle } = useContext(TitleContext);
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
    const { setBlogs, resetBlogs } = useContext(BlogContext);

    // Set company details in context
    useEffect(() => {
        if (!currentCompany) return;

        const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;
        if (logo_url) setLogo(logo_url);
        if (meta_title) setTitle(meta_title);
        if (blogs) setBlogs(blogs);
        const phones = [phone1, phone2].filter(Boolean).join(' - ');
        if (phones) setPhoneNumber(phones);

        return () => {
            resetLogo();
            resetTitle();
            resetPhoneNumber();
            resetBlogs();
        };
    }, [currentCompany]);

    // Fetch sub-types
    const fetchSubTypes = async (slug, typeSlug, params = null, reset = false) => {
        if (!slug || !typeSlug || fetchingRef.current) return;
        fetchingRef.current = true;
        setSubTypesLoading(true);

        try {
            if (!params) params = 'limit=9&offset=0';
            const response = await registration.getSubTypes(slug, typeSlug, params);

            setSubTypes(prev => {
                const existingSlugs = new Set(prev.map(item => item.slug));
                const newItems = response.data.results.filter(item => !existingSlugs.has(item.slug));
                return reset ? response.data.results : [...prev, ...newItems];
            });

            // Update nextParams for infinite scroll
            if (response.data.next) {
                const urlParams = response.data.next.split('?')[1];
                setNextParams(urlParams);
            } else {
                setNextParams(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubTypesLoading(false);
            fetchingRef.current = false;
        }
    };

    // Reset sub-types when company or typeSlug changes
    useEffect(() => {
        if (!currentCompany || !typeSlug) return;
        setSubTypes([]);
        setNextParams('limit=9&offset=0');
        fetchSubTypes(currentCompany.slug, typeSlug, 'limit=9&offset=0', true);
    }, [currentCompany, typeSlug]);

    // Infinite scroll
    useEffect(() => {
        if (!loaderRef.current) return;
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && nextParams && !subTypesLoading) {
                    fetchSubTypes(currentCompany?.slug, typeSlug, nextParams);
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [nextParams, subTypesLoading, currentCompany, typeSlug]);

    // No results message
    useEffect(() => {
        if (!subTypesLoading && subTypes.length === 0) {
            setNoSubTypesMsg(`No ${registrationType?.name} available.`);
        }
    }, [subTypes, subTypesLoading, registrationType]);

    // Message timeout
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            setMessage(null);
            setMessageClass('');
        }, 5000);
        return () => clearTimeout(timer);
    }, [message]);

    return (
        <>
            {currentCompany && <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass} />}
            {message && <Message message={message} messageClass={messageClass} />}

            <section className="bg-half" style={{ backgroundImage: "url('/images/city-4667143_1920.jpeg')" }}>
                <div className="bg-overlay"></div>
                <div className="home-center">
                    <div className="home-desc-center" data-aos="fade-in">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="page-next-level text-white">
                                        <h1>{registrationType?.name}</h1>
                                        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                        <p id="breadcrumbs">
                                            <span>
                                                <span><Link href="/">Home</Link></span> » 
                                                <span><Link href={`/${slug}`}>{currentCompany?.sub_type}</Link></span> » 
                                                <span className="breadcrumb_last" aria-current="page">{registrationType?.name}</span>
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
                    <h2>{registrationType?.name}</h2>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

                    <div className="row" data-aos="fade-up">
                        {subTypesLoading && subTypes.length === 0 && <Loading />}
                        {!subTypesLoading && subTypes.length === 0 && (
                            <h6 className="text-center text-danger">{noSubTypesMsg}</h6>
                        )}

                        {subTypes?.map((subType, index) => (
                            <div className="col-md-4" key={subType.slug || index + 1}>
                                <article className="post detail-post">
                                    <div className="post-preview">
                                        <Link href={`/${slug}/${typeSlug}/${subType.slug}`}>
                                            <img src={subType.image_url || '/images/building-3697342_1280.jpg'} 
                                                 alt={subType.name} 
                                                 className="img-fluid mx-auto d-block" 
                                                />
                                        </Link>
                                    </div>
                                    <div className="post-header">
                                        <h4 className="post-title">
                                            <Link href={`/${slug}/${typeSlug}/${subType.slug}`}>{subType.name}</Link>
                                        </h4>
                                        <div className="post-content">
                                            <p className="text-muted">{subType.description?.slice(0, 150)}</p>
                                        </div>
                                        <span className="bar"></span>
                                        <div className="post-footer">
                                            <div className="post-more">
                                                <Link href={`/${slug}/${typeSlug}/${subType.slug}`}>Read More <i className="mdi mdi-arrow-right"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}
                        {subTypesLoading && subTypes.length > 0 && <Loading />}
                        <div ref={loaderRef} style={{ height: '1px' }} />
                    </div>
                </div>
            </section>

            <TestimonialSlider testimonials={currentCompany?.testimonials} />
        </>
    );
};

export default TypePage;
