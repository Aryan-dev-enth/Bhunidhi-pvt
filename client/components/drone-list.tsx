"use client";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { dronesAtom } from "./states"; // Import the new drones atom
import { regionAtom } from "./states";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { droneScheduler } from "./droneScheduler.js";
import { useState } from "react";

import Lottie from "react-lottie";
import animationData from "../lottie/drone-animation.json";

import { DroneCard } from "./drone-card";

export function DroneList({ drones }: { drones: any[] }) {
  const region = useRecoilValue<any>(regionAtom);
  const setDrones = useSetRecoilState(dronesAtom);

  const [updatedDrones, setUpdatedDrones] = useState<any[]>(drones); // Type set to any[] for now
  const [confirmationType, setConfirmationType] = useState<string>("");
  const [schedule, setSchedule] = useState<boolean>(false); // Set initial state to false

  const handleScheduleFlightsConfirm = async () => {
    if (region?.sites?.length > 0 && drones?.length > 0) {
      try {
        console.log(
          "Scheduling flights with drones:",
          drones,
          "and sites:",
          region.sites
        );
        const scheduledDrones = await droneScheduler(region.sites, drones);

        console.log("Updated Drones:", scheduledDrones);

        // Update both the local state and the Recoil state for drones
        setUpdatedDrones(scheduledDrones);
        setDrones(scheduledDrones); // Update the Recoil state with the new drones
      } catch (error) {
        console.error("Error scheduling flights:", error);
      }
    } else {
      console.error("Sites or drones data is missing.");
    }

    setConfirmationType("");
    setSchedule(true);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds
    setSchedule(false); // Set schedule to false after the delay
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="space-y-4">
      <AlertDialog open={confirmationType === "scheduleFlights"}>
        <AlertDialogTrigger asChild>
          <Button
            variant={"destructive"}
            size={"lg"}
            onClick={() => setConfirmationType("scheduleFlights")}
          >
            Schedule Flights
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Schedule Flights</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to schedule flights for the drones?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmationType("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleScheduleFlightsConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {schedule ? (
        <div className="flex justify-center items-center bg-gradient-to-rrounded-lg shadow-xl space-x-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Scheduling All Drones</h2>
          <p className="text-lg">Surveying the sites for the drone flights...</p>
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      </div>
      
      ) : (
        <div className="space-y-3">
          {(updatedDrones || []).map((drone: any) => (
            <DroneCard key={drone._id} drone={drone} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DroneList;
