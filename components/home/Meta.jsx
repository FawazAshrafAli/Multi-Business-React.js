import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async';
import BaseMetaTags from '/src/components/base/BaseMetaTags';

import favicon from '/images/Favicon.png';

import home from '../../api/home';

const Meta = ({metaTags}) => {
  const [homeContent, setHomeContent] = useState();
  const [homeContentError, setHomeContentError] = useState(null);

  useState(() => {
    const fetchHomeContent = async() => {
      try {
        const response = await home.getHomeContent();
        setHomeContent(response.data)
      } catch (err) {
        setHomeContentError(err);
      }
    };

    fetchHomeContent();
  }, [])

  if (homeContentError) {
    console.error(homeContentError);
  }

  return (
    <>
      <BaseMetaTags/>
      <Helmet>

      <link rel="shortcut icon" href={favicon} />
          
      <meta name="description" content={homeContent&&homeContent[0]?.meta_description || ""} />
      <meta name="keywords" content={metaTags?.map(metaTag => metaTag?.name) || ""} />

      <link rel="canonical" href="https://bzindia.in/" />

      <title>{homeContent&&homeContent[0]?.meta_title || "BZIndia - Find the Top Companies in India"}</title>

      <meta property="og:type" content="article"/>

      <meta property="og:title" content={homeContent&&homeContent[0]?.meta_title || "BZIndia - Find the Top Companies in India"} />

      <meta property="og:url" content="https://bzindia.in/" />


      <meta property="og:description" content={homeContent&&homeContent[0]?.meta_description || ""} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="BZIndia - Find the Top Companies in India" />
      <meta name="twitter:description" content="site description!" />
      <meta name="twitter:image" content="https://example.com/your-image.jpg" />
      <meta name="twitter:site" content="https://x.com/Bzindia_in" />
      <meta name="twitter:creator" content="@Bzindia_in" />

      {/* Other meta tags */}
      <meta property="article:publisher" content="https://www.facebook.com/BZindia/" />
      <meta property="article:published_time" content="2022-10-07T18:01:17+00:00" />

      <meta property="og:image" content="https://bzindia.in/images/logo.svg" />      
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="800" />
      <meta property="og:image:type" content="image/png" />
        </Helmet>
    </>
  )
}

export default Meta