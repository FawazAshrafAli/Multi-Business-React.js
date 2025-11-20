import React, {lazy, Suspense, useContext, useEffect, useState} from 'react';

import 'aos/dist/aos.css';
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

const VentureSlider = lazy(() => import('./home/VentureSlider.jsx'));
const RegistrationSlider = lazy(() => import('./home/RegistrationSlider.jsx'));
const ServiceSlider = lazy(() => import('./common/ServiceSlider.jsx')); 
const ProductSlider = lazy(() => import('./common/ProductSlider.jsx'));
const TagCloud = lazy(() => import('./home/TagCloud.jsx'));
const MainContent = lazy(() => import('./home/MainContent.jsx'));
const Results = lazy(() => import('./Results.jsx'));
const HomeCourseSlider = lazy(() => import('./common/HomeCourseSlider.jsx'));

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("aos").then(AOS => {
        AOS.init();
      });
    }
  }, []);

  

  return (
    s ? 
      <Suspense fallback={<Loading/>}>
        <Results query={s} />
      </Suspense>
      :
    
    <>  

       {/* banner-slider start  */}
<section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}} data-aos="fade-in">

   {/* banner-serch-bar-section-start  */}

  <div className="banner-sech-bar">
    <div className="banner-serch-bar-cntnt">
      <h2>SEARCH YOUR NEEDS</h2>
      <p style={{width:"80%", margin:"0 auto", padding:"0px 0px 20px 0px"}}>Find the best companies in India for your service or product needs. Explore our curated business directory, focusing on one trusted company that delivers top-notch serviceMultiPages and productMultiPages nationwide.</p>
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

  <Suspense fallback={<Loading/>}>
    <VentureSlider companies={companies} />       
  </Suspense>

  {/* join venture-slider-section end   */}
  <section className="content_area001" style={{padding: "0px 0px 40px 0px", marginBottom: "0px", borderBottom: "1px solid #ddd"}}>
    <CompanyPreview companies={companies} />
  </section>
      
  <section style={{paddingTop:"50px"}}>
    <Suspense fallback={<Loading/>}>
      <RegistrationSlider detailPages = {registrationDetailPages?.slice(0,15)} nearestLocation={nearestLocation}/>
    </Suspense>
    
    <Suspense fallback={<Loading/>}>
      <HomeCourseSlider detailPages={courseDetailPages} nearestLocation={nearestLocation}/>
    </Suspense>

    <Suspense fallback={<Loading/>}>
      <ServiceSlider detailPages={serviceDetailPages} nearestLocation={nearestLocation}/>
    </Suspense>
  </section>


  
  <section style={{background: "#f1f1f1", marginBottom: "20px", padding: "0px 0px 50px 0px"}}>
    <div className="container">
      <div className="row">
        <div className="row" style={{padding: "40px 0 0px 0", textAlign: "center"}}>
          <div className="offerd-service-section" style={{margin: "0"}}>
            <Suspense fallback={<Loading/>}>
              <ProductSlider detailPages={productDetailPages}/>
            </Suspense>
          </div>
          {nearestLocation && 
          <Link href={`/${nearestLocation?.district?.slug || nearestLocation?.state?.slug}/products`}  className="primary_button" style={{margin: "0 auto"}}>Buy More</Link>
          }
        </div>  
      </div>            
    </div>
  </section>


  
   {/* what-we-do section start  */}

  <section className="content_area001">
    <div className="container">
      
      {!homeContent ? <Loading/> :
        <Suspense fallback={<Loading/>}>
          <MainContent homeContent={homeContent}/>
        </Suspense>
      }

      {!metaTag ? <Loading/> :
        <Suspense fallback={<Loading/>}>
          <TagCloud metaTags={metaTags}/>  
        </Suspense>
      }

    </div>
  </section>
  
</>
  )
}

export default Home