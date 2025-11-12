import React, { useContext, useEffect, useRef, useState } from 'react'
import registration from '../../lib/api/registration';
import Link from 'next/link';
import TestimonialSlider from '../common/TestimonialSlider';
import Loading from '../Loading';
import BlogContext from '../context/BlogContext';
import PhoneNumberContext from '../context/PhoneNumberContext';
import TitleContext from '../context/TitleContext';
import LogoContext from '../context/LogoContext';
import AutoPopUp from '../common/AutoPopUp';
import Message from '../common/Message';


const SubTypePage = ({ slug, currentCompany, subTypeSlug, registrationSubType }) => {
  const [message, setMessage] = useState();
  const [messageClass, setMessageClass] = useState();

  const [details, setDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [nextParams, setNextParams] = useState(null);

  const { setLogo, resetLogo } = useContext(LogoContext);
  const { setTitle, resetTitle } = useContext(TitleContext);
  const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
  const { setBlogs, resetBlogs } = useContext(BlogContext);

  const loaderRef = useRef(null);
  const fetchingRef = useRef(false);

  // Fetch details
  const fetchDetails = async (url = null, reset = false) => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setDetailsLoading(true);

    try {
        // First request: build manually
        if (!url) {
        url = `/registration_api/companies/${currentCompany?.slug}/detail-list/?sub_type=${subTypeSlug}&limit=9&offset=0`;
        }

        const response = await registration.getRegistrationDetails(url);

        setDetails(prev =>
        reset ? response.data.results : [...prev, ...response.data.results]
        );

        // Save next full URL directly
        setNextParams(response.data.next);
    } catch (err) {
        console.error("Fetch failed:", err);
    } finally {
        fetchingRef.current = false;
        setDetailsLoading(false);
    }
    };


  // Context setup
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

  // Reset and fetch on slug/subType change
  useEffect(() => {
    setDetails([]);
    setNextParams(null);
    if (currentCompany?.slug && subTypeSlug) {
        fetchDetails(null, true);
    }
    }, [currentCompany?.slug, subTypeSlug]);


  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
        if (
            entries[0].isIntersecting &&
            nextParams &&
            !fetchingRef.current &&
            !detailsLoading
        ) {
            fetchDetails(nextParams); // use DRF next URL directly
        }
        },
        { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
        if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
    }, [nextParams, detailsLoading]);

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
      <section className="bg-half" style={{ backgroundImage: "url('/images/city-4667143_1920.jpeg')" }}>
        <div className="bg-overlay"></div>
        <div className="home-center">
          <div className="home-desc-center" data-aos="fade-in">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="page-next-level text-white">
                    <h1>{registrationSubType?.name}</h1>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <p id="breadcrumbs">
                      <span>
                        <span><Link href="/">Home</Link></span> »
                        <span><Link href={`/${slug}`}>{currentCompany?.sub_type}</Link></span> »
                        <span><Link href={`/${slug}/${registrationSubType?.type_slug}`}>{registrationSubType?.type_name}</Link></span> »
                        <span className="breadcrumb_last" aria-current="page">{registrationSubType?.name}</span>
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
          <h2>{registrationSubType?.name}</h2>
          <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

          <div className="row" data-aos="fade-up">
            {details?.map((detail, index) => (
              <div className="col-md-4" key={detail.slug || index + 1}>
                <article className="post detail-post">
                  <div className="post-preview">
                    <Link href={`/${detail?.url}`}>
                      <img
                        src={detail?.image_url || '/images/building-3697342_1280.jpg'}
                        alt={detail.title}
                        className="img-fluid mx-auto d-block"                        
                      />
                    </Link>
                  </div>
                  <div className="post-header">
                    <h4 className="post-title">
                      <Link href={`/${detail?.url}`}>
                        {detail.title}
                      </Link>
                    </h4>
                    <div className="post-content">
                      <p className="text-muted" style={{textAlign:"left", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis"}}>{detail.summary}</p>
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

            {detailsLoading && <Loading />}
            <div ref={loaderRef} style={{ height: "1px" }} />
          </div>
        </div>
      </section>

      <TestimonialSlider testimonials={currentCompany?.testimonials} />
      
    </>
  );
};

export default SubTypePage;
