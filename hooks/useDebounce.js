import { useRef } from "react";

export function useDebounce(callback, delay = 400) {
    const timeoutRef = useRef(null);

    return (...args) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}
