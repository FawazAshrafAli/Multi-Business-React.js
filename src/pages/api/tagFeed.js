    // pages/api/rss.js

    import { Feed } from 'feed';
    import home from '../../../lib/api/home';
    import blog from '../../../lib/api/blog';
    import destination from '../../../lib/api/destination';
    import location from '../../../lib/api/location';
    import company from '../../../lib/api/company';
    import metaTag from '../../../lib/api/metaTag';

    export default async function handler(req, res) {
        const {metaTagSlug} = req.query;

        const siteUrl = 'https://bzindia.in';

        const { lat, lon } = await location.getLocationFromIP(req);
        
        // Fetch dynamic content
        const homeContentRes = await home.getHomeContent();
        const homeContent = homeContentRes.data; 

        const getImageMimeType = (url) => {
            if (url.endsWith('.png')) return 'image/png';
            if (url.endsWith('.webp')) return 'image/webp';
            if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
            return 'image/*';
        };

        const blogsRes = await blog.getBlogs(`/blog_api/blogs`);
        const blogs = blogsRes.data.results;

        const tagsRes = await metaTag.getMetaTags();
        const tags = tagsRes.data.results;

        const currentMetaTagRes = await metaTag.getMetaTag(metaTagSlug);
        const currentMetaTag = currentMetaTagRes.data;

        const matchingItemsRes = await metaTag.getMatchingItems(metaTagSlug);
        const matchingItems = matchingItemsRes.data.results;

        const companiesRes = await company.getCompanies();
        const companies = companiesRes.data; 

        const destinationsRes = await destination.getDestinations( lat, lon );
        const destinations  = await destinationsRes.data.slice(0, 12);

        const feed = new Feed({
            title: `${currentMetaTag?.name} - ${homeContent?.[0]?.meta_title || "BZIndia"} - RSS Feed`,
            description: currentMetaTag?.meta_description || "",
            id: `${siteUrl}/tag/${currentMetaTag?.slug}`,
            link: `${siteUrl}/tag/${currentMetaTag?.slug}`,
            language: 'en',
            image: `${siteUrl}/images/logo.svg`,
            favicon: `${siteUrl}/images/Favicon.png`,
            updated: new Date(currentMetaTag?.updated) || new Date(),
            generator: 'Feed for Next.js',
            feedLinks: {
            rss2: `${siteUrl}/tag/${currentMetaTag?.slug}/rss`,
            },
            author: {
            name: 'BZ India',
            link: siteUrl,
            },
        });    

        // Add Matching items
        matchingItems?.forEach((item) => {
            feed.addItem({
                title: item.name,
                id: `${siteUrl}/${item.url}`,
                link: `${siteUrl}/${item.url}`,
                description: item.meta_description,
                date: new Date(item.updated),

                enclosure: item.image_url ? {
                    url: `${item.image_url}`,  
                    type: getImageMimeType(item.image_url)
                } : undefined
            });
        });

        // Add Tags
        tags?.forEach((tag) => {
            feed.addItem({
                title: tag.name,
                id: `${siteUrl}/tag/${tag.slug}`,
                link: `${siteUrl}/tag/${tag.slug}`,
                description: tag.description,
                date: new Date(tag.updated),

                enclosure: tag.image_url ? {
                    url: `${tag.image_url}`,  
                    type: getImageMimeType(tag.image_url)
                } : undefined
            });
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
