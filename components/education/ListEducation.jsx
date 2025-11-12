import React, { useEffect, useState, useContext, useRef } from 'react'
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';
import BlogContext from '../context/BlogContext';

import course from '../../lib/api/course';

import Loading from '../Loading';
import TestimonialSlider from '../common/TestimonialSlider';
import AutoPopUp from '../common/AutoPopUp';
import Message from '../common/Message';

const ListEducation = ({ currentCompany, testimonials }) => {
    const { slug } = useParams();
    const searchParams = useSearchParams();
    const program = searchParams.get("program");

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();
    const [noDetailMsg, setNoDetailMsg] = useState("");
    
    const [courseDetails, setCourseDetails] = useState([]);
    const [courseDetailsError, setCourseDetailsError] = useState(null);
    const [courseDetailsLoading, setCourseDetailsLoading] = useState(true);
    const [nextPage, setNextPage] = useState(`/course_api/companies/${slug}/detail-list${program ? `/?program=${program}` : ""}`);

    const loaderRef = useRef(null);
    const fetchingRef = useRef(false);

    const { setLogo, resetLogo } = useContext(LogoContext);
    const { setTitle, resetTitle } = useContext(TitleContext);
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
    const { setBlogs, resetBlogs } = useContext(BlogContext);

    const fetchDetails = async (url) => {
        if (!url || fetchingRef.current) return;
        fetchingRef.current = true;
        setCourseDetailsLoading(true);

        try {
            const response = await course.getCourseDetails(url);

            setCourseDetails(prev => {
                const existingSlugs = new Set(prev.map(item => item.slug));
                const newItems = response.data.results.filter(item => !existingSlugs.has(item.slug));
                return [...prev, ...newItems];
            });

            setNextPage(response.data.next);
        } catch (err) {
            setCourseDetailsError(err);
        } finally {
            fetchingRef.current = false;
            setCourseDetailsLoading(false);
        }
    };

    // Reset data when slug or program changes
    useEffect(() => {
        if (!slug) return;

        setCourseDetails([]);
        const initialUrl = `/course_api/companies/${slug}/detail-list${program ? `/?program=${program}` : ""}`;
        setNextPage(initialUrl);
        fetchDetails(initialUrl);
    }, [slug, program]);

    // Infinite scroll observer
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextPage && !courseDetailsLoading) {
                fetchDetails(nextPage);
            }
        }, { threshold: 1 });

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [nextPage, courseDetailsLoading]);

    // Set no courses message
    useEffect(() => {
        if (!courseDetailsLoading && courseDetails.length === 0) {
            let msg = "No Courses to Display.";
            if (program) msg = "No courses available for the provided program.";
            setNoDetailMsg(msg);
        }
    }, [courseDetails, courseDetailsLoading, program]);

    // Company context setup
    useEffect(() => {
        if (!currentCompany) return;

        const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;

        if (logo_url) setLogo(logo_url);
        if (meta_title) setTitle(meta_title);
        if (blogs) setBlogs(blogs);

        const phones = [phone1, phone2].filter(Boolean).join(" - ");
        if (phones) setPhoneNumber(phones);

        return () => {
            resetLogo();
            resetTitle();
            resetPhoneNumber();
            resetBlogs();
        };
    }, [currentCompany]);

    // AOS animation
    useEffect(() => {
        AOS.init({ once: true });
    }, []);

    // Auto-dismiss messages
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => { setMessage(null); setMessageClass(""); }, 5000);
        return () => clearTimeout(timer);
    }, [message]);

    if (courseDetailsError) console.error(courseDetailsError);

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
                                        <h1>Courses</h1>
                                        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                        <p id="breadcrumbs">
                                            <span>
                                                <span><Link href="/">Home</Link></span> » 
                                                <span><Link href={`/${slug}`}>{currentCompany?.sub_type}</Link></span> » 
                                                <span className="breadcrumb_last" aria-current="page">Courses</span>
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
                    <h2>{program ? `Category: ${program}` : "All Courses"}</h2>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

                    <div className="row" data-aos="fade-up">
                        {courseDetails?.map((detail, index) => (
                            <div className="col-md-4" key={detail.slug || `detail-${index}`}>
                                <article className="post detail-post">
                                    <div className="post-preview">
                                        <Link href={`/${detail?.url}`}>
                                            <img src={detail.course?.image_url || '/images/building-3697342_1280.jpg'} alt={detail.course?.name} className="img-fluid mx-auto d-block" />
                                        </Link>
                                    </div>
                                    <div className="post-header">
                                        <h4 className="post-title">{detail.course?.name}</h4>
                                        <ul className="post-meta">
                                            <li><i className="fa fa-calendar" aria-hidden="true"></i> <small>{detail.published}</small></li>
                                            <li><i className="fa fa-tag" aria-hidden="true"></i>
                                                <Link href={`/${currentCompany?.slug}/courses?program=${detail.course?.program_name}`}><small>{detail.course?.program_name}</small></Link>
                                            </li>
                                        </ul>
                                        <div className="post-content">
                                            <p className="text-muted" style={{textAlign:"left", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis"}}>
                                                {detail.summary}
                                            </p>
                                        </div>
                                        <span className="bar"></span>
                                        <div className="post-footer">
                                            <div className="post-more">
                                                <Link href={`/${detail?.url}`}>
                                                    Read More <i className="mdi mdi-arrow-right"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}

                        {courseDetailsLoading && (
                            <div className="col-12 text-center">
                                <Loading/>
                            </div>
                        )}

                        {!courseDetailsLoading && courseDetails.length === 0 && (
                            <h6 className="text-center text-danger">{noDetailMsg}</h6>
                        )}
                    </div>

                    {/* Infinite scroll loader */}
                    <div ref={loaderRef} style={{height:'1px'}}></div>
                </div>
            </section>

            <TestimonialSlider testimonials={testimonials} />
        </>
    )
}

export default ListEducation;
