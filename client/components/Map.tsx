"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as h3 from "h3-js";
import { Skeleton } from "./ui/skeleton";

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Define the props for the reusable component
interface MarkerProps {
  position: [number, number];
  popupContent?: string;
}

interface RealTimeMapProps {
  isLoading?: any,
  hexagon?: string; 
  centerProp: number[];
  zoom?: number;
  markers?: MarkerProps[];
  scrollWheelZoom?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const customIcon = new L.Icon({
  iconUrl: "pin.png", // Path to your custom marker icon
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [30, 30],
});

const RealTimeMap: React.FC<RealTimeMapProps> = ({
  isLoading,
  hexagon,
  centerProp,
  zoom = 18,
  markers = [],
  scrollWheelZoom = true,
  style = { height: "100%", width: "100%" },
  className = "rounded-lg",
}) => {
  const hexagonCoordinates: any = hexagon
    ? h3.cellToBoundary(hexagon).map(([lat, lng]) => [lat, lng])
    : null;

    if(isLoading){
      return <Skeleton className="w-full h-full " />

    }

  return (
    <MapContainer
      center={centerProp as [number, number]}
      zoom={14}
      scrollWheelZoom={scrollWheelZoom}
      style={style}
      className={className}
    >
      <TileLayer
        url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render markers */}
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={customIcon}>
          {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
        </Marker>
      ))}

      {/* Render hexagon boundary */}
      {hexagonCoordinates && (
        <Polygon
          positions={hexagonCoordinates}
          pathOptions={{
            color: "black",
            weight: 2,
            fillOpacity: 0.3,
          }}
        />
      )}
    </MapContainer>
  );
};

export default RealTimeMap;
