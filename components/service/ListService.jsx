import React, { useEffect, useState, useContext, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import AOS from "aos";
import "aos/dist/aos.css";

import LogoContext from "../context/LogoContext";
import TitleContext from "../context/TitleContext";
import PhoneNumberContext from "../context/PhoneNumberContext";
import BlogContext from "../context/BlogContext";

import service from "../../lib/api/service";

import Loading from "../Loading";
import TestimonialSlider from "../common/TestimonialSlider";
import AutoPopUp from "../common/AutoPopUp";
import Message from "../common/Message";

const ListService = ({ currentCompany, testimonials }) => {
  const { slug } = useParams();

  const [message, setMessage] = useState();
  const [messageClass, setMessageClass] = useState();

  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [noDetailMsg, setNoDetailMsg] = useState("");

  const [details, setDetails] = useState([]);
  const [detailsError, setDetailsError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [nextPage, setNextPage] = useState(null);

  const loaderRef = useRef(null);

  const { setLogo, resetLogo } = useContext(LogoContext);
  const { setTitle, resetTitle } = useContext(TitleContext);
  const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
  const { setBlogs, resetBlogs } = useContext(BlogContext);

  const fetchDetails = async (url = null, reset = false) => {
    if (!url) {
        url = `/service_api/companies/${slug}/detail-list`;
        if (category) url += `/?category=${category}`;
    }

    try {
        setDetailsLoading(true);
        const response = await service.getServiceDetails(url);

        if (reset) {
        setDetails(response.data.results);
        } else {
        setDetails(prev => {
          const newItems = response.data.results.filter(r => !prev.some(p => p.slug === r.slug));
          return [...prev, ...newItems];
        });
        }

        setNextPage(response.data.next);
    } catch (err) {
        setDetailsError(err);
    } finally {
        setDetailsLoading(false);
    }
};


  // initial load / reset on slug/category change
  useEffect(() => {
    if (!slug) return;
    setDetails([]);
    const baseUrl = `/service_api/companies/${slug}/detail-list${
      category ? `/?category=${category}` : ""
    }`;
    fetchDetails(baseUrl, true);
  }, [slug, category]);

    // infinite scroll observer
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
            if (entries[0].isIntersecting && nextPage && !detailsLoading) {
                fetchDetails(nextPage);
            }
            },
            { threshold: 0.5 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [nextPage, detailsLoading]);

    useEffect(() => {
        if (!detailsLoading && details.length === 0) {
            let msg = "No Services to Display.";
            if (category) msg = "No services available for the provided category.";
            setNoDetailMsg(msg);
        }
    }, [details, detailsLoading, category]);

  useEffect(() => {
    if (currentCompany) {
      const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;

      if (logo_url) setLogo(logo_url);
      if (meta_title) setTitle(`Services - ${meta_title}`);
      if (blogs) setBlogs(blogs);

      const phones = [phone1, phone2].filter(Boolean).join(" - ");
      if (phones) setPhoneNumber(phones);
    }

    return () => {
      resetLogo();
      resetTitle();
      resetPhoneNumber();
      resetBlogs();
    };
  }, [currentCompany]);

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
                    <h1>{currentCompany?.sub_type}</h1>
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
                        »
                        <span>
                          <Link href={`/${slug}`}>
                            {currentCompany?.sub_type}
                          </Link>
                        </span>{" "}
                        »
                        <span
                          className="breadcrumb_last"
                          aria-current="page"
                        >
                          Services
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
          <h2>{category ? `Category: ${category}` : "All Services"}</h2>
          <p className="flip">
            <span className="deg1"></span>
            <span className="deg2"></span>
            <span className="deg3"></span>
          </p>

          <div className="row" data-aos="fade-up">
            {details?.length > 0 ? (
              details.map((detail, index) => (
                <div
                  className="col-md-4"
                  key={detail.id || detail.slug || `detail-${index}`}
                >
                  <article className="post detail-post">
                    <div className="post-preview">
                      <Link
                        href={`/${detail?.url}`}
                      >
                        <img
                          src={
                            detail.service?.image_url ||
                            "/images/building-3697342_1280.jpg"
                          }
                          alt={detail?.service?.name}
                          className="img-fluid mx-auto d-block"
                        />
                      </Link>
                    </div>

                    <div className="post-header">
                      <h4 className="post-title">
                        <Link href={`/${detail?.url}`}> {detail.service?.name}</Link>
                      </h4>
                      <ul className="post-meta">                        
                        <li>
                          <i
                            className="fa fa-tag"
                            aria-hidden="true"
                          ></i>
                          <Link
                            href={`/${currentCompany?.slug}/services?category=${detail.service?.category_name}`}
                          >
                            <small>{detail.service?.category_name}</small>
                          </Link>
                        </li>
                      </ul>

                      <div className="post-content">
                        <p className="text-muted" style={{textAlign:"left", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}}>{detail.summary}</p>
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
                </div>
              ))
            ) :!detailsLoading && details?.length === 0 && (
              <h6 className="text-center text-danger">{noDetailMsg}</h6>
            )}
          </div>

          {/* Infinite Scroll Loader */}
          {detailsLoading && (
            <div className="row">
              <div className="col text-center">
                <Loading />
              </div>
            </div>
          )}
          <div ref={loaderRef} className="h-10"></div>
        </div>
      </section>

      <TestimonialSlider testimonials={testimonials} />
    </>
  );
};

export default ListService;
