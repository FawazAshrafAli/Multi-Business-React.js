import { useCallback, useRef, useState } from "react";
import course from "../lib/api/course";

export default function useFetchCourseDetails() {
  const [courseDetails, setCourseDetails] = useState([]);
  const [courseDetailsLoading, setCourseDetailsLoading] = useState(false);
  const [nextCourseDetailUrl, setNextCourseDetailUrl] = useState(null);
  const fetchingRef = useRef(false);

  const fetchCourseDetails = useCallback(
    async (slug, specializationSlug, reset = false) => {
      if (fetchingRef.current) return;

      if (reset) {
        setCourseDetails([]);
        setNextCourseDetailUrl(null);
      }

      fetchingRef.current = true;
      setCourseDetailsLoading(true);

      try {
        const url =
          reset || !nextCourseDetailUrl
            ? `/course_api/companies/${slug}/detail-list/?specialization=${specializationSlug}&limit=9&offset=0`
            : nextCourseDetailUrl;

        const response = await course.getCourseDetails(url);
        const results = response.data.results || [];

        setCourseDetails((prev) =>
          reset ? results : [...prev, ...results]
        );

        setNextCourseDetailUrl(response.data.next || null);
        
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        fetchingRef.current = false;
        setCourseDetailsLoading(false);
      }
    },
    [nextCourseDetailUrl]
  );

  return {
    courseDetails,
    courseDetailsLoading,
    nextCourseDetailUrl,
    fetchCourseDetails,
  };
}
