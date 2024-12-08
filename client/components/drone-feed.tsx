"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import type { SurveyData, DroneState } from "@/types/drone";
import { Button } from "@/components/ui/button";
import {
  Battery,
  MapPin,
  Wifi,
  Thermometer,
  Compass,
  FastForwardIcon as Speed,
} from "lucide-react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { useRecoilValue } from "recoil";
import { droneAtom } from "./states";
import dynamic from "next/dynamic";
import { MotionChart } from "./motion-chart";
import { SystemChart } from "./system-chat";

const DroneMap = dynamic(() => import("./DroneMap"), { ssr: false });

interface DroneFeedProps {
  droneId: string;
}

export function DroneFeed({ droneId }: DroneFeedProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isVideoStreamActive, setVideoStreamActive] = useState<boolean>(false);
  const [droneState, setDroneState] = useState<any>({
    pitch: 0,
    roll: 0,
    yaw: 0,
    vgx: 0,
    vgy: 0,
    vgz: 0,
    templ: 0,
    temph: 0,
    tof: 0,
    h: 0,
    bat: 0,
    baro: 0,
    time: 0,
    agx: 0,
    agy: 0,
    agz: 0,
  });

  const frontVideoRef = useRef<HTMLVideoElement>(null);
  const topVideoRef = useRef<HTMLVideoElement>(null);

  const drone = useRecoilValue<any>(droneAtom);

  useEffect(() => {
    const socketInstance = io("http://localhost:8000");
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socketInstance.on("status", (message: string) => {
      setStatus(message);
    });

    socketInstance.on("dronestate", (state: DroneState) => {
      setDroneState((prevState) => ({ ...prevState, ...state }));
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendCommand = (command: string) => {
    if (socket) {
      socket.emit("command", command);
      console.log(`Command sent: ${command}`);

      // Start video stream when initialized
      if (command === "takeoff") {
        setVideoStreamActive(true);
        frontVideoRef.current?.play();
        topVideoRef.current?.play();
      }
    }
  };

  const startPoint: [number, number] = [28.896665, 77.117577];
  const destination: [number, number] = [28.896, 77.117];

  const renderDroneStateInfo = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <Compass className="h-5 w-5 text-primary" />
        <span className="text-sm">Yaw: {droneState.yaw}°</span>
      </div>
      <div className="flex items-center gap-2">
        <Speed className="h-5 w-5 text-primary" />
        <span className="text-sm">
          Speed:{" "}
          {Math.sqrt(
            droneState.vgx ** 2 + droneState.vgy ** 2 + droneState.vgz ** 2
          ).toFixed(2)}{" "}
          cm/s
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Thermometer className="h-5 w-5 text-primary" />
        <span className="text-sm">
          Temp: {droneState.templ}°C - {droneState.temph}°C
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Battery className="h-5 w-5 text-primary" />
        <span className="text-sm">Battery: {droneState.bat}%</span>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6 space-y-6"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Drone {droneId}</h2>
          <span className="rounded-full bg-success/20 px-3 py-1 text-sm text-success-foreground">
            {status || "Connecting..."}
          </span>
        </div>
        <Link href="/drones">
          <Button variant="outline">Back to Drones</Button>
        </Link>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Motion Status */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-secondary rounded-lg p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4">Motion Status</h3>
            <MotionChart droneState={droneState} />
          </motion.div>

          {/* Drone Control */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-secondary rounded-lg p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4">Drone Controls</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Button onClick={() => sendCommand("command")}>Initialize</Button>
              <Button onClick={() => sendCommand("takeoff")}>Fly</Button>
              <Button onClick={() => sendCommand("land")}>Land</Button>
            </div>
            {renderDroneStateInfo()}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* System Chart */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-muted rounded-lg overflow-hidden h-[300px]"
          >
            <SystemChart droneState={droneState} />
          </motion.div>

          {/* Drone Map */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-muted rounded-lg overflow-hidden h-[300px]"
          >
            <DroneMap
              drone={drone}
              startPoint={startPoint}
              destination={destination}
              style={{ height: "300px", width: "100%" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Video Streams */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  className="grid grid-cols-1 md:grid-cols-2 gap-6"
>
  <motion.div whileHover={{ scale: 1.02 }} className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground font-medium">
        Front View
      </span>
      <span
        className={`text-xs ${
          isVideoStreamActive ? "text-green-500" : "text-muted-foreground"
        }`}
      >
        {isVideoStreamActive ? "Streaming" : "Waiting to Initialize"}
      </span>
    </div>
    <div className="aspect-video rounded-lg overflow-hidden border">
      <video
        ref={frontVideoRef}
        src="https://res.cloudinary.com/do3vqgriw/video/upload/v1733665134/t8snztgpye0ei0jsv1xv.mp4"
        autoPlay={isVideoStreamActive}
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  </motion.div>

  <motion.div whileHover={{ scale: 1.02 }} className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground font-medium">
        Top View
      </span>
      <span
        className={`text-xs ${
          isVideoStreamActive ? "text-green-500" : "text-muted-foreground"
        }`}
      >
        {isVideoStreamActive ? "Streaming" : "Waiting to Initialize"}
      </span>
    </div>
    <div className="aspect-video rounded-lg border">
      <video
        ref={topVideoRef}
        src="https://res.cloudinary.com/do3vqgriw/video/upload/v1733665134/t8snztgpye0ei0jsv1xv.mp4"
        autoPlay={isVideoStreamActive}
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  </motion.div>
</motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-end gap-4 mt-6"
      >
        <Button variant="destructive" onClick={() => sendCommand("emergency")}>
          Emergency Stop
        </Button>
        <Link href={`/drones/${droneId}/conclude`}>
          <Button className="bg-primary hover:bg-primary/90">
            Conclude Survey
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
