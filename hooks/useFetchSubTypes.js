import { useCallback, useRef, useState } from 'react'
import registration from '../lib/api/registration';

export default function useFetchSubTypes() {
    const [subTypes, setSubTypes] = useState([]);
    const [subTypesLoading, setSubTypesLoading] = useState(false);

    const fetchingRef = useRef(false);
    const [nextParams, setNextParams] = useState('limit=9&offset=0');

    const fetchSubTypes = useCallback(async (slug, typeSlug=null, params = null, reset = false) => {
          if (!slug || fetchingRef.current) return;
          fetchingRef.current = true;
          setSubTypesLoading(true);
  
          try {
              if (!params) params = 'limit=9&offset=0';
              const response = await registration.getSubTypes(slug, typeSlug, params);
  
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
      }, []);

      return { subTypes, subTypesLoading, nextParams, fetchSubTypes };
}

