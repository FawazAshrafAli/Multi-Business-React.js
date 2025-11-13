import React, { useContext, useEffect } from 'react'
import ListingPage from '../common/ListingPage';
import TitleContext from '../context/TitleContext';
import { useRouter } from 'next/router';
import BlogContext from '../context/BlogContext';
import useNearestPlace from '../../hooks/useNearestPlace';

const ListCourseSpecializations = ({locationData, blogs}) => {
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
 
       router.push(`/${nearestPlace?.district?.slug}/courses`);      
 
     }, [nearestPlace]);
 
     useEffect(() => {
       setTitle(`Courses`);
 
       return () => {
         resetTitle();
       }
 
     }, [])
       
   return (
     <>
         <ListingPage
         itemsType="CourseSpecialization"        
         handleNearby={handleNearby}
         locationData={locationData}        
         />        
     
     </>
   )
 }

export default ListCourseSpecializations