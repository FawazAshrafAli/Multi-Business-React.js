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


const ProgramPage = ({ slug, currentCompany, programSlug, courseProgram }) => {

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const [specializations, setSpecializations] = useState([]);
    const [specializationsLoading, setSpecializationsLoading] = useState(false);
    const [nextUrl, setNextUrl] = useState(`/course_api/companies/${slug}/specializations/?program=${programSlug}&limit=9&offset=0`);
    const fetchingRef = useRef(false);
    const loaderRef = useRef(null);

    const { setLogo, resetLogo } = useContext(LogoContext);
    const { setTitle, resetTitle } = useContext(TitleContext);
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
    const { setBlogs, resetBlogs } = useContext(BlogContext);

    const [fallBackTestimonials, setFallBackTestimonials] = useState([]);

    // Set company info
    useEffect(() => {
        if (!currentCompany) return;
        const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;
        if (logo_url) setLogo(logo_url);
        if (meta_title) setTitle(meta_title);
        if (blogs) setBlogs(blogs);
        const phones = [phone1, phone2].filter(Boolean).join(' - ');
        if (phones) setPhoneNumber(phones);

        return () => {
            resetLogo(); resetTitle(); resetPhoneNumber(); resetBlogs();
        }
    }, [currentCompany]);

    // Fetch fallback testimonials
    useEffect(() => {
        const fetchFallback = async () => {
            try {
                const res = await course.getTestimonials(slug);
                setFallBackTestimonials(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFallback();
    }, [slug]);

    // Fetch specializations
    const fetchSpecializations = async () => {
        if (!nextUrl || fetchingRef.current) return;
        fetchingRef.current = true;
        setSpecializationsLoading(true);
        try {
            const res = await course.getSpecializations(nextUrl);
            setSpecializations(prev => [...prev, ...res.data.results]);
            setNextUrl(res.data.next || null);
        } catch (err) {
            console.error(err);
        } finally {
            setSpecializationsLoading(false);
            fetchingRef.current = false;
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchSpecializations();
    }, [programSlug]);

    // Infinite scroll observer
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchSpecializations();
            }
        }, { threshold: 1 });

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [nextUrl]);

    // Auto-dismiss messages
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => { setMessage(null); setMessageClass(''); }, 5000);
        return () => clearTimeout(timer);
    }, [message]);

    useEffect(() => {
        setSpecializations([]);
        setNextUrl(`/course_api/companies/${slug}/specializations/?program=${programSlug}&limit=9&offset=0`);
        setSpecializationsLoading(false);
    }, []);


    return (
            <>
            <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
            {message && <Message message={message} messageClass={messageClass}/>}

            <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
                <div className="bg-overlay"></div>
                <div className="home-center">
                    <div className="home-desc-center" data-aos="fade-in">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="page-next-level text-white">
                                        <h1>{courseProgram?.name}</h1>
                                        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                        <p id="breadcrumbs">
                                            <span>
                                                <span><Link href="/">Home</Link></span> » 
                                                <span><Link href={`/${slug}`}>{currentCompany?.sub_type}</Link></span> » 
                                                <span className="breadcrumb_last" aria-current="page">{courseProgram?.name}</span>
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
                    <h2>{courseProgram?.name}</h2>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

                    <div className="row" data-aos="fade-up">
                        {specializations.map((spec, index) => (
                            <div className="col-md-4" key={spec.slug || index}>
                                <article className="post detail-post">
                                    <div className="post-preview">
                                        <Link href={`/${slug}/${programSlug}/${spec.slug}`}><img src={spec.image_url || '/images/building-3697342_1280.jpg'} alt={spec.name} className="img-fluid mx-auto d-block" /></Link>
                                    </div>
                                    <div className="post-header">
                                        <h4 className="post-title"><Link href={`/${slug}/${programSlug}/${spec.slug}`}>{spec.name}</Link></h4>
                                        <div className="post-content"><p className="text-muted">{spec.description?.slice(0,150)}</p></div>
                                        <span className="bar"></span>
                                        <div className="post-footer">
                                            <div className="post-more"><Link href={`/${slug}/${programSlug}/${spec.slug}`}>Read More <i className="mdi mdi-arrow-right"></i></Link></div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}
                        {specializationsLoading && <Loading/>}
                        <div ref={loaderRef} />
                    </div>
                </div>
            </section>

            <TestimonialSlider testimonials={courseProgram?.testimonials?.length > 0 ? courseProgram?.testimonials : fallBackTestimonials} />
        </>
    )
}

export default ProgramPage;
