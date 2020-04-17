import React, { useState, useRef, useEffect } from 'react';
import MapGL, {
  Marker,
  Popup,
  NavigationControl,
  WebMercatorViewport,
} from 'react-map-gl';
import styled from 'styled-components';
import { FoodTag } from './ui';
import { ITruck, ICoordsArray, IViewportSettings } from './interfaces';
import { ReactComponent as PinIcon } from './icons/pin.svg';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN as string;

const Wrapper = styled.div`
  overflow: hidden;
  width: 100vw;
  height: calc(100vh - 85px);
  color: black;
`;
const ControlHolder = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
`;
const PopupBody = styled.div`
  max-width: 300px;
`;
const useContainerSize = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measureBox = () => {
    const box: any = containerRef && containerRef.current;
    const { height = 0, width = 0 } = box ? box.getBoundingClientRect() : {};
    return setSize({ height, width });
  };

  useEffect(() => measureBox(), []);

  return [size, containerRef];
};

const getBounds = function (coords: ICoordsArray) {
  return coords.reduce(
    (result, cur) => {
      return [
        [Math.min(result[0][0], cur[0]), Math.min(result[0][1], cur[1])],
        [Math.max(result[1][0], cur[0]), Math.max(result[1][1], cur[1])],
      ];
    },
    [
      [coords[0][0], coords[0][1]], // Min long, lat
      [coords[0][0], coords[0][1]], // Max long, lat
    ]
  );
};

function Map({ trucks }: { trucks: ITruck[] }) {
  const [size, mapRef]: any[] = useContainerSize();
  // Remove trucks with no coordinates
  const markers = trucks.filter((t) => Math.abs(t.latitude) > 0);
  const coords: ICoordsArray = markers.map((i: ITruck) => [
    i.longitude,
    i.latitude,
  ]);
  const bounds: any = getBounds(coords);
  const mercator = new WebMercatorViewport({
    width: size.width || window.innerWidth,
    height: size.width || window.innerHeight,
  });
  const isTall = size.height > size.width;
  const padding = {
    top: isTall ? 0 : (size.height + 1) / 20,
    right: 0,
    bottom: isTall ? 0 : (size.height + 1) / 5,
    left: 0,
  };
  const { longitude, latitude, zoom } = mercator.fitBounds(bounds, {
    padding,
  });

  const [viewport, setViewport] = useState<IViewportSettings>({
    latitude,
    longitude,
    zoom,
  });

  useEffect(() => {
    setViewport({
      latitude,
      longitude,
      zoom,
      bearing: -15,
      pitch: 45,
    });
  }, [latitude, longitude, zoom]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const activeTruck = activeId !== null ? markers[activeId] : null;
  return (
    <Wrapper ref={mapRef}>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/localjo/ck93j8bdy06xi1iqu9nc4zf5o/draft"
        onViewportChange={(nextViewport) => {
          setViewport(nextViewport);
        }}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {markers.map(({ id, longitude, latitude }, index) => {
          const isActive = index === activeId;
          const fillColor = isActive ? '#bd3f16' : '#900511';
          const iconSize = isActive ? 35 : 30;
          return (
            <Marker
              key={id}
              longitude={longitude}
              latitude={latitude}
              offsetTop={-35}
              offsetLeft={-12.5}
            >
              <PinIcon
                height={iconSize}
                fill={fillColor}
                stroke="#000"
                stoke-width="4"
                onMouseEnter={() => setActiveId(index)}
                onMouseLeave={() => setActiveId(null)}
              />
            </Marker>
          );
        })}
        <ControlHolder className="nav">
          <NavigationControl
            onViewportChange={(viewport) => setViewport(viewport)}
          />
        </ControlHolder>

        {activeTruck && (
          <Popup
            tipSize={10}
            anchor="top"
            longitude={activeTruck.longitude}
            latitude={activeTruck.latitude}
            closeButton={false}
            onClose={() => setActiveId(null)}
          >
            <PopupBody>
              <b>{activeTruck.name}</b>
              <p>{activeTruck.address}</p>
              {activeTruck.foodTypes.map((foodType, i) => (
                <FoodTag key={foodType}>{foodType}</FoodTag>
              ))}
            </PopupBody>
          </Popup>
        )}
      </MapGL>
    </Wrapper>
  );
}

export default Map;
