import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import BlogContext from '../context/BlogContext';
import location from '../../lib/api/location';
import TitleContext from '../context/TitleContext';
import ListingPage from '../common/ListingPage';
import useNearestPlace from '../../hooks/useNearestPlace';

const ListProductSubCategories = ({locationData, blogs}) => {

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

      router.push(`/${nearestPlace?.district?.slug}/products`);      

    }, [nearestPlace]);

    useEffect(() => {
      setTitle(`Product Sub Categories`);

      return () => {
        resetTitle();
      }

    }, [])
      
  return (
    <>
        <ListingPage
        itemsType="ProductSubCategory"        
        handleNearby={handleNearby}
        locationData={locationData}        
        />        
    
    </>
  )
}

export default ListProductSubCategories