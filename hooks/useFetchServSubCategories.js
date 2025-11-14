import { useCallback, useRef, useState } from "react";
import service from "../lib/api/service";

export default function useFetchServSubCategories() {
  const [servSubCategories, setServSubCategories] = useState([]);
  const [servSubCategoriesLoading, setServSubCategoriesLoading] = useState(false);

  const [nextServParams, setNextServParams] = useState("limit=9&offset=0");
  const [hasMore, setHasMore] = useState(true);

  const fetchingRef = useRef(false);

  const fetchServSubCategories = useCallback(
    async (slug, categorySlug = null, params = null) => {
      if (!slug || fetchingRef.current) return;

      fetchingRef.current = true;
      setServSubCategoriesLoading(true);

      try {
        const response = await service.getSubCategories(
          slug,
          categorySlug,
          params
        );

        setServSubCategories((prev) => {
          const newItems = response.data.results.filter(
            (item) => !prev.some((existing) => existing.slug === item.slug)
          );
          return [...prev, ...newItems];
        });

        if (response.data.next) {
          const urlParams = response.data.next.split("?")[1];
          setNextServParams(urlParams);
          setHasMore(true);
        } else {
          setNextServParams(null);
          setHasMore(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        fetchingRef.current = false;
        setServSubCategoriesLoading(false);
      }
    },
    []
  );

  return {
    servSubCategories,
    servSubCategoriesLoading,
    nextServParams,
    hasMore,
    fetchServSubCategories,
  };
}
