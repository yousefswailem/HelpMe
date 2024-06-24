import React, { useEffect, useState, useRef } from 'react';

const GoogleMapsLoader = (shopAddress) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          setIsScriptLoaded(true);
          resolve();
          return;
        }

        const existingScript = document.getElementById('googleMaps');
        if (existingScript) {
          existingScript.onload = () => {
            setIsScriptLoaded(true);
            resolve();
          };
          return;
        }

        const script = document.createElement('script');
        script.id = 'googleMaps';
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBBpLfENt9ayKz1lZxN2GGimK2nL05HNSc&v=weekly`;
        script.async = true;  
        script.defer = true;  
        script.onload = () => {
          setIsScriptLoaded(true);
          resolve();
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
      if (!mapRef.current) {
        mapRef.current = new window.google.maps.Map(document.getElementById('map'), {
          center: { lat: 31.898043, lng: 35.204269 },
          zoom: 12.5,
        });
      }

      fetch('http://localhost:8080/closest-drivers')
        .then(response => response.json())
        .then(data => {
          data.forEach(item => {
            const carIcon = {
              path: 'M20.92 5.01c-.35-.61-1.04-1-1.75-1H4.83c-.71 0-1.4.39-1.75 1L1 9v12c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h16v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V9l-2.08-3.99zM6.5 17c-.83 0-1.5-.67-1.5-1.5S5.67 14 6.5 14s1.5.67 1.5 1.5S7.33 17 6.5 17zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z', // Path for a more detailed car icon
              fillColor: '#FF0000',
              fillOpacity: 1,
              scale: 1,
              anchor: new window.google.maps.Point(15, 15),
            };

            if (!markersRef.current[item.driverId]) {
              markersRef.current[item.driverId] = new window.google.maps.Marker({
                position: { lat: item.driverLat, lng: item.driverLng },
                map: mapRef.current,
                title: `Driver ${item.driverName}`,
                icon: carIcon,
              });
            } else {
              markersRef.current[item.driverId].setPosition(new window.google.maps.LatLng(item.driverLat, item.driverLng));
            }

            if (!markersRef.current[item.shopId]) {
              markersRef.current[item.shopId] = new window.google.maps.Marker({
                position: { lat: item.shopLat, lng: item.shopLng },
                map: mapRef.current,
                title: `Shop ${item.shopName}`,
              });
            }
          });
        })
        .catch(error => console.error('Error fetching closest drivers:', error));
    }
  }, [isScriptLoaded]);

  return <div id="map" style={{ height: '77vh', width: '100%' }}></div>;
};

export default GoogleMapsLoader;
