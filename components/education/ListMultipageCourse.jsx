import React, { useEffect, useState, useRef, useContext } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

import course from '../../lib/api/course';
import location from '../../lib/api/location';
import Loading from '../Loading';
import BlogContext from '../context/BlogContext';
import TitleContext from '../context/TitleContext';

const ListMultipageCourse = ({blogs, homeContent}) => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [courseDetailPages, setCourseDetailPages] = useState([]);
  const [courseDetailPagesLoading, setCourseDetailPagesLoading] = useState(false);
  const [courseDetailPagesError, setCourseDetailPagesError] = useState(null);
  const [noDetailMsg, setNoDetailMsg] = useState("No Courses to Display.");

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyPlacesLoading, setNearbyPlacesLoading] = useState(true);
  const [nearbyPlacesError, setNearbyPlacesError] = useState(null);

  const [nextUrl, setNextUrl] = useState('/course_api/companies/all/detail-list?limit=9&offset=0');
  const loaderRef = useRef(null);
  const fetchedUrls = useRef(new Set());

  const { setBlogs, resetBlogs } = useContext(BlogContext);
  const { setTitle, resetTitle } = useContext(TitleContext);
  
    useEffect(() => {
        if (blogs) setBlogs(blogs);      
    
        return () => {      
        resetBlogs();
        };
    }, [blogs]);

    useEffect(() => {
        if (homeContent) setTitle(`Courses - ${homeContent?.meta_title}`);      
    
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

  // Fetch course details
  const fetchDetails = async (url) => {
    if (!url || courseDetailPagesLoading || fetchedUrls.current.has(url)) return;

    fetchedUrls.current.add(url);
    setCourseDetailPagesLoading(true);

    try {
      const response = await course.getCourseDetails(url);

      if (response.data.results.length > 0) {
        setCourseDetailPages(prev => [...prev, ...response.data.results]);
      }

      setNextUrl(response.data.next || null); // stop infinite scroll when null
    } catch (err) {
      setCourseDetailPagesError(err);
    } finally {
      setCourseDetailPagesLoading(false);
    }
  };

  // Initial fetch after nearby places loaded
  useEffect(() => {
    if (!nearbyPlacesLoading) {
      fetchDetails(nextUrl);
    }
  }, [nearbyPlacesLoading]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextUrl) {
          fetchDetails(nextUrl);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextUrl]);

  // AOS animations
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  // Log errors
  [courseDetailPagesError, nearbyPlacesError].forEach(err => err && console.error(err));

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
                    <h1>Courses In India</h1>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <p id="breadcrumbs">
                      <span>
                        <span><Link href="/">Home</Link></span> » 
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
          <div className="row" data-aos="fade-up" >
            {courseDetailPages.map((detail, index) => (
              <div className="col-md-4" key={detail.slug + index}>
                <article className="post detail-post">
                  <div className="post-preview">
                    <Link href={`/${detail.url}`}>
                      <img src={detail.course?.image_url || '/images/building-3697342_1280.jpg'} alt={detail.course?.name} className="img-fluid mx-auto d-block" />
                    </Link>
                  </div>
                  <div className="post-header">
                    <h4 className="post-title">
                      <Link href={`/${detail.url}`}>{detail.course?.name}</Link>
                    </h4>
                    <div className="post-content" >
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

            {courseDetailPagesLoading && <Loading />}
            {courseDetailPages.length === 0 && !courseDetailPagesLoading && <h6 className='text-center text-danger'>{noDetailMsg}</h6>}
            <div ref={loaderRef} style={{ height: '1px' }} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ListMultipageCourse;
