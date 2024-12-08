"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const droneIcon = new L.Icon({
  iconUrl: "/drone-card-icon.png",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = point1[0] * Math.PI / 180;
  const φ2 = point2[0] * Math.PI / 180;
  const Δφ = (point2[0] - point1[0]) * Math.PI / 180;
  const Δλ = (point2[1] - point1[1]) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const DroneMap: React.FC<any> = ({
  isLoading,
  drone,
  startPoint,
  destination,
  scrollWheelZoom = true,
  style = { height: "400px", width: "100%" },
  className = "rounded-lg",
}) => {
  const [dronePosition, setDronePosition] = useState<any>(startPoint);
  const [flightPath, setFlightPath] = useState<any[]>([]);
  const [isFlying, setIsFlying] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [speed, setSpeed] = useState(5); // m/s
  const [altitude, setAltitude] = useState(50); // meters
  const [battery, setBattery] = useState(100); // percentage
  const [elapsedTime, setElapsedTime] = useState(0); // seconds

  const updateDronePosition = useCallback(() => {
    setDronePosition((prev: any) => {
      const totalDistance = calculateDistance(startPoint, destination);
      const coveredDistance = calculateDistance(startPoint, prev);
      const remainingDistance = totalDistance - coveredDistance;
      
      if (remainingDistance <= speed) {
        setIsFlying(false);
        setIsOrbiting(true);
        return destination;
      }

      const ratio = speed / remainingDistance;
      const newLat = prev[0] + (destination[0] - prev[0]) * ratio;
      const newLng = prev[1] + (destination[1] - prev[1]) * ratio;
      const newPosition = [newLat, newLng];
      
      setFlightPath((path) => [...path, newPosition]);
      setBattery((prev) => Math.max(0, prev - 0.1));
      setElapsedTime((prev) => prev + 1);
      
      return newPosition;
    });
  }, [startPoint, destination, speed]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFlying) {
      interval = setInterval(updateDronePosition, 1000);
    } else if (isOrbiting) {
      let angle = 0;
      interval = setInterval(() => {
        angle += 0.1;
        const radius = 0.0001;
        const newLat = destination[0] + radius * Math.cos(angle);
        const newLng = destination[1] + radius * Math.sin(angle);
        setDronePosition([newLat, newLng]);
        setBattery((prev) => Math.max(0, prev - 0.05));
        setElapsedTime((prev) => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isFlying, isOrbiting, destination, updateDronePosition]);

  const handleStartFlight = () => {
    setIsFlying(true);
    setFlightPath([startPoint]);
    setBattery(100);
    setElapsedTime(0);
  };

  const handleStopFlight = () => {
    setIsFlying(false);
    setIsOrbiting(false);
  };

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  const center = isFlying || isOrbiting ? dronePosition : startPoint;

  return (
    <div className="space-y-4">
      <MapContainer
        center={center}
        zoom={17}
        scrollWheelZoom={scrollWheelZoom}
        style={style}
        className={className}
      >
        <MapController center={center} />
        <TileLayer
          url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={startPoint}>
          <Popup>Start Point</Popup>
        </Marker>

        <Marker position={destination}>
          <Popup>Destination</Popup>
        </Marker>

        <Marker position={dronePosition} icon={droneIcon}>
          <Popup>{drone.title || "Drone"}</Popup>
        </Marker>

        <Polyline positions={flightPath} color="blue" />

        {isOrbiting && (
          <Circle center={destination} radius={10} color="red" fillColor="red" fillOpacity={0.2} />
        )}
      </MapContainer>

      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div>Battery: {battery.toFixed(1)}%</div>
          <div>Altitude: {altitude}m</div>
          <div>Speed: {speed}m/s</div>
          <div>Elapsed Time: {elapsedTime}s</div>
        </div>
        <div className="space-x-2">
          <Button
            onClick={handleStartFlight}
            disabled={isFlying || isOrbiting}
          >
            Start Flight
          </Button>
          <Button
            onClick={handleStopFlight}
            disabled={!isFlying && !isOrbiting}
          >
            Stop Flight
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div>Adjust Speed:</div>
        <Slider
          value={[speed]}
          onValueChange={(value) => setSpeed(value[0])}
          min={1}
          max={10}
          step={1}
        />
      </div>
      <div className="space-y-2">
        <div>Adjust Altitude:</div>
        <Slider
          value={[altitude]}
          onValueChange={(value) => setAltitude(value[0])}
          min={10}
          max={100}
          step={10}
        />
      </div>
    </div>
  );
};

export default DroneMap;

