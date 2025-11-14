import React, { useContext, useEffect, useState } from 'react'
import ListingPage from '../common/ListingPage'
import { useRouter } from 'next/router';
import TitleContext from '../context/TitleContext';
import BlogContext from '../context/BlogContext';
import useNearestPlace from '../../hooks/useNearestPlace';

const ListServiceDetails = ({locationData, blogs, subCategory}) => {
  const router = useRouter();
  
  const {setTitle, resetTitle} = useContext(TitleContext);  
  const { setBlogs, resetBlogs } = useContext(BlogContext);
  const {nearestPlace, fetchNearestPlace} = useNearestPlace();

  const handleNearby = async () => {
        try {
            fetchNearestPlace();
        } catch (err) {
            console.error("Error in handling nearby function: ", err)
        }
    }

  useEffect(() => {
    if (!nearestPlace) return;

    router.push(`/${nearestPlace?.district?.slug}/more-services/${subCategory?.locationSlug || subCategory?.slug}-${nearestPlace?.slug}`);        

  }, [nearestPlace]);
  
  useEffect(() => {
      if (blogs) setBlogs(blogs);      
  
      return () => {      
      resetBlogs();
      };
  }, [blogs]);

  useEffect(() => {
    setTitle(`Services`);

    return () => {
        resetTitle();
    }

  }, []);

  return (
    <>
        <ListingPage
        itemsType="ServiceDetail"        
        handleNearby={handleNearby}
        locationData={locationData}
        subCategory={subCategory}
        />
    </>
  )
}

export default ListServiceDetails