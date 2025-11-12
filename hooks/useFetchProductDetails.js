import { useCallback, useRef, useState } from 'react'
import product from '../lib/api/product';

export default function useFetchProductDetails() {
    const [productDetails, setProductDetails] = useState([]);
    const [productDetailsLoading, setProductDetailsLoading] = useState(false);

    const fetchingRef = useRef(false);
    const [nextProductDetailsParams, setNextProductDetailsParams] = useState(null);

    const fetchProductDetails = useCallback(async (slug, subCategorySlug = null, params = null, reset = false) => {

        console.log("called")
        if (fetchingRef.current) return;
        
            fetchingRef.current = true;
            setProductDetailsLoading(true);
        
            try {
                let query = `sub_category=${subCategorySlug}`;
                if (params) query += `&${params}`;
    
                const response = await product.getProductDetailList(slug, query);
                const data = response?.data ?? {};

                setProductDetails(prev => {
                    const current = reset ? [] : prev;
                    const seen = new Set(current.map(item => item.slug));
                    const newItems = (data.results || []).filter(item => !seen.has(item.slug));
                    return [...current, ...newItems];
                });
    
    
                if (response.data.next) {
                const urlParams = response.data.next.split("?")[1];
                setNextProductDetailsParams(urlParams);
                } else {
                setNextProductDetailsParams(null);
                }
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setProductDetailsLoading(false);
                fetchingRef.current = false;
            }
      }, []);

      return { productDetails, productDetailsLoading, nextProductDetailsParams, fetchProductDetails };
}

