import { useCallback, useRef, useState } from "react";
import course from "../lib/api/course";

export default function useFetchCourseSpecializations() {
  const INITIAL_URL =
    `/course_api/companies/all/specializations/?listing_type=location&limit=9&offset=0`;

  const [eduSpecializations, setEduSpecializations] = useState([]);
  const [eduSpecializationsLoading, setEduSpecializationsLoading] = useState(false);
  const [nextEduUrl, setNextEduUrl] = useState(INITIAL_URL);

  const fetchingRef = useRef(false);

  const fetchEduSpecializations = useCallback(async (reset = false) => {
    // Reset must override fetchingRef
    if (fetchingRef.current && !reset) return;

    if (reset) {
      setEduSpecializations([]);
      setNextEduUrl(INITIAL_URL);
    }

    // Use fresh values by reading nextEduUrl AFTER reset
    const urlToFetch = reset ? INITIAL_URL : nextEduUrl;
    if (!urlToFetch) return;

    fetchingRef.current = true;
    setEduSpecializationsLoading(true);

    try {
      const res = await course.getSpecializations(urlToFetch);
      setEduSpecializations(prev =>
        reset ? res.data.results : [...prev, ...res.data.results]
      );
      setNextEduUrl(res.data.next || null);
    } catch (err) {
      console.error("Error fetching course specializations:", err);
    } finally {
      fetchingRef.current = false;
      setEduSpecializationsLoading(false);
    }
  }, [nextEduUrl]);
  
  return {
    eduSpecializations,
    eduSpecializationsLoading,
    nextEduUrl,
    fetchEduSpecializations,
  };
}
