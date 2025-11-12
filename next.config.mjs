/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/feed',
        destination: '/api/homeFeed',
      },
      {
        source: `/state-list-in-india/feed`,
        destination: '/api/listLocationFeed',
      },
      {
        source: `/courses/feed`,
        destination: '/api/coursesFeed',
      },
      {
        source: `/registrations/feed`,
        destination: '/api/registrationsFeed',
      },
      {
        source: `/services/feed`,
        destination: '/api/servicesFeed',
      },
      {
        source: `/products/feed`,
        destination: '/api/productsFeed',
      },
      {
        source: `/learn/feed`,
        destination: '/api/blogsFeed',
      },
      {
        source: `/tag/feed`,
        destination: '/api/tagsFeed',
      },
      {
        source: `/tag/:metaTagSlug/feed`,
        destination: '/api/tagFeed',
      },      
      {
        source: `/learn/:blogSlug/feed`,
        destination: '/api/blogFeed',
      },
      {
        source: `/state-list-in-india/:stateSlug/feed`,
        destination: '/api/listLocationFeed',
      },
      {
        source: `/state-list-in-india/:stateSlug/:districtSlug/feed`,
        destination: '/api/listLocationFeed',
      },
      {
        source: `/state-list-in-india/:stateSlug/:districtSlug/:placeSlug/feed`,
        destination: '/api/DetailLocationFeed',
      },
      {
        source: `/:slug/feed`,
        destination: '/api/companyHomeFeed',
      },
      {
        source: `/:slug/faqs/feed`,
        destination: '/api/faqFeed',
      },
      {
        source: `/:slug/faqs/:faqSlug/feed`,
        destination: '/api/faqDetailFeed',
      },
      {
        source: `/:slug/contact-us/feed`,
        destination: '/api/contactUsFeed',
      },
      {
        source: `/:slug/courses/feed`,
        destination: '/api/courseDetailsFeed',
      },
      {
        source: `/:slug/more-services/feed`,
        destination: '/api/serviceDetailsFeed',
      },
      {
        source: `/:slug/registrations/feed`,
        destination: '/api/registrationDetailsFeed',
      },
      {
        source: `/:slug/products/feed`,
        destination: '/api/productDetailsFeed',
      },
      {
        source: `/:slug/learn/feed`,
        destination: '/api/blogsFeed',
      },
      {
        source: `/:slug/learn/:blogSlug/feed`,
        destination: '/api/blogFeed',
      },
      {
        source: `/:slug/:multiPageSlug/feed`,
        destination: '/api/multipageFeed',
      },

      {
        source: `/:slug/:itemSlug/:stateSlug/feed`, 
        destination: '/api/multipageFeed',
      },

      {
        source: `/:slug/:itemSlug/:stateSlug/:districtSlug/feed`,
        destination: '/api/multipageFeed',
      },

      {
        source: `/:slug/:itemSlug/:stateSlug/:districtSlug/:placeSlug/feed`,
        destination: '/api/multipageFeed',
      },

    ];
  },
};

export default nextConfig;
