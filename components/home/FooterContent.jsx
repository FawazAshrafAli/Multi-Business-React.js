import React, { useEffect, useState } from 'react';
import createDOMPurify from 'dompurify';
import home from '../../lib/api/home';

const FooterContent = ({currentCompany}) => {  

  const [homeContent, setHomeContent] = useState();
  const [homeContentLoading, setHomeContentLoading] = useState();  

  const [sanitizedFooterText, setSanitizedFooterText] = useState([]);  

  useEffect(() => {
    if (currentCompany) return;

    const fetchHomeContent = async () => {
      try {
        const response = await home.getHomeContent();
        setHomeContent(response.data);        
      } catch (err) {
        console.error(err);
      } finally {
        setHomeContentLoading(false);
      }
    };

    fetchHomeContent();

  }, [currentCompany]);

  useEffect(() => {
    if (typeof window === 'undefined' || (!homeContent && !currentCompany)) return;

      const footerContent = currentCompany?.footer_content || homeContent[0]?.footer_text || "";

      const DOMPurify = createDOMPurify(window);
      const sanitized = DOMPurify.sanitize( footerContent || '');         

      setSanitizedFooterText(sanitized);
    }, [homeContent, currentCompany]);

  return (
    <>  
        {sanitizedFooterText?
        <div className="col-md-12 foot_area_cnt" id="slug-about">
            <div dangerouslySetInnerHTML={{__html: sanitizedFooterText}} />          
        </div>
        :""}
    </>
  )
}

export default FooterContent