import React, { useContext, useEffect, useState } from 'react'

import location from '../../lib/api/location'

import TitleContext from '../context/TitleContext'
import ListingPage from '../common/ListingPage'
import { useRouter } from 'next/router'
import BlogContext from '../context/BlogContext'

const ListCsc = ({locationData, parentPlace, childPlace, initialNearbyCenters, blogs, faqs}) => {
        const router = useRouter();

        const {setTitle, resetTitle} = useContext(TitleContext);            
    
        const [nearbyCscCenters, setNearbyCscCenters] = useState(initialNearbyCenters || []);
        const [nearbyCscCentersLoading, setNearbyCscCentersLoading] = useState(true);        
    
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
          try {            
            const response = await location.getNearestPlace();
            setNearestPlace(response.data);
          } catch (err) {
            console.error("Geolocation error:", err);
          } finally {
            setNearestPlaceLoading(false);
          }          
        };
              
        const handleNearby = async () => {

          try {
            fetchNearestPlace();
          } catch (err) {
            console.error("Error in handing nearby function: ", err)
          }
        }

        useEffect(() => {
          if (!nearestPlace) return;

          router.push(`/${nearestPlace?.district?.slug}/csc/common-service-center-${nearestPlace?.slug}`)          

        }, [nearestPlace]);
    
        useEffect(() => {
          setTitle("Find Nearest CSC - Common Service Centres in India");
    
          return () => {
            resetTitle();
          }
    
        }, [])
    
        useEffect(() => {
          const fetchNearbyCscCenters = async () => {
              try {
              const response = await location.getNearbyCscCenters(locationData?.latitude, locationData?.longitude);
              setNearbyCscCenters(response.data);        
              } catch (err) {
              console.error("Error in fetching nearby csc centers: ", err);
              } finally {
              setNearbyCscCentersLoading(false);
              }
          };          
          
          fetchNearbyCscCenters();
        }, [locationData])             
    
        
  return (
    <>
    <ListingPage
    items={nearbyCscCenters}
    itemsType="CSC"
    parentPlace={parentPlace}
    childPlace={childPlace}
    handleNearby={handleNearby}
    faqs={faqs}
    />        
    
    </>
  )
}

export default ListCsc