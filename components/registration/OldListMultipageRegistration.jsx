import React, { useEffect, useState, useRef, useContext } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import AOS from 'aos';
import 'aos/dist/aos.css';

import registration from '../../lib/api/registration';
import location from '../../lib/api/location';

import Loading from '../Loading';
import BlogContext from '../context/BlogContext';
import TitleContext from '../context/TitleContext';

const ListMultipageRegistration = ({ blogs, homeContent }) => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [noDetailMsg, setNoDetailMsg] = useState("No Registrations to Display.");
  const [registrationDetailPages, setRegistrationDetailPages] = useState([]);
  const [registrationDetailPagesError, setRegistrationDetailPagesError] = useState(null);
  const [registrationDetailPagesLoading, setRegistrationDetailPagesLoading] = useState(false);

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyPlacesLoading, setNearbyPlacesLoading] = useState(true);
  const [nearbyPlacesError, setNearbyPlacesError] = useState(null);

  const [nextUrl, setNextUrl] = useState(`/registration_api/companies/all/detail-list${category ? `?category=${category}` : ""}`);
  const loaderRef = useRef(null);
  const fetchingRef = useRef(false);
  const fetchedUrls = useRef(new Set());

  const { setBlogs, resetBlogs } = useContext(BlogContext);
  const { setTitle, resetTitle } = useContext(TitleContext);

  // Set blogs context
  useEffect(() => {
    if (blogs) setBlogs(blogs);
    return () => resetBlogs();
  }, [blogs]);

  useEffect(() => {
      if (homeContent) setTitle(`Products${homeContent?.meta_title ? ` - ${homeContent?.meta_title}` : ""}`);      
  
      return () => {      
      resetTitle();
      };
  }, [homeContent]);

  // Fetch nearby places
  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        const response = await location.getNearbyPlaces();
        setNearbyPlaces(response.data);
      } catch (err) {
        setNearbyPlacesError(err);
      } finally {
        setNearbyPlacesLoading(false);
      }
    };
    fetchNearbyPlaces();
  }, []);

  // Core fetch function
  const fetchDetails = async (url) => {
    if (!url || fetchingRef.current || fetchedUrls.current.has(url)) return;

    fetchedUrls.current.add(url);
    fetchingRef.current = true;
    setRegistrationDetailPagesLoading(true);

    try {
      const res = await registration.getRegistrationDetails(url);
      const results = res.data.results || [];

      setRegistrationDetailPages(prev => {
        const newItems = results.filter(item => !prev.some(p => p.slug === item.slug));
        return [...prev, ...newItems];
      });

      setNextUrl(res.data.next || null);

    } catch (err) {
      setRegistrationDetailPagesError(err);
    } finally {
      setRegistrationDetailPagesLoading(false);
      fetchingRef.current = false;
    }
  };

  // Reset state when category changes
  useEffect(() => {
    setRegistrationDetailPages([]);
    fetchedUrls.current.clear();
    setNextUrl(`/registration_api/companies/all/detail-list${category ? `?category=${category}` : ""}`);
  }, [category]);

  // Initial data load when nearby places are ready
  useEffect(() => {
    if (!nearbyPlacesLoading) {
      fetchDetails(nextUrl);
    }
  }, [nearbyPlacesLoading, nextUrl]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextUrl) {
        fetchDetails(nextUrl);
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextUrl]);

  // AOS animations
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  [registrationDetailPagesError, nearbyPlacesError].forEach(err => err && console.error(err));

  return (
    <>
      <section className="bg-half" style={{ backgroundImage: "url('/images/city-4667143_1920.jpeg')" }}>
        <div className="bg-overlay"></div>
        <div className="home-center">
          <div className="home-desc-center" data-aos="fade-in">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="page-next-level text-white">
                    <h1>Online Registrations asdas In India</h1>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <p id="breadcrumbs">
                      <span>
                        <span><Link href="/">Home</Link></span> » 
                        <span className="breadcrumb_last" aria-current="page">Registrations</span>
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
          <div className="row" data-aos="fade-up">
            {registrationDetailPages.map((detail, index) => (
              <div className="col-md-4" key={detail.slug + index}>
                <article className="post detail-post">
                  <div className="post-preview">
                    <Link href={`/${detail.url}`}>
                      <img src={detail.image_url || '/images/building-3697342_1280.jpg'} alt={detail.title} className="img-fluid mx-auto d-block" />
                    </Link>
                  </div>
                  <div className="post-header">
                    <h4 className="post-title"><Link href={`/${detail.url}`}>{detail.title}</Link></h4>
                    <div className="post-content">
                      <p className="text-muted" style={{textAlign:"left", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis"}}>{detail.summary}</p>
                    </div>
                    <span className="bar"></span>
                    <div className="post-footer">
                      <div className="post-more">
                        <Link href={`/${detail.url}`}>Read More <i className="mdi mdi-arrow-right"></i></Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}

            {!registrationDetailPagesLoading && registrationDetailPages.length === 0 && (
              <div className="col-12 text-center py-5">
                <p className="text-muted h5">{noDetailMsg}</p>
              </div>
            )}

            {registrationDetailPagesLoading && (
              <div className="col-12 text-center py-3">
                <Loading />
              </div>
            )}

            <div ref={loaderRef} style={{ height: '1px' }} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ListMultipageRegistration;
