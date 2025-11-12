import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import Loading from '../Loading';
import { bannerSlider } from '../../public/w3/js/slider';
import company from '../../lib/api/company';
import Link from 'next/link';

const BannerSlider = ({slug}) => {
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => { 
    if (!slug) return;

    const fetchBanners = async() => {
      try {
        const response = await company.getBanners(slug);
        setBanners(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchBanners();
  }, [slug]);

  if (bannersLoading) return <Loading/>;

  return (
    <section>
    
      
      <div className="main-slider">

      <Slider {...bannerSlider}>
      {banners?.map((banner, index) => (
        <div className="slider-item" key={banner.slug || index + 1}>
          <div className="slider-bg">
          <img src={banner.image_url || ""} alt={banner.title} style={{maxHeight: "700px", objectFit: "cover"}}/>
            <div className="overlay"></div>
            <div className="slider-content">
              <h2>{banner.title}</h2>
              <p>{banner.description}</p>
              <Link href={banner.link} className="primary_button" style={{visibility: "visible"}} tabIndex="-1" >Read More</Link>
            </div>
          </div>
        </div>
      )) || []}
            
    </Slider>
        
    
  </div>


 
    </section>
  );
};

export default BannerSlider;
