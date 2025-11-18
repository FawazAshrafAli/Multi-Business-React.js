import { useState, useEffect, useCallback } from "react";

export function useCitySearch(itemsData) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const filterItems = useCallback(
    (q) => {
      const value = q.trim().toLowerCase();

      if (!value) {
        setFiltered([]);
        setIsPanelOpen(false);
        return;
      }

      // Match only prefix, similar to your JS
      const matches = itemsData.filter((item) =>
        item.name?.toLowerCase().startsWith(value)
      );

      setFiltered(matches.slice(0, 10));
      setActiveIdx(-1);
      setIsPanelOpen(matches.length > 0);
    },
    [itemsData]
  );

  const chooseCity = (value) => {
    setQuery(value.name);
    setFiltered([]);
    setActiveIdx(-1);
    setIsPanelOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isPanelOpen || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((idx) => (idx + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((idx) => (idx - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) chooseCity(filtered[activeIdx]);
    } else if (e.key === "Escape") {
      setIsPanelOpen(false);
    }
  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (!e.target.closest(".bznew_list_search")) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener("click", closeOnOutsideClick);
    return () => {
      document.removeEventListener("click", closeOnOutsideClick);
    };
  }, []);

  return {
    query,
    setQuery,
    filtered,
    activeIdx,
    isPanelOpen,
    filterItems,
    handleKeyDown,
    chooseCity,
  };
}
