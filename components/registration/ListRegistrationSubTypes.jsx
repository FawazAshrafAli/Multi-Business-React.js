import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import BlogContext from '../context/BlogContext';
import location from '../../lib/api/location';
import TitleContext from '../context/TitleContext';
import ListingPage from '../common/ListingPage';

const ListRegistrationSubTypes = ({locationData, blogs}) => {

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

      router.push(`/${nearestPlace?.district?.slug}/filings`);      

    }, [nearestPlace]);

    useEffect(() => {
      setTitle(`Sub Types`);

      return () => {
        resetTitle();
      }

    }, [])
      
  return (
    <>
        <ListingPage
        itemsType="RegistrationSubType"        
        handleNearby={handleNearby}
        locationData={locationData}        
        />        
    
    </>
  )
}

export default ListRegistrationSubTypes