import React, { useEffect, useState, useRef, useContext } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import AOS from "aos";
import "aos/dist/aos.css";

import service from "../../lib/api/service";
import location from "../../lib/api/location";

import Loading from "../Loading";
import BlogContext from "../context/BlogContext";
import TitleContext from "../context/TitleContext";

const ListDetailPageService = ({ blogs, homeContent }) => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [noDetailMsg, setNoDetailMsg] = useState("");
  const [serviceDetailPages, setServiceDetailPages] = useState([]);
  const [serviceDetailPagesError, setServiceDetailPagesError] = useState(null);
  const [serviceDetailPagesLoading, setServiceDetailPagesLoading] = useState(false);

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyPlacesError, setNearbyPlacesError] = useState(null);
  const [nearbyPlacesLoading, setNearbyPlacesLoading] = useState(true);

  const [nextParams, setNextParams] = useState("limit=9&offset=0");
  const loaderRef = useRef(null);
  const { setBlogs, resetBlogs } = useContext(BlogContext);
  const { setTitle, resetTitle } = useContext(TitleContext);

  const serviceDetailPagesRef = useRef([]);

  // Set blogs in context
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

  // Fetch services with pagination
  const fetchServiceDetails = async (params = "limit=9&offset=0", reset = false) => {
    let url = `/service_api/companies/all/detail-list/?${params}`;
    if (category) url += `&category=${category}`;

    try {
      setServiceDetailPagesLoading(true);
      const response = await service.getServiceDetails(url);

      const newItems = response.data.results.filter(
        item => !serviceDetailPagesRef.current.some(existing => existing.slug === item.slug)
      );

      if (reset) {
        setServiceDetailPages(newItems);
        serviceDetailPagesRef.current = newItems;
      } else {
        setServiceDetailPages(prev => {
          const updated = [...prev, ...newItems];
          serviceDetailPagesRef.current = updated;
          return updated;
        });
      }

      if (response.data.next) {
        const nextUrl = new URL(response.data.next, window.location.origin);
        setNextParams(nextUrl.searchParams.toString());
      } else {
        setNextParams(null);
      }
    } catch (err) {
      setServiceDetailPagesError(err);
      console.error(err);
    } finally {
      setServiceDetailPagesLoading(false);
    }
  };

  // Reset & fetch when nearbyPlaces or category changes
  useEffect(() => {
    setServiceDetailPages([]);
    serviceDetailPagesRef.current = [];
    setNextParams("limit=9&offset=0");
    fetchServiceDetails("limit=9&offset=0", true);
  }, [nearbyPlaces, category]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && nextParams && !serviceDetailPagesLoading) {
          fetchServiceDetails(nextParams);
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextParams, serviceDetailPagesLoading]);

  // No results message
  useEffect(() => {
    if (!serviceDetailPagesLoading && serviceDetailPages.length === 0) {
      let msg = "No Services to Display.";
      if (category) msg = "No services available for the provided category.";
      setNoDetailMsg(msg);
    }
  }, [serviceDetailPages, serviceDetailPagesLoading, category]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

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
                    <h1>Services</h1>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <p id="breadcrumbs">
                      <span>
                        <span><Link href="/">Home</Link></span> » 
                        <span className="breadcrumb_last" aria-current="page">Services</span>
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
          <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

          <div className="row" data-aos="fade-up">
            {serviceDetailPagesLoading && serviceDetailPages.length === 0 && <Loading />}
            {!serviceDetailPagesLoading && serviceDetailPages.length === 0 && (
              <h6 className="text-center text-danger">{noDetailMsg}</h6>
            )}

            {serviceDetailPages?.map((detail, index) => (
              <div className="col-md-4" key={detail.slug + index || index + 1}>
                <article className="post detail-post">
                  <div className="post-preview">
                    <Link href={`/${detail.url}`}>
                      <img
                        src={detail.service?.image_url || "/images/building-3697342_1280.jpg"}
                        alt={detail.service?.name}
                        className="img-fluid mx-auto d-block"                        
                      />
                    </Link>
                  </div>
                  <div className="post-header">
                    <h4 className="post-title">
                      <Link href={`/${detail.url}`}>{detail.service?.name}</Link>
                    </h4>
                    <div className="post-content" style={{ maxHeight: "60px", overflowY: "hidden" }}>
                      <p className="text-muted" style={{
                        textAlign: "left",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {detail.summary}
                      </p>
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

            {serviceDetailPagesLoading && serviceDetailPages.length > 0 && <Loading />}
            <div ref={loaderRef} style={{ height: '1px' }} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ListDetailPageService;
