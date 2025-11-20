import { useCallback, useRef, useState } from 'react'
import service from '../lib/api/service';

export default function useFetchServiceDetails() {
    const [serviceDetails, setServiceDetails] = useState([]);
    const [serviceDetailsLoading, setServiceDetailsLoading] = useState(false);

    const fetchingRef = useRef(false);
    const [nextServiceDetailsParams, setNextServiceDetailsParams] = useState(null);

    const fetchServiceDetails = useCallback(async (slug, subCategorySlug = null, params = null, reset = false) => {
        if (fetchingRef.current) return;
        
            fetchingRef.current = true;
            setServiceDetailsLoading(true);
        
            try {
                let query = `sub_category=${subCategorySlug}`;
                if (params) query += `&${params}`;
    
                const response = await service.getDetailList(slug, query);
                const data = response?.data ?? {};

                setServiceDetails(prev => {
                    const current = reset ? [] : prev;
                    const seen = new Set(current.map(item => item.slug));
                    const newItems = (data.results || []).filter(item => !seen.has(item.slug));
                    return [...current, ...newItems];
                });
    
    
                if (response.data.next) {
                const urlParams = response.data.next.split("?")[1];
                setNextServiceDetailsParams(urlParams);
                } else {
                setNextServiceDetailsParams(null);
                }
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setServiceDetailsLoading(false);
                fetchingRef.current = false;
            }
      }, []);

      return { serviceDetails, serviceDetailsLoading, nextServiceDetailsParams, fetchServiceDetails };
}

