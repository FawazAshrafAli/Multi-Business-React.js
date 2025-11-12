    // pages/api/rss.js

    import { Feed } from 'feed';
    import home from '../../../lib/api/home';
    import blog from '../../../lib/api/blog';
    import destination from '../../../lib/api/destination';
    import location from '../../../lib/api/location';
    import company from '../../../lib/api/company';

    export default async function handler(req, res) {
        const {slug} = req.query;

        const siteUrl = 'https://bzindia.in';

        const { lat, lon } = await location.getLocationFromIP(req);
        
        // Fetch dynamic content
        const homeContentRes = await home.getHomeContent();
        const homeContent = homeContentRes.data; 
        
        let currentCompany;
        let blogs;
        let companies;

        const getImageMimeType = (url) => {
            if (url.endsWith('.png')) return 'image/png';
            if (url.endsWith('.webp')) return 'image/webp';
            if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
            return 'image/*';
        };

        if (slug) {
            const currentCompanyRes = await company.getCompany(slug);
            currentCompany = currentCompanyRes.data; 
        }

        const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
        blogs = blogsRes.data.results;

        if (currentCompany) {
            blogs = currentCompany?.blogs
        } else {
            const companiesRes = await company.getCompanies();
            companies = companiesRes.data; 
        }


        const destinationsRes = await destination.getDestinations( lat, lon );
        const destinations  = await destinationsRes.data.slice(0, 12);

    const feed = new Feed({
        title: `Learn - ${currentCompany?.meta_title || homeContent?.[0]?.meta_title || "BZIndia"} - RSS Feed`,
        description: `Latest artcles from ${currentCompany?.name || "BZIndia"}`,
        id: `${siteUrl}${currentCompany? `/${currentCompany?.slug}` : ""}/learn`,
        link: `${siteUrl}${currentCompany? `/${currentCompany?.slug}` : ""}/learn`,
        language: 'en',
        image: currentCompany?.logo_url || currentCompany?.logo_url || `${siteUrl}/images/logo.svg`,
        favicon: currentCompany?.favicon_url || `${siteUrl}/images/Favicon.png`,
        updated: new Date(),
        generator: 'Feed for Next.js',
        feedLinks: {
        rss2: `${siteUrl}${currentCompany? `/${currentCompany?.slug}` : ""}/learn/rss`,
        },
        author: {
        name: 'BZ India',
        link: siteUrl,
        },
    });    

        // Add blog posts
        blogs?.forEach((post) => {
            feed.addItem({
                title: post.title,
                id: `${siteUrl}/learn/${post.slug}`,
                link: `${siteUrl}/learn/${post.slug}`,
                description: post.summary?.slice(0,300),
                date: new Date(post.published_on),

                enclosure: post.image_url ? {
                    url: `${post.image_url}`,  
                    type: getImageMimeType(post.image_url)
                } : undefined
            });
        });

        if (!currentCompany) {
            // Add companies
            companies?.forEach((company) => {
                feed.addItem({
                title: company.name,
                id: `${siteUrl}/${company.slug}`,
                link: `${siteUrl}/${company.slug}`,
                description: company.meta_description,
                date: new Date(company.updated),
                });
            });
        }

    // Add destinations
    destinations.slice(0, 12).forEach((dest) => {
        feed.addItem({
        title: dest.name,
        id: `${siteUrl}/destination/${dest.slug}`,
        link: `${siteUrl}/destination/${dest.slug}`,
        description: dest.meta_description?.slice(0,300) || `Learn more about ${dest.name}`,
        date: new Date(dest.updated || Date.now()),
        
        });
    });  

    res.setHeader('Content-Type', 'application/rss+xml');
    res.write(feed.rss2());
    res.end();
    }
