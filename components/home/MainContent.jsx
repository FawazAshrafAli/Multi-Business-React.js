import React, { useEffect, useState } from 'react'
import createDOMPurify from 'dompurify';

const MainContent = ({homeContent}) => { 
  const [sanitizedDescription, setSanitizedDescription] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !homeContent) return;
    
      const DOMPurify = createDOMPurify(window);
      const sanitized = DOMPurify.sanitize(homeContent.description || '');

      setSanitizedDescription(sanitized);
    }, [homeContent]);


  return (
    <>  
        {homeContent?
            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <h3>{homeContent.title}</h3>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                
                    <span dangerouslySetInnerHTML={{__html: sanitizedDescription}} />
                </div>
            </div>
        :"Nothing to display"} 
    </>
  )
}

export default MainContent