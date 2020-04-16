import React, { useState, useRef, useEffect } from 'react';
import MapGL, {
  Marker,
  Popup,
  NavigationControl,
  WebMercatorViewport,
} from 'react-map-gl';
import { ITruck, ICoordsArray, IViewportSettings } from './interfaces';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN as string;

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  fill: '#00d',
  stroke: 'none',
};

interface IPinProps {
  size: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function Pin({ size = 20, onMouseEnter, onMouseLeave }: IPinProps) {
  return (
    <svg
      onMouseEnter={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
      height={size}
      viewBox="0 0 24 24"
      style={pinStyle}
    >
      <path d={ICON} />
    </svg>
  );
}

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
  const { longitude, latitude, zoom } = mercator.fitBounds(bounds, {
    padding: {
      top: 100,
      right: 0,
      bottom: 300,
      left: 0,
    },
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
    <div ref={mapRef}>
      <MapGL
        {...viewport}
        width="100vw"
        height="80vh"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={(nextViewport) => {
          setViewport(nextViewport);
        }}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {markers.map(({ id, longitude, latitude }, index) => {
          return (
            <Marker
              key={id}
              longitude={longitude}
              latitude={latitude}
              offsetTop={-20}
              offsetLeft={-10}
            >
              <Pin
                size={20}
                onMouseEnter={() => setActiveId(index)}
                onMouseLeave={() => setActiveId(null)}
              />
            </Marker>
          );
        })}
        <div
          className="nav"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '10px',
          }}
        >
          <NavigationControl
            onViewportChange={(viewport) => setViewport(viewport)}
          />
        </div>

        {activeTruck && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={activeTruck.longitude}
            latitude={activeTruck.latitude}
            closeOnClick={false}
            onClose={() => setActiveId(null)}
          >
            {activeTruck.name}
            <br />
            {activeTruck.address}
          </Popup>
        )}
      </MapGL>
    </div>
  );
}

export default Map;
