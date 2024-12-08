"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Battery, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import type { DroneStatus } from "@/types/drone";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRecoilValue } from "recoil";
import { regionAtom } from "./states";

import { droneAtom } from "./states";
import { useSetRecoilState } from "recoil";

const RealTimeMap = dynamic(() => import("./Map"), { ssr: false });

export function DroneCard({ drone }: any) {

  
  const setDrone = useSetRecoilState<any>(droneAtom);


  const region= useRecoilValue<any>(regionAtom);
  const dronePoint =[ region.geolocation[0][0],region.geolocation[0][1]]
  const [isExpanded, setIsExpanded] = useState(false);
  const mapCenter: any = dronePoint;
  const mapMarkers = [
    {
      position: dronePoint,
      popupContent: "Drone Station",
    }
  ];
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg bg-secondary/50 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="/drone-card-icon.png"
              alt={`Drone ${drone._id}`}
              className="h-12 w-12 opacity-80"
            />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{drone.title}</h3>
              <span
                className={`text-sm ${
                  drone.status === "Busy" ? "text-destructive" : "text-success"
                }`}
              >
                • {drone.status? drone.status.charAt(0).toUpperCase()+drone.status.slice(1): "No region selected"}
              </span>
            </div>
            {drone.surveyQueue && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-muted-foreground"
              >
                <div>Current Survey: {drone.surveyQueue[0]}</div>
                
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-1 text-sm"
          >
            <Battery className="h-4 w-4" />
            50%
          </motion.div>
          <Link href={`/drones/${drone._id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={()=>{
              console.log("Setting state", drone)
              setDrone(drone)
            }}>
              View Details
            </Button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full p-1 hover:bg-secondary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Additional Information</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Model: DJI Mavic 3</li>
                  <li>Serial Number: DJI123456789</li>
                  <li>Last Maintenance: 2023-05-15</li>
                  <li>Flight Hours: 120</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium">Current Location</h4>
                <div className="mt-2 h-40 rounded-lg bg-muted flex items-center justify-center">
                  <RealTimeMap
                    centerProp={mapCenter}
                    zoom={14}
                    markers={mapMarkers as any}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                    className="rounded-lg z-0"
                  />

                  {/* <MapPin className="h-6 w-6 text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Map placeholder</span> */}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
