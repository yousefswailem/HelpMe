import React, { useEffect, useState } from 'react';

const GoogleMapsLoader = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        const params = {
          key: 'AIzaSyBBpLfENt9ayKz1lZxN2GGimK2nL05HNSc',
          v: 'weekly',
        };

        const queryString = new URLSearchParams(params).toString();
        script.src = `https://maps.googleapis.com/maps/api/js?${queryString}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          resolve();
          setIsScriptLoaded(true);
        };
        script.onerror = () => reject(new Error('The Google Maps JavaScript API could not load.'));

        document.head.appendChild(script);
      });
    };

    loadGoogleMaps()
      .then(() => {
        console.log('Google Maps loaded');
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (isScriptLoaded) {
      // Initialize the map or perform other actions here
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 31.898043, lng: 35.204269 },
        zoom: 12.5,
      });
    }
  }, [isScriptLoaded]);

  return <div id="map" style={{ height: '77vh', width: '100%' }}></div>;
};

export default GoogleMapsLoader;
