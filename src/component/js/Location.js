import React, { useEffect, useState } from 'react';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';
import '../scss/Location.scss';

const Location = () => {
  const [map, setMap] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSelectedArea, setShowSelectedArea] = useState(false);
  const [isLocationVisible, setIsLocationVisible] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=08637e590784f47dfde7ec9b2a40910a&libraries=services';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const mapContainer = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3,
      };
      const newMap = new window.kakao.maps.Map(mapContainer, options);
      setMap(newMap);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (map) {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch('서울시 ' + keyword, placesSearchCB);
    }
  }, [keyword]);

  const placesSearchCB = (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      setPlaces(data);
      const bounds = new window.kakao.maps.LatLngBounds();
      for (let i = 0; i < data.length; i++) {
        const place = data[i];
        const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: map,
        });
        window.kakao.maps.event.addListener(marker, 'click', () => handleMarkerClick(place));
        bounds.extend(markerPosition);
      }
      map.setBounds(bounds);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchPlace();
      document.getElementById('keywordInput').value = '';
    }
  };

  const searchPlace = () => {
    setKeyword(document.getElementById('keywordInput').value);
  };

  const handleMarkerClick = (place) => {
    const kakaoLocation = place.address_name.split(" ")[1];

    console.log('장소명:', place.place_name);
    console.log('주소:', place.address_name);
    console.log('카카오행정구역:', kakaoLocation);
    console.log('위도:', place.y);
    console.log('경도:', place.x);
    setSelectedPlace(place);
    setShowSelectedArea(true);
  };

  const handleClose = () => {
    setSelectedPlace(null);
    setShowSelectedArea(false);
  };

  const handleLocationClose = () => {
    setIsLocationVisible(false);
  };

  return (
    <>
      {isLocationVisible && (
        <div className="location-container">
          <div className="map-container">
            <div id="map" style={{ width: '100%', height: '400px' }}></div>
            <div>
              <input type="text" id="keywordInput" onKeyPress={handleKeyPress} />
              <button onClick={searchPlace}>Search</button>
            </div>
          </div>
          {showSelectedArea && (
            <div className="selected-place-info">
              <div className="selected-place-name">
                * 장소명: {selectedPlace && selectedPlace.place_name}
              </div>
              <div>* 주소: {selectedPlace && selectedPlace.address_name}</div>
            </div>
          )}
        </div>
      )}
      {!isLocationVisible && showSelectedArea && (
        <div className="selected-place-info-fixed">
          <div className="selected-place-name">
            * 장소명: {selectedPlace && selectedPlace.place_name}
          </div>
          <div>* 주소: {selectedPlace && selectedPlace.address_name}</div>
        </div>
      )}
      {!isLocationVisible && showSelectedArea && (
        <button className="close-btn" onClick={handleClose}>닫기</button>
      )}

    </>
  );
};

export default Location;                           