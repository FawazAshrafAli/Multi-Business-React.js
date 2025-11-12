import { useState, useCallback } from "react";
import location from "../lib/api/location";

export default function useNearestPlace() {
  const [nearestPlace, setNearestPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNearestPlace = useCallback(async () => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation not supported"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // ✅ Call your API function
      const response = await location.getNearestPlace(latitude, longitude);
      setNearestPlace(response.data);
    } catch (err) {
      console.error("Geolocation error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { nearestPlace, loading, error, fetchNearestPlace };
}
