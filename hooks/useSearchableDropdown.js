import { useEffect, useRef, useState, useMemo } from 'react';

export function useSearchableDropdown(options = [], onSelect, labelKey = 'name') {
  const [search, setSearch] = useState('');
  const [originalSearch, setOriginalSearch] = useState('');
  const [showList, setShowList] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const keyword = search?.toString().toUpperCase().trim();
    const original = originalSearch.toString().toUpperCase().trim();

    // If input equals the selected item and user hasn't changed it, show full list
    const hasUserModified = keyword !== original;
    if (!hasUserModified) return options;

    return options.filter((item) => {
      const label = item?.[labelKey]?.toString().toUpperCase() || '';
      return label.includes(keyword);
    });
  }, [search, options, labelKey, originalSearch]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filtered]);

  const handleKeyDown = (e) => {
    if (!filtered.length) return;

    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      const selected = filtered[highlightedIndex];
      if (selected) {
        const label = selected?.[labelKey] || '';
        setSearch(label);
        setOriginalSearch(label); // store the selected label
        setShowList(false);
        onSelect?.(selected);
      }
    }
  };

  const handleSelect = (item) => {
    const label = item?.[labelKey] || '';
    setSearch(label);
    setOriginalSearch(label);
    setShowList(false);
    onSelect?.(item);
  };

  const handleBlur = () => {
    setTimeout(() => setShowList(false), 200);
  };

  return {
    search,
    setSearch,
    filtered,
    showList,
    setShowList,
    highlightedIndex,
    setHighlightedIndex,
    inputRef,
    listRef,
    handleKeyDown,
    handleSelect,
    handleBlur,
  };
}
