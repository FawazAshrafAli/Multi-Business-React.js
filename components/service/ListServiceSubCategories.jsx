import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import TitleContext from '../context/TitleContext';
import BlogContext from '../context/BlogContext';
import useNearestPlace from '../../hooks/useNearestPlace';
import ListingPage from '../common/ListingPage';

const ListServiceSubCategories = ({locationData, blogs}) => {
  const router = useRouter();

    const {setTitle, resetTitle} = useContext(TitleContext);                        

    const { setBlogs, resetBlogs } = useContext(BlogContext);

    const {nearestPlace, fetchNearestPlace} = useNearestPlace()
    
    useEffect(() => {
        if (blogs) setBlogs(blogs);      
    
        return () => {      
            resetBlogs();
        };
    }, [blogs]);
          
    const handleNearby = async () => {
      try {
        fetchNearestPlace();
      } catch (err) {
        console.error("Error in handling nearby function: ", err)
      }
    }

    useEffect(() => {
      if (!nearestPlace) return;

      router.push(`/${nearestPlace?.district?.slug}/more-services`);      

    }, [nearestPlace]);

    useEffect(() => {
      setTitle(`Service Sub Categories`);

      return () => {
        resetTitle();
      }

    }, [])
      
  return (
    <>
        <ListingPage
        itemsType="ServiceSubCategory"        
        handleNearby={handleNearby}
        locationData={locationData}        
        />        
    
    </>
  )
}

export default ListServiceSubCategories