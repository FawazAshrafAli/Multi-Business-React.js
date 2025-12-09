import React, {useContext, useEffect, useState} from 'react';

import CompanyPreview from './home/CompanyPreview.jsx';

import metaTag from '../lib/api/metaTag';

import $ from 'jquery';
import '/public/easy-responsive-tabs';
import Loading from './Loading.jsx';
import Link from 'next/link.js';
import { useSearchParams } from 'next/navigation.js';

import BlogContext from './context/BlogContext.jsx';
import TitleContext from './context/TitleContext.jsx';
import NearestLocationContext from './context/NearesLocationContext.jsx';
import dynamic from 'next/dynamic.js';

const VentureSlider = dynamic(() => import('./home/VentureSlider.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const RegistrationSlider = dynamic(() => import('./home/RegistrationSlider.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const ServiceSlider = dynamic(() => import('./common/ServiceSlider.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const ProductSlider = dynamic(() => import('./common/ProductSlider.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const TagCloud = dynamic(() => import('./home/TagCloud.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const MainContent = dynamic(() => import('./home/MainContent.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const Results = dynamic(() => import('./Results.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const HomeCourseSlider = dynamic(() => import('./common/HomeCourseSlider.jsx'), {
  ssr: false,
  loading: () => <Loading />
});

const Home = ({
  homeContent, metaTags, blogs, companies,
  courseDetailPages, serviceDetailPages, companyTypes,
  registrationDetailPages, productDetailPages
}) => {

  const searchParams = useSearchParams();
  const s = searchParams.get('s');       
    
  const [formData, setFormData] = useState({});

  const { setBlogs, resetBlogs } = useContext(BlogContext);
  const { setTitle, resetTitle } = useContext(TitleContext);  
  const { nearestLocation } = useContext(NearestLocationContext);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = "/images/city-4667143_1920.jpeg";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
      if (blogs) setBlogs(blogs);      
  
      return () => {      
      resetBlogs();
      };
  }, [blogs]);

  useEffect(() => {
      setTitle(homeContent?.meta_title || 'BZIndia - Find the top companies in India');
  
      return () => {      
      resetTitle();
      };
  }, [homeContent]);

  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.query) {
          router.push(`/?s=${formData.query}`)
      }
  }  

  useEffect(() => {
    if ($.fn.easyResponsiveTabs) {
    $('#verticalTab').easyResponsiveTabs({
        type: 'vertical',
        width: 'auto',
        fit: true
    });

    $('#horizontalTab').easyResponsiveTabs({
        type: 'horizontal',
        width: 'auto',
        fit: true
    });
    } else {
    console.warn('easyResponsiveTabs is not loaded properly');
    }
  }, [companies, companyTypes]);  

  return (
    s ? 
      <Results query={s} />
      :
    
    <>  

       {/* banner-slider start  */}
<section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}} >

   {/* banner-serch-bar-section-start  */}

  <div className="banner-sech-bar">
    <div className="banner-serch-bar-cntnt">
      <h2>SEARCH YOUR NEEDS</h2>
      <p style={{width:"80%", margin:"0 auto", padding:"0px 0px 20px 0px"}}>Find the best companies in India for your service or product needs. Explore our curated business directory, focusing on one trusted company that delivers top-notch services and products nationwide.</p>
      <form className="search_bx mt-5" role="search">
        <input className="form-control " type="search" name="s" placeholder="Search" value={formData.s || ""} onChange={(e) => handleChange(e)} aria-label="Search"/>
        <button className="srch-btn" type="submit"><i className="fas fa-search" onClick={(e) => handleSubmit(e)}></i></button>
      </form>
    </div>
  </div>
  <div className="bg-overlay"></div>
   {/* banner-serch-bar-section-end  */}
</section>
 
   {/* home -banner section-end  */}

  {/* join venture-slider-section start   */}

  <VentureSlider companies={companies} />       

  {/* join venture-slider-section end   */}
  <section className="content_area001" style={{padding: "0px 0px 40px 0px", marginBottom: "0px", borderBottom: "1px solid #ddd"}}>
    <CompanyPreview companies={companies} />
  </section>
      
  <section style={{paddingTop:"50px"}}>
    
    <RegistrationSlider detailPages = {registrationDetailPages?.slice(0,15)} nearestLocation={nearestLocation}/>    
    
    
    <HomeCourseSlider detailPages={courseDetailPages} nearestLocation={nearestLocation}/>    

    
    <ServiceSlider detailPages={serviceDetailPages} nearestLocation={nearestLocation}/>    
  </section>


  
  <section style={{background: "#f1f1f1", marginBottom: "20px", padding: "0px 0px 50px 0px"}}>
    <div className="container">
      <div className="row">
        <div className="row" style={{padding: "40px 0 0px 0", textAlign: "center"}}>
          <div className="offerd-service-section" style={{margin: "0"}}>
            <ProductSlider detailPages={productDetailPages}/>
          </div>
          {nearestLocation && 
          <Link href={`/${nearestLocation?.district?.slug || nearestLocation?.state?.slug || "delhi"}/more-products`}  className="primary_button" style={{margin: "0 auto"}}>Buy More</Link>
          }
        </div>  
      </div>            
    </div>
  </section>


  
   {/* what-we-do section start  */}

  <section className="content_area001">
    <div className="container">
      
      {!homeContent ? <Loading/> :        
          <MainContent homeContent={homeContent}/>        
      }

      {!metaTag ? <Loading/> :        
          <TagCloud metaTags={metaTags}/>          
      }

    </div>
  </section>
  
</>
  )
}

export default Home