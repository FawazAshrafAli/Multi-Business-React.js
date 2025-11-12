import React, { useEffect, useState, useContext, useRef } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

import AOS from 'aos';
import 'aos/dist/aos.css';

import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';
import BlogContext from '../context/BlogContext';

import registration from '../../lib/api/registration';
import Loading from '../Loading';
import TestimonialSlider from '../common/TestimonialSlider';
import AutoPopUp from '../common/AutoPopUp';
import Message from '../common/Message';

const ListRegistration = ({ currentCompany, testimonials }) => {
  const { slug } = useParams();

  const [message, setMessage] = useState();
  const [messageClass, setMessageClass] = useState();

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [details, setDetails] = useState([]);
  const [detailsError, setDetailsError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [noDetailMsg, setNoDetailMsg] = useState(null);
  const [nextParams, setNextParams] = useState(null);

  const loaderRef = useRef(null);

  const { setLogo, resetLogo } = useContext(LogoContext);
  const { setTitle, resetTitle } = useContext(TitleContext);
  const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
  const { setBlogs, resetBlogs } = useContext(BlogContext);

  const fetchDetails = async (url = null, reset = false) => {
    setDetailsLoading(true);

    if (!url) {
      url = `/registration_api/companies/${slug}/detail-list${type ? `/?type=${type}` : ""}`;
    }

    try {
      const response = await registration.getRegistrationDetails(url);

      setDetails(prev =>
        reset ? response.data.results : [...prev, ...response.data.results]
      );

      setNextParams(response.data.next);

      if (response.data.results.length === 0) {
        setNoDetailMsg(
          type
            ? "No registrations available for the provided type."
            : "No Registrations to Display."
        );
      }
    } catch (err) {
      setDetailsError(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fetch when slug/type changes
  useEffect(() => {
    if (slug) {
      fetchDetails(null, true);
    }
  }, [slug, type]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextParams && !detailsLoading) {
        fetchDetails(nextParams);
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextParams, detailsLoading]);

  // Set company info in contexts
  useEffect(() => {
    if (currentCompany) {
      const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;
      if (logo_url) setLogo(logo_url);
      if (meta_title) setTitle(`Registrations - ${meta_title}`);
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

  // AOS init
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
          setMessage(null);
          setMessageClass("");
      }, 5000);

      return () => clearTimeout(timer);
      }
  }, [message]);

  if (detailsError) console.error(detailsError);

  return (
    <>
      <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
      {message&&
      <Message message={message} messageClass={messageClass} />
      }
      <section
        className="bg-half"
        style={{ backgroundImage: "url('/images/city-4667143_1920.jpeg')" }}
      >
        <div className="bg-overlay"></div>
        <div className="home-center">
          <div className="home-desc-center" data-aos="fade-in">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="page-next-level text-white">
                    <h1>Registrations</h1>
                    <p className="flip">
                      <span className="deg1"></span>
                      <span className="deg2"></span>
                      <span className="deg3"></span>
                    </p>
                    <p id="breadcrumbs">
                      <span>
                        <span>
                          <Link href="/">Home</Link>
                        </span>{" "}
                        »{" "}
                        <span>
                          <Link href={`/${slug}`}>
                            {currentCompany?.sub_type}
                          </Link>
                        </span>{" "}
                        »{" "}
                        <span
                          className="breadcrumb_last"
                          aria-current="page"
                        >
                          Registrations
                        </span>
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
          <h2>{type ? `Category: ${type}` : "Registrations"}</h2>
          <p className="flip">
            <span className="deg1"></span>
            <span className="deg2"></span>
            <span className="deg3"></span>
          </p>

          <div className="row" data-aos="fade-up">
            {detailsLoading && details.length === 0 && <Loading />}
            {!detailsLoading && details.length === 0 && (
              <h6 className="text-center text-danger">{noDetailMsg}</h6>
            )}

            {details?.map((detail, index) => (
              <div className="col-md-4" key={detail.slug || index + 1}>
                {/* POST START */}
                <article className="post detail-post">
                  <div className="post-preview">
                    <Link
                      href={`/${detail?.url}`}
                    >
                      <img
                        src={
                          detail.image_url ||
                          "/images/building-3697342_1280.jpg"
                        }
                        alt={detail.title}
                        className="img-fluid mx-auto d-block"
                      />
                    </Link>
                  </div>
                  <div className="post-header">
                    <h4 className="post-title">
                      <a href={`/${detail?.url}`}>{detail.title}</a>
                    </h4>
                    <ul className="post-meta">
                      <li>
                        <Link
                          href={`/${currentCompany?.slug}/registrations?type=${detail.type_name}`}
                        >
                          <small>
                            {detail.type_name}
                          </small>
                        </Link>
                      </li>
                    </ul>
                    <div className="post-content">
                      <p className="text-muted" style={{textAlign:"left", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis"}}>{detail.summary}</p>
                    </div>
                    <span className="bar"></span>
                    <div className="post-footer">
                      <div className="post-more">
                        <Link
                          href={`/${detail?.url}`}
                        >
                          Read More <i className="mdi mdi-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
                {/* POST END */}
              </div>
            ))}

            {detailsLoading && details.length > 0 && <Loading />}

            {/* loader trigger */}
            <div ref={loaderRef} style={{ height: "1px" }} />
          </div>
        </div>
      </section>

      <TestimonialSlider testimonials={testimonials} />
    </>
  );
};

export default ListRegistration;
