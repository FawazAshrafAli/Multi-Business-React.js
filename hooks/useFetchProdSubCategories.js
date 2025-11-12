import { useCallback, useRef, useState } from 'react'
import product from '../lib/api/product';

export default function useFetchProdSubCategories() {
    const [prodSubCategories, setProdSubCategories] = useState([]);
    const [prodSubCategoriesLoading, setProdSubCategoriesLoading] = useState(false);

    const fetchingRef = useRef(false);
    const [nextProdParams, setNextProdParams] = useState('limit=9&offset=0');

  const fetchProdSubCategories = useCallback(async (slug, categorySlug=null, params=null) => {
          if (!slug || fetchingRef.current) return;
          fetchingRef.current = true;
          setProdSubCategoriesLoading(true);
          try {
              const response = await product.getSubCategories(slug, categorySlug, params);
              setProdSubCategories(prev => {
                  const newItems = response.data.results.filter(
                      item => !prev.some(existing => existing.slug === item.slug)
                  );
                  return [...prev, ...newItems];
              });
  
              if (response.data.next) {
                  const urlParams = response.data.next.split('?')[1];
                  setNextProdParams(urlParams);
                  setHasMore(true);
              } else {
                  setNextProdParams(null);
                  setHasMore(false);
              }
          } catch (err) {
              console.error(err);
          } finally {
              setProdSubCategoriesLoading(false);
          }
      }, []);

      return { prodSubCategories, prodSubCategoriesLoading, nextProdParams, fetchProdSubCategories };
}