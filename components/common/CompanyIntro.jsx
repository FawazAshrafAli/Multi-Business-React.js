import React, { useEffect, useState } from 'react'
import createDOMPurify from 'dompurify';
import Loading from '../Loading';

import AOS from 'aos';
import 'aos/dist/aos.css';

const CompanyIntro = ({name, description, loading}) => {
  const [sanitizedDescription, setSanitizedDescription] = useState([]);
  
  useEffect(() => {
      if (typeof window === 'undefined' || !description) return;

      const DOMPurify = createDOMPurify(window);
      const sanitized = DOMPurify.sanitize(description || '')    

      setSanitizedDescription(sanitized);
  }, [description]);
  
  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, [name, description, loading])

  if (loading) {
    return <Loading/>
  }
  return (
    <> 
      <section className="inner_home_content_sec">
          <div className="container">
          <div className="row">
              <div className="col-md-12" data-aos="fade-up"> 
              
              <h1>{name}</h1>
                                
              <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
              <span dangerouslySetInnerHTML={{__html: sanitizedDescription}}/>
              </div>
          </div>
          </div>
      </section>
    </>
  )
}

export default CompanyIntro