import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import TitleContext from '../context/TitleContext';
import useNearestPlace from '../../hooks/useNearestPlace';
import BlogContext from '../context/BlogContext';
import ListingPage from '../common/ListingPage';

const ListCourseDetails = ({locationData, blogs, specialization}) => {
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

    router.push(`/${nearestPlace?.district?.slug}/courses/${specialization?.location_slug || specialization?.slug}-${nearestPlace?.slug}`);        

  }, [nearestPlace]);
  
  useEffect(() => {
      if (blogs) setBlogs(blogs);      
  
      return () => {      
      resetBlogs();
      };
  }, [blogs]);

  useEffect(() => {
    setTitle(`Courses`);

    return () => {
        resetTitle();
    }

  }, []);

  return (
    <>
        <ListingPage
        itemsType="CourseDetail"        
        handleNearby={handleNearby}
        locationData={locationData}
        specialization={specialization}
        />
    </>
  )
}

export default ListCourseDetails