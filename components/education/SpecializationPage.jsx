import React, { useContext, useEffect, useRef, useState } from 'react'
import course from '../../lib/api/course';
import Link from 'next/link';
import TestimonialSlider from '../common/TestimonialSlider';
import Loading from '../Loading';
import BlogContext from '../context/BlogContext';
import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';
import Message from '../common/Message';
import AutoPopUp from '../common/AutoPopUp';


const SpecializationPage = ({ slug, currentCompany, specializationSlug, courseSpecialization }) => {
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();
    const [details, setDetails] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [fallBackTestimonials, setFallBackTestimonials] = useState([]);
    const [nextUrl, setNextUrl] = useState(`/course_api/companies/${slug}/detail-list/?specialization=${specializationSlug}&limit=9&offset=0`);

    const loaderRef = useRef(null);
    const fetchingRef = useRef(false);

    const { setLogo, resetLogo } = useContext(LogoContext);
    const { setTitle, resetTitle } = useContext(TitleContext);
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
    const { setBlogs, resetBlogs } = useContext(BlogContext);

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

    const fetchDetails = async () => {
        if (!nextUrl || fetchingRef.current) return;
        fetchingRef.current = true;
        setDetailsLoading(true);

        try {
            const response = await course.getCourseDetails(nextUrl);
            setDetails(prev => [...prev, ...response.data.results]);
            setNextUrl(response.data.next || null);
        } catch (err) {
            console.error(err);
        } finally {
            fetchingRef.current = false;
            setDetailsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch fallback testimonials
        const fetchFallBackTestimonials = async () => {
            try {
                const response = await course.getTestimonials(slug);
                setFallBackTestimonials(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFallBackTestimonials();
    }, [slug]);

    useEffect(() => {
        // Infinite scroll observer
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    fetchDetails();
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [nextUrl]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                setMessageClass("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        setDetails([]);
        setNextUrl(`/course_api/companies/${slug}/detail-list/?specialization=${specializationSlug}&limit=9&offset=0`);
    }, [slug, specializationSlug]);

    useEffect(() => {
        if (nextUrl) {
            fetchDetails();
        }
    }, [nextUrl]);


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
                                            <h1>{courseSpecialization?.name}</h1>
                                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                            <p id="breadcrumbs">
                                                <span>
                                                    <span><Link href="/">Home</Link></span> » 
                                                    <span><Link href={`/${slug}`}>{currentCompany?.sub_type}</Link></span> »
                                                    <span><Link href={`/${slug}/${courseSpecialization?.program_slug}`}>{courseSpecialization?.program_name}</Link></span> » 
                                                    <span className="breadcrumb_last" aria-current="page">{courseSpecialization?.name}</span>
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
                        <h2>{courseSpecialization?.name}</h2>
                        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

                        <div className="row" data-aos="fade-up">
                            {details?.map((detail, index) => (
                                <div className="col-md-4" key={detail.slug || index}>
                                    <article className="post detail-post">
                                        <div className="post-preview">
                                            <Link href={detail.url}>
                                                <img src={detail.course?.image_url || '/images/building-3697342_1280.jpg'} alt={detail?.course?.name} className="img-fluid mx-auto d-block" />
                                            </Link>
                                        </div>

                                        <div className="post-header">
                                            <h4 className="post-title">
                                                <Link href={detail.url}>{detail.course?.name}</Link>
                                            </h4>
                                            <div className="post-content">
                                                <p className="text-muted" style={{textAlign:"left", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis"}}>{detail.summary}</p>
                                            </div>
                                            <span className="bar"></span>
                                            <div className="post-footer">
                                                <div className="post-more">
                                                    <Link href={detail.url}>Read More <i className="mdi mdi-arrow-right"></i></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            ))}
                            {detailsLoading && <Loading/>}
                            <div ref={loaderRef} />
                        </div>
                    </div>
                </section>

                <TestimonialSlider testimonials={courseSpecialization?.program?.testimonials?.length > 0 ? courseSpecialization?.program?.testimonials : fallBackTestimonials} />
            
        </>
    )
}

export default SpecializationPage;
