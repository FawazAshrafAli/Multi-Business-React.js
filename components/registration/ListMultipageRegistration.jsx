import React, { useEffect, useState, useRef, useContext } from 'react';

import registration from '../../lib/api/registration';
import location from '../../lib/api/location';

import BlogContext from '../context/BlogContext';
import TitleContext from '../context/TitleContext';
import ListingPage from '../common/ListingPage';

const ListMultipageRegistration = ({ blogs, homeContent }) => {

  const [subTypes, setSubTypes] = useState([]);
  const [subTypesLoading, setSubTypesLoading] = useState(false);

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyPlacesLoading, setNearbyPlacesLoading] = useState(true);
  const [nearbyPlacesError, setNearbyPlacesError] = useState(null);

  const [nextParams, setNextParams] = useState('limit=9&offset=0');
  const loaderRef = useRef(null);
  const fetchingRef = useRef(false);
  const fetchedUrls = useRef(new Set());

  const { setBlogs, resetBlogs } = useContext(BlogContext);
  const { setTitle, resetTitle } = useContext(TitleContext);

  // Set blogs context
  useEffect(() => {
    if (blogs) setBlogs(blogs);
    return () => resetBlogs();
  }, [blogs]);

  useEffect(() => {
      if (homeContent) setTitle(`Products${homeContent?.meta_title ? ` - ${homeContent?.meta_title}` : ""}`);      
  
      return () => {      
      resetTitle();
      };
  }, [homeContent]);

  // Fetch nearby places
  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        const response = await location.getNearbyPlaces();
        setNearbyPlaces(response.data);
      } catch (err) {
        console.error("Error in fetching nearby places: ", err);
      } finally {
        setNearbyPlacesLoading(false);
      }
    };
    fetchNearbyPlaces();
  }, []);

  // Core fetch function
  const fetchSubTypes = async (params = null, reset = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setSubTypesLoading(true);

      try {
          if (!params) params = 'limit=9&offset=0';
          const response = await registration.getSubTypes("all", params);

          setSubTypes(prev => {
              const existingSlugs = new Set(prev.map(item => item.slug));
              const newItems = response.data.results.filter(item => !existingSlugs.has(item.slug));
              return reset ? response.data.results : [...prev, ...newItems];
          });

          // Update nextParams for infinite scroll
          if (response.data.next) {
              const urlParams = response.data.next.split('?')[1];
              setNextParams(urlParams);
          } else {
              setNextParams(null);
          }
      } catch (err) {
          console.error(err);
      } finally {
          setSubTypesLoading(false);
          fetchingRef.current = false;
      }
  };

  // Infinite scroll
  useEffect(() => {
      if (!loaderRef.current) return;
      const observer = new IntersectionObserver(
          entries => {
              if (entries[0].isIntersecting && nextParams && !subTypesLoading) {
                  fetchSubTypes(nextParams);
              }
          },
          { threshold: 1 }
      );

      observer.observe(loaderRef.current);
      return () => observer.disconnect();
  }, [nextParams, subTypesLoading]);  

  return (
    <>
      <ListingPage
      items={subTypes}
      itemsType="Registration"
      // parentPlace={parentPlace}
      // childPlace={childPlace}
      // handleNearby={handleNearby}
      />        
    
    </>
  );
};

export default ListMultipageRegistration;
