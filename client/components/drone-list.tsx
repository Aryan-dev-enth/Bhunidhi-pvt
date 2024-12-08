'use client';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dronesAtom } from './states';  // Import the new drones atom
import { regionAtom } from './states';
import { Button } from './ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from './ui/alert-dialog';
import { droneScheduler } from './droneScheduler.js';
import { useState } from 'react';

import { DroneCard } from './drone-card';

export function DroneList({ drones }: { drones: any[] }) {
  const region = useRecoilValue(regionAtom);
  const setDrones = useSetRecoilState(dronesAtom); 
  const [updatedDrones, setUpdatedDrones] = useState<any[]>(drones); // Type set to any[] for now
  const [confirmationType, setConfirmationType] = useState<string>("");

  const handleScheduleFlightsConfirm = async () => {
    if (region?.sites?.length > 0 && drones?.length > 0) {
      try {
        console.log("Scheduling flights with drones:", drones, "and sites:", region.sites);
        const scheduledDrones = await droneScheduler(region.sites, drones);
        console.log("Updated Drones:", scheduledDrones);

        // Update both the local state and the Recoil state for drones
        setUpdatedDrones(scheduledDrones);
        setDrones(scheduledDrones);  // Update the Recoil state with the new drones
      } catch (error) {
        console.error("Error scheduling flights:", error);
      }
    } else {
      console.error("Sites or drones data is missing.");
    }
    setConfirmationType("");
  };

  return (
    <div className="space-y-4">
      <AlertDialog open={confirmationType === 'scheduleFlights'}>
        <AlertDialogTrigger asChild>
          <Button className="bg-orange-500 text-black" onClick={() => setConfirmationType('scheduleFlights')}>
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
            <AlertDialogCancel onClick={() => setConfirmationType("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleScheduleFlightsConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-3">
        {(updatedDrones || []).map((drone: any) => (
          <DroneCard key={drone._id} drone={drone} />
        ))}
      </div>
    </div>
  );
}
