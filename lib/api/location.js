import apiClient from './axios';

apiClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const location = {
  async getNearbyPlaces(lat = undefined, lon = undefined) {
    if (lat && lon) {
      return apiClient.get(`/location_api/nearby_locations/?lat=${lat}&lon=${lon}`);
    }

    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        return apiClient.get(`/location_api/nearby_locations/?lat=${latitude}&lon=${longitude}`);
      } catch (error) {
        console.error("Error getting location:", error);
        throw error;
      }
    } else {    
      throw new Error("Geolocation is not supported by this browser");
    }
  },

  async getNearbyCscCenters(lat = undefined, lon = undefined) {
    if (lat && lon) {
      return apiClient.get(`/directory_api/nearby_csc_centers/?lat=${lat}&lon=${lon}`);
    }

    if (navigator.geolocation) {
      try {      
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        return apiClient.get(`/directory_api/nearby_csc_centers/?lat=${latitude}&lon=${longitude}`);
      } catch (error) {
        console.error("Error getting location:", error);
        throw error;
      }
    } else {    
      throw new Error("Geolocation is not supported by this browser");
    }
  },

  async getNearestPlace(lat = undefined, lon = undefined) {
    if (lat && lon) {
      return apiClient.get(`/location_api/nearest_place/?lat=${lat}&lon=${lon}`);
    }

    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        return apiClient.get(`/location_api/nearest_place/?lat=${latitude}&lon=${longitude}`);
      } catch (error) {
        console.error("Error getting nearest place:", error);
        throw error;
      }
    } else {    
      throw new Error("Geolocation is not supported by this browser");
    }
  },

  async getNearestCscCenters() {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        return apiClient.get(`/location_api/nearest_csc_centers/?lat=${latitude}&lon=${longitude}`);
      } catch (error) {
        console.error("Error getting nearest CSC centers:", error);
        throw error;
      }
    } else {    
      throw new Error("Geolocation is not supported by this browser");
    }
  },

  getStates() {
    return apiClient.get('/location_api/states/');
  },

  getMinimalStates() {
    return apiClient.get('/location_api/minimal-states/');
  },

  getMinimalState(stateSlug) {
    return apiClient.get(`/location_api/minimal-states/${stateSlug}`);
  },

  getState(stateSlug) {
    return apiClient.get(`/location_api/states/${stateSlug}/get_state`);
  },

  getDistricts(stateSlug = undefined) {
    if (stateSlug) {
      return apiClient.get(`/location_api/states/${stateSlug}/districts/`);
    } else {
      return apiClient.get(`/location_api/districts/`);
    }
  },

  getMinimalDistricts(stateSlug = undefined, params=undefined) {
    if (stateSlug) {
      let apiEndPoint = `/location_api/states/${stateSlug}/minimal-districts/`;

      if (params) {
        apiEndPoint += `?${params}`;
      }

      return apiClient.get(apiEndPoint);
    } else {
      return apiClient.get(`/location_api/minimal-districts/`);
    }
  },

  getMinimalPlaces(districtSlug = undefined, params=undefined) {
    let endPoint = `/location_api/districts/${districtSlug}/minimal-places/`;

    if (params) {
      endPoint += `?${params}`;
    }
    
    return apiClient.get(endPoint);
  },

  getPlaces(districtSlug = undefined) {
    if (districtSlug) {
      return apiClient.get(`/location_api/districts/${districtSlug}/places/`);
    } else {
      return apiClient.get(`/location_api/places/`);
    }
  },

  getMinimalPlace(placeSlug) {
    return apiClient.get(`/location_api/minimal-places/${placeSlug}`);
  },

  getPlace(placeSlug) {
    return apiClient.get(`/location_api/places/${placeSlug}`);
  },

  getMinimalDistrict(districtSlug) {
    return apiClient.get(`/location_api/minimal-districts/${districtSlug}/`);
  },

  getDistrict(districtSlug) {
    return apiClient.get(`/location_api/districts/${districtSlug}/`);
  },

  getCourseMultiPages(stateSlug) {
    return apiClient.get(`/location_api/states/${stateSlug}/course_multipages/`);
  },

  getCourseMultiPage(locationData, itemSlug) {
    const { placeSlug, districtSlug, stateSlug } = locationData || {};
    const locationSlug = placeSlug || districtSlug || stateSlug || "india";
    let url = `/location_api/states/${locationSlug}/course_multipages/${itemSlug}`;

    let params = [];

    if (locationSlug === placeSlug) {   
      if (placeSlug) params.push(`place_slug=${placeSlug}`);
      if (districtSlug) params.push(`district_slug=${districtSlug}`);
      if (stateSlug) params.push(`state_slug=${stateSlug}`);
    } else if (locationSlug === districtSlug) {
      if (districtSlug) params.push(`district_slug=${districtSlug}`);
      if (stateSlug) params.push(`state_slug=${stateSlug}`);
    } else if (locationSlug === stateSlug) {
      if (stateSlug) params.push(`state_slug=${stateSlug}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    return apiClient.get(url);
  },

  getRegistrationMultiPages(stateSlug) {
    return apiClient.get(`/location_api/states/${stateSlug}/registration_multipages/`);
  },

  getRegistrationMultiPage(locationData, itemSlug) {
    const { placeSlug, districtSlug, stateSlug } = locationData || {};
    const locationSlug = placeSlug || districtSlug || stateSlug || "india";
    let url = `/location_api/states/${locationSlug}/registration_multipages/${itemSlug}`;

    let params = [];

    if (locationSlug === placeSlug) {   
      if (placeSlug) params.push(`place_slug=${placeSlug}`);
      if (districtSlug) params.push(`district_slug=${districtSlug}`);
      if (stateSlug) params.push(`state_slug=${stateSlug}`);
    } else if (locationSlug === districtSlug) {
      if (districtSlug) params.push(`district_slug=${districtSlug}`);
      if (stateSlug) params.push(`state_slug=${stateSlug}`);
    } else if (locationSlug === stateSlug) {
      if (stateSlug) params.push(`state_slug=${stateSlug}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    return apiClient.get(url);
  },

  getProductMultiPages(stateSlug) {
    return apiClient.get(`/location_api/states/${stateSlug}/product_multipages/`);
  },

  getProductMultiPage(locationData, itemSlug) {
    const { placeSlug, districtSlug, stateSlug } = locationData || {};
    const locationSlug = placeSlug || districtSlug || stateSlug || "india";
    let url = `/location_api/states/${locationSlug}/product_multipages/${itemSlug}`;

    let params = [];

    if (locationSlug === placeSlug) {   
      if (placeSlug) params.push(`place_slug=${placeSlug}`);
      if (districtSlug) params.push(`district_slug=${districtSlug}`);
      if (stateSlug) params.push(`state_slug=${stateSlug}`);
    } else if (locationSlug === districtSlug) {
      if (districtSlug) params.push(`district_slug=${districtSlug}`);
      if (stateSlug) params.push(`state_slug=${stateSlug}`);
    } else if (locationSlug === stateSlug) {
      if (stateSlug) params.push(`state_slug=${stateSlug}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    return apiClient.get(url);
  },

  getServiceMultiPages(stateSlug) {
    return apiClient.get(`/location_api/states/${stateSlug}/service_multipages/`);
  },

  getServiceMultiPage(stateSlug, itemSlug) {
    return apiClient.get(`/location_api/states/${stateSlug}/service_multipages/${itemSlug}`);
  },  

  getUrlLocation(locationType = undefined, slug) {
    return apiClient.get(`/location_api/get_location/${locationType}/${slug}/`);
  },

  getStateCenter(stateSlug) {
    return apiClient.get(`/location_api/states/${stateSlug}/get_center`);
  },

  getDistrictCenter(districtSlug) {
    return apiClient.get(`/location_api/districts/${districtSlug}/get_center`);
  },

  getPlaceCenter(placeSlug) {
    return apiClient.get(`/location_api/places/${placeSlug}/get_center`);
  },

  getPopularCities() {
    return apiClient.get(`/location_api/popular_cities`);
  },

  getStatePincode(stateSlug) {
    return apiClient.get(`/location_api/states/${stateSlug}/get_pincode`);
  },

  getDistrictPincode(districtSlug) {
    return apiClient.get(`/location_api/districts/${districtSlug}/get_pincode`);
  },

  async getLocationFromIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (process.env.NODE_ENV === 'development') {
      ip = '103.251.43.66'; // Example IP from Kerala
    }

    try {
      const res = await fetch(`https://ipwho.is/${ip}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to get location");
      }

      return {
        lat: data.latitude,
        lon: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country,
      };
    } catch (err) {
      console.error("IP Geolocation failed:", err.message);
      return { lat: null, lon: null };
    }
  }
};

// ✅ Export moved to the bottom
export default location;
