/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_MEDIA_PROTOCOL || "http",
        hostname: process.env.NEXT_PUBLIC_MEDIA_HOST || "localhost",
        port: process.env.NEXT_PUBLIC_MEDIA_PORT || "5005",
        pathname: "/media/**",
      },
    ],
  },
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
        source: `/:slug/more-courses/feed`,
        destination: '/api/coursesFeed',
      },
      {
        source: `/:slug/more-courses/:specializationSlug/feed`,
        destination: '/api/locationBasedCourseDetailsFeed',
      },
      {
        source: `/:slug/startup-services/feed`,
        destination: '/api/registrationsFeed',
      },
      {
        source: `/:slug/startup-services/:subTypeSlug/feed`,
        destination: '/api/locationBasedRegistrationDetailsFeed',
      },
      {
        source: `/:slug/more-services/feed`,
        destination: '/api/servicesFeed',
      },
      {
        source: `/:slug/more-services/:subCategorySlug/feed`,
        destination: '/api/locationBasedServiceDetailsFeed',
      },
      {
        source: `/:slug/more-products/feed`,
        destination: '/api/productsFeed',
      },
      {
        source: `/:slug/more-products/:subCategorySlug/feed`,
        destination: '/api/locationBasedProductDetailsFeed',
      },
      {
        source: `/:slug/faqs/feed`,
        destination: '/api/faqFeed',
      },
      {
        source: `/:slug/csc/feed`,
        destination: '/api/cscFeed',
      },
      {
        source: `/:slug/csc/:cscSlug/feed`,
        destination: '/api/cscDetailFeed',
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
        source: `/:slug/view-courses/feed`,
        destination: '/api/courseDetailsFeed',
      },
      {
        source: `/:slug/view-services/feed`,
        destination: '/api/serviceDetailsFeed',
      },
      {
        source: `/:slug/registrations/feed`,
        destination: '/api/registrationDetailsFeed',
      },
      {
        source: `/:slug/view-products/feed`,
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
