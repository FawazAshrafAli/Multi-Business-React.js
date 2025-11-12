import { useCallback, useRef, useState } from 'react'
import registration from '../lib/api/registration';

export default function useFetchRegistrationDetails() {
    const [registrationDetails, setRegistrationDetails] = useState([]);
    const [registrationDetailsLoading, setRegistrationDetailsLoading] = useState(false);

    const fetchingRef = useRef(false);
    const [nextRegistrationDetailsParams, setNextRegistrationDetailsParams] = useState(null);

    const fetchRegistrationDetails = useCallback(async (subTypeSlug, url = null, reset = false) => {
        if (fetchingRef.current) return;
        
            fetchingRef.current = true;
            setRegistrationDetailsLoading(true);
        
            try {
                if (!url) {
                    url = `/registration_api/companies/all/detail-list/?sub_type=${subTypeSlug}&limit=9&offset=0`;
                }
                
                const response = await registration.getRegistrationDetails(url);

                setRegistrationDetails(prev =>
                reset ? response.data.results : [...prev, ...response.data.results]
                );
        
                // Save next full URL directly
                setNextRegistrationDetailsParams(response.data.next);
            } catch (err) {
                console.error("Fetch failed:", err);
            } finally {
                fetchingRef.current = false;
                setRegistrationDetailsLoading(false);
            }
      }, []);

      return { registrationDetails, registrationDetailsLoading, nextRegistrationDetailsParams, fetchRegistrationDetails };
}

