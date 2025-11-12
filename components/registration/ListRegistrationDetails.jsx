import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import TitleContext from '../context/TitleContext';
import BlogContext from '../context/BlogContext';
import ListingPage from '../common/ListingPage';
import location from '../../lib/api/location';

const ListRegistrationDetails = ({locationData, blogs, subType}) => {
  const router = useRouter();
  
    const {setTitle, resetTitle} = useContext(TitleContext);                    

    const [nearestPlace, setNearestPlace] = useState(null);
    const [nearestPlaceLoading, setNearestPlaceLoading] = useState(true);

    const { setBlogs, resetBlogs } = useContext(BlogContext);
    
        useEffect(() => {
            if (blogs) setBlogs(blogs);      
        
            return () => {      
            resetBlogs();
            };
        }, [blogs]);

    const fetchNearestPlace = async () => {
    if (navigator.geolocation) {
        try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        // ✅ Pass as object, not separate arguments
        const response = await location.getNearestPlace(latitude, longitude);

        setNearestPlace(response.data);
        } catch (err) {
        console.error("Geolocation error:", err);
        } finally {
        setNearestPlaceLoading(false);
        }
    } else {
        console.error(new Error("Geolocation not supported"));
        setNearestPlaceLoading(false);
    }
    };
        
    const handleNearby = async () => {
        try {
            fetchNearestPlace();
        } catch (err) {
            console.error("Error in handling nearby function: ", err)
        }
    }

    useEffect(() => {
        if (!nearestPlace) return;

        router.push(`/${nearestPlace?.district?.slug}/filings/${subType?.locationSlug || subType?.slug}-${nearestPlace?.slug}`);        

    }, [nearestPlace]);

    useEffect(() => {
    setTitle(`Filings`);

    return () => {
        resetTitle();
    }

    }, []);
        
    return (
      <>
          <ListingPage
          itemsType="RegistrationDetail"        
          handleNearby={handleNearby}
          locationData={locationData}
          subType={subType}
          />        
      
      </>
    )
  }

export default ListRegistrationDetails