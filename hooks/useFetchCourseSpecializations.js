import { useCallback, useRef, useState } from "react";
import course from "../lib/api/course";

export default function useFetchCourseSpecializations() {
  const [eduSpecializations, setEduSpecializations] = useState([]);
  const [eduSpecializationsLoading, setEduSpecializationsLoading] = useState(false);
  const [nextEduUrl, setNextEduUrl] = useState(
    `/course_api/companies/all/specializations/?limit=9&offset=0`
  );

  const fetchingRef = useRef(false);

  const fetchEduSpecializations = useCallback(
    async (reset = false) => {
      if (fetchingRef.current) return;

      if (reset) {
        setEduSpecializations([]);
        setNextEduUrl(`/course_api/companies/all/specializations/?limit=9&offset=0`);
      }

      if (!nextEduUrl) return;

      fetchingRef.current = true;
      setEduSpecializationsLoading(true);

      try {
        const res = await course.getSpecializations(nextEduUrl);
        setEduSpecializations(prev => [...prev, ...res.data.results]);
        setNextEduUrl(res.data.next || null);
      } catch (err) {
        console.error("Error fetching course specializations:", err);
      } finally {
        setEduSpecializationsLoading(false);
        fetchingRef.current = false;
      }
    },
    [nextEduUrl]
  );

  return {
    eduSpecializations,
    eduSpecializationsLoading,
    nextEduUrl,
    fetchEduSpecializations,
  };
}
